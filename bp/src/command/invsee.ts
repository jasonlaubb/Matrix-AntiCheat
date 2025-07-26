import { Dimension, EquipmentSlot, ItemStack, Player, system, Vector3, world } from "@minecraft/server";
import { Command } from "../main";
/**
 * Places a large chest at the given location and fills it with optional items.
 * @param dimension The dimension to place the chest in (e.g., world.overworld)
 * @param location The starting BlockLocation for the large chest
 * @param items Optional array of ItemStacks to insert into the chest
 */
function createLargeChest(dimension: Dimension, location: Vector3, items: ItemStack[] = []) {
    const chest1 = location;
    const chest2 = { x: location.x + 1, y: location.y, z: location.z }; // Place second chest to the right

    // Place two chests side by side
    dimension.getBlock(chest1)!.setType("minecraft:chest");
    dimension.getBlock(chest2)!.setType("minecraft:chest");
    world.setDynamicProperty("invseeChest:" + stringXyz(chest1), chest2);
    world.setDynamicProperty("invseeChest:" + stringXyz(chest2), chest1);
    // Wait a tick to ensure they merge (optional if you're doing this in a tick-safe way)
    system.runTimeout(() => {
        const mergedChest = dimension.getBlock(chest1)!.getComponent("inventory")!.container!;

        // Fill chest with items
        items.forEach((item, index) => {
        if (index < mergedChest.size) {
            mergedChest.setItem(index, item);
        }
    });
  }, 1); // Delay by 1 tick to allow merge
}
function stringXyz (location: Vector3) {
    return Object.values(location).join(",");
}
function parseXyz (location: string) {
    const [x, y, z] = location.split(",").map((v) => parseInt(v));
    return { x, y, z } as Vector3;
}
world.beforeEvents.playerBreakBlock.subscribe((event) => {
    const block = event.block;
    if (block.typeId !== "minecraft:chest") return;
    const otherBlockPos = world.getDynamicProperty("invseeChest:" + stringXyz(block.location)) as Vector3;
    if (!otherBlockPos) return;
    event.cancel = true;
    system.run(() => {
        block.setType("air");
        event.dimension.getBlock(otherBlockPos)!.setType("air");
    });
});
export default {
    name: "invsee",
    description: "View a player inventory",
    parameters: [
        {
            name: "player",
            type: "player",
        }
    ],
    requireOp: true,
    execute: (player, [target]) => {
        const empty = new Array(54) as ItemStack[];
        const div = new ItemStack("matrix:divider");
        empty.fill(div, 27, 36);
        empty[45] = new ItemStack("matrix:offhand_label");
        empty[53] = new ItemStack("matrix:armor_label");
        empty.fill(div, 47, 49);
        const targetPlayer = target as Player;
        const inv = targetPlayer.getComponent("inventory")!.container;
        for (let i = 0; i < 9; i++) {
            const item = inv.getItem(i);
            if (!item) continue;
            empty[i + 36] = item;
        }
        for (let i = 9; i < inv.size; i++) {
            const item = inv.getItem(i);
            if (!item) continue;
            empty[i - 9] = item;
        }
        const armor = targetPlayer.getComponent("equippable")!;
        const offhand = armor.getEquipment(EquipmentSlot.Offhand);
        if (offhand) empty[46] = offhand;
        const head = armor.getEquipment(EquipmentSlot.Head);
        if (head) empty[49] = head;
        const chest = armor.getEquipment(EquipmentSlot.Chest);
        if (chest) empty[50] = chest;
        const leg = armor.getEquipment(EquipmentSlot.Legs);
        if (leg) empty[51] = leg;
        const boot = armor.getEquipment(EquipmentSlot.Feet);
        if (boot) empty[52] = boot;
        system.run(() => {
            createLargeChest(player.dimension, player.location, empty);
        });
        return { status: 0 };
    }
} as Command;