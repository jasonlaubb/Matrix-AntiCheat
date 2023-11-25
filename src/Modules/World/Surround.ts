import {
    Block,
    Player,
    Vector3,
    system,
    world
} from "@minecraft/server";
import { flag, isAdmin } from "../../Assets/Util";
import config from "../../Data/Config";
import { MinecraftBlockTypes } from "../../node_modules/@minecraft/vanilla-data/lib/index";
import lang from "../../Data/Languages/lang";

const blockPlaceData = new Map<string, number[]>();

/**
 * @author jasonlaubb
 * @description This checks if a player is using Surrond in Minecraft Bedrock.
 * it detects if a player place more than 4 blocks in 2 tick.
 */

async function antiSurround (player: Player, block: Block) {
    if (player.hasTag("matrix:place-disabled")) {
        return;
    }
    
    const timeNow = Date.now();

    //get the block place count in the 2 tick
    let blockPlaceCount: number[] = blockPlaceData.get(player.id)?.filter(time => timeNow - time < 100) ?? [];

    const floorPos = {
        x: Math.floor(player.location.x),
        y: Math.floor(player.location.y),
        z: Math.floor(player.location.z)
    } as Vector3

    //calulate the deff between player and the block
    const xDeff = Math.abs(floorPos.x - block.location.x)
    const zDeff = Math.abs(floorPos.z - block.location.z)
    const yChange = floorPos.y - block.location.y

    //check if the block is obsidian and the deff is less than 1, than push the block right now
    if (block.typeId === MinecraftBlockTypes.Obsidian && xDeff <= 1 && zDeff <= 1 && floorPos.y === block.location.y && yChange <= 2 && yChange >= -1) {
        blockPlaceCount.push(timeNow);
    };

    blockPlaceData.set(player.id, blockPlaceCount);

    //if block place is in 2 tick is higher than the limit, flag them
    if (blockPlaceCount.length > config.antiSurrond.maxBlocksPer2Tick) {
        block.setType(MinecraftBlockTypes.Air)

        //prevent the player from placing blocks for 5 seconds
        system.runTimeout(() => player.removeTag("matrix:place-disabled"), config.antiSurrond.timeout);

        blockPlaceData.delete(player.id);
        flag(player, "Surround", "A", config.antiSurrond.maxVL,config.antiSurrond.punishment, [lang(">Block") + ":" + block.typeId]);
    }
}

world.afterEvents.playerPlaceBlock.subscribe((event) => {
    const toggle: boolean = (world.getDynamicProperty("antiSurround") ?? config.antiSurrond.enabled) as boolean;
    if (toggle !== true) return;

    const { player, block } = event;
    if (isAdmin (player)) return;

    antiSurround (player, block)
});