import { EffectAddBeforeEvent, EquipmentSlot, Player, world } from "@minecraft/server";
import { addCheckInterval, removeCheckInterval } from "../util/tick"

export default {
    property: "antiInvalidSprintEnable",
    enable: () => {
        addCheckInterval(tickEvent);
        world.beforeEvents.effectAdd.subscribe(effectAdd);
    },
    disable: () => {
        removeCheckInterval(tickEvent);
        world.beforeEvents.effectAdd.unsubscribe(effectAdd);
    }
}
function tickEvent (player: Player) {
    if (!player.isSprinting || player.isFlying) return;
    const now = Date.now();
    if (player.getEffect("minecraft:blindness") && player.invalidSprintBlindAt && now - player.invalidSprintBlindAt > 500) {
        player.flag("InvalidSprint", "A", "Movement", { blindDuration: now - player.invalidSprintBlindAt });
    }
    if (player.isSneaking) player.flag("InvalidSprint", "B", "Movement");
    const hunger = player.getComponent("player.hunger");
    // According to wiki, player cannot sprint when hunger value reached 6
    if (hunger && hunger.currentValue <= 6) {
        player.flag("InvalidSprint", "C", "Movement", { delay: now - player.invalidSprintBlindAt });
    }
    if (player.itemStartUse && now - player.itemStartUse > 200) {
        const heldItem = player.getComponent("equippable")!.getEquipment(EquipmentSlot.Mainhand);
        if (heldItem && heldItem.typeId.startsWith("minecraft:")) {
            if (["minecraft:bow", "minecraft:cross_bow"].includes(heldItem.typeId)) {
                player.flag("InvalidSprint", "E", "Movement", { useDuration: now - player.itemStartUse });
            } else if (["minecraft:milk_bucket", "minecraft:potion"].includes(heldItem.typeId) || heldItem.getComponent("food")) {
                if (now - player.itemStartUse < 1400) player.flag("InvalidSprint", "F", "Movement", { useDuration: now - player.itemStartUse });
            }
        }
    }
}
function effectAdd ({ entity, effectType }: EffectAddBeforeEvent) {
    if (effectType !== "minecraft:blindness" || !(entity instanceof Player) || entity.getEffect("minecraft:blindness")) return;
    entity.invalidSprintBlindAt = Date.now();
}