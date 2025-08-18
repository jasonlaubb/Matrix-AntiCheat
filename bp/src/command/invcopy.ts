import { EquipmentSlot, system, type Player } from "@minecraft/server";
import type { Command } from "../main";

export default {
    name: "invcopy",
    description: "Copy a player's inventory",
    parameters: [
        {
            name: "player",
            type: "normalPlayerTarget",
        },
    ],
    requireOp: true,
    execute: (player, [target]) => {
        const targetPlayer = target as Player;
        system.run(() => {
            const fromContainer = targetPlayer.getComponent("inventory")!.container!;
            const toContainer = player.getComponent("inventory")!.container!;
            for (let i = 0; i < 36; i++) {
                toContainer.setItem(i, fromContainer.getItem(i));
            }
            const fromEquip = targetPlayer.getComponent("equippable")!;
            const toEquip = player.getComponent("equippable")!;
            [EquipmentSlot.Head, EquipmentSlot.Chest, EquipmentSlot.Legs, EquipmentSlot.Feet, EquipmentSlot.Offhand].forEach((slot) => toEquip.setEquipment(slot, fromEquip.getEquipment(slot)));
        });
        return { status: 0, message: `§7[§aMatrix§7] §fCopied ${target.name}'s inventory` };
    },
} as Command;
