import { GuildMember } from "discord.js"
import { GuildModel } from "../GuildModel"
import { Command, CommandParams } from "../interfaces"

const cmd: Command = {
    name: "remove",
    desc: "Removes yourself from the speficied timezone.",
    async execute(params: CommandParams){
        const interaction = params.interaction
        const mentioned  = interaction.member as GuildMember

        //guild
        const guild = interaction.guild
        const roleManager = guild.roles

        if(!(await GuildModel.exists({guildId: guild.id}))){
            interaction.reply({content: ":x: You have no set timezone.", ephemeral: true})
            return
        }
   
        const userGuild = await GuildModel.findOne({guildId: interaction.guildId})
        const userTimezone = userGuild.timezones.find(timezone => mentioned.roles.cache.has(timezone.roleId))

        //more idiot-proofing
        if(!userTimezone){
            interaction.reply({content: ":x: You have no set timezone.", ephemeral: true})
            return
        }
        
        mentioned.roles.remove(roleManager.cache.get(userTimezone.roleId))

        interaction.reply(":white_check_mark: User removed.")
    }
}

export = cmd