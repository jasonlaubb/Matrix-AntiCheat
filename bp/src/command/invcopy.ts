import { EquipmentSlot, system, type Player } from "@minecraft/server";
import type { Command } from "../main";
import english from "../data/languages/english";
import { text } from "../util/text";
export default {
    name: "invcopy",
    description: english.commandInvCopyDescription,
    requireOp: true,
    translationDef: {
        actionName: "commandInvCopy",
        description: "commandInvCopyDescription",
        param: ["commandInvCopyTarget"]
    },
    parameters: [
        { name: "player", type: "normalPlayerTarget" },
    ],
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
            [EquipmentSlot.Head, EquipmentSlot.Chest, EquipmentSlot.Legs, EquipmentSlot.Feet, EquipmentSlot.Offhand].forEach((slot) =>
                toEquip.setEquipment(slot, fromEquip.getEquipment(slot))
            );
        });

        return {
            status: 0,
            message: "§7[§aMatrix§7] §f" + text("commandInvCopySuccess", target.name)
        };
    },
} as Command;