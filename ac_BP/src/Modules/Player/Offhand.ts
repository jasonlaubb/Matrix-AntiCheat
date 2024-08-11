import { DataDrivenEntityTriggerAfterEvent, EquipmentSlot, Player, world } from "@minecraft/server";
import { configi, registerModule } from "../Modules";
import { isAdmin, isSpawning, Type, flag } from "../../Assets/Util";

const toFlagInfo = {
    "matrix:offhand_flag1": {
        set: "Moving",
        type: "A",
    },
    "matrix:offhand_flag2": {
        set: "Attacking",
        type: "B",
    },
    "matrix:offhand_flag3": {
        set: "ContainerOpened",
        type: "C",
    },
} as { [key: string]: OffHandToFlagInfo };
async function antiOffHand(config: configi, { entity: player, eventId }: DataDrivenEntityTriggerAfterEvent) {
    if (isAdmin(player as Player) || isSpawning(player as Player)) return;
    const { set, type } = toFlagInfo[eventId];
    const equipComp = player.getComponent("equippable")!;
    const armorSlot = equipComp.getEquipment(EquipmentSlot.Offhand);
    if (!armorSlot || (armorSlot.typeId != "minecraft:totem_of_undying" && armorSlot.typeId != "minecraft:shield")) return;
    flag(player as Player, "Offhand", type, config.antiOffhand.maxVL, config.antiOffhand.punishment, ["Type" + ":" + set]);
    if (config.antiOffhand.doUnEquip) {
        // Unequip the item
        equipComp.setEquipment(EquipmentSlot.Offhand);
        player.getComponent("inventory")!.container!.addItem(armorSlot);
    }
}

registerModule("antiOffhand", false, [], {
    worldSignal: world.afterEvents.dataDrivenEntityTrigger,
    playerOption: {
        entityTypes: ["minecraft:player"],
        eventTypes: ["matrix:offhand_flag1", "matrix:offhand_flag2", "matrix:offhand_flag3"],
    },
    then: antiOffHand,
});
interface OffHandToFlagInfo {
    set: string;
    type: Type;
}
