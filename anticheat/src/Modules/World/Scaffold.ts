import {
    world,
    system,
    Vector,
    Vector3,
    Vector2
} from "@minecraft/server";
import { flag, isAdmin } from "../../Assets/Util";
import { MinecraftBlockTypes } from "../../node_modules/@minecraft/vanilla-data/lib/index"
import config from "../../Data/Config.js";

/**
 * @author jasonlaubb
 * @description A simple checks for scaffold, it can detect the main clients now
 * This checks check the invalid rotation, angle and postion
 */

const isUnderPlayer = (pos1: Vector3, pos2: Vector3) => {
    const p: Vector3 = { x: Math.floor(pos1.x), y: Math.floor(pos1.y), z: Math.floor(pos1.z) } as Vector3;
    if (p.y - 1 !== pos2.y) return false;
    const offsets: number[] = [-1, 0, 1];
    return offsets.includes(p.x - pos2.x) && offsets.includes(p.z - pos2.z);
}

world.afterEvents.playerPlaceBlock.subscribe(({ block, player }) => {
    const rotation: Vector2 = player.getRotation();
    const pos1: Vector3 = player.location;
    const pos2: Vector3 = { x: block.location.x - 0.5, z: block.location.z - 0.5 } as Vector3;
    const angle: number = calculateAngle(pos1, pos2, rotation);
    const toggle: boolean = (world.getDynamicProperty("antiScaffold") ?? config.antiScaffold.enabled) as boolean;
    if (toggle !== true) return;

    if (isAdmin(player) || player.hasTag("matrix:scaffold-disabled")) return;

    let detected: boolean = false;

    const factor: number = config.antiScaffold.factor;

    if ((rotation.x % factor === 0 || rotation.y % factor === 0) && Math.abs(rotation.x) !== 90) {
        detected = true
        flag (player, 'Scaffold', config.antiScaffold.punishment, [`RotationX:${rotation.x.toFixed(2)}°`, `RotationY:${rotation.y.toFixed(2)}°`])
    }

    if (angle > config.antiScaffold.maxAngle && Vector.distance({ x: pos1.x, y: 0, z: pos1.z }, { x: pos2.x, y: 0, z: pos2.z }) > 1.5 && Math.abs(rotation.x) < 79.5) {
        detected = true;
        flag (player, 'Scaffold', config.antiScaffold.punishment, [`Angle:${angle.toFixed(2)}°`])
    }

    if (rotation.x < config.antiScaffold.minRotation && isUnderPlayer(player.location, block.location)) {
        detected = true;
        flag (player, 'Scaffold', config.antiScaffold.punishment, [`RotationX:${rotation.x.toFixed(2)}°`])
    }

    if (detected) {
        block.setType(MinecraftBlockTypes.Air);
        player.addTag("matrix:scaffold-disabled");
        system.runTimeout(() => player.removeTag("matrix:scaffold-disabled"), config.antiScaffold.timeout);
    }
});

function calculateAngle(pos1:Vector3, pos2: Vector3, rotation: Vector2) {
    const dx: number = pos2.x - pos1.x;
    const dz: number = pos2.z - pos1.z;
    const radToDeg: number = 180 / Math.PI;
    const rawAngle: number = Math.atan2(dz, dx) * radToDeg;
    let adjustedAngle: number = rawAngle - rotation.y - 90;
    adjustedAngle = (adjustedAngle <= -180) ? adjustedAngle + 360 : adjustedAngle;
    return Math.abs(adjustedAngle);
}

world.beforeEvents.playerPlaceBlock.subscribe(event => {
    const { player } = event;

    if (player.hasTag("matrix:scaffold-disabled")) {
        event.cancel = true;
    }
});