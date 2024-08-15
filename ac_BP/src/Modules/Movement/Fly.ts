import { GameMode, Vector3, Dimension, Player } from "@minecraft/server";
import { bypassMovementCheck, flag, isSpawning } from "../../Assets/Util";
import { MinecraftEffectTypes } from "../../node_modules/@minecraft/vanilla-data/lib/index";
import { configi, registerModule } from "../Modules";
import { MatrixUsedTags } from "../../Data/EnumData";
import { isSpikeLagging } from "../../Assets/Public";

interface FlyData {
    previousLocations: Vector3;
    velocityLog: number;
    lastHighVelocity: number;
    flyFlags: number;
    lastFlag: number;
    lastFlag2: number;
    lastVelLog: number;
    lastVelocity: number;
    previousVelocity: number;
    previousHighVelocity: number;
}
interface IncludeStairDataInput {
    location: Vector3;
    dimension: Dimension;
}

/**
 * @author RaMiGamerDev
 * @description Code rewrite by jasonlaubb
 * A efficient vertical movement check based on bds prediction
 */

const flyData = new Map<string, FlyData>();
const includeStair = ({ location: { x: px, y: py, z: pz }, dimension }: IncludeStairDataInput) => {
    try {
        return [dimension.getBlock({ x: Math.floor(px), y: Math.floor(py), z: Math.floor(pz) })?.typeId, dimension.getBlock({ x: Math.floor(px), y: Math.floor(py) - 1, z: Math.floor(pz) })?.typeId].includes("stair");
    } catch {
        return false;
    }
};
function antiFly(player: Player, now: number, config: configi) {
    let data = flyData.get(player.id);
    if (!data) {
        data = {
            previousLocations: player.location,
            velocityLog: 0,
            lastVelLog: 0,
            lastHighVelocity: 0,
            previousHighVelocity: 0,
            previousVelocity: undefined!,
            lastFlag: now,
            lastFlag2: now,
            flyFlags: 0,
            lastVelocity: 0,
        };
        flyData.set(player.id, data);
        return;
    }
    const { y: velocity, x, z } = player.getVelocity();
    const xz = Math.hypot(x, z);
    if (velocity <= config.antiFly.highVelocity && velocity >= 0) {
        data.previousLocations = player.location;
        data.velocityLog = 0;
    }
    const jumpBoost = player.getEffect(MinecraftEffectTypes.JumpBoost);
    const levitation = player.getEffect(MinecraftEffectTypes.Levitation);
    const instair = includeStair(player);
    const skip1 = !(player.lastExplosionTime && now - player.lastExplosionTime < 5500) && !(player.threwTridentAt && now - player.threwTridentAt < 5000) && !player.hasTag(MatrixUsedTags.knockBack);
    const skip2 = !player.isFlying && !player.isGliding;
    const skip3 = !(jumpBoost && jumpBoost?.amplifier > 2) && !(levitation && levitation?.amplifier > 2);
    if (bypassMovementCheck(player) || (jumpBoost && jumpBoost.amplifier > 2) || (levitation && levitation.amplifier > 2)) {
        flyData.set(player.id, data);
        return;
    }
    const flyMovement = data.velocityLog > 1 && velocity <= 0;
    const clientFly = data.velocityLog > 0 && player?.lastVelLog == data.velocityLog;
    if (!player.isOnGround && clientFly && flyMovement && skip1 && skip2 && skip3 && velocity != 1 && !instair) {
        const lastflag = data.lastFlag;
        player.teleport(data.previousLocations);
        if (lastflag && now - lastflag <= 5000 && now - lastflag >= 500) flag(player, "Fly", "A", config.antiFly.maxVL, config.antiFly.punishment, ["velocityY" + ":" + data.lastHighVelocity.toFixed(2)]);
        data.velocityLog = 0;
        data.previousVelocity = undefined!;
        data.lastFlag = now;
    }
    data.lastVelLog = data.velocityLog;
    if (data.velocityLog == 1 && !instair && velocity <= 0.2) {
        const lastflag = data.lastFlag2;
        data.flyFlags++;
        const notSL = !isSpikeLagging(player);
        if ((data.lastVelocity >= -0.95 && data.lastVelocity <= -0.1) || (data.lastVelocity <= 0.42 && data.lastVelocity >= -0.03)) {
            if (notSL && (xz > 0 || player.lastXZLogged > 0) && (data.lastHighVelocity >= 7 || (data.flyFlags >= 2 && now - lastflag >= 450 && now - lastflag <= 1000))) {
                flag(player, "Fly", "B", config.antiFly.maxVL, config.antiFly.punishment, ["velocityY" + ":" + data.lastHighVelocity.toFixed(2)]);
                player.teleport(data.previousLocations);
                data.flyFlags++;
            } else if (data.flyFlags >= 2) data.flyFlags = 0;
            if (notSL && player.location.y - data.previousLocations.y >= config.antiFly.maxGroundPrviousVelocity && data.lastHighVelocity >= 0.7 && !isSpawning(player)) {
                if (now - lastflag <= 2000) flag(player, "Fly", "E", config.antiFly.maxVL, config.antiFly.punishment, ["velocityY" + ":" + data.lastHighVelocity.toFixed(2)]);
                player.teleport(data.previousLocations);
            }
        }
        if (data.lastHighVelocity >= config.antiFly.maxGroundPrviousVelocity && (player.isOnGround || player.isClimbing)) {
            if (now - lastflag <= 5000) flag(player, "Fly", "C", config.antiFly.maxVL, config.antiFly.punishment, ["velocityY" + ":" + data.lastHighVelocity.toFixed(2)]);
            player.teleport(data.previousLocations);
        }
        if (data.lastHighVelocity > config.antiFly.maxHighVelocity) {
            flag(player, "Fly", "D", config.antiFly.maxVL, config.antiFly.punishment, ["velocityY" + ":" + data.lastHighVelocity.toFixed(2)]);
            player.teleport(data.previousLocations);
        }
        data.lastFlag2 = now;
    }
    if (velocity > config.antiFly.highVelocity && skip1) {
        data.velocityLog += 1;
        data.lastHighVelocity = velocity;
    } else if (velocity <= config.antiFly.highVelocity || (velocity == 0 && player.isOnGround) || !skip1) {
        data.velocityLog = 0;
        data.lastVelocity = velocity;
    }
    flyData.set(player.id, data);
}

registerModule("antiFly", false, [flyData], {
    tickInterval: 1,
    tickOption: { excludeGameModes: [GameMode.creative, GameMode.spectator] },
    intick: async (config, player) => {
        antiFly(player, Date.now(), config);
    },
});
