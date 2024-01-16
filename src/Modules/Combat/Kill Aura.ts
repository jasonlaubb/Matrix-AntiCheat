import {
    world,
    system,
    Player,
    Vector3,
    Entity,
    EntityHitEntityAfterEvent,
    PlayerLeaveAfterEvent,
    EntityHurtAfterEvent,
    EntityDamageCause
} from "@minecraft/server";
import { flag, isAdmin, c } from "../../Assets/Util.js";
import lang from "../../Data/Languages/lang.js";

/**
 * @author ravriv
 * @description This checks if the player is hitting another player from a impossible angle.
 */

const hitLength = new Map<string, any[]>();
const lastFlag = new Map<string, number>();

async function KillAura (damagingEntity: Player, hitEntity: Entity, onFirstHit: boolean) {
    if (damagingEntity.hasTag("matrix:pvp-disabled")) return

    //constant the infomation
    let playerHitEntity = hitLength.get(damagingEntity.id) ?? [];
    let flagged = false;
    const config = c()
    const direction: Vector3 = calculateVector(damagingEntity.location, hitEntity.location) as Vector3;
    const distance: number = calculateMagnitude(direction);

    //if the player hit a target that is not in the list, add it to the list
    if (!playerHitEntity.includes(hitEntity.id)) {
        playerHitEntity.push(hitEntity.id);
        hitLength.set(damagingEntity.id, playerHitEntity);
    }

    //if the player hit more than 1 targets in 2 ticks, flag the player
    if (playerHitEntity.length > config.antiKillAura.maxEntityHit) {
        hitLength.delete(damagingEntity.id);
        //A - false positive: very low, efficiency: high
        flag (damagingEntity, 'Kill Aura', "A", config.antiKillAura.maxVL, config.antiKillAura.punishment, [`${lang(">HitLength")}:${playerHitEntity.length}`])
        flagged = true
    }

    //stop false positive
    if (hitEntity instanceof Player && distance > 3 && onFirstHit === true) {
        //get the angle
        const angle: number = calculateAngle(damagingEntity.location, hitEntity.location, damagingEntity.getVelocity(), hitEntity.getVelocity(), damagingEntity.getRotation().y);
        const rotationFloat: number = Math.abs(damagingEntity.getRotation().x)
        const velocity = damagingEntity.getVelocity().y

        //if the angle is higher than the max angle, flag the player
        if (angle > config.antiKillAura.minAngle && rotationFloat < 79) {
            //B - false positive: low, efficiency: mid
            flag (damagingEntity, 'Kill Aura', 'B', config.antiKillAura.maxVL, config.antiKillAura.punishment, [`${lang(">Angle")}:${angle.toFixed(2)}°`])
            flagged = true
        }

        //calulate the limit of xz, also Math lol
        const limitOfXZ = Math.cos(rotationFloat * Math.PI / 180) * 6.1 + 2.4
        //if player attack higher than the limit, flag him
        if (distance > limitOfXZ && velocity >= 0) {
            const lastflag = lastFlag.get(damagingEntity.id)
            if (lastflag && Date.now() - lastflag < 4000) {
                flag (damagingEntity, 'Kill Aura', 'C', config.antiKillAura.maxVL, config.antiKillAura.punishment, [`${lang(">distance")}:${distance.toFixed(2)}`,`${lang(">Limit")}:${limitOfXZ.toFixed(2)}`])
                flagged = true
            }
            lastFlag.set(damagingEntity.id, Date.now())
        }
    }

    if (flagged) {
        if (!config.slient) {
            damagingEntity.addTag("matrix:pvp-disabled");
            system.runTimeout(() => {
                damagingEntity.removeTag("matrix:pvp-disabled");
            }, config.antiKillAura.timeout);
        }
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

function calculateMagnitude({ x, z }: Vector3) {
    return Math.hypot(x, z);
}

function calculateAngle (attacker: Vector3, target: Vector3, attackerV: Vector3, targetV: Vector3, rotation: number = -90) {
    const pos1 = {
        x: attacker.x - attackerV.x * 0.5,
        y: 0,
        z: attacker.z - attackerV.z * 0.5
    } as Vector3
    const pos2 = {
        x: target.x - targetV.x * 0.5,
        y: 0,
        z: target.z - targetV.z * 0.5
    } as Vector3

    let angle = Math.atan2((pos2.z - pos1.z), (pos2.x - pos1.x)) * 180 / Math.PI - rotation - 90;
    angle = angle <= -180 ? angle += 360 : angle
    return Math.abs(angle)
}

const antiKillAura = (({ damagingEntity, hitEntity }: EntityHitEntityAfterEvent) => {
    if (!(damagingEntity instanceof Player) || isAdmin (damagingEntity)) return;

    KillAura (damagingEntity, hitEntity, false);
});

const antiKillAura2 = (event: EntityHurtAfterEvent) => {
    if (event.damageSource.cause !== EntityDamageCause.entityAttack || event.damageSource.damagingProjectile) return;

    const damagingEntity = event.damageSource.damagingEntity
    const hitEntity = event.hurtEntity
    if (!(damagingEntity instanceof Player) || isAdmin (damagingEntity)) return;

    KillAura (damagingEntity, hitEntity, true);
};

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
        world.afterEvents.entityHurt.subscribe(antiKillAura2)
        world.afterEvents.playerLeave.subscribe(playerLeave)
        id = system.runInterval(systemEvent, 2)
    },
    disable () {
        hitLength.clear()
        world.afterEvents.entityHitEntity.unsubscribe(antiKillAura)
        world.afterEvents.entityHurt.subscribe(antiKillAura2)
        world.afterEvents.playerLeave.subscribe(playerLeave)
        system.clearRun(id)
    }
}
