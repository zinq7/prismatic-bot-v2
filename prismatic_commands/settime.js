const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs-extra');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('settime')
        .setDescription('set the time of the run ending')
        .addStringOption(str => str.setName("time").setDescription("the time (in unix timestamp)").setRequired(true)),
    async execute(interaction) {
        if (interaction.member.roles.cache.get('1035017064886325279') == null) {
            await interaction.reply("You don't have the necessary permissions");
            return;
        } 

        let time = interaction.options.getString("time");
        await fs.readJSON("./leaderboards.json").then(obj => {
            obj.time = "<t:" + time + ":R>";
            return obj;
        }).then(obj => fs.writeFile('./leaderboards.json', JSON.stringify(obj)))
            .catch(err => console.error(err));

        await interaction.reply("Seed set to: <t:" + time + ":R>");
    }
}