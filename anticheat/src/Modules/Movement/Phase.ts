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

const powderBlock: MinecraftBlockTypes[] = [
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
    MinecraftBlockTypes.WhiteConcretePowder
]

const phaseData: Map<string, Vector3> = new Map<string, Vector3>();
const passableBlocks = [
    MinecraftBlockTypes.Sand,
    MinecraftBlockTypes.Gravel
];

const isSolidBlock = (block: Block) => Boolean(block?.isSolid && !passableBlocks.includes(block.typeId as MinecraftBlockTypes) && !powderBlock.includes(block.typeId as MinecraftBlockTypes));

/**
 * @author ravriv & jasonlaubb
 * @description This is a simple phase detector, it will detect if the player is inside a block
 */

async function antiPhase (player: Player) {
    const { id, location, dimension } = player;
    const { x, y, z } = location;
    const floorPos: Vector3 = { x: Math.floor(x), y: Math.floor(y), z: Math.floor(z) };
    const lastSafePos: Vector3 = phaseData.get(id) || floorPos

    const headBlock: Block = dimension.getBlock({ x: floorPos.x, y: floorPos.y + 1, z: floorPos.z });
    const bodyBlock: Block = dimension.getBlock(floorPos);

    const isSolid: boolean = isSolidBlock(bodyBlock) && isSolidBlock(headBlock);

    if (!isSolid) {
        phaseData.set(player.id, lastSafePos)
    } else if (bodyBlock.typeId !== MinecraftBlockTypes.SoulSand) {
        flag (player, 'Phase', config.antiPhase.maxVL,config.antiPhase.punishment, undefined)
        player.teleport(lastSafePos);
    }

    phaseData.set(id, lastSafePos);
}

system.runInterval(() => {
    const toggle: boolean = (world.getDynamicProperty("antiPhase") ?? config.antiPhase.enabled) as boolean;
    if (toggle !== true) return;
    
    for (const player of world.getPlayers({ excludeGameModes: [GameMode.creative, GameMode.spectator] })) {
        if (isAdmin (player)) continue;

        antiPhase (player);
    }
}, 2);

world.afterEvents.playerLeave.subscribe(event => {
    const playerName: string = event.playerId;
    phaseData.delete(playerName);
});
