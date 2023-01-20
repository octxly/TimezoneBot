import { GuildModel } from "../GuildModel"
import { Command, CommandParams } from "../interfaces"

const cmd: Command = {
    name: "clear",
    desc: "Clears all data and deletes all roles relating to this server.",
    async execute(params: CommandParams){
        const interaction = params.interaction

        //guild
        const guild = interaction.guild
        const roleManager = guild.roles

        if (!(await GuildModel.exists({guildId: guild.id}))){
            interaction.reply(":white_check_mark: Roles and data cleared.")
            return
        }

        const userGuild = await GuildModel.findOne({guildId: guild.id})
        userGuild.timezones.forEach(timezone => {
            roleManager.delete(roleManager.cache.get(timezone.roleId))
        })

        await GuildModel.deleteOne({guildId: guild.id})
        
        interaction.reply(":white_check_mark: Roles and data cleared.")
    }
}

export = cmd