import { registerCommand, isPlayer, sendRawText, verifier } from "../../CommandHandler";
import { c, isTimeStr, timeToMs } from "../../../../Assets/Util";
import { ban } from "../../../moderateModel/banHandler";
import { world } from "@minecraft/server";

registerCommand({
    name: "ban",
    description: "Ban a player",
    parent: false,
    maxArgs: 3,
    minArgs: 1,
    argRequire: [(value) => !!isPlayer(value as string, true, false), undefined, (value) => isTimeStr(value as string) || value == "forever"],
    require: (player) => verifier(player, c().commands.ban),
    executor: async (player, args) => {
        const target = isPlayer(args[0]);
        const reason = args[1] || "No reason provided";
        const time = args[2] || "forever";
        ban(target, reason, player.name, time === "forever" ? time : Date.now() + timeToMs(time)!);
        sendRawText(world, { text: "§bMatrix §7>§g " }, { translate: "ban.has", with: [target.name, player.name] });
    },
});
