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
 * @description It can detect most of the phase hack. And the invalid motion caused by client
 */

async function AntiNoClip (player: Player, now: number) {
    const config = c()
    const { x: xV, y: yV, z: zV } = player.getVelocity()
    const { x: x1, y: y1, z: z1 } = player.getHeadLocation()
    const { x: x2, y: y2, z: z2 } = player.location
    const movementClip = Math.hypot(xV, zV)
    const lastPos = safeLocation.get(player.id)

    if (lastPos && player?.lastClip && player?.backClip && movementClip < 0.1 && player?.lastClip > 1.6 && player?.backClip < 0.1 && (yV == 0 || Math.abs(yV) < 1.75 && player.isJumping) && !player.isGliding && !player.isFlying && player?.lastClip > 0.02 && !(player.lastExplosionTime && now - player.lastExplosionTime < 1000) && !(player.threwTridentAt && now - player.threwTridentAt < 2500) && !(player.lastApplyDamage && now - player.lastApplyDamage < 250)) {
        if (!config.slient) player.teleport(lastPos)
        flag(player, "NoClip", "A", config.antiNoClip.maxVL, config.antiNoClip.punishment, [lang(">velocityXZ") + ":" + movementClip.toFixed(2)])
    }

    player.backClip = player.lastClip
    player.lastClip = movementClip

    const floorHead = { x: Math.floor(x1), y: Math.floor(y1), z: Math.floor(z1) }
    const floorBody = { x: Math.floor(x2), y: Math.floor(y2), z: Math.floor(z2) }
    const inSolid = isSolidBlock(player.dimension.getBlock(floorHead)) || isSolidBlock(player.dimension.getBlock(floorBody))
    
    if (!inSolid) {
        safeLocation.set(player.id, player.location)
    }
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
        id = system.runInterval(antiPhase, 1)
        world.afterEvents.playerLeave.subscribe(playerLeave)
        world.afterEvents.entityHurt.subscribe(entityHurt, { entityTypes: ["minecraft:player"] })
    },
    disable () {
        system.clearRun(id)
        world.afterEvents.playerLeave.unsubscribe(playerLeave)
        world.afterEvents.entityHurt.unsubscribe(entityHurt)
    }
}
