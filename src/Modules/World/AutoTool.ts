import { world, system, EntityHitBlockAfterEvent, Player, EntityInventoryComponent } from "@minecraft/server";
import { flag, isAdmin } from "../../Assets/Util";
import { registerModule, configi } from "../Modules.js";

/**
 * @author jasonlaubb
 * @description A simple check to caught slient autotool hacker
 */

function doubleEvent(config: configi, { damagingEntity: player }: EntityHitBlockAfterEvent) {
    if (!(player instanceof Player) || isAdmin(player) || !player.lastSelectSlot) return;
    const itemStack = player.getComponent(EntityInventoryComponent.componentId).container.getItem(player.selectedSlotIndex)?.typeId ?? "air";
    if (config.antiAutoTool.toolType.some((eit) => itemStack.endsWith(eit)) == false) return;

    if (player.lastSelectSlot != player.selectedSlotIndex) {
        player.applyDamage(4);
        flag(player, "Auto Tool", "A", config.antiAutoTool.maxVL, config.antiAutoTool.punishment, undefined);
    }
};

function intickEvent(config: configi, player: Player) {
    if (isAdmin(player)) continue;
    const selectSlot = player.selectedSlotIndex;
    system.run(() => (player.lastSelectSlot = selectSlot));
};

registerModule("antiAutoTool", false, [], 
    {
        intick: async (config, player) => intickEvent(config, player),
        tickInterval: 1,
    },
    {
        worldSignal: world.afterEvents.entityHitBlock,
        playerOption: { entityTypes: ["minecraft:player"] },
        then: async (config, event: EntityHitBlockAfterEvent) => {
            doubleEvent(config, event);
        },
    }
);
