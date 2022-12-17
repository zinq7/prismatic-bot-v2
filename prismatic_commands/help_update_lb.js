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
            // embed.setDescription("----------------------------------------------------------");
            
            
            let fieldArr = [];
            for (let i = 0; i < obj.leaderboards.length && i < 50; i++) {
                let lbEntry = obj.leaderboards[i];
                let fieldObj = {};
                fieldObj.name =  padTo(lbEntry.char, 20) + lbEntry.timeM + ":" + toTwo(lbEntry.timeS) + "." + toTwo(lbEntry.timeL) + " ~ " + lbEntry.user + " (#" + (i + 1) + ")\n";
                fieldObj.value = "\u200b";

                let indexOf = fieldArr.findIndex(x => x.name.includes(lbEntry.char));
                if (indexOf != -1) {
                    fieldArr[indexOf].value += padTo(" -", 20) + lbEntry.timeM + ":" + toTwo(lbEntry.timeS) + "." + toTwo(lbEntry.timeL) + " ~ " + lbEntry.user +  " (#" + (i + 1) + ")\n"; 
                } else {
                    fieldArr.push(fieldObj);
                }
            }
            
            let desc = "\u200b";
            for (let  i = 0; i < fieldArr.length; i++) {
                fieldArr[i].value += "-------------------------------------------------------";
                // fieldArr[i].name = code(fieldArr[i].name);
                // fieldArr[i].value = code(fieldArr[i].value);
                desc += fieldArr[i].name;
                desc += fieldArr[i].value + "\n";
            }
            embed.setDescription(code(desc));
            //embed.addFields(fieldArr);

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

function padTo(str, padding) {
    let string = str;
    while (string.length < padding) {
        string += " ";
    }
    string += "\u200b";
    return string;
}

function code(str) {
    return "```" + str + "```";
}