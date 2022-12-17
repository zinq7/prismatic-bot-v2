const fs = require("fs-extra");
const discord = require('discord.js');
const config = require('../config.json');

module.exports = {
    data: "help",
    async execute(lbmessage) {
        fs.readJSON('leaderboards.json').then(obj => {
            let embed = new discord.EmbedBuilder();
            embed.setColor("ff99ff");
            embed.setTitle("CHARACTER LEADERBOARDS");
            embed.setDescription("--------------------------------------------------------------------------");
            
            
            let fieldArr = [];
            for (let i = 0; i < obj.leaderboards.length && i < 50; i++) {
                let lbEntry = obj.leaderboards[i];
                let fieldObj = {};
                fieldObj.name = lbEntry.char + " " + lbEntry.timeM + ":" + toTwo(lbEntry.timeS) + "." + toTwo(lbEntry.timeL)  + " ~ " + lbEntry.user + " (#" + (i + 1) + ")\n";
                fieldObj.value = "\u200b";

                let indexOf = fieldArr.findIndex(x => x.name.includes(lbEntry.char));
                if (indexOf != -1) {
                    fieldArr[indexOf].value += "--> **" + lbEntry.timeM + ":" + toTwo(lbEntry.timeS) + "." + toTwo(lbEntry.timeL) + "** ~ " + lbEntry.user +  " (#" + (i + 1) + ")\n"; 
                } else {
                    fieldArr.push(fieldObj);
                }                
            }
            
            for (let  i = 0; i < fieldArr.length; i++) {
                fieldArr[i].value += "--------------------------------------------------------------------------";
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