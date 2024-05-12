import { c } from "../../../../Assets/Util";
import { registerCommand, sendRawText, verifier } from "../../CommandHandler";
import { SHA256 } from "crypto-es/lib/sha256";
import { world } from "@minecraft/server";

registerCommand({
    name: "passwords",
    description: "Change the password of the op command",
    parent: false,
    maxArgs: 2,
    minArgs: 2,
    require: (player) => verifier(player, c().commands.passwords),
    argRequire: [undefined, (value, _player, args) => args[1] != value],
    requireSupportArgs: true,
    executor: async (player, args) => {
        const oldPassword: string = args[0];
        const newPassword: string = args[1];
        const config = c();
        const correctPassword = (world.getDynamicProperty("sha_password") ?? config.commands.password) as string;
        if (oldPassword !== correctPassword) return sendRawText(player, { text: "§bMatrix §7>§c " }, { translate: "passwords.wrong", with: [] });

        sendRawText(world, { text: "§bMatrix §7>§g " }, { translate: "passwords.changed", with: [] });
        world.setDynamicProperty("sha_password", String(SHA256(newPassword)));
    },
});
