const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs-extra');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setseed')
        .setDescription('set the seed to be used in the run')
        .addStringOption(str => str.setName("seed").setDescription("the seed").setRequired(true)),
    async execute(interaction) {

        if (interaction.member.roles.cache.get('1035017064886325279') == null) {
            await interaction.reply("You don't have the necessary permissions");
            return;
        } 

        let seed = interaction.options.getString("seed");
        await fs.readJSON("./leaderboards.json").then(obj => {
            obj.seed = seed;
            return obj;
        }).then(obj => fs.writeFile('./leaderboards.json', JSON.stringify(obj)))
            .catch(err => console.error(err));

        await interaction.reply("Seed set to: **" + seed + "**");
    }
}