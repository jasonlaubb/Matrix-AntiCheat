import { EntityCanFlyComponent, GameMode, Player, PlayerSpawnAfterEvent, world } from "@minecraft/server";
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

async function onPlayerJoin (config: configi, { initialSpawn, player }: PlayerSpawnAfterEvent) {
    if (!initialSpawn) return;
    const maxRenderRange = player.clientSystemInfo.maxRenderDistance;
    /**
      @reference This check made a reference of Scythe Anticheat V3.2.0 full change log (on GitHub).
      @credit Credit to Scythe Anticheat
      @description This is a check which is used to prevent the common server crashing method.
    */
    const isInvalidRange = maxRenderRange < 6 || maxRenderRange > 96;
    if (isInvalidRange) {
        flag(player, config.antiBadpacket.modules, "B");
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
},{
    worldSignal: world.afterEvents.playerSpawn,
    then: onPlayerJoin,
});
