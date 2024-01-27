import { world, system, PlayerPlaceBlockBeforeEvent, EntityEquippableComponent, EquipmentSlot, ItemUseOnBeforeEvent } from "@minecraft/server";
import { c, flag, isAdmin } from "../../Assets/Util";
import lang from "../../Data/Languages/lang";

/**
 * @author jasonlaubb
 * @description flag player nears command block minecart.
 */

const blockPlace = (event: PlayerPlaceBlockBeforeEvent) => {
    const { player, itemStack } = event
    if (isAdmin(player)) return
    const config = c()
    if (config.antiCommandBlockExplolit.cancelPlacement.includes(itemStack.typeId)) {
        event.cancel = true
        system.run(() => {
            player.getComponent(EntityEquippableComponent.componentId).setEquipment(EquipmentSlot.Mainhand) // bye bye item
            flag (player, "Command Block Explolit", "A", config.antiCommandBlockExplolit.maxVL, config.antiCommandBlockExplolit.punishment, [lang(">Block") + ":" + itemStack.typeId])
        })
    }
}

const itemUse = (event: ItemUseOnBeforeEvent) => {
    const { source: player, itemStack } = event
    if (isAdmin(player)) return
    const config = c()
    if (config.antiCommandBlockExplolit.cancelUsage.includes(itemStack?.typeId)) {
        event.cancel = true
        system.run(() => {
            player.getComponent(EntityEquippableComponent.componentId).setEquipment(EquipmentSlot.Mainhand) // bye bye item
            flag (player, "Command Block Explolit", "B", config.antiCommandBlockExplolit.maxVL, config.antiCommandBlockExplolit.punishment, [lang(">Block") + ":" + itemStack.typeId])
        })
    }
}

export default {
    enable () {
        world.beforeEvents.playerPlaceBlock.subscribe(blockPlace)
        world.beforeEvents.itemUseOn.subscribe(itemUse)
    },
    disable () {
        world.beforeEvents.playerPlaceBlock.unsubscribe(blockPlace)
        world.beforeEvents.itemUseOn.unsubscribe(itemUse)
    }
}