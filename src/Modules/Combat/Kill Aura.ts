import { world, system, Player, Vector3, Entity, EntityHitEntityAfterEvent, PlayerLeaveAfterEvent, EntityHurtAfterEvent, EntityDamageCause } from "@minecraft/server";
import { flag, isAdmin, c, getPing } from "../../Assets/Util.js";
import lang from "../../Data/Languages/lang.js";
import { MinecraftEntityTypes } from "../../node_modules/@minecraft/vanilla-data/lib/index";

/**
 * @author ravriv & jasonlaubb & RaMiGamerDev
 * @description This checks if the player is hitting another player from a impossible angle.
 */

const hitLength = new Map<string, any[]>();
const lastFlag = new Map<string, number>();

function KillAura(player: Player, hitEntity: Entity, onFirstHit: boolean) {
    if (player.hasTag("matrix:pvp-disabled")) return;
    //constant the infomation
    let playerHitEntity = hitLength.get(player.id) ?? [];
    let flagged = false;
    const config = c();
    const direction: Vector3 = calculateVector(player.location, hitEntity.location) as Vector3;
    const distance: number = calculateMagnitude(direction);

    //if the player hit a target that is not in the list, add it to the list
    if (!playerHitEntity.includes(hitEntity.id)) {
        playerHitEntity.push(hitEntity.id);
        hitLength.set(player.id, playerHitEntity);
    }

    //if the player hit more than 1 targets in 2 ticks, flag the player
    if (getPing(player) < 4 && playerHitEntity.length > config.antiKillAura.maxEntityHit) {
        hitLength.delete(player.id);
        //A - false positive: very low, efficiency: high
        flag(player, "Kill Aura", "A", config.antiKillAura.maxVL, config.antiKillAura.punishment, [`${lang(">HitLength")}:${playerHitEntity.length}`]);
        flagged = true;
    }

    player.lastTouchEntity = Date.now();

    const state = hitEntity instanceof Player && onFirstHit == true;
    //stop false positive
    if (state && distance > 3) {
        //get the angle
        const angle: number = calculateAngle(player.location, hitEntity.location, player.getVelocity(), hitEntity.getVelocity(), player.getRotation().y);
        const rotationFloat: number = Math.abs(player.getRotation().x);
        const velocity = player.getVelocity().y;

        //if the angle is higher than the max angle, flag the player
        if (angle > config.antiKillAura.minAngle && rotationFloat < 79 && !(player.threwTridentAt && Date.now() - player.threwTridentAt < 3000)) {
            //B - false positive: low, efficiency: mid
            flag(player, "Kill Aura", "B", config.antiKillAura.maxVL, config.antiKillAura.punishment, [`${lang(">Angle")}:${angle.toFixed(2)}°`]);
            flagged = true;
        }

        //calulate the limit of xz, also Math lol
        const limitOfXZ = Math.cos((rotationFloat * Math.PI) / 180) * 6.1 + 2.4;
        //if player attack higher than the limit, flag him
        if (distance > limitOfXZ && velocity >= 0) {
            const lastflag = lastFlag.get(player.id);
            if (lastflag && Date.now() - lastflag < 4000) {
                flag(player, "Kill Aura", "C", config.antiKillAura.maxVL, config.antiKillAura.punishment, [`${lang(">distance")}:${distance.toFixed(2)}`, `${lang(">Limit")}:${limitOfXZ.toFixed(2)}`]);
                flagged = true;
            }
            lastFlag.set(player.id, Date.now());
        }
    }

    if (onFirstHit == true) {
        /* Just an idea
        const entityInDirection = player.getEntitiesFromViewDirection
        if (!entityInDirection.some(({ id } => id == hitEntity.id)) {
            flag (player, 'Kill Aura', 'D', config.antiKillAura.maxVL, config.antiKillAura.punishment, undefined)
            flagged = true
        }*/
        // bad packet -w-
        if (player.isSleeping || player.hasTag("matrix:container")) {
            flag(player, "Kill Aura", "E", config.antiKillAura.maxVL, config.antiKillAura.punishment, undefined);
            flagged = true;
        }
    }

    if (flagged) {
        if (!config.slient) {
            player.addTag("matrix:pvp-disabled");
            system.runTimeout(() => {
                player.removeTag("matrix:pvp-disabled");
            }, config.antiKillAura.timeout);
        }
    }
}

interface LastRotateData {
    horizonR: number;
    verticalR: number;
    lastVel: Vector3;
}

const lastRotateData = new Map();
const tickEvent = () => {
    const players = world.getAllPlayers();
    for (const player of players) {
        if (isAdmin(player))
            continue;
        const data = lastRotateData.get(player.id);
        const pos1 = player.getHeadLocation();
        const raycast = player.getEntitiesFromViewDirection()[0];
        const { x: verticalRotation, y: horizontalRotation } = player.getRotation();
        const playerVelocity = player.getVelocity();
        try{ const yPitch = Math.abs(data.verticalR - verticalRotation) 
        lastRotateData.set(player.id, { horizonR: horizontalRotation, verticalR: verticalRotation, lastVel: playerVelocity, lastPitch: yPitch});
        } catch {lastRotateData.set(player.id, { horizonR: horizontalRotation, verticalR: verticalRotation, lastVel: playerVelocity})} 
        if (!raycast) kAFlags[player.id] = 0
        if (!raycast)
            continue;
        const nearestPlayer = raycast?.entity;
        if (!(raycast.entity instanceof Player) || raycast.distance > 7.5 || player.hasTag("matrix:pvp_disabled"))
           continue;
        const pos2 = nearestPlayer.getHeadLocation();
        if (!data)
            continue;
        let horizontalAngle = Math.atan2((pos2.z - pos1.z), (pos2.x - pos1.x)) * 180 / Math.PI - horizontalRotation - 90;
        horizontalAngle = Math.abs(horizontalAngle <= -180 ? horizontalAngle += 360 : horizontalAngle);
        const { x: floatX, y:floatY, z: floatZ } = playerVelocity;
        const { x: moveX, y:moveY,  z: moveZ } = nearestPlayer.getVelocity();
        const float = Math.hypot(floatX, floatZ);
        const move = Math.hypot(moveX, moveZ);
        const rotatedMove = Math.abs(data.horizonR - horizontalRotation);
        const yPitch = Math.abs(data.verticalR - verticalRotation) 
        const instantRot = rotatedMove > 60
        const config = c();
        if(Math.abs(yPitch - data.lastPitch) >  1 && Math.abs(yPitch - data.lastPitch) < 3 && (verticalRotation < 0 && moveY+floatY > 0 || verticalRotation > 0 && moveY+floatY < 0) && move > 0.1) invalidPitch[player.id]++
        else invalidPitch[player.id] = 0
        if(rotatedMove > 0 && rotatedMove < 20 && move > 0 || instantRot){
        kAFlags[player.id]++ 
        if(instantRot) kAFlags[player.id] = "G" 
        } else if(rotatedMove == 0 && move > 0 || rotatedMove > 0 && move == 0 || rotatedMove > 40) kAFlags[player.id] = 0
        player.onScreenDisplay.setActionBar(`${Math.abs(yPitch - data.lastPitch)}`)
        //killaura/F check for head rotation 
        if (kAFlags[player.id] >= 10) {
            player.addTag("matrix:pvp-disabled")
            system.runTimeout(() => player.removeTag("matrix:pvp-disabled"), config.antiKillAura.timeout)
            flag(player, "Kill Aura", "F", config.antiKillAura.maxVL, config.antiKillAura.punishment, [lang(">Angle") + ":" + horizontalAngle.toFixed(5)]);
            kAFlags[player.id] = 0
        }
        //killaura/G check for instant rotation to the target 
        if(rotatedMove <= 10 && kAFlags[player.id] == "G") {
        player.addTag("matrix:pvp-disabled")
        system.runTimeout(() => player.removeTag("matrix:pvp-disabled"), config.antiKillAura.timeout)
        flag(player, "Kill Aura", "G", config.antiKillAura.maxVL, config.antiKillAura.punishment, [lang(">Angle") + ":" +rotatedMove.toFixed(5)]);
        kAFlags[player.id] = 0
        } 
        //killaura/H check for smooth y Pitch movement 
        if(invalidPitch[player.id] >= 10){
        player.addTag("matrix:pvp-disabled")
        system.runTimeout(() => player.removeTag("matrix:pvp-disabled"), config.antiKillAura.timeout)
        flag(player, "Kill Aura", "H", config.antiKillAura.maxVL, config.antiKillAura.punishment, [lang(">Angle") + ":" +(yPitch-data.lastPitch).toFixed(5)])
        invalidPitch[player.id] = 0
        } 
        //killaura/I check for if the player rotation can be divided by 1
        if ((verticalRotation % 1 === 0 || horizontalRotation % 1 === 0) && Math.abs(verticalRotation) !== 90 && rotatedMove > 0) {
        player.addTag("matrix:pvp-disabled")
        system.runTimeout(() => player.removeTag("matrix:pvp-disabled"), config.antiKillAura.timeout)
        flag(player, "Kill Aura", "I", config.antiKillAura.maxVL, config.antiKillAura.punishment, [lang(">Angle") + ":" +(yPitch-data.lastPitch).toFixed(5)])
        } 
     }
};
tickEvent; // no killaura is in beta LOL

function calculateVector(l1: Vector3, l2: Vector3) {
    const { x: x1, y: y1, z: z1 } = l1;
    const { x: x2, y: y2, z: z2 } = l2;

    return {
        x: x2 - x1,
        y: y2 - y1,
        z: z2 - z1,
    };
}

function calculateMagnitude({ x, z }: Vector3) {
    return Math.hypot(x, z);
}

function calculateAngle(attacker: Vector3, target: Vector3, attackerV: Vector3, targetV: Vector3, rotation: number = -90) {
    const pos1 = {
        x: attacker.x - attackerV.x * 0.5,
        y: 0,
        z: attacker.z - attackerV.z * 0.5,
    } as Vector3;
    const pos2 = {
        x: target.x - targetV.x * 0.5,
        y: 0,
        z: target.z - targetV.z * 0.5,
    } as Vector3;

    let angle = (Math.atan2(pos2.z - pos1.z, pos2.x - pos1.x) * 180) / Math.PI - rotation - 90;
    angle = angle <= -180 ? (angle += 360) : angle;
    return Math.abs(angle);
}

const antiKillAura = ({ damagingEntity: player, hitEntity }: EntityHitEntityAfterEvent) => {
    if (isAdmin(player as Player)) return;

    KillAura(player as Player, hitEntity, false);
};

const antiKillAura2 = (event: EntityHurtAfterEvent) => {
    if (event.damageSource.cause !== EntityDamageCause.entityAttack || event.damageSource.damagingProjectile) return;

    const player = event.damageSource.damagingEntity;
    const hitEntity = event.hurtEntity;
    if (!(player instanceof Player) || isAdmin(player)) return;

    KillAura(player, hitEntity, true);
};

const systemEvent = () => {
    const allplayers = world.getAllPlayers();
    const players = allplayers.filter((player) => hitLength.get(player.id) !== undefined);
    players.forEach((player) => hitLength.delete(player.id));
};

const playerLeave = ({ playerId }: PlayerLeaveAfterEvent) => {
    hitLength.delete(playerId);
};

let id: number;
//let id2: number

export default {
    enable() {
        world.afterEvents.entityHitEntity.subscribe(antiKillAura, { entityTypes: [MinecraftEntityTypes.Player] });
        world.afterEvents.entityHurt.subscribe(antiKillAura2);
        world.afterEvents.playerLeave.subscribe(playerLeave);
        id = system.runInterval(systemEvent, 2);
        //id2 = system.runInterval(tickEvent, 1)
    },
    disable() {
        hitLength.clear();
        world.afterEvents.entityHitEntity.unsubscribe(antiKillAura);
        world.afterEvents.entityHurt.unsubscribe(antiKillAura2);
        world.afterEvents.playerLeave.unsubscribe(playerLeave);
        system.clearRun(id);
        //system.clearRun(id2)
    },
};
