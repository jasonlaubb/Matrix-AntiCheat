import type { Command } from "../main";
export default {
    name: "info",
    description: "Get information about the Matrix AntiCheat.",
    requireOp: false,
    execute: () => {
        return {
            status: 0,
            message: "§7[§aMatrix§7]§7 §fMatrix Anticheat Version 7.0.0\nAuthor: jasonlaubb (Discord: uwu_the_great)\nGitHub: https://github.com/jasonlaubb/Matrix-AntiCheat\nCurseForge: https://www.curseforge.com/minecraft-bedrock/addons/matrix-anti\nThis project is §eopen source§f with §cAGPLv3§f license.\nPlease join our §bDiscord support server§f for more information: §ebit.ly/matrix-dc§f or §ehttps://discord.gg/CqZGXeRKPJ"
        }
    }
} as Command;