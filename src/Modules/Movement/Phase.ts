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
const passableBlocks = [
    MinecraftBlockTypes.Sand,
    MinecraftBlockTypes.Gravel,
    MinecraftBlockTypes.SoulSand
] as string[];

const isSolidBlock = (block: Block) => {
    return block?.isSolid && !passableBlocks.includes(block?.typeId as MinecraftBlockTypes) && !powderBlock.includes(block?.typeId as MinecraftBlockTypes)
}

/**
 * @author jasonlaubb
 * @description This is a simple phase detector, it will detect if the player is inside a block
 */

async function AntiPhase (player: Player) {
    const config = c()
    const { x: xV, z: zV } = player.getVelocity()
    const { x: x1, y: y1, z: z1 } = player.getHeadLocation()
    const { x: x2, y: y2, z: z2 } = player.location
    const movementClip = Math.hypot(xV, zV)
    const lastPos = safeLocation.get(player.id)

    if (lastPos && player?.lastClip && movementClip > 1.6 && player?.lastClip < 0.3 && player?.lastClip > 0.02) {
        if (!config.slient) player.teleport(lastPos)
        flag(player, "NoClip", "A", config.antiPhase.maxVL, config.antiPhase.punishment, [lang(">velocityXZ") + ":" + movementClip.toFixed(2)])
    }

    player.lastClip = movementClip

    const floorHead = { x: Math.floor(x1), y: Math.floor(y1), z: Math.floor(z1) }
    const floorBody = { x: Math.floor(x2), y: Math.floor(y2), z: Math.floor(z2) }
    const inSolid = isSolidBlock(player.dimension.getBlock(floorHead)) || isSolidBlock(player.dimension.getBlock(floorBody))
    
    if (!inSolid) {
        safeLocation.set(player.id, player.location)
    }
}

const antiPhase = () => {
    const players = world.getPlayers({ excludeGameModes: [GameMode.creative, GameMode.spectator] })
    for (const player of players) {
        if (isAdmin (player)) continue;

        AntiPhase (player);
    }
}

const playerLeave = ({ playerId }: PlayerLeaveAfterEvent) => {
    safeLocation.delete(playerId)
};

let id: number

export default {
    enable () {
        id = system.runInterval(antiPhase, 1)
        world.afterEvents.playerLeave.subscribe(playerLeave)
    },
    disable () {
        system.clearRun(id)
        world.afterEvents.playerLeave.unsubscribe(playerLeave)
    }
}
