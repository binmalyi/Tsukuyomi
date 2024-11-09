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

/**
 * @description List of all discord events (REST & Gateway)
 */
const events = new Array<Event>().concat(Object.values(Events) as Event[], Object.values(RESTEvents));

/**
 * @description Perform a Glob search for exported modules in "function" directory
 */
export async function require(glob: Glob = new Glob("function/*.ts"), opt?: GlobScanOptions){
    if (!(glob instanceof Glob)) throw new Error("Missing Glob Object");
    const paths = await Array.fromAsync(glob.scan(opt ? opt : {absolute: true, cwd: "src"}));

    return !paths.length ? paths as [] : Promise.all<unknown>(paths.map(path => import(path)));
};

/**
 * @description Custom class to incorporate registration of events and modification of application commands (if needed)
 */
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
            // default export would in the format <filename_default> hence why we are splitting by '_' char and getting the file name from the first index of the array
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