import { EquipmentSlot, Player } from "@minecraft/server";
import { MinecraftItemTypes } from "@minecraft/vanilla-data";
import { registerModule } from "../Modules";

const antiOffHandData = new Map<string, string[]>();
function antiOffhand(player: Player) {
    const lastArmorShot: string[] = antiOffHandData.get(player.id) ?? new Array(20).fill("minecraft:air");
    const armorShot = player.getComponent("equippable")?.getEquipment(EquipmentSlot.Offhand) ?? { typeId: "minecraft:air" };
    lastArmorShot.shift();
    lastArmorShot.push(armorShot.typeId);
    if (armorShot.typeId != MinecraftItemTypes.Shield && armorShot.typeId != MinecraftItemTypes.TotemOfUndying) {
        antiOffHandData.set(player.id, lastArmorShot);
        return;
    }
    onPlayerEquip;
}

function onPlayerEquip(_player: Player) {}

registerModule("antiOffHand", false, [], {
    tickInterval: 1,
    intick: async (_config, player) => {
        antiOffhand(player);
    },
});
