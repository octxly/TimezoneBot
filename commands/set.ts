import { GuildMember } from "discord.js"
import { Command, CommandParams, TimezoneGuild } from "../interfaces"
import { GuildModel } from "../GuildModel"

const cmd: Command = {
    name: "set",
    desc: "Sets the specified timezone of yourself.",
    arguements:[
        {
            type: "INTEGER",
            name: "hours",
            description: "The hours of your UTC offset.",
            required: true,
            minValue: -12,
            maxValue: 14
        },
        {
            type: "INTEGER",
            name: "minutes",
            description: "The minutes of your UTC offset.",
            required: false,
            choices: [
                { name: "15", value: 15 },
                { name: "30", value: 30 },
                { name: "45", value: 45 }
            ]
        }
    ],
    async execute(params: CommandParams){
        const interaction = params.interaction
        const options = params.options
        const mentioned  = interaction.member as GuildMember

        const hours = options.getInteger("hours", true)
        const minutes = options.getInteger("minutes")
        const offset = minutes == 0 ? hours : hours + ((hours < 0 ? -1 : 1) * (minutes / 60))

        //format offset into a time format
        //could use the mintutes and hours varaibles but im lazy
        const dec = offset % 1
        const formattedNum = dec == 0 ? `${offset}:00` : `${offset - dec}:${Math.abs(60 * dec)}`
        const formattedOffset = `UTC${offset >= 0 ? "+" : ""}${formattedNum}`

        //guild
        const guild = interaction.guild
        const roleManager = guild.roles

        // if guild object hasnt been created yet
        if (!(await GuildModel.exists({guildId: guild.id}))){
            await new GuildModel({
                guildId: guild.id,
                timezones: []
            }).save()
        }

        const userGuild = await GuildModel.findOne({guildId: guild.id})

        let userTimezone = userGuild.timezones.find(timezone => mentioned.roles.cache.has(timezone.roleId))
        //if user already in a timezone
        if (userTimezone){
            //if user wants to switch timezones
            if (userTimezone.offset != offset){
                mentioned.roles.remove(roleManager.cache.get(userTimezone.roleId))
            } else {
                interaction.reply({content: `:x: User already in timezone ${formattedOffset}.`, ephemeral: true})
                return
            }
        }

        //retries to find correct timezone
        userTimezone = userGuild.timezones.find(timezone => timezone.offset == offset)
        //if correct timezone doesn't exist
        if (!userTimezone){
            let role = await roleManager.create({
                name: "loading...",
                color: "WHITE"
            })

            const newTimezone = {
                offset: offset,
                roleId: role.id
            }

            userGuild.timezones.push(newTimezone)

            await GuildModel.updateOne({guildId: guild.id}, {
                $push: {
                    timezones: newTimezone
                }
            })

            userTimezone = newTimezone
        }

        mentioned.roles.add(roleManager.cache.get(userTimezone.roleId))

        interaction.reply(`:white_check_mark: User added to timezone ${formattedOffset}.`)
    }
}

export = cmd