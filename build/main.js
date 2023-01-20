"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const fs_1 = __importDefault(require("fs"));
const mongoose_1 = __importDefault(require("mongoose"));
const GuildModel_1 = require("./GuildModel");
//bot object
const client = new discord_js_1.Client({ intents: [discord_js_1.Intents.FLAGS.GUILDS, discord_js_1.Intents.FLAGS.GUILD_MESSAGES] });
//get commands and add them to a collection
const commandFiles = fs_1.default.readdirSync("./build/commands").filter(file => file.endsWith(".js"));
const commands = new discord_js_1.Collection();
commandFiles.forEach(file => {
    const command = require(`./commands/${file}`);
    commands.set(command.name, command);
});
const updateTime = 10000;
const roundToMinute = 30;
mongoose_1.default.connect(`mongodb://localhost:27017/TimezoneBot`, () => console.log("connected to database"));
client.once("ready", async () => {
    // const e = client.channels.cache.get("784179862330933248") as TextChannel
    // e.send("HELP SOME GUY KIDNAPPED ME OFF THE STREET AND IS FORCING ME TO MAKE DISCORD BOTS HELP")
    console.log("online in discord");
    // testing server
    // const guildId = "941444994508681287"
    // // RoR smp
    // const guildId = "853958925626638386"
    // // RoR regular
    const guildId = "780726634172514305";
    const guild = client.guilds.cache.get(guildId);
    let commandManager;
    if (guild) {
        commandManager = guild.commands;
    }
    else {
        commandManager = client.application?.commands;
    }
    //deleting unwanted application commands that accidentially go global
    // client.application.commands.fetch().then(c => console.log(c))
    // client.application.commands.fetch("944290159220912178").then(c => c.delete())
    // create slash commands for all commands
    commands.forEach(command => {
        commandManager.create({
            name: command.name,
            description: command.desc,
            options: command.arguements
        });
    });
    update();
});
client.on("interactionCreate", async (interaction) => {
    if (!interaction.isCommand())
        return;
    const perms = interaction.guild.me.permissions;
    const permsList = [
        "MANAGE_ROLES",
        "VIEW_CHANNEL",
        "SEND_MESSAGES",
        "SEND_MESSAGES_IN_THREADS"
    ];
    if (!perms.has(permsList)) {
        interaction.reply(`:x: Bot does not have correct permissions. ${permsList}`);
        return;
    }
    //checking if in dm or not
    if (interaction.guild === null) {
        interaction.reply(":x: This bot is meant for servers. Please use this bot there.");
        return;
    }
    //CommandParams object is a lot easier to pass arguements with than a crap ton of parameters
    if (commands.has(interaction.commandName))
        commands.get(interaction.commandName).execute({
            interaction: interaction,
            options: interaction.options,
            commands: commands,
            client: client
        });
    else
        interaction.reply({ content: ":x: Command does not exist or is obselete. (the bot doesn't know it exists, probably due to the dev's oversight)", ephemeral: true });
});
const update = () => {
    setInterval(async () => {
        //for each guild that the bot is tracking
        for await (const doc of GuildModel_1.GuildModel.find()) {
            const guild = client.guilds.cache.get(doc.guildId);
            //if bot isnt in TimezoneGuild, delete the TimezoneGuild's info
            if (!guild) {
                await GuildModel_1.GuildModel.deleteOne({
                    guildId: guild.id
                });
                return;
            }
            //for each timezone in that guild
            doc.timezones.forEach(async (timezone) => {
                const role = guild.roles.cache.get(timezone.roleId);
                //if role doesn't exist, delete corresponding data
                if (!role) {
                    await GuildModel_1.GuildModel.updateOne({ guildId: guild.id }, {
                        $pull: {
                            timezones: { offset: timezone.offset }
                        }
                    });
                    return;
                }
                //get the rounded correct time
                let date = new Date();
                let utc = date.getTime() + (date.getTimezoneOffset() * 60000);
                date.setTime(utc + (3600000 * timezone.offset));
                var round = 1000 * 60 * roundToMinute;
                date.setTime(Math.round(date.getTime() / round) * round);
                //change formattedOffset to the correct time format
                const dec = timezone.offset % 1;
                const formattedNum = dec == 0 ? `${timezone.offset}:00` : `${timezone.offset - dec}:${Math.abs(60 * dec)}`;
                const formattedOffset = `${date.toLocaleTimeString("en-US")} (UTC${timezone.offset >= 0 ? "+" : ""}${formattedNum})`;
                const earlyMorningf = `🌕 Early Morning ${formattedOffset}`;
                const morningf = `🌥️ Morning ${formattedOffset}`;
                const noonf = `☀️ Noon ${formattedOffset}`;
                const afternoonf = `🌤️ Afternoon ${formattedOffset}`;
                const eveningf = `🌥️ Evening ${formattedOffset}`;
                const nightf = `🌕 Night ${formattedOffset}`;
                try {
                    switch (date.getHours()) {
                        case 4:
                        case 5:
                        case 6:
                        case 7:
                            if (role.name !== earlyMorningf) {
                                role.setName(earlyMorningf);
                            }
                            break;
                        case 8:
                        case 9:
                        case 10:
                        case 11:
                            if (role.name !== morningf) {
                                role.setName(morningf);
                            }
                            break;
                        case 12:
                            if (role.name !== noonf) {
                                role.setName(noonf);
                            }
                            break;
                        case 13:
                        case 14:
                        case 15:
                        case 16:
                        case 17:
                            if (role.name !== afternoonf) {
                                role.setName(afternoonf);
                            }
                            break;
                        case 18:
                        case 19:
                        case 20:
                            if (role.name !== eveningf) {
                                role.setName(eveningf);
                            }
                            break;
                        case 21:
                        case 22:
                        case 23:
                        case 0:
                        case 1:
                        case 2:
                        case 3:
                            if (role.name !== nightf) {
                                role.setName(nightf);
                            }
                            break;
                    }
                }
                catch (err) {
                    console.log(err);
                }
            });
        }
    }, updateTime);
};
client.login("OTQxNDQyMTYwNzY1NTkxNjMz.YgWAVg.PVaJtMsXJWrD4savxFxBfkWJVMU");
