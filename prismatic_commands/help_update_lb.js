const fs = require("fs-extra");
const discord = require('discord.js');
const config = require('../config.json');

module.exports = {
    data: "help",
    async execute(lbmessage) {
        fs.readJSON('leaderboards.json').then(obj => {
            let embed = new discord.EmbedBuilder();
            embed.setColor("ff99ff");
            embed.setTitle("Top 50 Leaderboards");

            
            let fieldArr = [];
            for (let i = 0; i < obj.leaderboards.length && i < 50; i++) {

                let lbEntry = obj.leaderboards[i];
                let fieldObj = {};
                fieldObj.name = "Position " + (i + 1);
                fieldObj.value = lbEntry.char + " as " + lbEntry.user
                    + ": **" + lbEntry.timeM + ":" + toTwo(lbEntry.timeS) + "." + toTwo(lbEntry.timeL) + "**\n";

                fieldArr.push(fieldObj);
            }

            embed.addFields(fieldArr);

            if (config.shouldlb) {
                lbmessage.edit({embeds: [embed]});
            }
        })
    }
}

function toTwo(time) {
    if ((time+"").length == 1) {
        return "0" + time + "";
    } else return time;
}
// i'm on this rn, but good progreessss