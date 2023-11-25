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
    //constant the infomation
    const { id, location, dimension } = player;
    const { x, y, z } = location;

    //get the floor pos (the block position)
    const floorPos: Vector3 = { x: Math.floor(x), y: Math.floor(y), z: Math.floor(z) };

    //get the last safe position
    const lastSafePos: Vector3 = phaseData.get(id) || floorPos

    //get the head block and the body block
    const headBlock: Block = dimension.getBlock({ x: floorPos.x, y: floorPos.y + 1, z: floorPos.z });
    const bodyBlock: Block = dimension.getBlock(floorPos);

    //check if the player is inside the block
    const isSolid: boolean = isSolidBlock(bodyBlock) && isSolidBlock(headBlock);

    //if the player is not inside the block, set the last safe position
    if (!isSolid) {
        phaseData.set(player.id, lastSafePos)

    //if the player is inside the block, flag them
    } else if (bodyBlock.typeId !== MinecraftBlockTypes.SoulSand) {
        flag (player, 'Phase', 'A',config.antiPhase.maxVL,config.antiPhase.punishment, undefined)
        player.teleport(lastSafePos);
    }

    phaseData.set(id, lastSafePos);
}

system.runInterval(() => {
    const toggle: boolean = (world.getDynamicProperty("antiPhase") ?? config.antiPhase.enabled) as boolean;
    if (toggle !== true) return;
    const players = world.getPlayers({ excludeGameModes: [GameMode.creative, GameMode.spectator] })
    for (const player of players) {
        if (isAdmin (player)) continue;

        antiPhase (player);
    }
}, 20);

world.afterEvents.playerLeave.subscribe(event => {
    const playerName: string = event.playerId;
    phaseData.delete(playerName);
});
