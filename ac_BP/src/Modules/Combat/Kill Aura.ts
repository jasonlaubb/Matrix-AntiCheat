import { world, system, Player, Vector3, Entity, EntityHitEntityAfterEvent, EntityHurtAfterEvent, EntityDamageCause } from "@minecraft/server";
import { flag, isAdmin, getPing, isSpawning, toFixed } from "../../Assets/Util.js";
import { MinecraftEntityTypes } from "../../node_modules/@minecraft/vanilla-data/lib/index";
import { registerModule, configi } from "../Modules.js";
import { AnimationControllerTags, DisableTags } from "../../Data/EnumData.js";
import { isSpikeLagging } from "../../Assets/Public.js";
import { Type } from "../../Assets/Util.js";
import MathUtil from "../../Assets/MathUtil.js";

/**
 * @author ravriv & jasonlaubb & RaMiGamerDev
 * @description This checks if the player is hitting another player from a impossible angle.
 */

interface KillAuraData {
    hitLength: string[];
    lastFlag: number;
    invalidPitch: number;
    kAFlags: number;
}

const killauradata = new Map<string, KillAuraData>();

function doubleEvent(config: configi, player: Player, hitEntity: Entity, onFirstHit: boolean) {
    if (isAdmin(player)) return;
    const data = killauradata.get(player.id) ?? {
        hitLength: [],
        lastFlag: 0,
        invalidPitch: 0,
        kAFlags: 0,
    };
    if (player.hasTag(DisableTags.pvp)) return;
    //constant the infomation
    const playerHitEntity = data.hitLength;
    let flagged = false;
    const direction: Vector3 = calculateVector(player.location, hitEntity.location) as Vector3;
    const distance: number = calculateMagnitude(direction);

    //if the player hit a target that is not in the list, add it to the list
    if (!playerHitEntity.includes(hitEntity.id)) {
        playerHitEntity.push(hitEntity.id);
        data.hitLength = playerHitEntity;
    }

    //if the player hit more than 1 targets in 2 ticks, flag the player
    if (getPing(player) < 4 && playerHitEntity.length > config.antiKillAura.maxEntityHit) {
        data.hitLength = [];
        //A - false positive: very low, efficiency: high
        flag(player, "Kill Aura", "A", config.antiKillAura.maxVL, config.antiKillAura.punishment, ["HitLength" + ":" + playerHitEntity.length]);
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
        if (!isSpikeLagging(player) && angle > config.antiKillAura.minAngle && rotationFloat < 79 && !(player.threwTridentAt && Date.now() - player.threwTridentAt < 3000)) {
            //B - false positive: low, efficiency: mid
            flag(player, "Kill Aura", "B", config.antiKillAura.maxVL, config.antiKillAura.punishment, ["Angle" + ":" + `${angle.toFixed(2)}°`]);
            flagged = true;
        }

        //calulate the limit of xz, also Math lol
        const limitOfXZ = Math.cos((rotationFloat * Math.PI) / 180) * 6.1 + 2.4;
        //if player attack higher than the limit, flag him
        if (distance > limitOfXZ && velocity >= 0) {
            const lastflag = data.lastFlag;
            if (lastflag && Date.now() - lastflag < 4000) {
                flag(player, "Kill Aura", "C", config.antiKillAura.maxVL, config.antiKillAura.punishment, ["distance" + ":" + distance.toFixed(2), "Limit" + ":" + limitOfXZ.toFixed(2)]);
                flagged = true;
            }
            data.lastFlag = Date.now();
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
        if (player.isSleeping) {
            flag(player, "Kill Aura", "E", config.antiKillAura.maxVL, config.antiKillAura.punishment, undefined);
            flagged = true;
        }
        // Check for tool box no swinging type killaura
        if (player.hasTag(AnimationControllerTags.alive) && !player.hasTag(AnimationControllerTags.attackTime) && !isSpikeLagging(player) && !player.isInWater) {
            const startDetectingTime = Date.now();
            new Promise<boolean>((resolve) => {
                let tick = 0;
                const id = system.runInterval(() => {
                    tick++;
                    if (tick > 12) {
                        system.clearRun(id);
                        resolve(true);
                    }
                    if (player.hasTag(AnimationControllerTags.attackTime)) {
                        system.clearRun(id);
                        resolve(false);
                    }
                }, 1);
            }).then((noSwinging) => {
                if (noSwinging) {
                    flag(player, "Kill Aura", "J", config.antiKillAura.maxVL, config.antiKillAura.punishment, ["DetectingMs:" + (Date.now() - startDetectingTime)]);
                }
            });
        }
    } else {
        // KillAura/H
        const tickdata = lastRotateData.get(player.id);
        if (tickdata) {
            const rotations = tickdata.rotations;
            if (rotations.x.length >= 10) {
                const hMove = Math.abs(MathUtil.calculateDifferentSum(rotations.y));
                const vMove = Math.abs(MathUtil.calculateDifferentSum(rotations.x));
                if (hMove > 2.1 && hMove < 11.5 && vMove > 5.3 && MathUtil.trackIncreasing(rotations.x)) {
                    flag(player, "Kill Aura", "H", config.antiKillAura.maxVL, config.antiKillAura.punishment, undefined);
                }
                player.sendMessage("H: " + hMove.toFixed(2) + " | V: " + vMove.toFixed(2) + " | T: " + MathUtil.trackIncreasing(rotations.x));
            }
        }
    }

    if (flagged) {
        player.addTag(DisableTags.pvp);
        system.runTimeout(() => {
            player.removeTag(DisableTags.pvp);
        }, config.antiKillAura.timeout);
    }
}

interface LastRotateData {
    horizonR: number;
    verticalR: number;
    lastVel: Vector3;
    lastPitch: number;
    kAFlags: Type | number;
    invalidPitch: number;
    rotations: {
        x: number[],
        y: number[],
    };
}
const lastRotateData = new Map<string, LastRotateData>();
function intickEvent(config: configi, player: Player) {
    const data = lastRotateData.get(player.id) ?? {
        horizonR: 0,
        verticalR: 0,
        lastVel: 0,
        lastPitch: 0,
        kAFlags: undefined!,
        invalidPitch: 0,
        rotations: {
            x: []as number[],
            y: []as number[],
        },
    };
    const pos1 = player.getHeadLocation();
    const raycast = player.getEntitiesFromViewDirection()[0];
    const { x: verticalRotation, y: horizontalRotation } = player.getRotation();
    const playerVelocity = player.getVelocity();
    const rotations = data.rotations;
    rotations.x.push(verticalRotation);
    rotations.y.push(horizontalRotation);
    if (rotations.x.length > 10) {
        rotations.y.shift();
        rotations.x.shift();
        const averageRotateY = MathUtil.calculateDifferentSum(rotations.y)
        const averageRotate = MathUtil.calculateDifferentSum(rotations.x);
        player.onScreenDisplay.setActionBar(`Average Move X: ${averageRotate.toFixed(2)}\nAverage Move Y: ${averageRotateY.toFixed(2)}\nTrack increasing: ${MathUtil.trackIncreasing(rotations.y)}`);

    }
    data.rotations = rotations;
    try {
        const yPitch = Math.abs(data.verticalR - verticalRotation);
        lastRotateData.set(player.id, { horizonR: horizontalRotation, verticalR: verticalRotation, lastVel: playerVelocity, lastPitch: yPitch, invalidPitch: undefined!, kAFlags: undefined!, rotations: data.rotations });
    } catch {
        lastRotateData.set(player.id, { horizonR: horizontalRotation, verticalR: verticalRotation, lastVel: playerVelocity, lastPitch: undefined!, invalidPitch: undefined!, kAFlags: undefined!, rotations: { x: []as number[], y: []as number[] } });
    }
    if (!raycast) return;
    const nearestPlayer = raycast?.entity;
    if (!(raycast.entity instanceof Player) || raycast.distance > 7.5 || player.hasTag(DisableTags.pvp)) return;
    const pos2 = nearestPlayer.getHeadLocation();
    if (!data) return;
    let horizontalAngle = (Math.atan2(pos2.z - pos1.z, pos2.x - pos1.x) * 180) / Math.PI - horizontalRotation - 90;
    horizontalAngle = Math.abs(horizontalAngle <= -180 ? (horizontalAngle += 360) : horizontalAngle);
    const { /*x: floatX, */ y: floatY /*, z: floatZ*/ } = playerVelocity;
    const { x: moveX, y: moveY, z: moveZ } = nearestPlayer.getVelocity();
    //const float = Math.hypot(floatX, floatZ);
    const move = Math.hypot(moveX, moveZ);
    const rotatedMove = Math.abs(data.horizonR - horizontalRotation);
    const yPitch = Math.abs(data.verticalR - verticalRotation);
    const instantRot = rotatedMove > 60;
    if (Math.abs(yPitch - data.lastPitch!) > 1 && Math.abs(yPitch - data.lastPitch!) < 3 && ((verticalRotation < 0 && moveY + floatY > 0) || (verticalRotation > 0 && moveY + floatY < 0)) && move > 0.1) data.invalidPitch++;
    else data.invalidPitch = 0;
    if ((rotatedMove > 0 && rotatedMove < 60 && move > 0) || instantRot) {
        (data.kAFlags as number)++;
        if (instantRot) data.kAFlags = "G";
    } else if ((rotatedMove == 0 && move > 0) || (rotatedMove > 0 && move == 0) || rotatedMove > 40) data.kAFlags = 0;
    //   player.onScreenDisplay.setActionBar(`${Math.abs(yPitch - data.lastPitch)}`)
    let isDetected = false;
    //killaura/F check for head rotation
    if ((data.kAFlags as number) >= 40) {
        isDetected = true;
        flag(player, "Kill Aura", "F", config.antiKillAura.maxVL, config.antiKillAura.punishment, ["Angle" + ":" + toFixed(horizontalAngle, 5, true)]);
        data.kAFlags = 0;
    }
    //killaura/G check for instant rotation to the target
    if (rotatedMove == 0 && data.kAFlags == "G" && verticalRotation != 0) {
        isDetected = true;
        flag(player, "Kill Aura", "G", config.antiKillAura.maxVL, config.antiKillAura.punishment, ["RotatedMove:" + toFixed(rotatedMove, 5, true)]);
        data.kAFlags = 0;
    }
    //killaura/H check for smooth y Pitch movement
    if (data.invalidPitch >= 20) {
        isDetected = true;
        flag(player, "Kill Aura", "H", config.antiKillAura.maxVL, config.antiKillAura.punishment, ["PitchDifferent:" + toFixed(yPitch - data.lastPitch, 5, true)]);
        data.invalidPitch = 0;
    }
    //killaura/I check for if the player rotation can be divided by 1
    if (
        !isSpawning(player) &&
        !isSpikeLagging(player) &&
        Date.now() - player.lastTouchEntity < 300 &&
        (verticalRotation % 1 === 0 || horizontalRotation % 1 === 0) &&
        Math.abs(verticalRotation) !== 90 &&
        ((rotatedMove > 0 && verticalRotation == 0) || verticalRotation != 0)
    ) {
        isDetected = true;
        flag(player, "Kill Aura", "I", config.antiKillAura.maxVL, config.antiKillAura.punishment, ["PitchDifferent:" + toFixed(yPitch - data.lastPitch, 5, true)]);
    }
    if (isDetected) {
        player.addTag(DisableTags.pvp);
        system.runTimeout(() => player.removeTag(DisableTags.pvp), config.antiKillAura.timeout);
    }
}

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

    return MathUtil.caulateAngle(pos1, pos2, rotation);
}

// Register the module
registerModule(
    "antiKillAura",
    false,
    [killauradata, lastRotateData],
    {
        intick: async (config, player) => intickEvent(config, player),
        tickInterval: 1,
    },
    {
        worldSignal: world.afterEvents.entityHurt,
        playerOption: { entityTypes: [MinecraftEntityTypes.Player] },
        then: async (config, { damageSource: { damagingEntity, damagingProjectile, cause }, hurtEntity }: EntityHurtAfterEvent) => {
            if (damagingEntity instanceof Player && !isAdmin(damagingEntity) && cause == EntityDamageCause.entityAttack && !damagingProjectile) {
                doubleEvent(config, damagingEntity, hurtEntity, true);
            }
        },
    },
    {
        worldSignal: world.afterEvents.entityHitEntity,
        playerOption: { entityTypes: [MinecraftEntityTypes.Player] },
        then: async (config, event: EntityHitEntityAfterEvent) => {
            if (!isAdmin(event.damagingEntity as Player)) {
                doubleEvent(config, event.damagingEntity as Player, event.hitEntity, false);
            }
        },
    }
);
