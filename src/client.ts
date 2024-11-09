import { Glob, type GlobScanOptions } from "bun";
import {
    type RestEvents,
    type ClientEvents,
    type ClientOptions,
    // type ApplicationCommandData,
    // type RESTPostAPIChatInputApplicationCommandsJSONBody,
    Client,
    Options,
    Partials,
    GatewayIntentBits,
    SlashCommandBuilder,
    Events,
    RESTEvents
} from "discord.js";

type Event = keyof ClientEvents | keyof RestEvents;
// type Slash = ApplicationCommandData | SlashCommandBuilder;
type callback = (...params: Array<(ClientEvents[keyof ClientEvents] | RestEvents[keyof RestEvents])[number]>) => void | Promise<void>;

const events = new Array<Event>().concat(Object.values(Events) as Event[], Object.values(RESTEvents));

export async function require(glob: Glob = new Glob("function/*.ts"), opt?: GlobScanOptions){
    if (!(glob instanceof Glob)) throw new Error("Missing Glob Object");
    const paths = await Array.fromAsync(glob.scan(opt ? opt : {absolute: true, cwd: "src"}));

    return !paths.length ? paths as [] : Promise.all<unknown>(paths.map(path => import(path)));
};

export class Tsukuyomi extends Client {
    public store: Map<string, callback> = new Map();

    constructor(options: ClientOptions = {
        intents: [
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildMembers,
            GatewayIntentBits.GuildMessages,
            GatewayIntentBits.GuildPresences,
            GatewayIntentBits.MessageContent,
            GatewayIntentBits.GuildMessagePolls,
            GatewayIntentBits.GuildMessageReactions,
            GatewayIntentBits.GuildEmojisAndStickers
        ],
        partials: [
            Partials.User,
            Partials.Channel,
            Partials.Message,
            Partials.Reaction,
            Partials.GuildMember,
            Partials.ThreadMember,
        ],
        rest: {rejectOnRateLimit: () => !0}
    }){
        super(options);

        this._inject()
        .then(() => this.login())
        .then(() => require(new Glob("slash/*.ts")) as Promise<Array<{default: SlashCommandBuilder}>> | Promise<[]>)
        .then(slashies => this.application!.commands.set(!slashies.length ? slashies as [] : slashies.map(({default: slash}) => slash.toJSON())))
        .catch(console.error);
    };

    private async _inject(){
        const modules = await require() as Array<{default: callback}>;
        if (!modules.length) Promise.reject("No modules have been exported");

        for (const {default: fn} of modules){
            const name = fn.name.split('_')[0]!;
            (
                !events.includes(name as Event)
                ? this.store.set.bind(this.store)
                : (
                    events.includes(name as Event)
                    ? this[name === "ready" ? "once" : "on"].bind(this)
                    : this.rest.on.bind(this) as any
                )
            )(name, fn);
        };
    };
};