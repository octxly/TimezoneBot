"use strict";
const discord_js_1 = require("discord.js");
const cmd = {
    name: "help",
    desc: "A help page with some useful info.",
    async execute(params) {
        const interaction = params.interaction;
        const embed = new discord_js_1.MessageEmbed()
            .setColor("#0099ff")
            .setTitle("Help")
            .addField("**How do I see other people's timezones?**", "A person's timezone, if they added themselves, is in their roles. You can also use /telltime <user> to see.")
            .addField("**How do I add myself to a timezone?**", "All you need to do is /set <UTC offset> to add yourself.")
            .addField("**How do I delete a timezone?**", "Just delete the role.");
        interaction.reply({ embeds: [embed] });
    }
};
module.exports = cmd;
