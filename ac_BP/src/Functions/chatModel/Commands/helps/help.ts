import { c, rawstr } from "../../../../Assets/Util";
import { getAllCommands, registerCommand, verifier } from "../../CommandHandler";

registerCommand({
    name: "help",
    description: "Shows help related to commands",
    parent: false,
    maxArgs: 1,
    minArgs: 0,
    argRequire: [(value) => Number.isInteger(Number(value))],
    require: (player) => verifier(player, c().commands.help),
    executor: async (player, args) => {
        const commands = getAllCommands();
        const totalPage = Math.ceil(commands.length / 8);
        let requirePage = 0;
        if (args[0]) {
            const num = Number(args[0]);
            if (num <= 0 && num > totalPage) {
                player.sendMessage(new rawstr(true, "c").tra("help.pageerr", args[0]).parse());
                return;
            }
            requirePage = num - 1;
        }
        const helpMsg = new rawstr(true, "g")
            .tra("help.header", "https://jasonlaubb.github.io/Matrix-AntiCheat")
            .str("\n")
            .tra("help.page", String(requirePage + 1), String(totalPage));
        const cmds = commands.slice(requirePage * 8, requirePage * 8 + 8).filter((cmd) => cmd);
        const prefix = c().commands.prefix;
        for (const cmd of cmds) {
            helpMsg.str(`\n§a${prefix}${cmd.name} §7-§a ${cmd.description}`);
        }

        player.sendMessage(helpMsg.parse());
    },
});
