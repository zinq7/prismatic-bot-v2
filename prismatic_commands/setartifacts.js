const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs-extra');

const artifacts = ["Chaos", "Command", "Death", "Dissonance", "Enigma", "Evolution", "Frailty", "Glass", 
"Honor", "Kin", "Metamorhasis", "Sacrifice", "Soul", "Spite", "Swarms", "Vengeance"]

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setartifacts')
        .setDescription('set the artifacts to be used in the run')
        .addStringOption(str => {
            str.setName("artifacts").setDescription("the artifacts in the run, seperated by SPACES (<artifact1> <artifact2> <etc>)").setRequired(true)
            return str;
        }),
    async execute(interaction) {
        if (interaction.member.roles.cache.get('1035017064886325279') == null) {
            await interaction.reply("You don't have the necessary permissions");
            return;
        } 

        console.log(interaction.user.roles);
        let arts = interaction.options.getString("artifacts");
        await fs.readJSON("./leaderboards.json").then(obj => {
            obj.artifacts = arts.split(" ");
            return obj;
        })
        .then(obj => fs.writeFile('./leaderboards.json', JSON.stringify(obj)))
            .catch(err => console.error(err));

        await interaction.reply("Artifacts set to: **" + arts + "**");
    }
}