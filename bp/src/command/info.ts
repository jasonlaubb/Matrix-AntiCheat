import type { Command } from "../main";
export default {
    name: "info",
    description: "Get information about the Matrix AntiCheat.",
    requireOp: false,
    execute: () => {
        return {
            status: 0,
            message:
                "§7[§aMatrix§7]§7 §fMatrix Anticheat Version 7.0.25\n§gAuthor: §ejasonlaubb (Discord: @uwu_the_great)\n§gGitHub: §ehttps://github.com/jasonlaubb/Matrix-AntiCheat\n§gCurseForge: §ehttps://www.curseforge.com/minecraft-bedrock/addons/matrix-anti\n§fThis project is §eopen source§f with §cAGPLv3§f license.\nPlease join our §bDiscord support server§f for more information.\n§gDiscord server links: §ebit.ly/matrix-dc §7|§e §ehttps://discord.gg/CqZGXeRKPJ",
        };
    },
} as Command;
