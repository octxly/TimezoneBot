import { CommandInteraction, CommandInteractionOptionResolver, CacheType, Client, ApplicationCommandOptionData, Collection } from "discord.js";

export interface Timezone {
    offset: number
    roleId: string
}

export interface TimezoneGuild {
    guildId: string
    timezones: Timezone[]
}

export interface CommandParams {
    interaction: CommandInteraction
    options: Omit<CommandInteractionOptionResolver<CacheType>, 'getMessage' | 'getFocused'>
    client: Client
    commands: Collection<string, Command>
}

export interface Command {
    name: string
    desc: string
    arguements?: ApplicationCommandOptionData[]
    execute(params: CommandParams): void
}