import {
    world,
    system,
    Vector,
    PlayerPlaceBlockAfterEvent,
    PlayerLeaveAfterEvent,
    Vector3 } from "@minecraft/server";
import { flag, isAdmin, c } from "../../Assets/Util";
import { MinecraftBlockTypes, MinecraftEffectTypes } from "../../node_modules/@minecraft/vanilla-data/lib/index";
import lang from "../../Data/Languages/lang";

/**
 * @author jasonlaubb & RaMiGamerDev
 * @description A integrated check for many type of scaffold
 */
interface ScaffoldData {
    lastX: number
    lastDiagX: number
    lastZ: number
    lastDiagZ: number
    scaffoldFlags: number
    lastPlace: number
    blockLog: {
        time: number
        id: string
    }[]
    blockPlace: number[]
}
const scaffoldData = new Map<string, ScaffoldData>()
function playerPlaceBlockAfterEvent ({ player, block }: PlayerPlaceBlockAfterEvent) {
    if (isAdmin(player) || player.hasTag("matrix:place-disabled")) return
    const config = c()
    let data = scaffoldData.get(player.id)
    const { x, y, z } = block.location
    if (!data) {
        data = {
            lastX: x,
            lastDiagX: 0,
            lastZ: z,
            lastDiagZ: 0,
            scaffoldFlags: 0,
            lastPlace: Date.now(),
            blockLog: [],
            blockPlace: []
        }
        scaffoldData.set(player.id, data)
        return
    }
    const rotation = player.getRotation();
    const pos1 = player.location;
    const pos2 = { x: block.location.x - 0.5, y: 0, z: block.location.z - 0.5 };
    const angle = calculateAngle(pos1, pos2, rotation.y);
    let detected
    //get the factor from the config
    const factor = config.antiScaffold.factor;
    //check if rotation is a number that can be divided by the factor
    if ((rotation.x % factor === 0 || rotation.y % factor === 0) && Math.abs(rotation.x) !== 90) {
        detected = true;
        flag(player, 'Scaffold', 'A', config.antiScaffold.maxVL, config.antiScaffold.punishment, [`${lang(">RotationX")}:${rotation.x.toFixed(2)}°`, `${lang(">RotationY")}:${rotation.y.toFixed(2)}°`]);
    }
    //check if the angle is higher than the max angle
    if (angle > config.antiScaffold.maxAngle && Vector.distance({ x: pos1.x, y: 0, z: pos1.z }, { x: pos2.x, y: 0, z: pos2.z }) > 1.75 && Math.abs(rotation.x) < 69.5) {
        detected = true;
        flag(player, 'Scaffold', 'B', config.antiScaffold.maxVL, config.antiScaffold.punishment, [`${lang(">Angle")}:${angle.toFixed(2)}°`]);
    }
    const floorPos = { x: Math.floor(pos1.x), y: Math.floor(pos1.y), z: Math.floor(pos1.z) };
    if (player.isJumping && !player.isOnGround && !isUnderPlayer(floorPos, block.location)) {
        floorPos.y -= 1;
    }
    const isUnder = isUnderPlayer(floorPos, block.location);
    //check if the rotation is lower than the min rotation and the block is under the player
    if (rotation.x < config.antiScaffold.minRotation && isUnder) {
        detected = true;
        flag(player, 'Scaffold', 'C', config.antiScaffold.maxVL, config.antiScaffold.punishment, [`${lang(">RotationX")}:${rotation.x.toFixed(2)}°`]);
    }
    const diagZ = Math.abs(z - data.lastX)
    const diagX = Math.abs(x - data.lastZ)
    const diagScaffold = (data.lastDiagX == 1 && diagX == 0 && data.lastDiagZ == 0 && diagZ == 1 || data.lastDiagX == 0 && diagX == 1 && data.lastDiagZ == 1 && diagZ == 0)
    const now = Date.now()
    if(isUnder && now - data.lastPlace < 300 && diagScaffold) {
        data.scaffoldFlags++
        if(data.scaffoldFlags == 2){
            flag(player, 'Scaffold', 'E', config.antiScaffold.maxVL, config.antiScaffold.punishment, [`${lang(">Block")}:${block.typeId}`])
            data.scaffoldFlags = 0
            detected = true
        }
    }
    data.lastDiagX = diagX
    data.lastDiagZ = diagZ
    if (!diagScaffold || now - data.lastPlace > 500) data.scaffoldFlags = 0
    const underBlockUnder = block.dimension.getBlock({ x: x, y: y - 1, z: z });
    data.blockLog ??= [];
    const blockId = JSON.stringify(underBlockUnder.location);
    data.blockLog.push({ time: now, id: blockId });
    data.blockLog = data.blockLog.filter(({ time }) => now - time < 750);
    if (isUnder && !(!underBlockUnder?.isAir && data.blockLog.some(({ id }) => id == blockId))) {
        if (!data.blockPlace)
            data.blockPlace = [];
        const timeNow = now;
        data.blockPlace = data.blockPlace.filter(time => timeNow - time <= 500)
        data.blockPlace.push(timeNow)
        if (data.blockPlace.length > config.antiScaffold.maxBPS && !(player.getEffect(MinecraftEffectTypes.JumpBoost) && player.isJumping) && !player.getEffect(MinecraftEffectTypes.Speed)) {
            detected = true;
            data.blockPlace = [];
            flag(player, 'Scaffold', 'D', config.antiScaffold.maxVL, config.antiScaffold.punishment, [`${lang(">Block")}:${block.typeId}`]);
        }
    }
    data.lastX = x
    data.lastZ = z
    data.lastPlace = now
    if (detected && !config.slient) {
        block.setType(MinecraftBlockTypes.Air);
        player.addTag("matrix:place-disabled");
        system.runTimeout(() => player.removeTag("matrix:place-disabled"), config.antiScaffold.timeout);
    }
}
function playerLeaveAfterEvent ({ playerId }: PlayerLeaveAfterEvent) {
    scaffoldData.delete(playerId)
}
function calculateAngle(pos1: Vector3, pos2: Vector3, rotation = -90) {
    let angle = Math.atan2((pos2.z - pos1.z), (pos2.x - pos1.x)) * 180 / Math.PI - rotation - 90;
    angle = angle <= -180 ? angle += 360 : angle;
    return Math.abs(angle);
}
function isUnderPlayer(p: Vector3, pos2: Vector3) {
    if (p.y - 1 !== pos2.y)
        return false;
    const offsets = [-1, 0, 1];
    return offsets.includes(p.x - pos2.x) && offsets.includes(p.z - pos2.z);
}
export default {
    enable () {
        world.afterEvents.playerPlaceBlock.subscribe(playerPlaceBlockAfterEvent)
        world.afterEvents.playerLeave.subscribe(playerLeaveAfterEvent)
    },
    disable () {
        scaffoldData.clear()
        world.afterEvents.playerPlaceBlock.unsubscribe(playerPlaceBlockAfterEvent)
        world.afterEvents.playerLeave.unsubscribe(playerLeaveAfterEvent)
    }
}
