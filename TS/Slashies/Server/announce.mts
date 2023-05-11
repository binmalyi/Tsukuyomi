import { inspect } from 'util';
import { ChannelType, ChatInputCommandInteraction, EmbedBuilder, PermissionFlagsBits, SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
    .setName('announce')
    .setDescription('Make an announcement')
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .addChannelOption(option => option.setName('channel').setDescription('Target channel').setRequired(true).addChannelTypes(ChannelType.GuildText))
    .addStringOption(option => option.setName('text').setDescription('Announcement to make').setRequired(true));

export async function execute(interaction: ChatInputCommandInteraction){
    const channel = interaction.options.getChannel('channel', true, [ChannelType.GuildText]), text = interaction.options.getString('text', true).slice(0, 4096);

    if (!interaction.inCachedGuild()) return;

    await channel.send({
        embeds: [
            new EmbedBuilder()
            .setColor('Red')
            .setDescription(text.replaceAll('\\n', '\n'))
        ]
    });
};