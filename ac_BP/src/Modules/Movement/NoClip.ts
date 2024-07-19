import { world, Block, Vector3, Player, EntityHurtAfterEvent, PlayerBreakBlockAfterEvent, GameMode, system } from "@minecraft/server";
import { flag } from "../../Assets/Util";
import { MinecraftBlockTypes } from "../../node_modules/@minecraft/vanilla-data/lib/index";
import { configi, registerModule } from "../Modules";
import { isISL } from "./Timer";
import { AnimationControllerTags } from "../../Data/EnumData";

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
] as string[];

interface NoClipData {
    safeLocation: Vector3;
    lastLocation: Vector3;
    lastFlag: number;
    lastFlag2: number;
}
const noclipdata = new Map<string, NoClipData>();
const passableBlocks = [MinecraftBlockTypes.Sand, MinecraftBlockTypes.Gravel, MinecraftBlockTypes.SoulSand] as string[];

const isSolidBlock = (block: Block) => {
    return block?.isSolid && !passableBlocks.includes(block?.typeId as MinecraftBlockTypes) && !powderBlock.includes(block?.typeId as MinecraftBlockTypes);
};

function straight(start: Vector3, end: Vector3): Vector3[] {
    const chunks: Vector3[] = [];
    const { x: startX, z: startZ } = start;
    const { x: endX, y, z: endZ } = end;

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

async function AntiNoClip(player: Player, config: configi, now: number) {
    const data = noclipdata.get(player.id) ?? {
        lastLocation: player.location,
        safeLocation: player.location,
        lastFlag: 0,
        lastFlag2: 0,
    };
    const { x, y, z }: Vector3 = player.getVelocity();
    const movementClip = Math.hypot(x, z);
    const bodyBlock = player.dimension.getBlock({ x: Math.floor(player.location.x), y: Math.floor(player.location.y), z: Math.floor(player.location.z) })?.typeId as MinecraftBlockTypes;
    if (
        data.lastLocation &&
        movementClip > 1.2 &&
        !player.isGliding &&
        !(player.lastBreakSolid && now - player.lastBreakSolid < 1750) &&
        Math.abs(y) < 1.7 &&
        !passableBlocks.includes(bodyBlock) &&
        !powderBlock.includes(bodyBlock) &&
        straight(data.lastLocation, player.location).some((loc) => isSolidBlock(player.dimension.getBlock(loc)))
    ) {
        const lastflag = data.lastFlag2;
        if (!config.slient) teleportMagic(player, data.safeLocation);
        if (lastflag && now - lastflag < 5000 && !isISL(player)) {
            flag(player, "NoClip", "A", config.antiNoClip.maxVL, config.antiNoClip.punishment, undefined);
        }
        data.lastFlag2 = now;
    }
    data.lastLocation = player.location;

    /*     emmm     */
    const safePos = data.safeLocation;
    const lastflag = data.lastFlag;
    if (
        player?.lastSafePos &&
        safePos &&
        player?.lastClip &&
        player?.backClip &&
        player?.beforeClip &&
        ((movementClip < 0.25 && player?.lastClip > config.antiNoClip.clipMove && player?.backClip < 0.25) || (player.lastClip == player.backClip && player.backClip > config.antiNoClip.clipMove && movementClip < 0.25 && player.beforeClip < 0.25)) &&
        /*(y == 0 || (Math.abs(y) < 1.75 && player.isJumping)) &&*/
        !player.isGliding &&
        !player.isFlying &&
        !(player.lastExplosionTime && now - player.lastExplosionTime < 1000) &&
        !(player.threwTridentAt && now - player.threwTridentAt < 2500) &&
        !(player.lastApplyDamage && now - player.lastApplyDamage < 250)
    ) {
        if (!config.slient) teleportMagic(player, safePos);
        if (lastflag && now - lastflag < 5000 && !isISL(player)) {
            if (Math.abs(y) < 1.75) {
                flag(player, "NoClip", "B", config.antiNoClip.maxVL, config.antiNoClip.punishment, ["velocityXZ" + ":" + movementClip.toFixed(2)]);
            } else if (!player.hasTag(AnimationControllerTags.riding)) {
                flag(player, "NoClip", "C", config.antiNoClip.maxVL, config.antiNoClip.punishment, ["velocityXZ" + ":" + movementClip.toFixed(2)]);
            }
        }
        data.lastFlag = now;
    }
    player.beforeClip = player.backClip;
    player.backClip = player.lastClip;
    player.lastClip = movementClip;
    const { x: x1, y: y1, z: z1 } = player.getHeadLocation();
    const { x: x2, y: y2, z: z2 } = player.location;
    const floorHead = { x: Math.floor(x1), y: Math.floor(y1), z: Math.floor(z1) };
    const floorBody = { x: Math.floor(x2), y: Math.floor(y2), z: Math.floor(z2) };
    const inSolid = isSolidBlock(player.dimension.getBlock(floorHead)) || !player.dimension.getBlock(floorBody).isAir;
    if (!inSolid) {
        data.safeLocation = player.location;
        player.lastSafePos = safePos;
    }

    noclipdata.set(player.id, data);
}

const playerBreakBlock = ({ player, block: { isSolid } }: PlayerBreakBlockAfterEvent) => isSolid && (player.lastBreakSolid = Date.now());

const entityHurt = ({ hurtEntity: player }: EntityHurtAfterEvent) => ((player as Player).lastApplyDamage = Date.now());

registerModule(
    "antiNoClip",
    false,
    [noclipdata],
    {
        tickInterval: 1,
        playerOption: { excludeGameModes: [GameMode.spectator, GameMode.creative] },
        intick: async (config, player) => AntiNoClip(player, config, Date.now()),
    },
    {
        worldSignal: world.afterEvents.entityHurt,
        playerOption: { entityTypes: ["player"] },
        then: async (_config, event) => entityHurt(event as EntityHurtAfterEvent),
    },
    {
        worldSignal: world.afterEvents.playerBreakBlock,
        then: async (_config, event) => playerBreakBlock(event as PlayerBreakBlockAfterEvent),
    }
);

// Anti teleport bypass
function teleportMagic (player: Player, location: Vector3) {
    let i = 0;
    location.x = Math.floor(location.x) + 0.5;
    location.z = Math.floor(location.z) + 0.5;
    const id = system.runInterval(() => {
        player.teleport(location, {
            rotation: player.getRotation(),
        });
        if (i > 7) {
            system.clearRun(id);
        }
        i++;
    }, 1);
}