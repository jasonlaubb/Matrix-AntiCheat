import {
    world,
    system,
    Block,
    Vector3,
    GameMode,
    Player,
    PlayerLeaveAfterEvent,
    EntityHurtAfterEvent
} from "@minecraft/server";
import { flag, isAdmin, c } from "../../Assets/Util";
import { MinecraftBlockTypes } from "../../node_modules/@minecraft/vanilla-data/lib/index";
import lang from "../../Data/Languages/lang";

const powderBlock = [
    MinecraftBlockTypes.RedConcretePowder,
    MinecraftBlockTypes.BlueConcretePowder,
    MinecraftBlockTypes.GreenConcretePowder,
    MinecraftBlockTypes.YellowConcretePowder,
    MinecraftBlockTypes.BlackConcretePowder,
    MinecraftBlockTypes.BrownConcretePowder,
    MinecraftBlockTypes.CyanConcretePowder,
    MinecraftBlockTypes.GrayConcretePowder,
    MinecraftBlockTypes.LightBlueConcretePowder,
    MinecraftBlockTypes.LightGrayConcretePowder,
    MinecraftBlockTypes.LimeConcretePowder,
    MinecraftBlockTypes.MagentaConcretePowder,
    MinecraftBlockTypes.OrangeConcretePowder,
    MinecraftBlockTypes.PinkConcretePowder,
    MinecraftBlockTypes.PurpleConcretePowder,
    MinecraftBlockTypes.WhiteConcretePowder,
] as string[]

const safeLocation = new Map<string, Vector3>()
const lastFlag = new Map<string, number>()
const passableBlocks = [
    MinecraftBlockTypes.Sand,
    MinecraftBlockTypes.Gravel,
    MinecraftBlockTypes.SoulSand
] as string[];

const isSolidBlock = (block: Block) => {
    return block?.isSolid && !passableBlocks.includes(block?.typeId as MinecraftBlockTypes) && !powderBlock.includes(block?.typeId as MinecraftBlockTypes)
}

function straight (start: Vector3, end: Vector3): Vector3[] {
    const chunks: Vector3[] = [];
    const { x: startX, z: startZ } = start;
    const { x: endX, y , z: endZ } = end;

    const dx = endX - startX;
    const dz = endZ - startZ;

    const stepsX = Math.abs(dx);
    const stepsZ = Math.abs(dz);

    const steps = Math.max(stepsX, stepsZ);

    const xIncrement = stepsX === 0 ? 0 : dx / steps;
    const zIncrement = stepsZ === 0 ? 0 : dz / steps;

    for (let i = 1; i < steps; i++) {
        chunks.push({
            x: Math.floor(startX + xIncrement * i),
            z: Math.floor(startZ + zIncrement * i),
            y: y,
        });
    }

    return chunks;
}

/**
 * @author jasonlaubb
 * @description It can detect most of the phase hack. And the invalid motion caused by client
 */

async function AntiNoClip (player: Player, now: number) {
    const config = c();
    const { x, y, z }: Vector3 = player.getVelocity()
    const movementClip = Math.hypot(x, z);
    const lastPos = safeLocation.get(player.id);
    const headY = player.getHeadLocation().y
    const bodyY = player.location.y
    const bodyBlock = player.dimension.getBlock({ x: Math.floor(player.location.x), y: Math.floor(player.location.y), z: Math.floor(player.location.z) })
    if (lastPos && movementClip >= 1 && headY - bodyY > 0.4 && straight(lastPos, player.location).some(loc => isSolidBlock(player.dimension.getBlock(loc)))) {
        flag (player, "NoClip", "A", config.antiNoClip.maxVL, config.antiNoClip.punishment, undefined)
    }
    safeLocation.set(player.id, player.location)
}

const antiNoClip = () => {
    const players = world.getPlayers({ excludeGameModes: [GameMode.creative, GameMode.spectator] })
    const now = Date.now()
    for (const player of players) {
        if (isAdmin (player)) continue;

        AntiNoClip (player, now);
    }
}

const playerLeave = ({ playerId }: PlayerLeaveAfterEvent) => {
    safeLocation.delete(playerId)
};

const entityHurt = ({ hurtEntity: player }: EntityHurtAfterEvent) => (player as Player).lastApplyDamage = Date.now()

let id: number

export default {
    enable () {
        id = system.runInterval(antiNoClip, 1)
        world.afterEvents.playerLeave.subscribe(playerLeave)
        world.afterEvents.entityHurt.subscribe(entityHurt, { entityTypes: ["minecraft:player"] })
    },
    disable () {
        system.clearRun(id)
        world.afterEvents.playerLeave.unsubscribe(playerLeave)
        world.afterEvents.entityHurt.unsubscribe(entityHurt)
    }
}
