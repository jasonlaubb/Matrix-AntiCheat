import { registerCommand, verifier } from "../../CommandHandler";
import { c, rawstr } from "../../../../Assets/Util";
import { GameMode } from "@minecraft/server";

const gameModes = [
    GameMode.survival,
    GameMode.creative,
    GameMode.adventure,
    GameMode.spectator,
]
registerCommand({
    name: "gm",
    description: "Set the gamemode of yourself",
    parent: false,
    maxArgs: 1,
    minArgs: 1,
    argRequire: [(value) => ["0","1","2","3"].includes(value as string)],
    require: (player) => verifier(player, c().commands.gm),
    executor: async (player, args) => {
        const gamemode = gameModes[Number(args[0])];
        player.setGameMode(gamemode);
        player.sendMessage(new rawstr(true, "g").tra("gm.success", gamemode.toString()).parse());
    }
})