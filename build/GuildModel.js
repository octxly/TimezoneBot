"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GuildModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
exports.GuildModel = mongoose_1.default.model("guilds", new mongoose_1.default.Schema({
    guildId: String,
    timezones: [
        {
            offset: Number,
            roleId: String
        }
    ]
}));
