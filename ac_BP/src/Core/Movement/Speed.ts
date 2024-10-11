import { GameMode, Player, Vector3 } from "@minecraft/server";
import { configi, registerModule } from "../Modules";
import MathUtil from "../../Assets/MathUtil";
import { AnimationControllerTags } from "../../Data/EnumData";
import flag from "../../Assets/flag";
import { MinecraftEffectTypes } from "../../node_modules/@minecraft/vanilla-data/lib/index";

function getBlockPerSecond(currentLocation: Vector3, lastLoggedLocation: Vector3, now: number, lastTimeStamp: number) {
    const secondTaken = (now - lastTimeStamp) / 1000;
    if (secondTaken == 0) return 0;
    const movedDistance = MathUtil.distanceXZ(currentLocation, lastLoggedLocation);
    const bps = movedDistance / secondTaken;
    return bps;
}

interface SpeedData {
    lastLocation: Vector3;
    lastTimeStamp: number;
    lastStopLoc: Vector3;
    lastTeleport: number;
}
const speedData = new Map<string, SpeedData>();
async function antiSpeed(config: configi, player: Player) {
    const now = Date.now();
    const data = speedData.get(player.id) ?? {
        lastLocation: player.location,
        lastTimeStamp: Date.now(),
        lastStopLoc: player.location,
        lastTeleport: 0,
    };

    const blockPerSecond = getBlockPerSecond(player.location, data.lastLocation, now, data.lastTimeStamp);
    const { x, y, z } = player.getVelocity();
    const strightMovement = Math.abs(y) > Math.abs(x) + Math.abs(z);
    player.runCommand(`title @s actionbar ` + blockPerSecond);
    if (blockPerSecond == 0) {
        data.lastStopLoc = player.location;
    } else if (
        blockPerSecond > config.antiSpeed.maxBlockPerSecond &&
        (player.getEffect(MinecraftEffectTypes.Speed)?.amplifier ?? 0) <= 2 &&
        !strightMovement &&
        now - data.lastTeleport > 5000 &&
        !(player.lastExplosionTime && now - player.lastExplosionTime < 3000) &&
        !player.hasTag(AnimationControllerTags.riding) &&
        !(player.threwTridentAt && now - player.threwTridentAt < 9000) &&
        !player.isInWater &&
        !player.isGliding
    ) {
        player.teleport(data.lastStopLoc);
        flag(player, config.antiSpeed.modules, "A");
    }
    data.lastLocation = player.location;
    data.lastTimeStamp = now;
    speedData.set(player.id, data);
}

async function systemEvent(_config: configi, player: Player) {
    const data = speedData.get(player.id);
    if (!data) return;
    const playerVelocity = player.getVelocity();
    if (playerVelocity.x == 0 && playerVelocity.z == 0 && (Math.abs(player.location.x - data.lastLocation.x) > 0.1 || Math.abs(player.location.z - data.lastLocation.z) > 0.1)) {
        data.lastTeleport = Date.now();
        player.sendMessage("Teleport detected")
        speedData.set(player.id, data);
    }
}

registerModule(
    "antiSpeed",
    false,
    [speedData],
    {
        tickInterval: 1,
        intick: systemEvent,
    },
    {
        tickOption: { excludeGameModes: [GameMode.creative, GameMode.spectator] },
        intick: antiSpeed,
        tickInterval: 10,
    }
);
