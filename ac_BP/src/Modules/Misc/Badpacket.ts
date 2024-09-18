import { GameMode, Player } from "@minecraft/server";
import { configi, registerModule } from "../Modules";
import { MatrixUsedTags } from "../../Data/EnumData";
import { MinecraftEffectTypes } from "../../node_modules/@minecraft/vanilla-data/lib/index";
import { flag, onceTrue } from "../../Assets/Util";

async function antiBadPacket(config: configi, player: Player) {
    const sprint = player.isSprinting;
    const loc = player.location;
    if (sprint) {
        const validSprint = await onceTrue(player, isValidSprint, config.antiBadpacket.faultToleranceTicks);
        if (!validSprint) {
            player.teleport(loc);
            flag(player, "Badpacket", "A", config.antiBadpacket.maxVL, config.antiBadpacket.punishment, ["FaultToleranceTicks:" + config.antiBadpacket.faultToleranceTicks]);
        }
    }
}

function isValidSprint(player: Player) {
    if (!player.isSprinting) return true;
    if (!player.hasTag(MatrixUsedTags.container) && !player.getEffect(MinecraftEffectTypes.Blindness) && !player.isSneaking) {
        return true;
    }
    return false;
}
registerModule("antiBadpacket", false, [], {
    tickInterval: 10,
    intick: antiBadPacket,
    tickOption: {
        excludeGameModes: [GameMode.spectator, GameMode.creative],
    },
});
