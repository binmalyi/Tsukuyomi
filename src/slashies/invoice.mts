import { readFile, writeFile } from "fs/promises";
import { ChannelType, ChatInputCommandInteraction, PermissionFlagsBits, SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
    .setName('invoice')
    .setDescription('Setup voice channel')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
    .addChannelOption(option => option
        .setName('channel')
        .setDescription('Channel to use')
        .addChannelTypes(ChannelType.GuildVoice)
    );

export async function execute(interaction: ChatInputCommandInteraction){
    if (!interaction.inCachedGuild()) return;
    const
        channel = interaction.options.getChannel('channel', false, [ChannelType.GuildVoice]),
        channels = (JSON.parse(await readFile('config.json', {encoding: 'utf-8'})) as Array<string>);

    channels.push(channel ? channel.id : (await interaction.guild.channels.create({name: '➕', type: ChannelType.GuildVoice, parent: interaction.channel?.parentId})).id);
    
    await writeFile('config.json', JSON.stringify(channels, null, 2), {encoding: 'utf-8'})
    .then(void await interaction.reply({content: 'Success', ephemeral: true}));
};