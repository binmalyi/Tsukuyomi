import FastGlob from 'fast-glob';
import { pathToFileURL } from 'url';
import {
    ApplicationCommandData,
    Client,
    ClientEvents,
    ClientOptions,
    LimitedCollection,
    RESTEvents,
    RestEvents,
    Routes,
    SlashCommandBuilder
} from 'discord.js';

type SlashCommands = ApplicationCommandData | SlashCommandBuilder;
type Callback = (...args: ((ClientEvents[keyof ClientEvents] | RestEvents[keyof RestEvents]) | Array<unknown>)) => Promise<void>;

interface Module { execute: Callback };
interface Event extends Module { event: (keyof ClientEvents) | (keyof RestEvents), once?: boolean };
interface Slash extends Module { data: SlashCommands };
interface Prefix extends Module { name: string };
interface Options extends ClientOptions {
    dir: string,
    folders: Array<string>
}

(await import('dotenv')).config();

export class Tsukuyomi extends Client implements Client {
    public slash: LimitedCollection<string, Slash>;

    constructor(config: Options){
        const { dir, folders, ...options } = config;
        if (!folders || folders.every(elem => typeof elem !== 'string')) throw new Error("Missing folder names");

        super(options);
        this.slash = new LimitedCollection({maxSize: 200, keepOverLimit: () => false});

        Promise.all<Event|Prefix|Slash>(FastGlob.sync(`(${folders.join('|')})/**/*.mjs`, {cwd: dir, absolute: true}).map(path => import(pathToFileURL(path).href)))
        .then(async modules => {
            for (const module of modules)
            if (!('execute' in module)) throw new Error('Missing executing function');
            else if ('event' in module)
                module.event in RESTEvents
                ? this.rest.on(module.event as keyof RestEvents, module.execute)
                : (module.once
                    ? this.once(module.event as keyof ClientEvents, module.execute)
                    : this.on(module.event as keyof ClientEvents, module.execute));
            else if ('data' in module) this.slash.set(module.data.name, module);
            else throw new Error("Missing required properties");
        })
        .then(() => this.login())
        .then(() => this.rest.put(Routes.applicationCommands(this.user!.id), {body: this.slash.map(slash => slash.data)}))
        .catch(console.error);
    };
};