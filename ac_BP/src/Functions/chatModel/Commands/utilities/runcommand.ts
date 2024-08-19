import { registerCommand, verifier } from "../../CommandHandler";
import { c, rawstr } from "../../../../Assets/Util";

const bannedCommandList = ["op", "deop", "execute", "kick", "event"];
registerCommand({
    name: "runcommand",
    description: "Run a command without operator permissions.",
    parent: false,
    maxArgs: 1,
    minArgs: 1,
    argRequire: [],
    require: (player) => verifier(player, c().commands.runcommand),
    executor: async (player, args) => {
        const command = args[0].startsWith("/") ? args[0].slice(1) : args[0];
        if (bannedCommandList.some((banned) => command.startsWith(banned))) {
            player.sendMessage(new rawstr(true, "c").tra("runcommand.banned").parse());
            return;
        }
        try {
            player.runCommand(command);
            player.sendMessage(new rawstr(true, "g").tra("runcommand.success").parse());
        } catch {
            player.sendMessage(new rawstr(true, "c").tra("runcommand.failed").parse());
        }
    },
});
