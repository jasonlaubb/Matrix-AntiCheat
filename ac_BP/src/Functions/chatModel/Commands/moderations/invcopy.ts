import { registerCommand, isPlayer, verifier } from "../../CommandHandler";
import { c, rawstr } from "../../../../Assets/Util";
import { ItemStack, EntityInventoryComponent, EntityEquippableComponent, EquipmentSlot } from "@minecraft/server";

registerCommand({
    name: "invcopy",
    description: "Copy a player's inventory to yourself",
    parent: false,
    maxArgs: 1,
    minArgs: 1,
    argRequire: [(value) => !!isPlayer(value as string, true, false)],
    require: (player) => verifier(player, c().commands.invcopy),
    executor: async (player, args) => {
        const target = isPlayer(args[0]);
        
        const inputInv = target.getComponent(EntityInventoryComponent.componentId).container;
        const outputInv = player.getComponent(EntityInventoryComponent.componentId).container;

        for (let i = 0; i < inputInv.size; i++) {
            const item: ItemStack | undefined = inputInv.getItem(i);

            outputInv.setItem(i, item);
        }

        const equupments = player.getComponent(EntityEquippableComponent.componentId) as EntityEquippableComponent;
        for (const slot in EquipmentSlot) {
            equupments.setEquipment(slot as EquipmentSlot, equupments.getEquipment(slot as EquipmentSlot));
        }

        player.sendMessage(new rawstr(true, "g").tra("invcopy.not").parse());
    },
});