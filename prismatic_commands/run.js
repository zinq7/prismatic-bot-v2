const { SlashCommandBuilder, ReactionUserManager } = require('discord.js');
const fs = require('fs-extra');

const artifacts = ["Chaos", "Command", "Death", "Dissonance", "Enigma", "Evolution", "Frailty", "Glass", 
"Honor", "Kin", "Metamorhasis", "Sacrifice", "Soul", "Spite", "Swarms"]

module.exports = {
    data: new SlashCommandBuilder()
        .setName('run')
        .setDescription('displays the information about the current run'),
    async execute(interaction) {
        let msg = "Run: \n";
        await fs.readJSON("./leaderboards.json").then(obj => {
            msg += "Seed: " + obj.seed + "\n";
            msg += "Artifacts: " + obj.artifacts + "\n";
            msg += "Time: " + obj.time + "\n";
        }).catch(err => console.log(err));

        await interaction.reply(msg);
    }
}