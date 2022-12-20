const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs-extra');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('sendlbmessage')
        .setDescription('sends the first lb message')
        .addChannelOption(ch => ch.setName("channel").setDescription("where the leaderboard will be").setRequired(true)),
    async execute(interaction) {
        let chan = interaction.options.getChannel("channel");
        let emb = new EmbedBuilder().setTitle("pog").setDescription("epic");
        chan.send({embeds: [emb]});

        await interaction.reply("Should have sent the message");
    }
}