import { registerCommand, verifier } from "../../CommandHandler";
import { isPlayer } from "../../CommandHandler";
import { c } from "../../../../Assets/Util";
import { sendRawText } from "../../CommandHandler";
import { rawstr } from "../../../../Assets/Util";
import { world } from "@minecraft/server";

registerCommand({
    name: "warn",
    description: "Warn a player",
    parent: false,
    maxArgs: 2,
    minArgs: 1,
    argRequire: [(value) => !!isPlayer(value as string, false, true), (value) => value == "reset"],
    require: (player) => verifier(player, c().commands.warn),
    executor: async (player, args) => {
        const target = args[0];
        const resetStatus = args[1];
        const warnData = player.getDynamicProperty("warnAmount") as number ?? 0;
        const warnAmount = warnData + 1;
        if (resetStatus) {
            player.setDynamicProperty("warnAmount");
            sendRawText(player, { text: "§bMatrix §7>§g " }, { translate: "warn.reset", with: [target] });
        } else {
            player.setDynamicProperty("warnAmount", warnAmount);
            const maxWarning = c().commands.warn.maxWarns;
            if (warnAmount > maxWarning) {
                sendRawText(player, { text: "§bMatrix §7>§c " }, { translate: "warn.reached", with: [target] });
                return;
            }
            switch (warnAmount) {
                case (maxWarning): {
                    world.sendMessage(new rawstr(true, "g").tra("warn.final", target).parse());
                    break;
                }
                case 1: {
                    world.sendMessage(new rawstr(true, "g").tra("warn.first", target).parse());
                    break;
                }
                case 2: {
                    world.sendMessage(new rawstr(true, "g").tra("warn.second", target).parse());
                    break;
                }
                case 3: {
                    world.sendMessage(new rawstr(true, "g").tra("warn.third", target).parse());
                    break;
                }
                default: {
                    world.sendMessage(new rawstr(true, "g").tra("warn.for", target, warnAmount.toString()).parse());
                }
            }
        }
    }
})