import { MessageEmbed } from "discord.js"
import { Command, CommandParams } from "../interfaces"

const cmd: Command = {
    name: "commands",
    desc: "Lists all of the commands in the server.",
    async execute(params: CommandParams){
        const interaction = params.interaction
        const commands = params.commands

        const embed = new MessageEmbed()
            .setColor("#0099ff")
            .setTitle("List of commands")

        embed.addField("**Commands**", "These all the available commands. Some may be restricted.", false)
        commands.forEach(command => {
            embed.addField("/" + command.name, command.desc, true)
        })

        interaction.reply({embeds: [embed]})
    }
}

export = cmd