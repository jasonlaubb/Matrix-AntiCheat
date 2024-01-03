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

function blocksBetween (start: Vector3, end: Vector3): Vector3[] {
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
    const { x: xV, y: yV, z: zV } = player.getVelocity();
    const { x: x1, y: y1, z: z1 } = player.getHeadLocation();
    const { x: x2, y: y2, z: z2 } = player.location;
    const movementClip = Math.hypot(xV, zV);
    const lastPos = safeLocation.get(player.id);
    if (player?.lastSafePos && lastPos && player?.lastClip && player?.backClip && player?.befoClip && (movementClip < 0.25 && player?.lastClip > config.antiNoClip.clipMove && player?.backClip < 0.25 || player.lastClip == player.backClip && player.backClip > config.antiNoClip.clipMove && movementClip < 0.25 && player.befoClip < 0.25) && (yV == 0 || Math.abs(yV) < 1.75 && player.isJumping) && !player.isGliding && !player.isFlying && !(player.lastExplosionTime && now - player.lastExplosionTime < 1000) && !(player.threwTridentAt && now - player.threwTridentAt < 2500) && !(player.lastApplyDamage && now - player.lastApplyDamage < 250)) {
        // checks if player moved through at least a block
        if (Math.abs(lastPos.y - y2) < 1.7 && x1 - z2 > 0.3 && blocksBetween(lastPos, player.location).some(loc => isSolidBlock(player.dimension.getBlock(loc)))) {
            if (!config.slient) player.teleport(player.lastSafePos);

            const Lastflag = lastFlag.get(id) 
            if(Lastflag && Date.now() - Lastflag < 2500){
               flag(player, "NoClip", "A", config.antiNoClip.maxVL, config.antiNoClip.punishment, [lang(">velocityXZ") + ":" + movementClip.toFixed(2)]);
            }
            lastFlag.set(id,Date.now())
        }
    }
    /*if (player?.lastClip && player?.lastClip > 1.6) {
        player.sendMessage(`${player.befoClip} > ${player.backClip} > ${player.lastClip} > ${movementClip}`)
    }*/
    player.befoClip = player.backClip
    player.backClip = player.lastClip;
    player.lastClip = movementClip;
    const floorHead = { x: Math.floor(x1), y: Math.floor(y1), z: Math.floor(z1) };
    const floorBody = { x: Math.floor(x2), y: Math.floor(y2), z: Math.floor(z2) };
    const inSolid = isSolidBlock(player.dimension.getBlock(floorHead)) || isSolidBlock(player.dimension.getBlock(floorBody));
    if (!inSolid) {
        safeLocation.set(player.id, player.location);
        player.lastSafePos = lastPos
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
