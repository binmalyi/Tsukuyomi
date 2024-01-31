const
    isString = /^(?<=\").*(?=\")$/,
    isSymbol = /^Symbol(.+)$/,
    isBigInt = /^[0-9]+n$/,
    isNumber = /^[0-9]+$/;

export function toJSON(data: unknown):string {
    switch (typeof data){
        case "object": {
            if (data === null) return "null";
            return "{"+Reflect.ownKeys(data).map(key => `"${typeof key === "string"? key : key.toString()}":${Object.is(data[key as keyof typeof data], data) ? `<Circular Reference>` : toJSON(data[key as keyof typeof data])}`).join(",")+"}".trim();
        };

        case "bigint":
            return data.toString() + "n";

        case "string":
            return '"'+data+'"';

        default:
            return String(data);
    };
};

export function fromJSON(data: string){
    if (typeof data !== "string") throw new TypeError("Invalid type");

    const object = {} as {[key: string | number | symbol]: unknown};
    for (const [key, val] of data.slice(1,-1).split(",").map(_ => _.split(":").map((_, inx) => inx === 0 ? _.slice(1,-1) : _))) object[isSymbol.test(key) ? Symbol(key.match(/(?<=\()\w+(?=\))/g)![0]) : (isNumber.test(key) ? Number(key) : key)] = val === "<Circular Reference>" ? object : (val.startsWith("{") && val.endsWith("}") ? fromJSON(val) : (isString.test(val) ? val.slice(1,-1) : (isNumber.test(val) ? Number(val) : (isBigInt.test(val) ? BigInt(val.slice(0,-1)) : new Function(`"use strict" return ${val}`)()))));

    return object;
};