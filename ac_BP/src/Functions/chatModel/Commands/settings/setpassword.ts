import { c, rawstr } from "../../../../Assets/Util";
import { registerCommand, verifier } from "../../CommandHandler";
import { SHA256 } from "../../../../node_modules/crypto-es/lib/sha256";
import Dynamic from "../../../Config/dynamic_config";

registerCommand({
    name: "setpassword",
    description: "Change the password to a new one safely",
    parent: false,
    maxArgs: 3,
    minArgs: 2,
    require: (player) => verifier(player, c().commands.setpassword),
    argRequire: [undefined, undefined, (value) => ["true", "false"].includes(value as string) && c().commands.passwordSetting.usingHash != value],
    requireSupportArgs: true,
    executor: async (player, args) => {
        const newPassword: string = args[0];
        const confirmPassword: string = args[1];
        const config = c();
        if (newPassword != confirmPassword) {
            player.sendMessage(new rawstr(true, "c").tra("setpassword.different").parse());
            return;
        }
        player.sendMessage(new rawstr(true, "g").tra("setpassword.changed").parse());

        if (!args[2] || args[2] == "true" || (config.commands.passwordSetting.usingHash && args[2] == "false")) {
            Dynamic.set(["commands", "passwordSetting", "hash"], SHA256(newPassword).toString());
            Dynamic.set(["commands", "passwordSetting", "usingHash"], true);
            Dynamic.set(["commands", "passwordSetting", "enabled"], true);
            Dynamic.delete(["commands", "passwordSetting", "password"]);
        } else {
            Dynamic.set(["commands", "passwordSetting", "password"], newPassword);
            Dynamic.set(["commands", "passwordSetting", "usingHash"], false);
            Dynamic.set(["commands", "passwordSetting", "enabled"], true);
            Dynamic.delete(["commands", "passwordSetting", "hash"]);
        }
    },
});