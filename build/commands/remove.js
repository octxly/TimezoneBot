"use strict";
const GuildModel_1 = require("../GuildModel");
const cmd = {
    name: "remove",
    desc: "Removes yourself from the speficied timezone.",
    async execute(params) {
        const interaction = params.interaction;
        const mentioned = interaction.member;
        //guild
        const guild = interaction.guild;
        const roleManager = guild.roles;
        if (!(await GuildModel_1.GuildModel.exists({ guildId: guild.id }))) {
            interaction.reply({ content: ":x: You have no set timezone.", ephemeral: true });
            return;
        }
        const userGuild = await GuildModel_1.GuildModel.findOne({ guildId: interaction.guildId });
        const userTimezone = userGuild.timezones.find(timezone => mentioned.roles.cache.has(timezone.roleId));
        //more idiot-proofing
        if (!userTimezone) {
            interaction.reply({ content: ":x: You have no set timezone.", ephemeral: true });
            return;
        }
        mentioned.roles.remove(roleManager.cache.get(userTimezone.roleId));
        interaction.reply(":white_check_mark: User removed.");
    }
};
module.exports = cmd;
