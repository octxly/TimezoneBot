import { MessageEmbed } from "discord.js"
import { Command, CommandParams } from "../interfaces"

const cmd: Command = {
    name: "help",
    desc: "A help page with some useful info.",
    async execute(params: CommandParams){
        const interaction = params.interaction

        const embed = new MessageEmbed()
            .setColor("#0099ff")
            .setTitle("Help")

            .addField(
                "**How do I see other people's timezones?**", 
                "A person's timezone, if they added themselves, is in their roles. You can also use /telltime <user> to see."
            )
            .addField(
                "**How do I add myself to a timezone?**",
                "All you need to do is /set <UTC offset> to add yourself."
            )
            .addField(
                "**How do I delete a timezone?**",
                "Just delete the role."
            )

        interaction.reply({embeds: [embed]})
    }
}

export = cmd