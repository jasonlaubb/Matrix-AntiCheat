import { registerCommand, verifier } from "../../CommandHandler";
import { c, rawstr } from "../../../../Assets/Util";
import { MatrixEvents } from "../../../../Data/EnumData";
import { MinecraftEffectTypes } from "../../../../node_modules/@minecraft/vanilla-data/lib/index";

registerCommand({
    name: "vanish",
    description: "Vanish yourself",
    parent: false,
    maxArgs: 0,
    minArgs: 0,
    argRequire: [],
    require: (player) => verifier(player, c().commands.vanish),
    executor: async (player, _args) => {
        player.triggerEvent(MatrixEvents.vanish);
        player.addEffect(MinecraftEffectTypes.Invisibility, 19999999, { showParticles: false, amplifier: 2 });
        player.sendMessage(new rawstr(true, "g").tra("vanish.has").parse());
    },
});
