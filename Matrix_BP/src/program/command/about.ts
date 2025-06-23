import { Module } from "../../matrixAPI";
import { fastText } from "../../util/rawtext";
import type { cmd } from "../../assets/cmd";
import { system } from "@minecraft/server";
export default {
    cc: {
        name: "m:about",
        description: "Displays information about the Matrix AntiCheat.",
        permissionLevel: 0,
        cheatsRequired: false
    },
    cb: (player) => {
        const aboutMessage = fastText()
            .addTran("command.about.title")
            .endline()
            .addTran("command.about.author")
            .endline()
            .addTran("command.about.github", "https://github.com/jasonlaubb/Matrix-AntiCheat/")
            .endline()
            .addTran("command.about.version", Module.version.join("."))
            .endline()
            .addTran("command.about.joindc", Module.discordInviteLink)
            .build();
        system.run(() => player.sendMessage(aboutMessage));
        return { status: 0 };
    }
} as cmd;