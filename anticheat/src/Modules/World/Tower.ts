import {
    world,
    Player,
    Block,
    Vector3,
    system
} from "@minecraft/server"
import { flag, isAdmin } from "../../Assets/Util";
import { MinecraftBlockTypes, MinecraftEffectTypes } from "../../node_modules/@minecraft/vanilla-data/lib/index";
import config from "../../Data/Config";

const towerData = new Map<string, Vector3>();
const lastBlockPlace = new Map<string, number>();

/**
 * @author jasonlaubb
 * @description A anti tower module that can detect tower-hack with a very low false positive rate
 * It work by patching a very small delay between player towering and with a high velocity
 */

async function antiTower (player: Player, block: Block) {
    const towerBlock = towerData.get(player.id)
    const lastTime = lastBlockPlace.get(player.id)

    towerData.set(player.id, block.location)
    lastBlockPlace.set(player.id, Date.now())

    if (!towerBlock || !lastTime) {
        return
    }

    if (player.hasTag("matrix:place-disabled") || !player.isJumping || player.isFlying || player.isInWater || player.getEffect(MinecraftEffectTypes.JumpBoost)) return

    const { x, y, z } = block.location;

    const nearBlock = Math.abs(x - towerBlock.x) <= 1 && Math.abs(z - towerBlock.z) <= 1
    const playerNearBlock = Math.abs(player.location.x - towerBlock.x) <= 1 && Math.abs(player.location.z - towerBlock.z) <= 1
    const playerPosDeff = Math.abs(player.location.y - y)
    const playerTowering = playerPosDeff < 0.5
    const locationState = playerTowering && nearBlock && playerNearBlock

    const delay = Date.now() - lastTime

    if (delay < config.antiTower.minDelay && locationState && y - towerBlock.y == 1) {
        block.setType(MinecraftBlockTypes.Air)
        player.addTag("matrix:place-disabled")
        system.runTimeout(() => player.removeTag("matrix:place-disabled"), config.antiTower.timeout)
        flag (player, "Tower", config.antiTower.maxVL, config.antiTower.punishment, ["Delay:" + delay.toFixed(2), "PosDeff:" + playerPosDeff.toFixed(2)])
    }
}

world.afterEvents.playerPlaceBlock.subscribe(({ player, block }) => {
    const toggle: boolean = (world.getDynamicProperty("antiTower") ?? config.antiTower.enabled) as boolean;
    if (toggle !== true) return;

    if (isAdmin(player)) return;

    antiTower (player, block)
})

world.afterEvents.playerLeave.subscribe(({ playerId }) => {
    towerData.delete(playerId)
    lastBlockPlace.delete(playerId)
})