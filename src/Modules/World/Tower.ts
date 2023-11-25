import { world, system, Player, Block, Vector3 } from "@minecraft/server";
import { flag, isAdmin } from "../../Assets/Util";
import { MinecraftBlockTypes, MinecraftEffectTypes } from "../../node_modules/@minecraft/vanilla-data/lib/index";
import config from "../../Data/Config";
import lang from "../../Data/Languages/lang";

interface TowerData {
    towerBlock: Vector3;
    lastBlockPlace: number;
}

const towerData = new Map<string, TowerData>();

/**
 * @author jasonlaubb
 * @description A anti tower module that can detect tower-hack with a very low false positive rate
 * It work by patching a very small delay between player towering and with a high velocity
 */

async function antiTower(player: Player, block: Block) {
    const data = towerData.get(player.id)
    //get the two value from Map
    const towerBlock = data?.towerBlock
    const lastTime = data?.lastBlockPlace

    //set the value to Map
    towerData.set(player.id, { towerBlock: block.location, lastBlockPlace: Date.now() });

    //skip check for first block place
    if (data === undefined) return;

    //prevent false positive and disable check when player has tag
    if (player.hasTag("matrix:place-disabled") || player.isOnGround || !player.isJumping || player.isFlying || player.isInWater || player.getEffect(MinecraftEffectTypes.JumpBoost)) return;
    
    const { x, y, z }: Vector3 = block.location;

    //check the block has the same position as the tower block horizontally
    const towerNearBlock: boolean = x === towerBlock.x && z === towerBlock.z;

    //calulate the distance between player and the centre of block
    const playerCentreDis: number = Math.hypot(player.location.x - x + 0.5, player.location.z - z + 0.5);

    //check if player is pushed out when towering
    const playerNearBlock: boolean = playerCentreDis > 0.41 && playerCentreDis < 2.5;

    //calculate the Y pos deff between player and the tower block
    const playerPosDeff: number = player.location.y - y;

    //check if player is towering
    const playerTowering: boolean = playerPosDeff < 0.4 && y - towerBlock.y == 1;

    //check if all state is true
    const locationState: boolean = playerTowering && towerNearBlock && playerNearBlock;

    //calculate the delay between last block placed and current block placed
    const delay: number = Date.now() - lastTime;

    //if delay is less than the min delay and all state is true, flag the player
    if (delay < config.antiTower.minDelay && locationState) {

        //set the block to the air
        block.setType(MinecraftBlockTypes.Air);

        //stop player place block
        player.addTag("matrix:place-disabled");

        //remove the tag after timeout
        system.runTimeout(() => player.removeTag("matrix:place-disabled"), config.antiTower.timeout);
        flag(player, "Tower", "A", config.antiTower.maxVL, config.antiTower.punishment, [lang(">Delay") + ":" + delay.toFixed(2), lang(">PosDeff") + ":" + playerPosDeff.toFixed(2), lang(">CentreDis") + ":" + playerCentreDis.toFixed(2)]);
    }
}
world.afterEvents.playerPlaceBlock.subscribe(({ player, block }) => {
    const toggle: boolean = (world.getDynamicProperty("antiTower") as boolean ?? config.antiTower.enabled);
    if (toggle !== true || isAdmin(player)) return;
    antiTower(player, block);
});
world.afterEvents.playerLeave.subscribe(({ playerId }) => {
    towerData.delete(playerId);
});