/**
 * @author r4isen1920
 * @license MIT
 */
export { projectPlayerInventory };

import { world, system, EquipmentSlot, Player, ItemStack } from "@minecraft/server";

/**
 *
 * @param { import('@minecraft/server').Entity } entity
 *
 * @returns { import('@minecraft/server').ItemStack[] }
 *
 */
function fetchInventory(entity: any): import("@minecraft/server").ItemStack[] {
    const container = entity.getComponent("inventory").container;
    let inventory = Array.from({ length: container.size }, (_, i) => container.getItem(i) || { typeId: "air" });
    return entity instanceof Player ? inventory.slice(9).concat(inventory.slice(0, 9)) : inventory;
}

/**
 *
 * @param { import('@minecraft/server').ItemStack[] } inventory
 *
 * @returns { string }
 */
function stringifyInventory(inventory: any[]): string {
    return JSON.stringify(
        inventory.map((item) => {
            return {
                typeId: item?.typeId || "air",
                amount: item?.amount || 0,
            };
        })
    );
}

/**
 *
 * @param { import('@minecraft/server').Player } player
 *
 * @returns { import('@minecraft/server').ItemStack[] }
 */
function fetchPlayerEquipments(player: any): import("@minecraft/server").ItemStack[] {
    const equipment = player.getComponent("equippable");
    return [equipment.getEquipment(EquipmentSlot.Head), equipment.getEquipment(EquipmentSlot.Chest), equipment.getEquipment(EquipmentSlot.Legs), equipment.getEquipment(EquipmentSlot.Feet), equipment.getEquipment(EquipmentSlot.Offhand)];
}

/**
 *
 * @param { import('@minecraft/server').ItemStack[] } equipment
 *
 * @returns { string }
 */
function transformEquipmentStatsToString(equipment: any[]): string {
    return equipment
        .map((item) => {
            return !item?.typeId ? "b" : "a";
        })
        .join("")
        .replace(/[\[\],"]/g, "");
}

/**
 *
 * Projects the target player's
 * inventory into the inventory
 * viewer entity.
 *
 * @param { import('@minecraft/server').Player } player
 * @param { import('@minecraft/server').Player } sourcePlayer
 */
function projectPlayerInventory(player: any, sourcePlayer: any) {
    sourcePlayer.runCommand(`ride @s stop_riding`);

    const inventory = fetchInventory(player);
    const equipment = fetchPlayerEquipments(player);

    const entityProjector = sourcePlayer.dimension.spawnEntity("r4isen1920_invsee:inventory", sourcePlayer.location);
    const entityProjectorContainer = entityProjector.getComponent("inventory").container;

    entityProjector.nameTag = `_r4ui:inventory:${transformEquipmentStatsToString(equipment)}:${player.name}`;

    for (let i = 0; i < 36; i++) {
        if (inventory[i].typeId !== "air") entityProjectorContainer.setItem(i, inventory[i]);
        else continue;
    }
    for (let i = 45; i < 53; i++) {
        if (equipment[i - 45]?.typeId !== "air") entityProjectorContainer.setItem(i, equipment[i - 45]);
        else continue;
    }

    sourcePlayer.runCommand(`ride @s start_riding @e[type=r4isen1920_invsee:inventory,c=1] teleport_ride`);
    entityProjector.addTag("invsee");
    entityProjector.setDynamicProperty("r4isen1920_invsee:target", player.id);

    player.setDynamicProperty("r4isen1920_invsee:old_log", stringifyInventory(inventory.concat(equipment)));
    entityProjector.setDynamicProperty("r4isen1920_invsee:old_log", stringifyInventory(fetchInventory(entityProjector)));
}

/**
 *
 * @param { import('@minecraft/server').Dimension } dimension
 *
 * @returns { import('@minecraft/server').Entity[] }
 */
function getInventoryViewerEntities(dimension: any) {
    return world.getDimension(dimension).getEntities({ type: "r4isen1920_invsee:inventory", tags: ["invsee"] });
}

/**
 *
 * @param { import('@minecraft/server').Entity } entityProjector
 */
function checkSync(entityProjector: any) {
    const target = world.getEntity(entityProjector.getDynamicProperty("r4isen1920_invsee:target"))!;

    const playerInventory = stringifyInventory(fetchInventory(target).concat(fetchPlayerEquipments(target)));
    const viewerInventory = stringifyInventory(fetchInventory(entityProjector));

    if (playerInventory !== target.getDynamicProperty("r4isen1920_invsee:old_log")) {
        pullChange(entityProjector, target);
    } else if (viewerInventory !== entityProjector.getDynamicProperty("r4isen1920_invsee:old_log")) {
        pushChange(entityProjector, target);
    }

    target.setDynamicProperty("r4isen1920_invsee:old_log", playerInventory);
    entityProjector.setDynamicProperty("r4isen1920_invsee:old_log", viewerInventory);

    entityProjector.removeTag("updating");
}

function pullChange(entityProjector: any, target: any) {
    if (entityProjector.hasTag("updating")) return;
    entityProjector.addTag("updating");

    const inventory = fetchInventory(target);
    const equipment = fetchPlayerEquipments(target);

    const entityProjectorContainer = entityProjector.getComponent("inventory").container;
    entityProjector.nameTag = `_r4ui:inventory:${transformEquipmentStatsToString(equipment)}:${target.name}`;
    entityProjectorContainer.clearAll();

    for (let i = 0; i < 36; i++) {
        if (inventory[i].typeId !== "air") entityProjectorContainer.setItem(i, inventory[i]);
        else continue;
    }
    for (let i = 45; i < 53; i++) {
        if (equipment[i - 45]?.typeId !== "air") entityProjectorContainer.setItem(i, equipment[i - 45]);
        else continue;
    }
}

function pushChange(entityProjector: any, target: any) {
    if (entityProjector.hasTag("updating")) return;
    entityProjector.addTag("updating");

    const targetContainer = target.getComponent("inventory").container;
    const targetEquipment = target.getComponent("equippable");

    const viewerInventory = fetchInventory(entityProjector).slice(0, 36);
    const viewerInventorySlice = [...viewerInventory.slice(-9), ...viewerInventory.slice(0, -9)];
    const viewerEquipment = fetchInventory(entityProjector).slice(45, 53);

    entityProjector.nameTag = `_r4ui:inventory:${transformEquipmentStatsToString(viewerEquipment)}:${target.name}`;

    const indexToEquipment: { [key: number]: EquipmentSlot } = {
        45: EquipmentSlot.Head,
        46: EquipmentSlot.Chest,
        47: EquipmentSlot.Legs,
        48: EquipmentSlot.Feet,
        49: EquipmentSlot.Offhand,
    };

    targetContainer.clearAll();
    targetEquipment.setEquipment(EquipmentSlot.Head, new ItemStack("air"));
    targetEquipment.setEquipment(EquipmentSlot.Chest, new ItemStack("air"));
    targetEquipment.setEquipment(EquipmentSlot.Legs, new ItemStack("air"));
    targetEquipment.setEquipment(EquipmentSlot.Feet, new ItemStack("air"));
    targetEquipment.setEquipment(EquipmentSlot.Offhand, new ItemStack("air"));

    for (let i = 0; i < 36; i++) {
        if (viewerInventorySlice[i].typeId !== "air") targetContainer.setItem(i, viewerInventorySlice[i]);
        else continue;
    }
    for (let i = 45; i < 53; i++) {
        if (viewerEquipment[i - 45].typeId !== "air") targetEquipment.setEquipment(indexToEquipment[i], viewerEquipment[i - 45]);
        else continue;
    }
}

system.runTimeout(() => {
    system.runInterval(() => {
        const inventoryViewerEntities = getInventoryViewerEntities("minecraft:overworld").concat(getInventoryViewerEntities("minecraft:nether")).concat(getInventoryViewerEntities("minecraft:the_end"));
        inventoryViewerEntities.forEach((entity) => {
            checkSync(entity);
        });
    }, 1);
}, 5);
