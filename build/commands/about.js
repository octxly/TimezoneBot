"use strict";
const discord_js_1 = require("discord.js");
const cmd = {
    name: "about",
    desc: "Infomation about the bot.",
    async execute(params) {
        const embed = new discord_js_1.MessageEmbed()
            .setColor("#0099ff")
            .setTitle("About")
            .setDescription(`
            TimezoneBot is a bot designed to keep track of timezones.

            Use /help for help relating to this bot.

            Contact me if you have any problems, or join 
            the discord TimezoneGuild in the description of this bot.
            -octxly#6800
        `);
        params.interaction.reply({ embeds: [embed] });
    }
};
module.exports = cmd;
