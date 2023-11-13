import {
    world,
    system,
    Block,
    Vector3,
    GameMode,
    Player
} from "@minecraft/server";
import { flag, isAdmin } from "../../Assets/Util";
import config from "../../Data/Config";
import { MinecraftBlockTypes } from "../../node_modules/@minecraft/vanilla-data/lib/index";

class PhaseData {
    lastPos: Vector3;
    lastSafePos: Vector3;
    lastSolid: boolean;
};

const phaseData: Map<string, PhaseData> = new Map<string, PhaseData>();
const passableBlocks = new Set([MinecraftBlockTypes.Sand, MinecraftBlockTypes.Gravel]);
const isSolidBlock = (block: Block) => Boolean(block?.isSolid && !passableBlocks.has(block.typeId as MinecraftBlockTypes) && !block.typeId.endsWith('_powder'));

/**
 * @author ravriv & jasonlaubb
 * @description This is a simple phase detector, it will detect if the player is inside a block
 */

async function antiPhase (player: Player) {
    const { id, location, dimension } = player;
    const { x, y, z } = location;
    const floorPos: Vector3 = { x: Math.floor(x), y: Math.floor(y), z: Math.floor(z) };
    const data: PhaseData = phaseData.get(id) || { lastPos: floorPos, lastSafePos: floorPos, lastSolid: false };

    const headBlock: Block = dimension.getBlock({ x: floorPos.x, y: floorPos.y + 1, z: floorPos.z });
    const bodyBlock: Block = dimension.getBlock(floorPos);

    const isSolid: boolean = isSolidBlock(bodyBlock) && isSolidBlock(headBlock);

    if (!isSolid) {
        data.lastSafePos = floorPos;
    }

    data.lastPos = floorPos;
    data.lastSolid = isSolid;

    if (data.lastSolid && isSolid) {
        if(bodyBlock.typeId === MinecraftBlockTypes.SoulSand && headBlock.isSolid == false) return
        flag (player, 'Phase', config.antiPhase.punishment, undefined)
        player.teleport(data.lastSafePos);
    }

    phaseData.set(id, data);
}

system.runInterval(() => {
    const toggle: boolean = (world.getDynamicProperty("antiPhase") ?? config.antiPhase.enabled) as boolean;
    if (toggle !== true) return;
    
    for (const player of world.getPlayers({ excludeGameModes: [GameMode.creative, GameMode.spectator] })) {
        if (isAdmin (player)) continue;

        antiPhase (player);
    }
}, 20);

world.afterEvents.playerLeave.subscribe(event => {
    const playerName: string = event.playerId;
    phaseData.delete(playerName);
});
