import { registerCommand, verifier } from "../../CommandHandler";
import { c, rawstr } from "../../../../Assets/Util";
import { MatrixEvents } from "../../../../Data/EnumData";
import { MinecraftEffectTypes } from "../../../../node_modules/@minecraft/vanilla-data/lib/index";

registerCommand({
    name: "unvanish",
    description: "Unvanish yourself",
    parent: false,
    maxArgs: 0,
    minArgs: 0,
    argRequire: [],
    require: (player) => verifier(player, c().commands.unvanish),
    executor: async (player, _args) => {
        player.triggerEvent(MatrixEvents.unvanish);
        player.removeEffect(MinecraftEffectTypes.Invisibility);
        player.sendMessage(new rawstr(true, "g").tra("vanish.out").parse());
    },
});
