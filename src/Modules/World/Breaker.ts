import { Block, Player, PlayerBreakBlockBeforeEvent, Vector3, system, world } from "@minecraft/server";
import config from "../../Data/Config";
import { flag, isAdmin } from "../../Assets/Util";
import lang from "../../Data/Languages/lang";
import { MinecraftBlockTypes } from "../../node_modules/@minecraft/vanilla-data/lib/index";

//offset~
const offset = [
    { x: 1, y: 0, z: 0 },
    { x: -1, y: 0, z: 0 },
    { x: 0, y: 1, z: 0 },
    { x: 0, y: -1, z: 0 },
    { x: 0, y: 0, z: 1 },
    { x: 0, y: 0, z: -1 },
]

async function AntiBreaker (player: Player, block: Block, event: PlayerBreakBlockBeforeEvent) {
    if (player.hasTag("matrix:break-disabled")) return;

    if (block.typeId === MinecraftBlockTypes.Bed) {
        let allBlock: Block[] = []
        offset.forEach(({ x, y, z}) => allBlock.push(player.dimension.getBlock({ x: block.location.x + x, y: block.location.y + y, z: block.location.z + z }) ?? null))

        const bedBody = allBlock.filter(block => block.typeId === MinecraftBlockTypes.Bed)
        if (bedBody.length === 2) {
            const bed = bedBody[0]
            let allBlock2 = []
            offset.forEach(({ x, y, z}) => allBlock2.push(player.dimension.getBlock({ x: bed.location.x + x, y: bed.location.y + y, z: bed.location.z + z }) ?? null))
            allBlock2 = allBlock.filter(bedx => bedx.location.x !== block.location.x || bedx.location.y !== block.location.y || bedx.location.z !== block.location.z)
            const aroundSolid = allBlock.every(block => block?.isSolid) && allBlock2.every(block => block?.isSolid)
            if (aroundSolid) {
                event.cancel = true
                if (!config.slient) {
                    system.run(() => player.addTag("matrix:break-disabled"))
                    system.runTimeout(() => player.removeTag("matrix:break-disabled"), config.antiBreaker.timeout)
                }
                system.run(() =>
                    flag (player, "Breaker", "A", config.antiBreaker.maxVL, config.antiBreaker.punishment, [lang(">Type") + ":" + block.typeId])
                )
                return
            }
        }
    } else {
        let allBlock: Block[] = []
        offset.forEach(({ x, y, z}) => allBlock.push(player.dimension.getBlock({ x: block.location.x + x, y: block.location.y + y, z: block.location.z + z })) ?? null)
        const aroundSolid = allBlock.every(block => block?.isSolid)

        if (aroundSolid) {
            event.cancel = true
            if (!config.slient) {
                system.run(() => player.addTag("matrix:break-disabled"))
                system.runTimeout(() => player.removeTag("matrix:break-disabled"), config.antiBreaker.timeout)
            }
            system.run(() =>
                flag (player, "Breaker", "B", config.antiBreaker.maxVL, config.antiBreaker.punishment, [lang(">Type") + ":" + block.typeId])
            )
            return
        }
    }

    const allPos = new Set(pointsBetween(player.getHeadLocation(), block.location))
    const anySolid = [...allPos].map(pos => player.dimension.getBlock(pos)).some(block => block?.isSolid)

    if (anySolid) {
        event.cancel = true
        if (!config.slient) {
            system.run(() => player.addTag("matrix:break-disabled"))
            system.runTimeout(() => player.removeTag("matrix:break-disabled"), config.antiBreaker.timeout)
        }
        system.run(() => 
            flag (player, "Breaker", "C", config.antiBreaker.maxVL, config.antiBreaker.punishment, [lang(">Type") + ":" + block.typeId])
        )
    }
}

function pointsBetween (pos1: Vector3, pos2: Vector3): Vector3[] {
    pos1 = { x: Math.floor(pos1.x), y: Math.floor(pos1.y), z: Math.floor(pos1.z) }

    const start = {
       x: Math.min(pos1.x, pos2.x),
       y: Math.min(pos1.y, pos2.y),
       z: Math.min(pos1.z, pos2.z),
    };
    const goal = {
       x: Math.max(pos1.x, pos2.x),
       y: Math.max(pos1.y, pos2.y),
       z: Math.max(pos1.z, pos2.z),
    };
    const delta = {
       x: Math.abs(start.x - goal.x),
       y: Math.abs(start.y - goal.y),
       z: Math.abs(start.z - goal.z),
    };
    const distance = Math.floor(Math.hypot(delta.x, delta.y, delta.z));
    const step = {
       x: delta.x / distance,
       y: delta.y / distance,
       z: delta.z / distance,
    };
    const points = new Array(distance);
    for (let i = 0; i < distance; i++) {
         const point = {
          x: Math.floor(start.x + step.x * (i + 1)),
          y: Math.floor(start.y + step.y * (i + 1)),
          z: Math.floor(start.z + step.z * (i + 1)),
       };
       points[i] = point;
    }
    return points.filter(pos => pos.x !== pos2.x && pos.y !== pos2.y && pos.z !== pos2.z && pos.x !== pos1.x && pos.y !== pos1.y && pos.z !== pos1.z)
}

const antiBreaker = (event: PlayerBreakBlockBeforeEvent) => {
    const { player, block } = event
    if (isAdmin(player)) return

    AntiBreaker (player, block, event)
}

export default {
    enable () {
        world.beforeEvents.playerBreakBlock.subscribe(antiBreaker)
    },
    disable () {
        world.beforeEvents.playerBreakBlock.unsubscribe(antiBreaker)
    }
}