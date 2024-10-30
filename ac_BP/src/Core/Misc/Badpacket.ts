import { EntityCanFlyComponent, GameMode, Player } from "@minecraft/server";
import { configi, registerModule } from "../Modules";
import { MatrixUsedTags } from "../../Data/EnumData";
import { MinecraftEffectTypes } from "../../node_modules/@minecraft/vanilla-data/lib/index";
import { onceTrue } from "../../Assets/Util";
import flag from "../../Assets/flag";

async function antiBadPacket(config: configi, player: Player) {
    const sprint = player.isSprinting;
    const loc = player.location;
    if (player.isFlying) {
        const component = player.getComponent("can_fly") as EntityCanFlyComponent;
        if (!component?.isValid()) {
            flag(player, config.antiBadpacket.modules, "C");
        }
    }
    // Anti Invalid Sprint
    if (sprint) {
        const validSprint = await onceTrue(player, isValidSprint, config.antiBadpacket.faultToleranceTicks);
        if (!validSprint) {
            player.teleport(loc);
            flag(player, config.antiBadpacket.modules, "A");
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
