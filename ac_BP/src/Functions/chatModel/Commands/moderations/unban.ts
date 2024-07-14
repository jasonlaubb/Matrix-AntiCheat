import { registerCommand, verifier } from "../../CommandHandler";
import { c, rawstr } from "../../../../Assets/Util";
import { Action } from "../../../../Assets/Action";
import { unbanList } from "../../../moderateModel/banHandler";

registerCommand(
    {
        name: "unban",
        description: "Unban related commands",
        parent: true,
        require: (player) => verifier(player, c().commands.rank),
    },
    {
        name: "add",
        description: "Unban a player, even they are offline.",
        minArgs: 1,
        maxArgs: 1,
        argRequire: [undefined],
        executor: async (player, args) => {
            Action.unban(args[0])
            player.sendMessage(new rawstr(true, "g").tra("unban.add", args[0]).parse());
        }
    },
    {
        name: "remove",
        description: "Remove a unbanned player if they haven't joined and unbanned yet",
        minArgs: 1,
        maxArgs: 1,
        argRequire: [undefined],
        executor: async (player, args) => {
            if (Action.unbanRemove(args[0])) {
                player.sendMessage(new rawstr(true, "g").tra("unbanremove.yes", args[0]).parse());
            } else {
                player.sendMessage(new rawstr(true, "c").tra("unbanremove.not", args[0]).parse());
            }
        }
    },
    {
        name: "list",
        description: "List all unbanned players",
        minArgs: 0,
        maxArgs: 0,
        argRequire: [],
        executor: async (player, _args) => {
            const unbanlist = unbanList();
            if (unbanlist.length == 0) {
                player.sendMessage(new rawstr(true, "c").tra("unbanlist.none").parse());
            } else {
                player.sendMessage(new rawstr(true, "g").tra("unbanlist.list").str(": " + unbanlist.join(", ")).parse());
            }
        }
    }
)