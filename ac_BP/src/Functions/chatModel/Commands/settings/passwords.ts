import { c } from "../../../../Assets/Util";
import { registerCommand, sendRawText, verifier } from "../../CommandHandler";
import { SHA256 } from "../../../../node_modules/crypto-es/lib/sha256";
import { world } from "@minecraft/server";
import Dynamic from "../../../Config/dynamic_config";

registerCommand({
    name: "passwords",
    description: "Change the password of the op command",
    parent: false,
    maxArgs: 3,
    minArgs: 2,
    require: (player) => verifier(player, c().commands.passwords),
    argRequire: [undefined, undefined, (value) => ["true", "false"].includes(value as string) && c().commands.passwordSetting.usingHash != value],
    requireSupportArgs: true,
    executor: async (player, args) => {
        const oldPassword: string = args[0];
        const newPassword: string = args[1];
        const config = c();
        const correctPassword = config.commands.passwordSetting.usingHash ? SHA256(config.commands.passwordSetting.hash).toString() : config.commands.passwordSetting.password;
        if (oldPassword != correctPassword) return sendRawText(player, { text: "§bMatrix §7>§c " }, { translate: "passwords.wrong", with: [] });
        sendRawText(world, { text: "§bMatrix §7>§g " }, { translate: "passwords.changed", with: [] });

        if (!args[2] || args[2] == "true" || (config.commands.passwordSetting.usingHash && args[2] == "false")) {
            Dynamic.set(["commands", "passwordSetting", "hash"], SHA256(newPassword).toString());
            Dynamic.set(["commands", "passwordSetting", "usingHash"], true);
            Dynamic.delete(["commands", "passwordSetting", "password"]);
        } else {
            Dynamic.set(["commands", "passwordSetting", "password"], newPassword);
            Dynamic.set(["commands", "passwordSetting", "usingHash"], false);
            Dynamic.delete(["commands", "passwordSetting", "hash"]);
        }
    },
});
