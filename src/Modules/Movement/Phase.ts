import {
    world,
    system,
    Block,
    Vector3,
    GameMode,
    Player,
    PlayerLeaveAfterEvent
} from "@minecraft/server";
import { flag, isAdmin, c } from "../../Assets/Util";
import { MinecraftBlockTypes } from "../../node_modules/@minecraft/vanilla-data/lib/index";

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

const phaseData: Map<string, Vector3> = new Map<string, Vector3>();
const passableBlocks = [
    MinecraftBlockTypes.Sand,
    MinecraftBlockTypes.Gravel,
    MinecraftBlockTypes.SoulSand
] as string[];

const isSolidBlock = (block: Block) => {
    return block?.isSolid && !passableBlocks.includes(block?.typeId as MinecraftBlockTypes) && !powderBlock.includes(block?.typeId as MinecraftBlockTypes)
}

/**
 * @author ravriv & jasonlaubb
 * @description This is a simple phase detector, it will detect if the player is inside a block
 */
interface PhaseData {
    N: Vector3,
    O: Vector3
}
const data = new Map<string, PhaseData>()

async function AntiPhase (player: Player) {
    const config = c()
    const { x, y, z } = player.location
    const { y: headY } = player.getHeadLocation()
    if (Math.floor(headY) - Math.floor(y) == 0) return;
    const { x: xV, z: zV } = player.getVelocity()
    const nextPos = { x: x + xV, y, z: z + zV }
    const phaseData = data.get(player.id)
    const floorPos = { x: Math.floor(x), y: Math.floor(y), z: Math.floor(z) }
    data.set(player.id, { N: nextPos, O: floorPos})
    const nextSolid: [boolean, boolean] = [isSolidBlock(player.dimension.getBlock({ x: Math.floor(nextPos.x), y: Math.floor(y), z: Math.floor(nextPos.z) })), isSolidBlock(player.dimension.getBlock({ x: Math.floor(nextPos.x), y: Math.floor(y) + 1, z: Math.floor(nextPos.z) }))]
    const nowSolid: [boolean, boolean] = [isSolidBlock(player.dimension.getBlock({ x: Math.floor(x), y: Math.floor(y), z: Math.floor(z) })), isSolidBlock(player.dimension.getBlock({ x: Math.floor(nextPos.x), y: Math.floor(y) + 1, z: Math.floor(z) }))]

    if (player.phaseCheck) {
        if (nowSolid && JSON.stringify(nextPos) == JSON.stringify(phaseData.N) && JSON.stringify(floorPos) !== JSON.stringify(phaseData.O)) {
            if (!config.slient) player.teleport(phaseData.O)
            flag(player, "Phase", "A", config.antiPhase.maxVL, config.antiPhase.punishment, undefined)
        }
    }
    if (nextSolid && !nowSolid && Math.floor(headY) - Math.floor(y) !== 0) player.phaseCheck = true
}

const antiPhase = () => {
    const players = world.getPlayers({ excludeGameModes: [GameMode.creative, GameMode.spectator] })
    for (const player of players) {
        if (isAdmin (player)) continue;

        AntiPhase (player);
    }
}

const playerLeave = ({ playerId }: PlayerLeaveAfterEvent) => {
    const playerName: string = playerId;
    phaseData.delete(playerName);
};

let id: number

export default {
    enable () {
        id = system.runInterval(antiPhase, 1)
        world.afterEvents.playerLeave.subscribe(playerLeave)
    },
    disable () {
        phaseData.clear()
        system.clearRun(id)
        world.afterEvents.playerLeave.unsubscribe(playerLeave)
    }
}