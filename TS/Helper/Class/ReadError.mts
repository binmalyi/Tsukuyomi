import { inspect } from 'util';
import { basename, parse } from 'path'
import { toAnsi } from "../Function/Ansi.mjs";

export class ReadError extends Error {
    constructor(file: Object, info: ReturnType<typeof parse>){
        super(`${toAnsi('--Black Missing Properties')}\n> Path: ${basename(info.dir)}\n> File: ${info.base}\n\n${inspect(file, {depth: 5, colors: true})}`);
        this.name = toAnsi('--RedBold ' + this.constructor.name + '--Reset [--Bgred 404--Reset ]');
    };
};