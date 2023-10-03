import { Tsukuyomi } from "../utils/client.mjs";
import { Interaction, Events } from "discord.js";

export const event = Events.InteractionCreate;
export function execute(interaction: Interaction){
    const client = interaction.client as Tsukuyomi;
    if (interaction.isChatInputCommand()) client.slash.get(interaction.commandName)!.execute(interaction).catch(console.error);
};