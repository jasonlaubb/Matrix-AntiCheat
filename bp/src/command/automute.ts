import { system, world } from "@minecraft/server";
import type { Command } from "../main";
import { hasEducationalFeature } from "../util/util";
import english from "../data/languages/english";
import { text } from "../util/text";
export const automute = {
    name: "automute",
    description: english.commandAutoMuteDescription,
    requireOp: true,
    translationDef: {
        actionName: "commandAutoMute",
        description: "commandAutoMuteDescription",
    },
    execute: () => {
        if (!hasEducationalFeature()) return { status: 1, message: "§7[§aMatrix§7] §f" + text("commandAutoMuteEduOnly") };
        const isEnabled = world.getDynamicProperty("automute");
        world.setDynamicProperty("automute", !isEnabled);
        return { status: 0, message: "§7[§aMatrix§7] §f" + text("commandAutoMuteSuccess", isEnabled ? text("commandToggleDisable") : text("commandToggleEnable")) };
    },
} as Command;
export const enterchat = {
    name: "enterchat",
    description: english.commandEnterchat,
    requireOp: false,
    translationDef: {
        actionName: "commandEnterchat",
        description: "commandEnterchat",
    },
    execute: (player) => {
        const isEnabled = world.getDynamicProperty("automute");
        if (!isEnabled) return { status: 1, message: "§7[§aMatrix§7] §f" + text("commandEnterchatNotEnabled") };
        if (player?.chatEntered) return { status: 1, message: "§7[§aMatrix§7] §f" + text("commandEnterchatAlready") };
        if (player.getDynamicProperty("muteData:" + player.id)) return { status: 1, message: "§7[§aMatrix§7] §f" + text("commandEnterchatMuted") };
        player.chatEntered = true;
        system.run(() => player.runCommand("ability @s mute false"));
        return { status: 0, message: "§7[§aMatrix§7] §f" + text("commandEnterchatSuccess") };
    },
} as Command;
