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
            const currentname = config.autoPunishment.bypassname;
            if (currentlist.includes(target.id)) return sendRawText(player, { text: "§bMatrix §7>§c " }, { translate: "bypasslist.already", with: [target.name] });
            currentlist.push(target.id);
            currentname.push(target.name);
            Dynamic.set(["autoPunishment", "bypasslist"], currentlist);
            Dynamic.set(["autoPunishment", "bypassname"], currentname);
            sendRawText(player, { text: "§bMatrix §7>§g " }, { translate: "banqueue.done", with: [] });
        },
    },
    {
        name: "remove",
        description: "Remove a player from bypasslist",
        argRequire: [undefined],
        minArgs: 1,
        maxArgs: 1,
        executor: async (player, args) => {
            const config = c();
            const currentlist = config.autoPunishment.bypasslist;
            const currentname = config.autoPunishment.bypassname;
            if (!currentname.includes(args[0])) return sendRawText(player, { text: "§bMatrix §7>§c " }, { translate: "bypasslist.notfound", with: [args[0]] });
            const index = currentname.indexOf(args[0]);
            currentlist.splice(index, 1);
            currentname.splice(index, 1);
            Dynamic.set(["autoPunishment", "bypasslist"], currentlist);
            Dynamic.set(["autoPunishment", "bypassname"], currentname);
            sendRawText(player, { text: "§bMatrix §7>§g " }, { translate: "banqueue.done", with: [] });
        },
    },
    {
        name: "list",
        description: "List all bypassed players",
        minArgs: 0,
        maxArgs: 0,
        argRequire: [],
        executor: async (player, _args) => {
            const config = c();
            const bypasslist = config.autoPunishment.bypassname;
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
