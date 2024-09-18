import { registerCommand, isPlayer, verifier } from "../../CommandHandler";
import { c, getPLevel, rawstr, setPLevel } from "../../../../Assets/Util";

registerCommand({
    name: "setadmin",
    description: "Change a player admin permission level",
    parent: false,
    maxArgs: 2,
    minArgs: 2,
    argRequire: [(value) => !!isPlayer(value as string), (value) => Number.isInteger(Number(value))],
    require: (player) => verifier(player, c().commands.setadmin),
    executor: async (player, args) => {
        const target = isPlayer(args[0]);
        const targetNumber = Number(args[1]);
        if (getPLevel(target) >= getPLevel(player)) {
            player.sendMessage(new rawstr(true, "c").tra("setadmin.toohigh").parse());
        } else if (targetNumber >= 4) {
            player.sendMessage(new rawstr(true, "c").tra("setadmin.outofrange").parse());
        } else if (targetNumber < 0) {
            player.sendMessage(new rawstr(true, "c").tra("setadmin.toolow").parse());
        } else {
            setPLevel(target, targetNumber);
            player.sendMessage(new rawstr(true, "g").tra("setadmin.has", target.name, player.name, targetNumber.toString()).parse());
        }
    },
});