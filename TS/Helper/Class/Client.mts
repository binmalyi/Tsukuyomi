import { parse } from 'path';
import { inspect } from 'util';
import FastGlob from 'fast-glob';
import { pathToFileURL } from 'url';
import { Surreal } from 'surrealdb.js';
import { ReadError } from './ReadError.mjs';
import { ApplicationCommandData, Client, ClientEvents, ClientOptions, SlashCommandBuilder } from 'discord.js';

export interface Module { execute: (...args: Array<(keyof ClientEvents)|unknown>) => Promise<void> };
export interface Event extends Module { eventName: keyof ClientEvents, rest?: boolean, once?: boolean };
export interface Prefix extends Module { prefixName: string };
export interface Slash extends Module { data: SlashCommandBuilder | ApplicationCommandData };
export interface Options { base: string, folders: Array<string> };

(await import('dotenv')).config();

export class Zelda extends Client {
    db: Surreal;
    prefix: Map<string, Prefix>;
    slash: Map<string, Slash>;

    constructor(options: ClientOptions){
        super(options);

        this.db = new Surreal('http://127.0.0.1:8000/rpc');
        this.prefix = this.slash = new Map();
        this.setMaxListeners(1);
    };

    init({base, folders}: Options){
        if (!Array.isArray(folders) || folders.every(folder => typeof folder !== 'string')) throw TypeError('Expected an array of strings');

        const fileNames: Array<ReturnType<typeof parse>> = [];

        Promise.all<Event|Prefix|Slash>(
            FastGlob.sync(`(${folders.join('|')})/**/*.{js,cjs,mjs}`, {cwd: base, absolute: true})
            .map(path => (fileNames.push(parse(pathToFileURL(path).href)), import(pathToFileURL(path).href)))
        )
        .then(exports => {
            for (const index in exports){
                const _export = exports[index];

                if ('eventName' in _export) _export.rest ? this.rest.on(_export.eventName, _export.execute) : (_export.once ? this.once(_export.eventName, _export.execute) : this.on(_export.eventName, _export.execute));
                else if ('prefixName' in _export) this.prefix.set(_export.prefixName, _export);
                else if ('data' in _export) this.slash.set(_export.data.name, _export);
                else throw new ReadError(_export, fileNames[index]);
            };

            this.login();
        });
    };
};