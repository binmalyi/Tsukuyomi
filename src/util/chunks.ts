/**
 * @description Regular expression to match discord ids (snowflakes)
 */
export const SNOWFLAKE = /\d{17,20}/;

/**
 * @description Function to break down message content into "chunks" to identify the command and its arguments
*/
export function chunkify(data: string){
    if (typeof data !== "string" || !data) throw new Error("Invalid Contents");
    const chunks = data.trim().slice(process.env["PREFIX"]!.length).split(/\s+/);
    return [chunks.shift()!.toLowerCase(), ...chunks];
};