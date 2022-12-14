const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs-extra');
const update = require('./help_update_lb');
const config = require('../config');

const chars = ["Acrid", "Artificier", "Bandit", "Captain", "Commando", "Engineer",
    "Huntress", "The Loader", "Mul-T", "Mercenary", "REX", "Railgunner", "Void Fiend"];

module.exports = {
    data: (new SlashCommandBuilder()
        .setName("unsubmit")
        .setDescription("deletes one of your runs from the leaderboards")
        .addStringOption(option => {
            option.setName("character")
                .setDescription("which character the run was played as")
                .addChoices({ name: chars[0], value: chars[0] },
                    { name: chars[1], value: chars[1] },
                    { name: chars[2], value: chars[2] },
                    { name: chars[3], value: chars[3] },
                    { name: chars[4], value: chars[4] },
                    { name: chars[5], value: chars[5] },
                    { name: chars[6], value: chars[6] },
                    { name: chars[7], value: chars[7] },
                    { name: chars[8], value: chars[8] },
                    { name: chars[9], value: chars[9] },
                    { name: chars[10], value: chars[10] },
                    { name: chars[11], value: chars[11] },
                    { name: chars[12], value: chars[12] } // so inefficient lol but wtvr
                ).setRequired(true)
            return option;
        }
        )),
    async execute(interaction) {
        await interaction.deferReply();

        let char = interaction.options.getString("character"); 
        let user = interaction.user.username;

        let deleted = `${user}'s ${char} run deleted!`;
        await fs.readJSON("./leaderboards.json")
            .then((object) => {
                let index = object.leaderboards.findIndex((x) => x.user == user && x.char == char);
                
                if (index != -1) {
                    object.leaderboards.splice(index, 1);
                } else {
                    deleted = `Could not find ${user}'s ${char} run :(`;
                }
                

                return object;
            }).then((obj) => fs.writeFile("leaderboards.json", JSON.stringify(obj)))
            .catch(e => console.error(e));

        await interaction.followUp(deleted);

        // update leaderboard message
        let msg = interaction.client.channels.cache.get(config.lbchannel).messages;

        msg.fetch(config.lbmessage)
            .then(m => update.execute(m));
    }
}
