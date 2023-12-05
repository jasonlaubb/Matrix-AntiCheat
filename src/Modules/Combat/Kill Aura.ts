import {
    world,
    system,
    Player,
    Vector3,
    Entity,
    EntityHitEntityAfterEvent,
    PlayerLeaveAfterEvent
} from "@minecraft/server";
import { flag, isAdmin, c } from "../../Assets/Util.js";
import lang from "../../Data/Languages/lang.js";

/**
 * @author ravriv
 * @description This checks if the player is hitting another player from a impossible angle.
 */

const hitLength = new Map<string, any[]>();

async function KillAura (damagingEntity: Player, hitEntity: Entity) {
    //constant the infomation
    let playerHitEntity = hitLength.get(damagingEntity.name) ?? [];
    const config = c()
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
        //A - false positive: very low, efficiency: high
        flag (damagingEntity, 'Kill Aura', "A", config.antiKillAura.maxVL, config.antiKillAura.punishment, [`${lang(">HitLength")}:${playerHitEntity.length}`])
        
        if (!config.slient) {
            damagingEntity.addTag("matrix:pvp-disabled");
            system.runTimeout(() => {
                damagingEntity.removeTag("matrix:pvp-disabled");
            }, config.antiKillAura.timeout);
        }
    }

    //stop false positive
    if (!(hitEntity instanceof Player) || distance <= 2 || damagingEntity.hasTag("matrix:pvp-disabled")) return;

    //get the angle
    const angle: number = calculateAngle(damagingEntity.location, hitEntity.location, damagingEntity.getVelocity(), hitEntity.getVelocity(), damagingEntity.getRotation().y);

    //if the angle is higher than the max angle, flag the player
    if (angle > config.antiKillAura.minAngle) {
        //B - false positive: low, efficiency: mid
        flag (damagingEntity, 'Kill Aura', 'B', config.antiKillAura.maxVL, config.antiKillAura.punishment, [`${lang(">Angle")}:${angle.toFixed(2)}°`])

        if (!config.slient) {
            damagingEntity.addTag("matrix:pvp-disabled");
            system.runTimeout(() => {
                damagingEntity.removeTag("matrix:pvp-disabled");
            }, config.antiKillAura.timeout);
        }
    }

    //calulate the limit of xz, also Math lol
    const limitOfXZ = Math.sin(Math.abs(damagingEntity.getRotation().x) * Math.PI / 180) * 5.5

    //if player attack higher than the limit, flag him
    if (distance > limitOfXZ) {
        flag (damagingEntity, 'Kill Aura', 'C', config.antiKillAura.maxVL, config.antiKillAura.punishment, [`${lang(">distance")}:${distance.toFixed(2)}`,`${lang(">Limit")}:${limitOfXZ.toFixed(2)}`])
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

const antiKillAura = (({ damagingEntity, hitEntity }: EntityHitEntityAfterEvent) => {
    if (!(damagingEntity instanceof Player) || isAdmin (damagingEntity)) return;

    KillAura(damagingEntity, hitEntity);
});

const systemEvent = () => {
    const allplayers = world.getAllPlayers()
    const players = allplayers.filter(player => hitLength.get(player.id) !== undefined)
    players.forEach(player => hitLength.delete(player.id))
}

const playerLeave = ({ playerId }: PlayerLeaveAfterEvent) => {
    hitLength.delete(playerId);
}

let id: number

export default {
    enable () {
        world.afterEvents.entityHitEntity.subscribe(antiKillAura)
        world.afterEvents.playerLeave.subscribe(playerLeave)
        id = system.runInterval(systemEvent, 2)
    },
    disable () {
        hitLength.clear()
        world.afterEvents.entityHitEntity.unsubscribe(antiKillAura)
        world.afterEvents.playerLeave.subscribe(playerLeave)
        system.clearRun(id)
    }
}
