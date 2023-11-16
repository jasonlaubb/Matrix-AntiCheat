import {
    world,
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

const hitLength = new Map<string, any[]>();

async function KillAura(damagingEntity: Player, hitEntity: Player) {
    let playerHitEntity = hitLength.get(damagingEntity.name) ?? [];
    const direction: Vector3 = calculateVector(damagingEntity.location, hitEntity.location) as Vector3;
    const distance: number = calculateMagnitude(direction);

    if (!playerHitEntity.includes(hitEntity.id)) {
        playerHitEntity.push(hitEntity.id);
        hitLength.set(damagingEntity.id, playerHitEntity);
    }

    if (playerHitEntity.length > config.antiKillAura.maxEntityHit && !damagingEntity.hasTag("matrix:pvp-disabled")) {
        hitLength.delete(damagingEntity.name);
        damagingEntity.addTag("matrix:pvp-disabled");
        flag (damagingEntity, 'Kill Aura', config.antiKillAura.maxVL, config.antiKillAura.punishment, [`HitLength:${playerHitEntity.length}`])
        system.runTimeout(() => {
            damagingEntity.removeTag("matrix:pvp-disabled");
        }, config.antiKillAura.timeout);
    }

    if (distance < 2 || damagingEntity.hasTag("matrix:pvp-disabled")) return;

    const angle: number = calculateAngle(damagingEntity.location, hitEntity.location, damagingEntity.getRotation().y);

    if (angle > config.antiKillAura.minAngle) {
        flag (damagingEntity, 'Kill Aura', config.antiKillAura.maxVL, config.antiKillAura.punishment, [`Angle:${angle.toFixed(2)}°`])

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

function calculateAngle (pos1: Vector3, pos2: Vector3, rotation = -90) {
    let angle = Math.atan2((pos2.z - pos1.z), (pos2.x - pos1.x)) * 180 / Math.PI - rotation - 90;
    angle = angle <= -180 ? angle += 360 : angle
    return Math.abs(angle)
}

world.afterEvents.entityHitEntity.subscribe(({ damagingEntity, hitEntity }) => {
    const toggle = (world.getDynamicProperty("antiKillAura") ?? config.antiKillAura.enabled) as boolean;
    if (toggle !== true) return;

    if (!(damagingEntity instanceof Player) || !(hitEntity instanceof Player) || isAdmin (damagingEntity)) return;

    KillAura(damagingEntity, hitEntity);
});

system.runInterval(() => world.getAllPlayers().filter(player => hitLength.get(player.id) !== undefined).forEach(player => hitLength.delete(player.id)), 2)

world.afterEvents.playerLeave.subscribe(({ playerId }) => {
    hitLength.delete(playerId);
})