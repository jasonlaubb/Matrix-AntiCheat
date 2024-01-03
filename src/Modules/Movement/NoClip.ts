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
const lastLocation = new Map<string, Vector3>()
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
 * @description Check if player phase more than 1 block
 */

async function AntiNoClip (player: Player, now: number) {
    const config = c();
    const { x, y, z }: Vector3 = player.getVelocity()
    const movementClip = Math.hypot(x, z);
    const lastPos = lastLocation.get(player.id);
    const bodyBlock = player.dimension.getBlock({ x: Math.floor(player.location.x), y: Math.floor(player.location.y), z: Math.floor(player.location.z) })?.typeId as MinecraftBlockTypes
    if (lastPos && movementClip >= 1 && Math.abs(y) < 1.7 && !passableBlocks.includes(bodyBlock) && !powderBlock.includes(bodyBlock) && straight(lastPos, player.location).some(loc => isSolidBlock(player.dimension.getBlock(loc)))) {
        if (!config.slient) player.teleport(lastPos)
        flag (player, "NoClip", "A", config.antiNoClip.maxVL, config.antiNoClip.punishment, undefined)
    }
    lastLocation.set(player.id, player.location)

    /*     emmm     */
    const safePos = safeLocation.get(player.id);
    const lastflag = lastFlag.get(id) 
    if (player?.lastSafePos && safePos && player?.lastClip && player?.backClip && player?.befoClip && (movementClip < 0.25 && player?.lastClip > config.antiNoClip.clipMove && player?.backClip < 0.25 || player.lastClip == player.backClip && player.backClip > config.antiNoClip.clipMove && movementClip < 0.25 && player.befoClip < 0.25) && (yV == 0 || Math.abs(yV) < 1.75 && player.isJumping) && !player.isGliding && !player.isFlying && !(player.lastExplosionTime && now - player.lastExplosionTime < 1000) && !(player.threwTridentAt && now - player.threwTridentAt < 2500) && !(player.lastApplyDamage && now - player.lastApplyDamage < 250)) {
        if (!config.slient) player.teleport(player.lastSafePos);
        if (lastflag && Date.now() - lastflag < 3000){
            flag(player, "NoClip", "A", config.antiNoClip.maxVL, config.antiNoClip.punishment, [lang(">velocityXZ") + ":" + movementClip.toFixed(2)]);
        } 
        lastFlag.set(id, now) 
    }
    player.befoClip = player.backClip
    player.backClip = player.lastClip;
    player.lastClip = movementClip;
    
    const floorHead = { x: Math.floor(x1), y: Math.floor(y1), z: Math.floor(z1) };
    const floorBody = { x: Math.floor(x2), y: Math.floor(y2), z: Math.floor(z2) };
    const inSolid = isSolidBlock(player.dimension.getBlock(floorHead)) || isSolidBlock(player.dimension.getBlock(floorBody));
    if (!inSolid) {
        safeLocation.set(player.id, player.location);
        player.lastSafePos = safePos
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
