import { EffectAddBeforeEvent, EquipmentSlot, Player, system, world } from "@minecraft/server";
import { addCheckInterval, removeCheckInterval } from "../util/tick";

export default {
    property: "antiInvalidSprintEnable",
    enable: () => {
        addCheckInterval(tickEvent);
        world.beforeEvents.effectAdd.subscribe(effectAdd);
    },
    disable: () => {
        removeCheckInterval(tickEvent);
        world.beforeEvents.effectAdd.unsubscribe(effectAdd);
    },
};
function tickEvent(player: Player) {
    if (!player.isSprinting || player.isFlying) return;
    const now = Date.now();
    if (player.getEffect("minecraft:blindness") && player.invalidSprintBlindAt && now - player.invalidSprintBlindAt > 500) {
        player.flag("InvalidSprint", "A", "Movement", { blindDuration: now - player.invalidSprintBlindAt });
    }
    if (player.isSneaking) player.flag("InvalidSprint", "B", "Movement");
    const hunger = player.getComponent("player.hunger");
    // According to wiki, player cannot sprint when hunger value reached 6
    if (hunger && hunger.currentValue <= 6) {
        player.flag("InvalidSprint", "C", "Movement");
    }
    const useDuration = player.itemStartUse && now - player.itemStartUse;
    if (useDuration) {
        const heldItem = player.getComponent("equippable")!.getEquipment(EquipmentSlot.Mainhand);
        if (heldItem && heldItem.typeId.startsWith("minecraft:")) {
            if (["minecraft:bow", "minecraft:cross_bow"].includes(heldItem.typeId)) {
                system.runTimeout(() => {
                    if (!player.invalidSprintStopUseAt || now - player.invalidSprintStopUseAt >= 200) player.flag("InvalidSprint", "F", "Movement", { useDuration });
                }, 4);
            } else if (["minecraft:milk_bucket", "minecraft:potion"].includes(heldItem.typeId) || heldItem.getComponent("food")) {
                if (useDuration < 1400) {
                    system.runTimeout(() => {
                        if (!player.invalidSprintStopUseAt || now - player.invalidSprintStopUseAt >= 200) player.flag("InvalidSprint", "F", "Movement", { useDuration });
                    }, 4);
                }
            }
        }
    }
}
function effectAdd({ entity, effectType }: EffectAddBeforeEvent) {
    if (effectType !== "minecraft:blindness" || !(entity instanceof Player) || entity.getEffect("minecraft:blindness")) return;
    entity.invalidSprintBlindAt = Date.now();
}
