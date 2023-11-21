import {
    world,
    system,
    Player,
    Vector3
} from "@minecraft/server";
import config from "../../Data/Config.js";
import { flag, isAdmin } from "../../Assets/Util.js";
import lang from "../../Data/Languages/lang.js";

/**
 * @author ravriv
 * @description This checks if the player is hitting another player from a impossible angle.
 */

const hitLength = new Map<string, any[]>();

async function KillAura(damagingEntity: Player, hitEntity: Player) {
    //constant the infomation
    let playerHitEntity = hitLength.get(damagingEntity.name) ?? [];
    const direction: Vector3 = calculateVector(damagingEntity.location, hitEntity.location) as Vector3;
    const distance: number = calculateMagnitude(direction);

    //if the player hit a target that is not in the list, add it to the list
    if (!playerHitEntity.includes(hitEntity.id)) {
        playerHitEntity.push(hitEntity.id);
        hitLength.set(damagingEntity.id, playerHitEntity);
    }

    //if the player hit more than 1 targets in 2 ticks, flag the player
    if (playerHitEntity.length > config.antiKillAura.maxEntityHit && !damagingEntity.hasTag("matrix:pvp-disabled")) {
        hitLength.delete(damagingEntity.name);
        damagingEntity.addTag("matrix:pvp-disabled");
        flag (damagingEntity, 'Kill Aura', config.antiKillAura.maxVL, config.antiKillAura.punishment, [`${lang(">HitLength")}:${playerHitEntity.length}`])
        system.runTimeout(() => {
            damagingEntity.removeTag("matrix:pvp-disabled");
        }, config.antiKillAura.timeout);
    }

    //stop false positive
    if (distance <= 2 || damagingEntity.hasTag("matrix:pvp-disabled")) return;

    //get the angle
    const angle: number = calculateAngle(damagingEntity.location, hitEntity.location, damagingEntity.getVelocity(), hitEntity.getVelocity(),damagingEntity.getRotation().y);

    //if the angle is higher than the max angle, flag the player
    if (angle > config.antiKillAura.minAngle) {
        flag (damagingEntity, 'Kill Aura', config.antiKillAura.maxVL, config.antiKillAura.punishment, [`${lang(">Angle")}:${angle.toFixed(2)}°`])

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

function calculateAngle (attacker: Vector3, target: Vector3, attackerV: Vector3, targetV: Vector3, rotation: number = -90) {
    const pos1 = {
        x: attacker.x - attackerV.x,
        y: 0,
        z: attacker.z - attackerV.z
    } as Vector3
    const pos2 = {
        x: target.x - targetV.x,
        y: 0,
        z: target.z - targetV.z
    } as Vector3

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
