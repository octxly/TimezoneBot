"use strict";
const GuildModel_1 = require("../GuildModel");
const cmd = {
    name: "removeuser",
    desc: "Removes the timezone role from any user.",
    arguements: [
        {
            name: "user",
            description: "The user the timezone role is being removed from.",
            type: "USER",
            required: true
        }
    ],
    async execute(params) {
        const interaction = params.interaction;
        const options = params.options;
        const member = options.getMember("user", true);
        //guild
        const guild = interaction.guild;
        const roleManager = guild.roles;
        if (!(await GuildModel_1.GuildModel.exists({ guildId: guild.id }))) {
            interaction.reply({ content: ":x: You have no set timezone.", ephemeral: true });
            return;
        }
        const userGuild = await GuildModel_1.GuildModel.findOne({ guildId: interaction.guildId });
        const userTimezone = userGuild.timezones.find(timezone => member.roles.cache.has(timezone.roleId));
        //more idiot-proofing
        if (!userTimezone) {
            interaction.reply({ content: ":x: You have no set timezone.", ephemeral: true });
            return;
        }
        member.roles.remove(roleManager.cache.get(userTimezone.roleId));
        interaction.reply(":white_check_mark: User removed.");
    }
};
module.exports = cmd;
