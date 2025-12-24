import english from "../data/languages/english";
import type { Command } from "../main";
import { text } from "../util/text";
export default {
    name: "acinfo",
    description: english.commandInfoDescription,
    requireOp: false,
    translationDef: {
        actionName: "commandInfo",
        description: "commandInfoDescription",
    },
    execute: () => {
        const version = "7.2.1";
        const author = "jasonlaubb (Discord: @uwu_the_great)";
        const github = "https://github.com/jasonlaubb/Matrix-AntiCheat";
        const curseforge = "https://www.curseforge.com/minecraft-bedrock/addons/matrix-anti";
        const license = "AGPLv3";
        const discordShort = "bit.ly/matrix-dc";
        const discordFull = "https://discord.gg/CqZGXeRKPJ";

        const message =
            "§7[§aMatrix§7]§7 §f" +
            text("commandInfoVersion", version) +
            "\n" +
            text("commandInfoAuthor", author) +
            "\n" +
            text("commandInfoGitHub", github) +
            "\n" +
            text("commandInfoCurseForge", curseforge) +
            "\n" +
            text("commandInfoLicense", license) +
            "\n" +
            text("commandInfoSupport") +
            "\n" +
            text("commandInfoDiscordLinks", discordShort, discordFull);

        return { status: 0, message };
    },
} as Command;
