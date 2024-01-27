import { EntityEquippableComponent, EquipmentSlot, ItemDurabilityComponent, PlayerSpawnAfterEvent, system, world } from "@minecraft/server"
import { isAdmin, c, flag } from "../../Assets/Util"
import { MinecraftItemTypes } from "../../node_modules/@minecraft/vanilla-data/lib/index"

/**
 * @author jasonlaubb
 * @description Detect if player try to use disabler to bypass anti-cheat
 * Thanks for RaMi helps to test!
 */

let id: number
export default {
    enable () {
        id = system.runInterval(antiDisabler)
        world.afterEvents.playerSpawn.subscribe(playerSpawn)
    },
    disable () {
        system.clearRun(id)
        world.afterEvents.playerSpawn.unsubscribe(playerSpawn)
    }
}

const antiDisabler = () => {
    const players = world.getAllPlayers()
    for (const player of players) {
        if (isAdmin(player) || !player.isGliding || player.hasTag("matrix:disabler-patched")) continue
        const elytra = player.getComponent(EntityEquippableComponent.componentId)!?.getEquipment(EquipmentSlot.Chest)!
        const durability = elytra?.getComponent(ItemDurabilityComponent.componentId)
        if (elytra.typeId != MinecraftItemTypes.Elytra || (elytra.typeId == MinecraftItemTypes.Elytra && durability.maxDurability - durability.damage <= 1)) {
            const config = c()
            player.addTag("matrix:disabler-patched")
            system.runTimeout(() => player.removeTag("matrix:disabler-patched"), 500)
            flag(player, "Disabler", "A", config.antiDisabler.maxVL, config.antiDisabler.punishment, undefined)
        }
    }
}

const playerSpawn = ({ player, initialSpawn }: PlayerSpawnAfterEvent) => {
    if (!initialSpawn) return
    player.removeTag("matrix:disabler-patched")
}