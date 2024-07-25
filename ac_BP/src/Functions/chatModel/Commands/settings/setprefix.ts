import { registerCommand, verifier } from "../../CommandHandler";
import { c } from "../../../../Assets/Util";
import Dynamic from "../../../Config/dynamic_config";
import { system } from "@minecraft/server";
import { rawstr } from "../../../../Assets/Util";

registerCommand({
    name: "setprefix",
    description: "Change the flag mode used for flag message in chat",
    parent: false,
    maxArgs: 1,
    minArgs: 0,
    argRequire: [(value) => (value as string).length > 0 && (value as string).length <= 8],
    require: (player) => verifier(player, c().commands.setprefix),
    executor: async (player, args) => {
        if (args[0]) {
            Dynamic.set(["commands", "prefix"], args[0]);
            player.sendMessage(new rawstr(true, "g").tra("setprefix.set", args[0]).parse());
        } else {
            Dynamic.delete(["commands", "prefix"]);
            system.run(() => {
                const currentprefix = c().commands.prefix;
                player.sendMessage(new rawstr(true, "g").tra("setprefix.reset", currentprefix).parse());
            })
        }
    },
});