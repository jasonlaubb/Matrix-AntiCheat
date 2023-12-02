import {
    world,
    Player,
    EntityInventoryComponent,
    ItemEnchantsComponent,
    EntityDamageCause,
    system
} from "@minecraft/server"
import { MinecraftItemTypes, MinecraftEnchantmentTypes } from "../node_modules/@minecraft/vanilla-data/lib/index";

world.beforeEvents.itemUse.subscribe((event) => {
    const player = event.source
    if (player.hasTag("matrix:item-disabled")) {
        event.cancel = true;
    }
})
world.afterEvents.playerSpawn.subscribe(({ player, initialSpawn }) => {
    if (initialSpawn) {
        player.removeTag("matrix:item-disabled")
    }
})

world.afterEvents.itemReleaseUse.subscribe(({ itemStack, source: player }) => {
    if (itemStack?.typeId === MinecraftItemTypes.Trident && player instanceof Player) {
        const getItemInSlot = (
            player.getComponent(
                EntityInventoryComponent.componentId
            ) as EntityInventoryComponent
        ).container.getItem(player.selectedSlot);
        if (getItemInSlot === undefined) return;
        const getEnchantment = (
            getItemInSlot.getComponent(
                ItemEnchantsComponent.componentId
            ) as ItemEnchantsComponent
        ).enchantments;
        if (getItemInSlot.typeId == MinecraftItemTypes.Trident) {
            const checkRipTide = getEnchantment.hasEnchantment(
                MinecraftEnchantmentTypes.Riptide
            );
            if (checkRipTide) {
                player.threwTridentAt = Date.now();
            }
        }
    }
});

world.afterEvents.entityHurt.subscribe(event => {
    const player = event.hurtEntity;
    if (player instanceof Player && (event.damageSource.cause == EntityDamageCause.blockExplosion || event.damageSource.cause == EntityDamageCause.entityExplosion || event.damageSource.cause === EntityDamageCause.entityAttack)) {
        player.lastExplosionTime = Date.now();

        if (!player.hasTag("matrix:knockback")) {
            player.addTag("matrix:knockback")
        } else if (player.getVelocity().y <= 0) {
            player.removeTag("matrix:knockback")
        }
    }
});

world.beforeEvents.itemUse.subscribe((event) => {
    const player = event.source
    if (player.hasTag("matrix:item-disabled")) {
        event.cancel = true;
    }
})

world.afterEvents.playerBreakBlock.subscribe((event) => {
    const { player, block } = event

    if (player.hasTag("matrix:break-disabled")) {
        block.dimension.getEntities({ location: block.location, maxDistance: 2, minDistance: 0, type: "minecraft:item" }).forEach((item) => { item.kill() })
        block.setPermutation(block.permutation.clone())
    }
})

world.beforeEvents.playerBreakBlock.subscribe((event) => {
    const { player } = event
    if (player.hasTag("matrix:break-disabled")) {
        event.cancel = true
    }
})

world.afterEvents.playerSpawn.subscribe(({ player, initialSpawn }) => {
    if (initialSpawn) {
        player.removeTag("matrix:item-disabled");
        player.removeTag("matrix:break-disabled");
        player.removeTag("matrix:place-disabled");
        player.removeTag("matrix:pvp-disabled");
    }
})

system.runInterval(() => {
    const players = world.getPlayers({ tags: ["matrix:knockback"]})
    for (const player of players) {
        const velocity = player.getVelocity().y
        if (velocity <= 0) player.removeTag("matrix:knockback")
    }
})