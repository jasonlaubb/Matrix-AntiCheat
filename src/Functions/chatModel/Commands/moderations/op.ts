import { c, isAdmin } from "../../../../Assets/Util";
import { isPlayer, registerCommand, sendRawText, verifier } from "../../CommandHandler";
import { SHA256 } from "../../../../node_modules/crypto-es/lib/sha256";

registerCommand({
    name: "op",
    description: "Op a player, or op yourself with password",
    parent: false,
    maxArgs: 1,
    minArgs: 1,
    require: (player) => verifier(player, c().commands.op),
    requireSupportPlayer: true,
    argRequire: [
        (value, player) => {
            if (!isAdmin(player)) return true;
            return !!isPlayer(value as string, true, false);
        },
    ],
    executor: async (player, args) => {
        if (isAdmin(player)) {
            const target = isPlayer(args[0]);
            target.setDynamicProperty("isAdmin", true);
        } else {
            const config = c();
            const now = Date.now();
            const lastTry = player.lastOpTry ?? 0;

            if (now - lastTry < config.passwordCold) {
                const wait = ((config.passwordCold - (now - lastTry)) / 1000).toFixed(1);
                sendRawText(player, { text: "§bMatrix §7>§c " }, { translate: "op.wait", with: [wait] });
                return;
            }
            player.lastOpTry = now;

            const password: string = args[0];
            const correctPassword: string = config.commands.passwordSetting.usingHash ? config.commands.passwordSetting.password : String(SHA256(config.commands.passwordSetting.password));

            if (String(SHA256(password)) == correctPassword) {
                player.setDynamicProperty("isAdmin", true);
                sendRawText(player, { text: "§bMatrix §7>§g " }, { translate: "op.now" });
            } else {
                sendRawText(player, { text: "§bMatrix §7>§c " }, { translate: "op.wrong" });
            }
        }
    },
});