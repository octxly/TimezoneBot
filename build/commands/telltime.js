"use strict";
const GuildModel_1 = require("../GuildModel");
const cmd = {
    name: "telltime",
    desc: "Gets the time for a certain user.",
    arguements: [
        {
            name: "user",
            description: "The user you want to see the time of.",
            type: "USER",
            required: true
        }
    ],
    async execute(params) {
        const interaction = params.interaction;
        const member = params.options.getMember("user", true);
        if (!(await GuildModel_1.GuildModel.exists({ guildId: interaction.guildId }))) {
            interaction.reply({ content: ":x: User mentioned has no set timezone.", ephemeral: true });
            return;
        }
        const userGuild = await GuildModel_1.GuildModel.findOne({ guildId: interaction.guildId });
        const userTimezone = userGuild.timezones.find(timezone => member.roles.cache.has(timezone.roleId));
        //more idiot-proofing
        if (!userTimezone) {
            interaction.reply({ content: ":x: User mentioned has no set timezone.", ephemeral: true });
            return;
        }
        let d = new Date();
        let utc = d.getTime() + (d.getTimezoneOffset() * 60000);
        let nd = new Date(utc + (3600000 * userTimezone.offset));
        interaction.reply(`**${member.user.username}**: ${nd.toLocaleString("en-US")}`);
    }
};
module.exports = cmd;
