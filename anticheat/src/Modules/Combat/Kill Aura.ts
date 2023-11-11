import { world,
    system,
    Player,
    Vector3
} from "@minecraft/server";
import config from "../../Data/Config.js";
import { flag, isAdmin } from "../../Assets/Util.js";

/**
 * @author ravriv
 * @description This is a simple kill aura detector.
 * it will detect if the player is hitting another player from a impossible angle.
 */

const hitLength = new Map<string, string[]>();

function KillAura(damagingEntity: Player, hitEntity: Player) {
    let playerHitEntity = hitLength.get(damagingEntity.name) ?? [];
    const direction: Vector3 = calculateVector(damagingEntity.location, hitEntity.location) as Vector3;
    const distance: number = calculateMagnitude(direction);

    if (!playerHitEntity.includes(hitEntity.name)) {
        playerHitEntity.push(hitEntity.name);
        hitLength.set(damagingEntity.name, playerHitEntity);
    }

    if (playerHitEntity.length > config.antiKillAura.maxEntityHit && !damagingEntity.hasTag("matrix:pvp-disabled")) {
        hitLength.delete(damagingEntity.name);
        damagingEntity.addTag("matrix:pvp-disabled");
        flag (damagingEntity, 'Kill Aura', config.antiKillAura.punishment, [`HitLength:${playerHitEntity.length}`])
        system.runTimeout(() => {
            damagingEntity.removeTag("pvp-disabled");
        }, config.antiKillAura.timeout);
    }

    if (distance < 2 || damagingEntity.hasTag("matrix:pvp-disabled")) return;

    const view: Vector3 = damagingEntity.getViewDirection();
    const angle: number = calculateAngle(view, direction);

    if (angle > config.antiKillAura.minAngle) {
        flag (damagingEntity, 'Kill Aura', config.antiKillAura.punishment, [`Angle:${angle.toFixed(2)}°`])

        damagingEntity.addTag("matrix:pvp-disabled");
        system.runTimeout(() => {
            damagingEntity.removeTag("matrix:pvp-disabled");
        }, config.antiKillAura.timeout);
    }
}

function calculateVector(l1: Vector3, l2: Vector3) {
    const { x: x1, y: y1, z: z1 } = l1;
    const { x: x2, y: y2, z: z2 } = l2;

    return {
        x: x2 - x1,
        y: y2 - y1,
        z: z2 - z1
    };
}

function calculateMagnitude({ x, y, z }: Vector3) {
    return Math.sqrt(x ** 2 + y ** 2 + z ** 2);
}

function calculateAngle(v1: Vector3, v2: Vector3) {
    const { x: x1, y: y1, z: z1 } = v1;
    const { x: x2, y: y2, z: z2 } = v2;
    const dotProduct: number = x1 * x2 + y1 * y2 + z1 * z2;
    const m1: number = calculateMagnitude(v1);
    const m2: number = calculateMagnitude(v2);
    const denominator: number = m1 * m2;

    if (denominator === 0) return 0;

    const radians: number = Math.acos(dotProduct / denominator);
    const degrees: number = radians * (180 / Math.PI);
    return degrees;
}

world.afterEvents.entityHitEntity.subscribe(({ damagingEntity, hitEntity }) => {
    const toggle = (world.getDynamicProperty("antiKillAura") ?? config.antiKillAura.enabled) as boolean;
    if (toggle !== true) return;
    if (!(damagingEntity instanceof Player) || !(hitEntity instanceof Player)) return;
    if (isAdmin (damagingEntity)) return
    KillAura(damagingEntity, hitEntity);
});

world.afterEvents.playerLeave.subscribe(({ playerId }) => {
    hitLength.delete(playerId);
})