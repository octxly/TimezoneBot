"use strict";
const GuildModel_1 = require("../GuildModel");
const cmd = {
    name: "clear",
    desc: "Clears all data and deletes all roles relating to this server.",
    async execute(params) {
        const interaction = params.interaction;
        //guild
        const guild = interaction.guild;
        const roleManager = guild.roles;
        if (!(await GuildModel_1.GuildModel.exists({ guildId: guild.id }))) {
            interaction.reply(":white_check_mark: Roles and data cleared.");
            return;
        }
        const userGuild = await GuildModel_1.GuildModel.findOne({ guildId: guild.id });
        userGuild.timezones.forEach(timezone => {
            roleManager.delete(roleManager.cache.get(timezone.roleId));
        });
        await GuildModel_1.GuildModel.deleteOne({ guildId: guild.id });
        interaction.reply(":white_check_mark: Roles and data cleared.");
    }
};
module.exports = cmd;
