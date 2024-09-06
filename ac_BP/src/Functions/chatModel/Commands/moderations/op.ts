import { c, isPasswordCorrect, setPLevel } from "../../../../Assets/Util";
import { registerCommand, sendRawText, verifier } from "../../CommandHandler";

registerCommand({
    name: "op",
    description: "Op a player, or op yourself with password",
    parent: false,
    maxArgs: 1,
    minArgs: 1,
    require: (player) => verifier(player, c().commands.op),
    argRequire: [],
    executor: async (player, args) => {
        const config = c();
        const now = Date.now();
        const lastTry = player.lastOpTry ?? 0;

        if (now - lastTry < config.passwordCold) {
            const wait = ((config.passwordCold - (now - lastTry)) / 1000).toFixed(1);
            sendRawText(player, { text: "§bMatrix §7>§c " }, { translate: "op.wait", with: [wait] });
            return;
        }

        if (config.commands.passwordSetting.enabled) {
            if (isPasswordCorrect(args[0])) {
                player.sendMessage
            }
        } else {
            if (!player.isOp()) return;
        }

        // Give the player the permission level
        setPLevel(player, config.commands.passwordSetting.givenLevel);
    },
});