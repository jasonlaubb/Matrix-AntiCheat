import { world, Block, Vector3, Player, PlayerBreakBlockAfterEvent, PlayerPlaceBlockAfterEvent, GameMode } from "@minecraft/server";
import { bypassMovementCheck } from "../../Assets/Util";
import { MinecraftBlockTypes, MinecraftEffectTypes } from "../../node_modules/@minecraft/vanilla-data/lib/index";
import { configi, registerModule } from "../Modules";
import { isSpikeLagging } from "../../Assets/Public";
import flag from "../../Assets/flag";

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

interface PhaseData {
    safeLocation: Vector3;
    lastLocation: Vector3;
    lastHighTeleport: number;
    lastFlag: number;
}
const phasedata = new Map<string, PhaseData>();
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

async function AntiPhase(player: Player, config: configi, now: number) {
    const data = phasedata.get(player.id) ?? {
        lastLocation: player.location,
        safeLocation: player.location,
        lastFlag: 0,
        lastFlag2: 0,
        lastHighTeleport: 0,
    };
    const { x, y, z }: Vector3 = player.getVelocity();
    const movementClip = Math.hypot(x, z);
    const bodyBlock = player.dimension.getBlock({ x: Math.floor(player.location.x), y: Math.floor(player.location.y), z: Math.floor(player.location.z) })?.typeId as MinecraftBlockTypes;
    const skipLocations = straight(data.lastLocation, player.location);
    const skipMaterials = skipLocations.map((loc) => player.dimension.getBlock(loc));
    const phaseIndex: number = skipMaterials.findIndex((block) => block?.isValid() && isSolidBlock(block!));
    const isClientLagging = delayPlacementCheck(player);
    const absY = Math.abs(y);
    if (
        !bypassMovementCheck(player) &&
        !isClientLagging &&
        data.lastLocation &&
        movementClip > config.antiPhase.minSpeed &&
        !player.isGliding &&
        !(player.lastBreakSolid && now - player.lastBreakSolid < config.antiPhase.breakSolidBypass) &&
        absY < 1.7 &&
        movementClip > absY &&
        !(player.lastExplosionTime && now - player.lastExplosionTime < 2000) &&
        !passableBlocks.includes(bodyBlock) &&
        !powderBlock.includes(bodyBlock) &&
        phaseIndex != -1 &&
        !isNearWall(player) &&
        (player.getEffect(MinecraftEffectTypes.Speed)?.amplifier ?? 0) <= 2
    ) {
        const lastflag = data.lastFlag;
        player.teleport(data.safeLocation);
        if (lastflag && now - lastflag < 5000 && !isSpikeLagging(player)) {
            //const skipMaterial = skipMaterials[phaseIndex]!.typeId!;
            flag(player, config.antiPhase.modules, "A");
        }
        data.lastFlag = now;
    }
    const safePos = data.safeLocation;
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

    phasedata.set(player.id, data);
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
function isNearWall({ location: { x, z } }: Player) {
    const floatX = x - Math.trunc(x);
    const floatZ = z - Math.trunc(z);
    return floatX == 0.7 || floatX == 0.3 || floatZ == 0.7 || floatZ == 0.3;
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
registerModule(
    "antiPhase",
    false,
    [phasedata],
    {
        tickInterval: 1,
        tickOption: { excludeGameModes: [GameMode.spectator, GameMode.creative] },
        intick: async (config, player) => AntiPhase(player, config, Date.now()),
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
