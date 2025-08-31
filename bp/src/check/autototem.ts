import { EquipmentSlot, Player } from "@minecraft/server";
import { addCheckInterval, removeCheckInterval } from "../util/tick";
export default {
    enable() {
        addCheckInterval("autototem", tickEvent);
    },
    disable() {
        removeCheckInterval("autototem");
    },
    property: "antiAutototemEnable",
};
function tickEvent(player: Player) {
    if (player.isOp()) return;
    const offhand = player.getComponent("equippable")!.getEquipmentSlot(EquipmentSlot.Offhand);
    const hasItem = offhand.getItem();
    player.autototemLastItem ??= [true, true];
    if (hasItem) {
        if (!player.autototemLastItem[0]) {
            if (player.autototemLastItem[1]) {
                offhand.setItem();
                player.getComponent("inventory")!.container!.addItem(hasItem);
                player.flag("AutoTotem", "A", "Player", { item: hasItem.typeId }); // Wear totem in a tick
            } else {
                const { x, y } = player.inputInfo.getMovementVector();
                if (x !== 0 || y !== 0) {
                    offhand.setItem();
                    player.getComponent("inventory")!.container!.addItem(hasItem);
                    player.flag("AutoTotem", "B", "Player", { item: hasItem.typeId }); // Wear totem when they are moving
                }
            }
        }
    }
    player.autototemLastItem.unshift(!!hasItem);
    player.autototemLastItem.pop();
}
