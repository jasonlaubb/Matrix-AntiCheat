import { world, system, PlayerPlaceBlockBeforeEvent, EntityEquippableComponent, EquipmentSlot, ItemUseOnBeforeEvent } from "@minecraft/server";
import { flag, isAdmin } from "../../Assets/Util";
import { registerModule, configi } from "../Modules.js";

/**
 * @author jasonlaubb
 * @description flag player nears command block minecart.
 */

function firstEvent(config: configi, event: PlayerPlaceBlockBeforeEvent) {
    const { player, permutationBeingPlaced: permutation } = event;
    if (isAdmin(player) || !permutation) return;
    if (config.antiCommandBlockExplolit.cancelPlacement.includes(permutation.type.id)) {
        event.cancel = true;
        system.run(() => {
            player.getComponent(EntityEquippableComponent.componentId).setEquipment(EquipmentSlot.Mainhand); // bye bye item
            flag(player, "Command Block Explolit", "A", config.antiCommandBlockExplolit.maxVL, config.antiCommandBlockExplolit.punishment, ["Block" + ":" + permutation.type.id]);
        });
    }
}

function doubleEvent(config: configi, event: ItemUseOnBeforeEvent) {
    const { source: player, itemStack } = event;
    if (isAdmin(player)) return;
    if (config.antiCommandBlockExplolit.cancelUsage.includes(itemStack?.typeId)) {
        event.cancel = true;
        system.run(() => {
            player.getComponent(EntityEquippableComponent.componentId).setEquipment(EquipmentSlot.Mainhand); // bye bye item
            flag(player, "Command Block Explolit", "B", config.antiCommandBlockExplolit.maxVL, config.antiCommandBlockExplolit.punishment, ["Block" + ":" + itemStack.typeId]);
        });
    }
}

registerModule(
    "antiCBE",
    false,
    [],
    {
        worldSignal: world.beforeEvents.playerPlaceBlock,
        playerOption: { entityTypes: ["minecraft:player"] },
        then: async (config, event: PlayerPlaceBlockBeforeEvent) => {
            firstEvent(config, event);
        },
    },
    {
        worldSignal: world.beforeEvents.itemUseOn,
        playerOption: { entityTypes: ["minecraft:player"] },
        then: async (config, event: ItemUseOnBeforeEvent) => {
            doubleEvent(config, event);
        },
    }
);
