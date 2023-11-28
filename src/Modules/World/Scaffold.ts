import {
    world,
    system,
    Vector,
    Vector3,
    Vector2,
    Player,
    Block
} from "@minecraft/server";
import { flag, isAdmin } from "../../Assets/Util";
import { MinecraftBlockTypes } from "../../node_modules/@minecraft/vanilla-data/lib/index"
import config from "../../Data/Config.js";
import lang from "../../Data/Languages/lang";

/**
 * @author jasonlaubb
 * @description A simple checks for scaffold, it can detect the main clients now
 * This checks check the invalid rotation, angle and postion
 */

let blockPlace: { [key: string]: number[] } = {}

async function antiScaffold (player: Player, block: Block) {
    //constant the infomation
    const rotation: Vector2 = player.getRotation();
    const pos1: Vector3 = player.location;
    const pos2: Vector3 = { x: block.location.x - 0.5, z: block.location.z - 0.5 } as Vector3;
    const angle: number = calculateAngle(pos1, pos2, rotation.y);

    if (player.hasTag("matrix:place-disabled")) return;

    let detected: boolean = false;

    //get the factor from the config
    const factor: number = config.antiScaffold.factor;

    //check if rotation is a number that can be divided by the factor
    if ((rotation.x % factor === 0 || rotation.y % factor === 0) && Math.abs(rotation.x) !== 90) {
        detected = true
        flag (player, 'Scaffold', 'A', config.antiScaffold.maxVL, config.antiScaffold.punishment, [`${lang(">RotationX")}:${rotation.x.toFixed(2)}°`, `${lang(">RotationY")}:${rotation.y.toFixed(2)}°`])
    }

    //check if the angle is higher than the max angle
    if (angle > config.antiScaffold.maxAngle && Vector.distance({ x: pos1.x, y: 0, z: pos1.z }, { x: pos2.x, y: 0, z: pos2.z }) > 1.35 && Math.abs(rotation.x) < 69.5) {
        detected = true;
        flag (player, 'Scaffold', 'B', config.antiScaffold.maxVL,  config.antiScaffold.punishment, [`${lang(">Angle")}:${angle.toFixed(2)}°`])
    }

    const isUnder = isUnderPlayer(player.location, block.location)
    
    //check if the rotation is lower than the min rotation and the block is under the player
    if (rotation.x < config.antiScaffold.minRotation && isUnder) {
        detected = true;
        flag (player, 'Scaffold', 'C', config.antiScaffold.maxVL, config.antiScaffold.punishment, [`${lang(">RotationX")}:${rotation.x.toFixed(2)}°`])
    }

    //check if the player is placing block too fast
    if (isUnder) {
        if (!blockPlace[player.id]) blockPlace[player.id] = []
        const timeNow = Date.now()
        blockPlace[player.id] = [...blockPlace[player.id].filter(time => timeNow - time <= 1000), timeNow]

        if (blockPlace[player.id].length > config.antiScaffold.maxBPS) {
            detected = true;
            blockPlace[player.id] = []
            flag (player, 'Scaffold', 'D', config.antiScaffold.maxVL, config.antiScaffold.punishment, [`${lang(">Block")}:${block.typeId}`])
        }
    }

    //if detected, flag the player and set the block to the air
    if (detected && !config.slient) {
        block.setType(MinecraftBlockTypes.Air);
        player.addTag("matrix:place-disabled");
        system.runTimeout(() => player.removeTag("matrix:place-disabled"), config.antiScaffold.timeout);
    }
}

function isUnderPlayer (pos1: Vector3, pos2: Vector3) {
    const p: Vector3 = { x: Math.floor(pos1.x), y: Math.floor(pos1.y), z: Math.floor(pos1.z) } as Vector3;
    if (p.y - 1 !== pos2.y) return false;
    const offsets: number[] = [-1, 0, 1];
    return offsets.includes(p.x - pos2.x) && offsets.includes(p.z - pos2.z);
}

world.afterEvents.playerPlaceBlock.subscribe(({ block, player }) => {
    const toggle: boolean = (world.getDynamicProperty("antiScaffold") ?? config.antiScaffold.enabled) as boolean;
    if (toggle !== true) return;

    if (isAdmin (player)) return;

    antiScaffold (player, block)
});

function calculateAngle (pos1: Vector3, pos2: Vector3, rotation = -90) {
    let angle = Math.atan2((pos2.z - pos1.z), (pos2.x - pos1.x)) * 180 / Math.PI - rotation - 90;
    angle = angle <= -180 ? angle += 360 : angle
    return Math.abs(angle);
}

world.beforeEvents.playerPlaceBlock.subscribe(event => {
    const { player } = event;

    if (player.hasTag("matrix:place-disabled")) {
        event.cancel = true;
    }
});

world.afterEvents.playerPlaceBlock.subscribe(event => {
    const { player, block } = event;
    
    if (player.hasTag("matrix:place-disabled")) {
        block.setType(MinecraftBlockTypes.Air);
    }
});

world.afterEvents.playerSpawn.subscribe(({ player, initialSpawn }) => {
    if (!initialSpawn) return;
    if (player.hasTag("matrix:place-disabled")) {
        player.removeTag("matrix:place-disabled")
    }
});

world.afterEvents.playerLeave.subscribe(({ playerId }) => {
    delete blockPlace[playerId]
})