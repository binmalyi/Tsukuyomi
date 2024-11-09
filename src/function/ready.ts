import type { ClientEvents } from "discord.js";

export default function (...params: ClientEvents["ready"]){
    console.log(`${params[0].user.username} has logged on.`);
};