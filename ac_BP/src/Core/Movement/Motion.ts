import { EntityHurtAfterEvent, GameMode, Player, Vector3, world } from "@minecraft/server";
import { configi, registerModule } from "../Modules";
import { bypassMovementCheck } from "../../Assets/Util";
import MathUtil from "../../Assets/MathUtil";
import { isSpikeLagging } from "../../Assets/Public";
import { AnimationControllerTags } from "../../Data/EnumData";
import flag from "../../Assets/flag";
import { MinecraftEffectTypes } from "../../node_modules/@minecraft/vanilla-data/lib/index";
interface MotionData {
    agoWrap: number;
    previousWrap: number;
    beforeWrap: number;
    lastWrap: number;
    lastHugeWrap: number;
    lastTickLocation: Vector3;
    lastFreezeLocation: Vector3;
}
const motionData = new Map<string, MotionData>();
async function checkMotion(config: configi, player: Player) {
    const data =
        motionData.get(player.id) ??
        ({
            agoWrap: 0,
            previousWrap: 0,
            beforeWrap: 0,
            lastWrap: 0,
            lastHugeWrap: 0,
            lastTickLocation: player.location,
            lastFreezeLocation: player.location,
        } as MotionData);
    const now = Date.now();
    const { x: velocityX, y: velocityY, z: velocityZ } = player.getVelocity();
    const wrapDistance = Math.hypot(velocityX, velocityZ);
    const actualWrapDistance = MathUtil.distanceXZ(player.location, data.lastTickLocation);
    if (actualWrapDistance > config.antiMotion.maxWrapDistance) {
        data.lastHugeWrap = Date.now();
    }
    if (velocityX == 0 && velocityY == 0 && velocityZ == 0) {
        data.lastFreezeLocation = player.location;
    }
    const commonPrevention =
        !player.isGliding &&
        !player.isFlying &&
        !player.hasTag(AnimationControllerTags.riding) &&
        !(player.lastExplosionTime && now - player.lastExplosionTime < 1000) &&
        !(player.threwTridentAt && now - player.threwTridentAt < 2500) &&
        !(player.lastApplyDamage && now - player.lastApplyDamage < 250) &&
        !(player.lastBreakSolid && now - player.lastBreakSolid < 1000) &&
        !isSpikeLagging(player);
    motionData.set(player.id, data);
    if (commonPrevention && (player.getEffect(MinecraftEffectTypes.Speed)?.amplifier ?? 0) <= 2 && !bypassMovementCheck(player)) {
        if (wrapDistance == data.beforeWrap && wrapDistance < config.antiMotion.predictionThereshold && data.lastWrap > config.antiMotion.wrapDistanceThereshold && data.beforeWrap < config.antiMotion.predictionThereshold) {
            player.teleport(data.lastFreezeLocation);
            flag(player, config.antiMotion.modules, "A");
        }
        if (data.agoWrap < config.antiMotion.predictionThereshold && data.beforeWrap > config.antiMotion.wrapDistanceThereshold && data.lastWrap == data.beforeWrap && wrapDistance < config.antiMotion.predictionThereshold) {
            player.teleport(data.lastFreezeLocation);
            flag(player, config.antiMotion.modules, "B");
        }
    }
    data.agoWrap = data.previousWrap;
    data.previousWrap = data.beforeWrap;
    data.beforeWrap = data.lastWrap;
    data.lastWrap = wrapDistance;
    data.lastTickLocation = player.location;
    motionData.set(player.id, data);
}
function entityHurt({ hurtEntity }: EntityHurtAfterEvent) {
    const player = hurtEntity as Player;
    player.lastApplyDamage = Date.now();
}
registerModule(
    "antiMotion",
    false,
    [motionData],
    {
        tickInterval: 1,
        tickOption: {
            excludeGameModes: [GameMode.creative, GameMode.spectator],
        },
        intick: checkMotion,
    },
    {
        worldSignal: world.afterEvents.entityHurt,
        playerOption: { entityTypes: ["minecraft:player"] },
        then: async (_config, event) => entityHurt(event as EntityHurtAfterEvent),
    }
);
