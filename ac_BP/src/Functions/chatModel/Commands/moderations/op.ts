import { c, getPLevel, isPasswordCorrect, rawstr, setPLevel } from "../../../../Assets/Util";
import { registerCommand, sendRawText, verifier } from "../../CommandHandler";

registerCommand({
    name: "op",
    description: "Gain the highest admin permission level by yourself",
    parent: false,
    maxArgs: 1,
    minArgs: 0,
    require: (player) => verifier(player, c().commands.op),
    argRequire: [],
    executor: async (player, args) => {
        const config = c();
        if (getPLevel(player) >= config.commands.passwordSetting.givenLevel) {
            player.sendMessage(new rawstr(true, "c").tra("op.reached").parse());
            return;
        }
        if (config.commands.passwordSetting.enabled) {
            const now = Date.now();
            const lastTry = player.lastOpTry ?? 0;
            if (now - lastTry < config.passwordCold) {
                const wait = ((config.passwordCold - (now - lastTry)) / 1000).toFixed(1);
                sendRawText(player, { text: "§bMatrix §7>§c " }, { translate: "op.wait", with: [wait] });
                return;
            }
            if (isPasswordCorrect(args[0])) {
                player.sendMessage(new rawstr(true, "c").tra("op.pwgain").parse());
            } else {
                player.sendMessage(new rawstr(true, "c").tra("op.incorrect").parse());
                player.lastOpTry = Date.now();
                return;
            }
        } else {
            if (player.isOp()) {
                player.sendMessage(new rawstr(true, "c").tra("op.opgain").parse());
                if (config.commands.passwordSetting.password == "type_your_password_here") {
                    player.sendMessage(new rawstr(true, "c").tra("op.pwtips").parse());
                }
            } else {
                player.sendMessage(new rawstr(true, "c").tra("op.notop").parse());
                return;
            }
        }

        // Give the player the permission level
        setPLevel(player, config.commands.passwordSetting.givenLevel);
    },
});