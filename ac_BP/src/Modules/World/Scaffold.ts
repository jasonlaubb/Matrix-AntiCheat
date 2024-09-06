import { world, system, PlayerPlaceBlockAfterEvent, Vector3, Player, Block } from "@minecraft/server";
import { flag, isAdmin } from "../../Assets/Util";
import { MinecraftBlockTypes, MinecraftEffectTypes } from "../../node_modules/@minecraft/vanilla-data/lib/index";
import { configi, registerModule } from "../Modules";
import { AnimationControllerTags, DisableTags } from "../../Data/EnumData";

/**
 * @author jasonlaubb & RaMiGamerDev
 * @description A integrated check for many type of scaffold
 */
interface ScaffoldData {
    lastX: number;
    lastDiagX: number;
    lastZ: number;
    lastDiagZ: number;
    scaffoldFlags: number;
    scaffoldFlags2: number;
    scaffoldFlagsF: number;
    scaffoldFlagsG: number;
    scaffoldFlagsH: number;
    scaffoldFlagsI: number;
    scaffoldFlagsK: number;
    scaffoldFlagsL: number;
    lastXRot: number;
    lastPlace: number;
    blockLog: {
        time: number;
        id: string;
    }[];
    blockPlace: number[];
    diagSpeed: number;
    avgExt: number;
    lastDis: number;
    maxExt: number;
}
const scaffoldData = new Map<string, ScaffoldData>();
function playerPlaceBlockAfterEvent(config: configi, { player, block }: PlayerPlaceBlockAfterEvent) {
    if (isAdmin(player) || player.hasTag(DisableTags.place) || player.isFlying) return;
    let data = scaffoldData.get(player.id);
    const { x, y, z } = block.location;
    const now = Date.now();
    if (!data) {
        data = {
            lastX: x,
            lastDiagX: 0,
            lastZ: z,
            lastDiagZ: 0,
            scaffoldFlags: 0,
            scaffoldFlags2: 0,
            scaffoldFlagsF: 0,
            scaffoldFlagsG: 0,
            scaffoldFlagsH: 0,
            scaffoldFlagsI: 0,
            scaffoldFlagsK: 0,
            scaffoldFlagsL: 0,
            lastXRot: 0,
            lastPlace: now,
            blockLog: [],
            blockPlace: [],
            diagSpeed: 500,
            lastDis: 0,
            avgExt: 0,
            maxExt: undefined!,
        };
        scaffoldData.set(player.id, data);
        return;
    }
    const rotation = player.getRotation();
    const pos1 = player.location;
    const pos2 = { x: block.location.x - 0.5, y: 0, z: block.location.z - 0.5 };
    const angle = calculateAngle(pos1, pos2, rotation.y);
    let detected;
    //get the factor from the config
    const factor = config.antiScaffold.factor;
    //check if rotation is a number that can be divided by the factor
    if ((rotation.x % factor === 0 || rotation.y % factor === 0) && Math.abs(rotation.x) !== 90) {
        detected = true;
        flag(player, "Scaffold", "A", config.antiScaffold.maxVL, config.antiScaffold.punishment, ["RotationX:" + `${rotation.x.toFixed(2)}°`, "RotationY:" + `${rotation.y.toFixed(2)}°`]);
    }
    //check if the angle is higher than the max angle
    if (angle > config.antiScaffold.maxAngle && Math.hypot(pos1.x - pos2.x, pos1.z - pos2.z) > 1.75 && Math.abs(rotation.x) < 69.5) {
        detected = true;
        flag(player, "Scaffold", "B", config.antiScaffold.maxVL, config.antiScaffold.punishment, ["Angle:" + `${angle.toFixed(2)}°`]);
    }
    try {
        const floorPos = { x: Math.floor(pos1.x), y: Math.floor(pos1.y), z: Math.floor(pos1.z) };
        if (player.isJumping && !player.isOnGround && !isUnderPlayer(floorPos, block.location)) {
            floorPos.y -= 1;
        }
        const isUnder = isUnderPlayer(floorPos, block.location);
        //check if the rotation is lower than the min rotation and the block is under the player
        if (rotation.x < config.antiScaffold.minRotation && isUnder) {
            detected = true;
            flag(player, "Scaffold", "C", config.antiScaffold.maxVL, config.antiScaffold.punishment, ["RotationX:" + `${rotation.x.toFixed(2)}°`]);
        }
        //diag scaffold check
        //false postive: very low | efficiency: high
        //calculate the extender
        let actualXLoc;
        let actualZLoc;
        const xLoc = Math.abs(x - player.location.x) - 0.2;
        const zLoc = Math.abs(z - player.location.z) - 0.2;
        const xLoc2 = Math.abs(x + xLoc * 2 - player.location.x);
        const zLoc2 = Math.abs(z + zLoc * 2 - player.location.z);
        if (xLoc2 > xLoc) actualXLoc = xLoc + 1;
        else actualXLoc = xLoc;
        if (zLoc2 > zLoc) actualZLoc = zLoc + 1;
        else actualZLoc = zLoc;
        let extender = Math.hypot(actualXLoc, actualZLoc);
        if (rotation.x > 60) data.maxExt = 1;
        else data.maxExt = (60 - rotation.x) / 10 + 1;
        if (rotation.x <= 20) data.maxExt = 8;
        const { x: velocityX, z: velocityZ } = player.getVelocity();
        const xz = Math.hypot(velocityX, velocityZ);
        //choosing maximum diag speed
        if (xz > 0 && xz < 0.3 && player.isOnGround && extender < 1 && data.lastXRot == rotation.x) data.diagSpeed = 150;
        if ((xz > 0.1 && !player.isOnGround) || extender >= 1 || xz > 0.5 || rotation.x >= 80) data.diagSpeed = 500;
        if (xz > 0 && xz < 0.3 && player.isOnGround && extender < 1 && data.lastXRot != rotation.x) data.diagSpeed = 50;
        //i cant explain, its just some math:)
        const diagZ = Math.abs(z - data.lastZ);
        const diagX = Math.abs(x - data.lastX);
        const diagScaffold = (data.lastDiagX == 1 && diagX == 0 && data.lastDiagZ == 0 && diagZ == 1) || (data.lastDiagX == 0 && diagX == 1 && data.lastDiagZ == 1 && diagZ == 0);
        const yLoc = y - player.location.y;
        //the check:)
        if (yLoc > -2.1 && yLoc <= -1 && now - data.lastPlace < data.diagSpeed && diagScaffold && (extender - data.lastDis > 0 || extender < 1)) {
            data.scaffoldFlags++;
            if (data.scaffoldFlags >= 3) {
                data.scaffoldFlags = 0;
                data.scaffoldFlags2++;
                if (data.scaffoldFlags2 >= 1) {
                    flag(player, "Scaffold", "E", config.antiScaffold.maxVL, config.antiScaffold.punishment, ["Block:" + block.typeId]);
                    detected = true;
                }
            }
        }
        const blockBelow = player.dimension.getBlock({ x: Math.floor(player.location.x), y: Math.floor(player.location.y), z: Math.floor(player.location.z) })?.isSolid;
        const isScaffolding = !blockBelow && (extender - data.lastDis >= -0.1 || extender < 1) && yLoc > -2.1 && yLoc <= -1;
        if (isScaffolding) {
            //if the player not diagonal scaffolding or duration higher than 500 ticks reset the log
            if (!diagScaffold || now - data.lastPlace > 500) data.scaffoldFlags = 0;
            if (now - data.lastPlace > 8000) data.scaffoldFlags2 = 0;
            //scaffold/F: check for unnatural rotating head with placing  blocks
            if (now - data.lastPlace < 200 && now - data.lastPlace >= 100 && Math.abs(data.lastXRot - rotation.x) > 10 && !diagScaffold && player.hasTag(AnimationControllerTags.moving)) {
                data.scaffoldFlagsF++;
                if (data.scaffoldFlagsF >= 3) {
                    flag(player, "Scaffold", "F", config.antiScaffold.maxVL, config.antiScaffold.punishment, ["RotDiff:" + Math.abs(data.lastXRot - rotation.x).toFixed(2)]);
                    data.scaffoldFlagsF = 0;
                    detected = true;
                }
            } else if (now - data.lastPlace > 200 || now - data.lastPlace < 25 || Math.abs(data.lastXRot - rotation.x) < 0.5) data.scaffoldFlagsF = 0;
            //scaffold/G: check for invalid high extender with high rotation
            if (yLoc > -2.1 && yLoc <= -1 && extender - data.avgExt >= 0.5) {
                data.scaffoldFlagsG++;
                if (data.scaffoldFlagsG >= 3) {
                    flag(player, "Scaffold", "G", config.antiScaffold.maxVL, config.antiScaffold.punishment, ["Height:" + yLoc.toFixed(2), "ExtenderDiff:" + (extender - data.avgExt).toFixed(2)]);
                    data.scaffoldFlagsG = 0;
                    detected = true;
                }
            } else data.scaffoldFlagsG = 0;
            //scaffold/H: check for invalid low extender with low rotation
            if (rotation.x < 50 && extender < 1 && extender > 0 && !player.isOnGround) {
                data.scaffoldFlagsH++;
                if (data.scaffoldFlagsH >= 3) {
                    flag(player, "Scaffold", "H", config.antiScaffold.maxVL, config.antiScaffold.punishment, [`RotationX:${rotation.x.toFixed(2)}`, `Extender:${extender.toFixed(2)}`]);
                    data.scaffoldFlagsH = 0;
                    detected = true;
                }
            } else data.scaffoldFlagsH = 0;
        }
        //all of this checks are new so idk how much is false postive rate but efficiency is good
        const underBlockUnder = block.dimension.getBlock({ x: x, y: y - 1, z: z });
        data.blockLog ??= [];
        const blockId = JSON.stringify(underBlockUnder?.location);
        data.blockLog.push({ time: now, id: blockId });
        data.blockLog = data.blockLog.filter(({ time }) => now - time < 750);
        if (isUnder && !(!underBlockUnder?.isAir && data.blockLog.some(({ id }) => id == blockId))) {
            if (!data.blockPlace) data.blockPlace = [];
            const timeNow = now;
            data.blockPlace = data.blockPlace.filter((time) => timeNow - time <= 500);
            data.blockPlace.push(timeNow);
            if (data.blockPlace.length > config.antiScaffold.maxBPS && !(player.getEffect(MinecraftEffectTypes.JumpBoost) && player.isJumping) && !player.getEffect(MinecraftEffectTypes.Speed)) {
                detected = true;
                data.blockPlace = [];
                flag(player, "Scaffold", "D", config.antiScaffold.maxVL, config.antiScaffold.punishment, ["Block:" + block.typeId]);
            }
        }
    } catch (error) {
        if ((error as Error)!.name! != "LocationOutOfWorldBoundariesError") return;
        throw error;
    }
    if (!block?.isValid()) {
        detected = true;
        flag(player, "Scaffold", "I", config.antiScaffold.maxVL, config.antiScaffold.punishment, undefined);
    }
    //scaffold/K: check for placing 5 or more blocks in one tick
    if (now - data.lastPlace < 75) {
        data.scaffoldFlagsK++;
        if (data.scaffoldFlagsK >= 5) {
            flag(player, "Scaffold", "K", config.antiScaffold.maxVL, config.antiScaffold.punishment, [`Block:${block.typeId}`]);
            data.scaffoldFlagsK = 0;
            detected = true;
        }
    } else data.scaffoldFlagsK = 0;
    //scaffold/L: check for fast placing
    if (now - data.lastPlace < 175) {
        data.scaffoldFlagsL++;
        if (data.scaffoldFlagsL >= 10) {
            flag(player, "Scaffold", "L", config.antiScaffold.maxVL, config.antiScaffold.punishment, [`Block:${block.typeId}`]);
            data.scaffoldFlagsL = 0;
            detected = true;
        }
    } else data.scaffoldFlagsL = 0;
    data.lastX = x;
    data.lastZ = z;
    data.lastPlace = now;
    data.lastXRot = rotation.x;
    if (detected) {
        detectedAction(config, player, block);
    }
}
function detectedAction(config: configi, player: Player, block: Block) {
    block.setType(MinecraftBlockTypes.Air);
    player.addTag(DisableTags.place);
    system.runTimeout(() => player.removeTag(DisableTags.place), config.antiScaffold.timeout);
}
function calculateAngle(pos1: Vector3, pos2: Vector3, rotation = -90) {
    let angle = (Math.atan2(pos2.z - pos1.z, pos2.x - pos1.x) * 180) / Math.PI - rotation - 90;
    angle = angle <= -180 ? (angle += 360) : angle;
    return Math.abs(angle);
}
function isUnderPlayer(p: Vector3, pos2: Vector3) {
    if (p.y - 1 !== pos2.y) return false;
    const offsets = [-1, 0, 1];
    return offsets.includes(p.x - pos2.x) && offsets.includes(p.z - pos2.z);
}

registerModule("antiScaffold", false, [scaffoldData], {
    worldSignal: world.afterEvents.playerPlaceBlock,
    then: async (config, event) => playerPlaceBlockAfterEvent(config, event),
});
