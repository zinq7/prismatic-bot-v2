const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs-extra');
const update = require('./help_update_lb');
const config = require('../config');

const chars = ["Acrid", "Artificier", "Bandit", "Captain", "Commando", "Engineer",
    "Huntress", "The Loader", "Mul-T", "Mercenary", "REX", "Railgunner", "Void Fiend"];

module.exports = {
    data: (new SlashCommandBuilder()
        .setName("submit")
        .setDescription("submit a run to the leaderboards")
        .addIntegerOption(int => int.setName("minutes").setDescription("# of minutes").setMaxValue(5).setMinValue(0).setRequired(true))
        .addIntegerOption(option => option.setName("seconds").setDescription("# of seconds").setMaxValue(59).setMinValue(0).setRequired(true))
        .addIntegerOption(option => option.setName("milliseconds").setDescription("# of millis (2 d.p)").setMaxValue(99).setMinValue(0).setRequired(true))
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

        let timeM = interaction.options.getInteger('minutes');
        let timeS = interaction.options.getInteger('seconds');
        let timeL = interaction.options.getInteger("milliseconds");

        let runData = {
            timeM: timeM,
            timeS: timeS,
            timeL: timeL,
            char: interaction.options.getString("character"),
            user: interaction.user.username
        }

        await fs.readJSON("./leaderboards.json")
            .then((object) => {
                let previousRun = object.leaderboards.find((x) => x.user == runData.user && x.char == runData.char);

                if (previousRun != null) {
                    if (previousRun.timeM * 10000 + previousRun.timeS * 100 + previousRun.timeL >
                        timeM * 10000 + timeS * 100 + timeL) {
                        previousRun.timeM = timeM;
                        previousRun.timeS = timeS;
                        previousRun.timeL = timeL;
                    }
                    // set times
                } else {
                    object.leaderboards.push(runData);
                }

                //sort leaderboards
                object.leaderboards.sort(function (a, b) {
                    let t1 = a.timeM * 10000 + a.timeS * 100 + a.timeL;
                    let t2 = b.timeM * 10000 + b.timeS * 100 + b.timeL;
                    return t1 - t2;
                }); //sort by time


                return object;
            }).then((obj) => fs.writeFile("leaderboards.json", JSON.stringify(obj)))
            .catch(e => console.error(e));

        await interaction.followUp(`${runData.user}'s ${runData.char} **` + runData.timeM + ":" + toTwo(runData.timeS) + "." + toTwo(runData.timeL) + `** run submitted!`);

        // call execute with lbMessage
        let msg = interaction.client.channels.cache.get(config.lbchannel).messages;

        msg.fetch(config.lbmessage)
            .then(m => update.execute(m));
    }
}

function toTwo(time) {
    if ((time+"").length == 1) {
        return "0" + time + "";
    } else return time;
}
