import { c } from "../../../../Assets/Util";
import Dynamic from "../../../Config/dynamic_config";
import { registerCommand, verifier } from "../../CommandHandler";
import { rawstr } from "../../../../Assets/Util";

registerCommand({
    name: "antispam",
    description: "Toggle the antispam modules",
    parent: false,
    minArgs: 1,
    maxArgs: 2,
    require: (player) => verifier(player, c().commands.antispam),
    argRequire: [(value) =>["chatFilter","linkEmailFilter","spamFilter"].includes(value as string), (value) => ["enable", "disable"].includes(value as string)],
    executor: async (player, args) => {
        const config = c().intergradedAntiSpam as unknown as { [key: string]: { enabled: boolean }};
        const status = config[args[0]]?.enabled;
        if (args[1]) {
            if (status == (args[1] == "enable")) return player.sendMessage(new rawstr(true, "g").tra("antispam.already", args[0], args[1]).parse());
            Dynamic.set(["intergradedAntiSpam", args[0], "enabled"], args[1]);
        } else {
            Dynamic.delete(["intergradedAntiSpam", args[0]]);
            player.sendMessage(new rawstr(true, "g").tra("antispam.toggle", args[0], "default").parse());
        }
    }
})