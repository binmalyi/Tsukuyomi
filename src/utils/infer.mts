export function inferType(object: unknown):string {
    switch (typeof object){
        case "object": {
            if (object === null) return "null";
            else switch (object.constructor.name){
                    case "Object":
                        return `{[key: ${[...new Set(Object.keys(object).map(key => typeof key))].join("|")}]: ${[...new Set(Object.values(object).map(value => inferType(value)))].join("|")}}`;
                    case "Array":
                        return `Array<${[...new Set((object as Array<unknown>).map(value => inferType(value)))].join("|")}>`;
                    default:
                        return `${object.constructor.name}<${[...new Set([...(object as any).keys()].map(key => inferType(key)))].join("|")},${[...new Set([...(object as any).values()].map(value => inferType(value)))].join("|")}>`;
                };
        };
        default: return typeof object
    };
};