"use strict";
const discord_js_1 = require("discord.js");
const cmd = {
    name: "commands",
    desc: "Lists all of the commands in the server.",
    async execute(params) {
        const interaction = params.interaction;
        const commands = params.commands;
        const embed = new discord_js_1.MessageEmbed()
            .setColor("#0099ff")
            .setTitle("List of commands");
        embed.addField("**Commands**", "These all the available commands. Some may be restricted.", false);
        commands.forEach(command => {
            embed.addField("/" + command.name, command.desc, true);
        });
        interaction.reply({ embeds: [embed] });
    }
};
module.exports = cmd;
