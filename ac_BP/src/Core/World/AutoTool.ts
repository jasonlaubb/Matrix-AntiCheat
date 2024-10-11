import { world, system, EntityHitBlockAfterEvent, Player, EntityInventoryComponent } from "@minecraft/server";
import { isAdmin } from "../../Assets/Util";
import { registerModule, configi } from "../Modules.js";
import flag from "../../Assets/flag";
/**
 * @author jasonlaubb
 * @description A simple check to caught slient autotool hacker
 */

function doubleEvent(config: configi, { damagingEntity: player }: EntityHitBlockAfterEvent) {
    if (!(player instanceof Player) || !player.lastSelectSlot || isAdmin(player)) return;
    const itemStack = player.getComponent(EntityInventoryComponent.componentId)?.container?.getItem(player.selectedSlotIndex)?.typeId ?? "air";
    if (config.antiAutoTool.toolType.some((eit) => itemStack.endsWith(eit)) == false) return;

    if (player.lastSelectSlot != player.selectedSlotIndex) {
        player.applyDamage(4);
        flag(player, config.antiAutoTool.modules, "A");
    }
}

function intickEvent(player: Player) {
    const selectSlot = player.selectedSlotIndex;
    system.run(() => (player.lastSelectSlot = selectSlot));
}

registerModule(
    "antiAutoTool",
    false,
    [],
    {
        intick: async (_config, player) => intickEvent(player),
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
