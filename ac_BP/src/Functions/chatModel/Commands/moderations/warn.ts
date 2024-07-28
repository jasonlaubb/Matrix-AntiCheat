import { registerCommand, verifier } from "../../CommandHandler";
import { isPlayer } from "../../CommandHandler";
import { c } from "../../../../Assets/Util";
import { sendRawText } from "../../CommandHandler";
import { rawstr } from "../../../../Assets/Util";
import { world } from "@minecraft/server";
import { Action } from "../../../../Assets/Action";

registerCommand({
    name: "warn",
    description: "Warn a player",
    parent: false,
    maxArgs: 2,
    minArgs: 1,
    argRequire: [(value) => !!isPlayer(value as string, false, false), (value) => value == "reset"],
    require: (player) => verifier(player, c().commands.warn),
    executor: async (player, args) => {
        const target = isPlayer(args[0]);
        const resetStatus = args[1];
        const warnData = (player.getDynamicProperty("warnAmount") as number) ?? 0;
        const warnAmount = warnData + 1;
        if (resetStatus) {
            target.setDynamicProperty("warnAmount");
            sendRawText(player, { text: "§bMatrix §7>§g " }, { translate: "warn.reset", with: [target.name] });
        } else {
            target.setDynamicProperty("warnAmount", warnAmount);
            const config = c();
            const maxWarning = c().commands.warn.maxWarns;
            if (warnAmount > maxWarning) {
                sendRawText(player, { text: "§bMatrix §7>§c " }, { translate: "warn.reached", with: [target.name] });
                target.setDynamicProperty("warnAmount", 0);
                switch (config.commands.warn.maxWarnAction) {
                    case "tempkick": {
                        Action.tempkick(target);
                        break;
                    }
                    case "kick": {
                        Action.kick(target);
                        break;
                    }
                    case "ban": {
                        Action.ban(target, "Warn amount limits", player.name, "forever");
                        break;
                    }
                }
                return;
            }
            switch (warnAmount) {
                case maxWarning: {
                    world.sendMessage(new rawstr(true, "g").tra("warn.final", target.name).parse());
                    break;
                }
                case 1: {
                    world.sendMessage(new rawstr(true, "g").tra("warn.first", target.name).parse());
                    break;
                }
                case 2: {
                    world.sendMessage(new rawstr(true, "g").tra("warn.second", target.name).parse());
                    break;
                }
                case 3: {
                    world.sendMessage(new rawstr(true, "g").tra("warn.third", target.name).parse());
                    break;
                }
                default: {
                    world.sendMessage(new rawstr(true, "g").tra("warn.for", target.name, warnAmount.toString()).parse());
                }
            }
        }
    },
});
