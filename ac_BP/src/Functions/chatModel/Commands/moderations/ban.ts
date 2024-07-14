import { registerCommand, isPlayer, sendRawText, verifier } from "../../CommandHandler";
import { c, isTimeStr, timeToMs } from "../../../../Assets/Util";
import { ban } from "../../../moderateModel/banHandler";

registerCommand({
    name: "ban",
    description: "Ban a player",
    parent: false,
    maxArgs: 3,
    minArgs: 3,
    argRequire: [(value) => !!isPlayer(value as string, true, true), undefined, (value) => isTimeStr(value as string) || value == "forever"],
    require: (player) => verifier(player, c().commands.ban),
    executor: async (player, args) => {
        const target = isPlayer(args[0]);
        const reason = args[1];
        const time = args[2];
        ban(target, reason, player.name, time === "forever" ? time : Date.now() + timeToMs(time));
        sendRawText(player, { text: "§bMatrix §7>§g " }, { translate: "ban.has", with: [target.name, player.name] });
    },
});
