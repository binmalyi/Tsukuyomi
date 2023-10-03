import FastGlob from 'fast-glob';
import { pathToFileURL } from 'url';
// import { Surreal } from 'surrealdb.js';
import {
    ApplicationCommandData,
    Client,
    ClientEvents,
    ClientOptions,
    LimitedCollection,
    RESTEvents,
    RestEvents,
    SlashCommandBuilder
} from 'discord.js';

type SlashCommands = ApplicationCommandData | SlashCommandBuilder;
type Callback = (...args: ((ClientEvents[keyof ClientEvents] | RestEvents[keyof RestEvents]) | Array<unknown>)) => Promise<void>;

interface Module { execute: Callback };
interface Event extends Module { event: (keyof ClientEvents) | (keyof RestEvents), once?: boolean };
interface Slash extends Module { data: SlashCommands };
interface Prefix extends Module { name: string };
interface IOptions { folders: Array<string>, dir: string };

(await import('dotenv')).config();

export class Tsukuyomi extends Client implements Client {
    // public db: Surreal;
    // public prefix: LimitedCollection<string, Prefix>;
    public slash: LimitedCollection<string, Slash>;

    constructor(options: ClientOptions){
        super(options);

        // this.db = new Surreal('http://127.0.0.1:8000/rpc');
        this.slash = new LimitedCollection({maxSize: 200, keepOverLimit: () => false});
        // this.prefix = new LimitedCollection({maxSize: 50, keepOverLimit: () => false});
    };

    public init(options: IOptions): void {
        if (!Array.isArray(options.folders) || options.folders.every(folder => typeof folder !== 'string')) throw TypeError('Expected array of folder names');

        Promise.all<Event|Prefix|Slash>(FastGlob.sync(`(${options.folders.join('|')})/**/*.mjs`, {cwd: options.dir, absolute: true}).map(path => import(pathToFileURL(path).href)))
        .then(async modules => {
            for (const module of modules)
            if (!('execute' in module)) throw new Error('Missing required property');
            else if ('event' in module)
                module.event in RESTEvents
                ? this.rest.on(module.event as keyof RestEvents, module.execute)
                : (module.once
                    ? this.once(module.event as keyof ClientEvents, module.execute)
                    : this.on(module.event as keyof ClientEvents, module.execute));
            else if ('data' in module) this.slash.set(module.data.name, module);
            // else if ('name' in module) this.prefix.set(module.name, module);

            await this.login()
            //.then(this.db.signin.bind(this.db, {user: 'root', pass: 'root'}));
        })
        .catch(console.error);
    };
};