import { isPlayer, registerCommand, sendRawText, verifier } from "../../CommandHandler";
import { c } from "../../../../Assets/Util";
import Dynamic from "../../../Config/dynamic_config";

registerCommand(
    {
        name: "bypasslist",
        description: "Bypass a player kimochi",
        parent: true,
        require: (player) => verifier(player, c().commands.bypasslist),
    },
    {
        name: "add",
        description: "Add a player to bypasslist",
        argRequire: [(value) => !!isPlayer(value as string)],
        minArgs: 1,
        maxArgs: 1,
        executor: async (player, args) => {
            const config = c();
            const target = isPlayer(args[0]);
            const currentlist = config.autoPunishment.bypasslist;
            if (currentlist.includes(target.id)) return sendRawText(player, { text: "§bMatrix §7>§c " }, { translate: "bypasslist.already", with: [target.name] });
            currentlist.push(target.id);
            Dynamic.set(["autoPunishment", "bypasslist"], currentlist);
            sendRawText(player, { text: "§bMatrix §7>§g " }, { translate: "banqueue.done", with: [] });
        },
    },
    {
        name: "remove",
        description: "Remove a player from bypasslist",
        argRequire: [(value) => !!isPlayer(value as string)],
        minArgs: 1,
        maxArgs: 1,
        executor: async (player, args) => {
            const config = c();
            const target = isPlayer(args[0]);
            const currentlist = config.autoPunishment.bypasslist;
            if (!currentlist.includes(target.id)) return sendRawText(player, { text: "§bMatrix §7>§c " }, { translate: "bypasslist.notfound", with: [target.name] });
            currentlist.splice(currentlist.indexOf(target.id), 1);
            Dynamic.set(["autoPunishment", "bypasslist"], currentlist);
            sendRawText(player, { text: "§bMatrix §7>§g " }, { translate: "banqueue.done", with: [] });
        },
    },
    {
        name: "list",
        description: "List all bypassed players",
        minArgs: 0,
        maxArgs: 0,
        executor: async (player, _args) => {
            const config = c();
            const bypasslist = config.autoPunishment.bypasslist;
            if (bypasslist.length == 0) {
                sendRawText(player, { text: "§bMatrix §7>§c " }, { translate: "bypasslist.empty" });
            } else {
                sendRawText(player, { text: "§bMatrix §7>§g " }, { translate: "bypasslist.list", with: [bypasslist.join(", ")] });
            }
        },
    }
);

export interface BanqueueData {
    name: string;
    reason: string;
    time: "forever" | number;
    admin: string;
}
