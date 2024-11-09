export const SNOWFLAKE = /\d{17,20}/;

export function chunkify(data: string){
    if (typeof data !== "string" || !data) throw new Error("Invalid Contents");
    const chunks = data.trim().slice(process.env["PREFIX"]!.length).split(/\s+/);
    return [chunks.shift()!.toLowerCase(), ...chunks];
};