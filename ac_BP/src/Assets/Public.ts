import { world, Player, EntityInventoryComponent, ItemEnchantableComponent, EntityDamageCause, system, PlayerBreakBlockAfterEvent } from "@minecraft/server";
import { MinecraftItemTypes, MinecraftEnchantmentTypes, MinecraftBlockTypes } from "../node_modules/@minecraft/vanilla-data/lib/index";
import { clearBlockBreakLog, findSlime, logBreak } from "./Util";

world.afterEvents.itemReleaseUse.subscribe(({ itemStack, source: player }) => {
    if (itemStack?.typeId === MinecraftItemTypes.Trident && player instanceof Player) {
        const getItemInSlot = (player.getComponent(EntityInventoryComponent.componentId) as EntityInventoryComponent).container.getItem(player.selectedSlotIndex);
        if (getItemInSlot === undefined) return;
        if (getItemInSlot.typeId == MinecraftItemTypes.Trident) {
            const checkRipTide = (getItemInSlot.getComponent(ItemEnchantableComponent.componentId) as ItemEnchantableComponent).hasEnchantment(MinecraftEnchantmentTypes.Riptide);
            if (checkRipTide) {
                player.threwTridentAt = Date.now();
            }
        }
    }
});

world.afterEvents.entityHurt.subscribe(
    (event) => {
        const player = event.hurtEntity as Player;
        if (event.damageSource.cause == EntityDamageCause.blockExplosion || event.damageSource.cause == EntityDamageCause.entityExplosion || event.damageSource.cause === EntityDamageCause.entityAttack) {
            player.lastExplosionTime = Date.now();

            if (!player.hasTag("matrix:knockback")) {
                player.addTag("matrix:knockback");
            } else if (player.getVelocity().y <= 0) {
                player.removeTag("matrix:knockback");
            }
        }
        player.lastApplyDamage = Date.now();
    },
    { entityTypes: ["minecraft:player"] }
);

world.beforeEvents.itemUse.subscribe((event) => {
    const player = event.source;
    if (player.hasTag("matrix:item-disabled")) {
        event.cancel = true;
    }
});

world.afterEvents.playerBreakBlock.subscribe(({ player: { id }, player, brokenBlockPermutation, block: { location }, block }: PlayerBreakBlockAfterEvent) => {
    if (player.hasTag("matrix:break-disabled")) {
        block.dimension
            .getEntities({
                location: block.location,
                maxDistance: 2,
                minDistance: 0,
                type: "minecraft:item",
            })
            .forEach((item) => {
                item.kill();
            });
        block.setPermutation(Object.assign({}, block.permutation));
    } else {
        if (brokenBlockPermutation.type.id !== MinecraftBlockTypes.Air) logBreak(Object.assign({}, brokenBlockPermutation), location, id);
    }
});

world.afterEvents.playerLeave.subscribe(({ playerId }) => {
    clearBlockBreakLog(playerId);
});

world.beforeEvents.playerBreakBlock.subscribe((event) => {
    const { player } = event;
    if (player.hasTag("matrix:break-disabled")) {
        event.cancel = true;
    }
});

world.beforeEvents.playerPlaceBlock.subscribe((event) => {
    const { player } = event;
    if (player.hasTag("matrix:place-disabled")) {
        event.cancel = true;
    }
});

world.afterEvents.playerSpawn.subscribe(({ player, initialSpawn }) => {
    if (initialSpawn) {
        player.removeTag("matrix:item-disabled");
        player.removeTag("matrix:break-disabled");
        player.removeTag("matrix:place-disabled");
        player.removeTag("matrix:pvp-disabled");
    }
});

class Tps {
    private tps: number;
    constructor() {}
    public getTps() {
        return this.tps;
    }
    public updateTps(tps: number) {
        this.tps = tps;
    }
}

let tpsAmountData: number[] = [];
let lastTickLog: number = Date.now();

const tps = new Tps();
export { tps };

system.runInterval(async () => {
    const now = Date.now();
    tpsAmountData.push(now - lastTickLog);
    lastTickLog = Date.now();
    if (tpsAmountData.length > 20) tpsAmountData.shift();
    let tpsNow: number = 0;
    tpsAmountData.forEach((period) => (tpsNow += period));
    tps.updateTps((20 / 1000) * tpsNow);
    const players = world.getAllPlayers();
    for (const player of players) {
        // knockback
        const v = player.getVelocity();
        if (v.y <= 0) player.removeTag("matrix:knockback");

        // item use
        if (player.hasTag("matrix:using_item") && !player.lastItemUsed) {
            player.lastItemUsed = now;
        } else if (!player.hasTag("matrix:using_item")) {
            player.lastItemUsed = undefined;
        }

        // slime
        const slimeUnder = findSlime(player.dimension, player.location);
        if (slimeUnder) {
            player.addTag("matrix:slime");
        } else if (v.y <= 0) player.removeTag("matrix:slime");

        // Not useful lmao
        if (player.lastVelObject && player.lastLocObject) {
            if ((v.x != 0 || v.y != 0 || v.z != 0) && JSON.stringify(player.lastVelObject) == JSON.stringify(v) && JSON.stringify(player.lastLocObject) == JSON.stringify(player.location)) {
                system.run(() => {
                    player.pingTick ??= 0;
                    player.pingTick += 1;
                });
            } else system.run(() => (player.pingTick = 0));
        }

        player.lastVelObject = v;
        player.lastLocObject = player.location;
    }
});

import allProperty from "../Data/ValidPlayerProperty";

world.beforeEvents.playerLeave.subscribe(({ player }) => {
    // delete all property saved
    allProperty.forEach((property) => delete (player as { [key: string]: any | Player })[property]);
});
