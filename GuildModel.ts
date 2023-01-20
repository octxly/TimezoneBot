import mongoose from "mongoose";
import { TimezoneGuild } from "./interfaces";

export const GuildModel = mongoose.model("guilds", new mongoose.Schema<TimezoneGuild>({
    guildId: String,
    timezones: [
        {
            offset: Number,
            roleId: String
        }
    ]
}))