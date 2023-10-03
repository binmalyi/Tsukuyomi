import { readFile } from "fs/promises";
import {
    ChannelType,
    Events,
    GuildMember,
    PermissionFlagsBits,
    Snowflake,
    VoiceState
} from "discord.js";

const voice = new WeakMap<GuildMember, Snowflake>();

export const event = Events.VoiceStateUpdate;
export async function execute(oldState: VoiceState, newState: VoiceState){

    if (!oldState.channel && (JSON.parse(await readFile('config.json', {encoding: 'utf-8'})) as Array<string>).includes(newState.channelId!))

        await newState.guild.channels.create({
            name: oldState.member?.user?.displayName ?? oldState.id.slice(0, 10),
            type: ChannelType.GuildVoice,
            parent: newState.channel?.parent,
            permissionOverwrites: [
                {
                    id: newState.id,
                    allow: [PermissionFlagsBits.ManageChannels, PermissionFlagsBits.ViewChannel]
                }
            ]
        })
        .then(channel => (newState.member?.voice?.setChannel(channel), voice.set(newState.member as GuildMember, channel.id)))
        .catch(console.error);
        
    else if(!newState.channel) if(oldState.channelId === voice.get(newState.member as GuildMember)) oldState.channel?.delete();
}