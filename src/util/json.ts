function toJSON(data: unknown): string {
    if (typeof data === "string") return data.length > 1 ? '"'+data+'"' : "'"+data+"'";
    else if (
        data == undefined
        || typeof data === "boolean"
        || typeof data === "number"
        || typeof data === "string"
        || typeof data === "function"
        || typeof data === "symbol"
    ) return String(data);
    else if (typeof data === "bigint") return data.toString()+'n';
    else if (Array.isArray(data)) return `[${data.map(elem => toJSON(elem))}]`;
    else if (data?.constructor?.name === "Map" || data?.constructor?.name === "Set") return `new ${data.constructor.name}(${data.constructor.name === "Map" ? toJSON(Array.from((data as Map<unknown, unknown>).entries())) : Array.from((data as Set<unknown>).entries()).map(entries => toJSON(entries))})`;
    else return '{'+Reflect.ownKeys(data).map(key => toJSON(key)+':'+toJSON(data[key as keyof typeof data]))+'}';
};

function fromJSON(data: string): unknown {
    if (typeof data !== "string") throw new Error(`Expected a string but received ${typeof data}`);
    else if (data.includes("eval")) throw new Error("Eval script detected");
    return new Function(`"use strict"; return ${data};`)();
};