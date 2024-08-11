import { world, Block, Vector3, Player, EntityHurtAfterEvent, PlayerBreakBlockAfterEvent, PlayerPlaceBlockAfterEvent, GameMode, system } from "@minecraft/server";
import { bypassMovementCheck, flag } from "../../Assets/Util";
import { MinecraftBlockTypes } from "../../node_modules/@minecraft/vanilla-data/lib/index";
import { configi, registerModule } from "../Modules";
import { isSpikeLagging } from "../../Assets/Public";
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
    const skipLocations = straight(data.lastLocation, player.location);
    const skipMaterials = skipLocations.map((loc) => player.dimension.getBlock(loc));
    const phaseIndex: number = skipMaterials.findIndex((block) => block?.isValid() && isSolidBlock(block!));
    if (
        !bypassMovementCheck(player) &&
        data.lastLocation &&
        movementClip > 1.2 &&
        !player.isGliding &&
        !(player.lastBreakSolid && now - player.lastBreakSolid < 1750) &&
        Math.abs(y) < 1.7 &&
        !passableBlocks.includes(bodyBlock) &&
        !powderBlock.includes(bodyBlock) &&
        phaseIndex != -1
    ) {
        const lastflag = data.lastFlag2;
        freezeTeleport(player, data.safeLocation);
        if (lastflag && now - lastflag < 5000 && !isSpikeLagging(player)) {
            const skipMaterial = skipMaterials[phaseIndex]!.typeId!;
            flag(player, "NoClip", "A", config.antiNoClip.maxVL, config.antiNoClip.punishment, ["SkipMaterial:" + skipMaterial]);
        }
        data.lastFlag2 = now;
    }
    data.lastLocation = player.location;

    /*     emmm     */
    const safePos = data.safeLocation;
    const lastflag = data.lastFlag;
    if (
        !bypassMovementCheck(player) &&
        player?.lastSafePos &&
        safePos &&
        player?.lastClip &&
        player?.backClip &&
        player?.beforeClip &&
        ((movementClip < 0.25 && player?.lastClip > config.antiNoClip.clipMove && player?.backClip < 0.25) || (player.lastClip == player.backClip && player.backClip > config.antiNoClip.clipMove && movementClip < 0.25 && player.beforeClip < 0.25)) &&
        !player.isGliding &&
        !player.isFlying &&
        !(player.lastExplosionTime && now - player.lastExplosionTime < 1000) &&
        !(player.threwTridentAt && now - player.threwTridentAt < 2500) &&
        !(player.lastApplyDamage && now - player.lastApplyDamage < 250) &&
        !isSpikeLagging(player)
    ) {
        const isClientLagging = delayPlacementCheck(player);
        freezeTeleport(player, safePos);
        if (!isClientLagging) {
            if (lastflag && now - lastflag < 20000) {
                const trueOnGround = Math.abs(y) < 1.75 && player.isJumping;
                const staticOnGround = y == 0 && player.isOnGround;
                if (trueOnGround || staticOnGround) {
                    if (!player.lastBreakSolid || now - player.lastBreakSolid > 5000) {
                        flag(player, "NoClip", "B", config.antiNoClip.maxVL, config.antiNoClip.punishment, ["MovementClip:" + Math.max(player.lastClip, player.backClip, movementClip).toFixed(2)]);
                    }
                } else if (!player.hasTag(AnimationControllerTags.riding)) {
                    flag(player, "NoClip", "C", config.antiNoClip.maxVL, config.antiNoClip.punishment, ["MovementClip:" + Math.max(player.lastClip, player.backClip, movementClip).toFixed(2)]);
                }
            }
            data.lastFlag = now;
        }
    }
    player.beforeClip = player.backClip;
    player.backClip = player.lastClip;
    player.lastClip = movementClip;
    const { x: x1, y: y1, z: z1 } = player.getHeadLocation();
    const { x: x2, y: y2, z: z2 } = player.location;
    const floorHead = { x: Math.floor(x1), y: Math.floor(y1), z: Math.floor(z1) };
    const floorBody = { x: Math.floor(x2), y: Math.floor(y2), z: Math.floor(z2) };
    try {
        const inSolid = isSolidBlock(player.dimension.getBlock(floorHead)!) || !player.dimension.getBlock(floorBody!)?.isAir;
        if (!inSolid) {
            data.safeLocation = player.location;
            player.lastSafePos = safePos;
        }
    } catch {}

    noclipdata.set(player.id, data);
}
function onServerBlockDestroy({ player, block: { isSolid } }: PlayerBreakBlockAfterEvent) {
    if (!isSolid) return;
    player.lastBreakSolid = Date.now();
}
let blockPlacementLog: PlaceLog[] = [];
function onServerBlockPlace({ player: { id }, block: { location, isSolid } }: PlayerPlaceBlockAfterEvent) {
    if (!isSolid) return;
    const now = Date.now();
    blockPlacementLog = blockPlacementLog.filter(({ time }) => now - time < 12000);
    blockPlacementLog.push({
        time: now,
        location: location,
        placeId: id,
    } as PlaceLog);
}
function delayPlacementCheck({ location, id }: Player) {
    if (blockPlacementLog.length == 0) return false;
    const { x: x1, z: z1 } = location;
    return blockPlacementLog.some(({ location: { x, z }, placeId }) => {
        const distance = Math.hypot(x1 - x, z1 - z);
        return id != placeId && distance < 5;
    });
}
interface PlaceLog {
    time: number;
    location: Vector3;
    placeId: string;
}
const entityHurt = ({ hurtEntity: player }: EntityHurtAfterEvent) => ((player as Player).lastApplyDamage = Date.now());

registerModule(
    "antiNoClip",
    false,
    [noclipdata],
    {
        tickInterval: 1,
        tickOption: { excludeGameModes: [GameMode.spectator, GameMode.creative] },
        intick: async (config, player) => AntiNoClip(player, config, Date.now()),
    },
    {
        worldSignal: world.afterEvents.entityHurt,
        playerOption: { entityTypes: ["player"] },
        then: async (_config, event) => entityHurt(event as EntityHurtAfterEvent),
    },
    {
        worldSignal: world.afterEvents.playerBreakBlock,
        then: async (_config, event) => onServerBlockDestroy(event as PlayerBreakBlockAfterEvent),
    },
    {
        worldSignal: world.afterEvents.playerPlaceBlock,
        then: async (_config, event) => onServerBlockPlace(event as PlayerPlaceBlockAfterEvent),
    }
);

// Anti teleport bypass
export function freezeTeleport(player: Player, location: Vector3) {
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
