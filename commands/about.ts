import { MessageEmbed } from "discord.js"
import { Command, CommandParams } from "../interfaces"

const cmd: Command = {
    name: "about",
    desc: "Infomation about the bot.",
    async execute(params: CommandParams){
        const embed = new MessageEmbed()
        .setColor("#0099ff")
        .setTitle("About")
        .setDescription(`
            TimezoneBot is a bot designed to keep track of timezones.

            Use /help for help relating to this bot.

            Contact me if you have any problems, or join 
            the discord TimezoneGuild in the description of this bot.
            -octxly#6800
        `)

        params.interaction.reply({embeds: [embed]})
    }
}

export = cmd