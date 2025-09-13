import { Dimension, EquipmentSlot, ItemStack, Player, system, Vector3, world } from "@minecraft/server";
import { Command } from "../main";
import { stringXyz } from "../util/util";
import { get } from "../util/database";
import english from "../data/languages/english";
import { text } from "../util/text";
/**
 * Places a large chest at the given location and fills it with optional items.
 * @param dimension The dimension to place the chest in (e.g., world.overworld)
 * @param location The starting BlockLocation for the large chest
 * @param items Optional array of ItemStacks to insert into the chest
 */
function createLargeChest(dimension: Dimension, location: Vector3, items: ItemStack[] = []) {
    const chest1 = location;
    const chest2 = { x: location.x + 1, y: location.y, z: location.z }; // Place second chest to the right
    const chest1Pos = dimension.getBlock(chest1)!;
    const chest2Pos = dimension.getBlock(chest2)!;
    // Place two chests side by side
    chest1Pos.setType("minecraft:chest");
    chest2Pos.setType("minecraft:chest");
    world.setDynamicProperty("invseeChest:" + stringXyz(chest1Pos.location), chest2Pos.location);
    world.setDynamicProperty("invseeChest:" + stringXyz(chest2Pos.location), chest1Pos.location);
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
function midPoint({ x, y, z }: Vector3, { x: x2, z: z2 }: Vector3) {
    return { x: (x + x2) * 0.5 + 0.5, y: y + 1, z: (z + z2) * 0.5 + 0.5 };
}
export function invseeHandler () {
world.beforeEvents.playerBreakBlock.subscribe((event) => {
    const block = event.block;
    if (block.type.id === "minecraft:chest") {
        const otherBlockPos = world.getDynamicProperty("invseeChest:" + stringXyz(block.location)) as Vector3;
        if (otherBlockPos === undefined) return;
        event.cancel = true;
        if (!event.player.isOp()) {
            event.player.sendMessage("§7[§aMatrix§7] §f" + text("commandInvseeBreakDenied"));
            return;
        }
        system.run(() => {
            block.setType("air");
            event.dimension.getBlock(otherBlockPos)!.setType("air");
            world.setDynamicProperty("invseeChest:" + stringXyz(block.location));
            world.setDynamicProperty("invseeChest:" + stringXyz(otherBlockPos));
            event.dimension
                .getEntities({
                    location: midPoint(event.block.location, otherBlockPos),
                    maxDistance: 2,
                    type: "minecraft:item",
                })
                .forEach((entity) => entity.kill());
        });
    } else {
        if (world.getDynamicProperty("invseeChest:" + stringXyz({ x: block.location.x, y: block.location.y + 1, z: block.location.z }))) {
            event.cancel = true;
            event.player.sendMessage("§7[§aMatrix§7] §f" + text("commandInvseeBlockProtected"));
        }
    }
});
world.beforeEvents.playerInteractWithBlock.subscribe((event) => {
    const block = event.block;
    if (block.type.id !== "minecraft:chest") return;
    const data = world.getDynamicProperty("invseeChest:" + stringXyz(block.location));
    if (!data || event.player.isOp()) return;
    event.cancel = true;
    event.player.sendMessage("§7[§aMatrix§7] §f" + text("commandInvseeOpenDenied"));
});
}
export default {
    name: "invsee",
    description: english.commandInvseeDescription,
    requireOp: true,
    translationDef: {
        actionName: "commandInvsee",
        description: "commandInvseeDescription",
        param: ["commandInvseeTarget"]
    },
    parameters: [
        { name: "player", type: "player" },
    ],
    execute: (player, [target]) => {
        if (get("banInvseeHandler")) {
            return {
                status: 1,
                message: "§7[§aMatrix§7] §f" + text("commandInvseeDisabled")
            };
        }

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
            if (item) empty[i + 36] = item;
        }

        for (let i = 9; i < inv.size; i++) {
            const item = inv.getItem(i);
            if (item) empty[i - 9] = item;
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
            player.onScreenDisplay.setActionBar(text("commandInvseeActionBar"));
            player.tryTeleport(
                {
                    x: Math.floor(player.location.x) + 0.5,
                    y: Math.floor(player.location.y) + 1,
                    z: Math.floor(player.location.z) + 0.5,
                },
                {
                    rotation: { x: 97, y: player.getRotation().y },
                }
            );
        });

        return { status: 0 };
    },
} as Command;