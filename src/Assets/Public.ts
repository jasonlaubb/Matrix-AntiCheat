import {
    world,
    Player,
    EntityInventoryComponent,
    ItemEnchantsComponent,
    EntityDamageCause,
    system,
    PlayerBreakBlockAfterEvent
} from "@minecraft/server"
import { MinecraftItemTypes, MinecraftEnchantmentTypes, MinecraftBlockTypes } from "../node_modules/@minecraft/vanilla-data/lib/index";
import { clearBlockBreakLog, findSlime, logBreak } from "./Util";

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
    const player = event.hurtEntity as Player;
    if ((event.damageSource.cause == EntityDamageCause.blockExplosion || event.damageSource.cause == EntityDamageCause.entityExplosion || event.damageSource.cause === EntityDamageCause.entityAttack)) {
        player.lastExplosionTime = Date.now();

        if (!player.hasTag("matrix:knockback")) {
            player.addTag("matrix:knockback")
        } else if (player.getVelocity().y <= 0) {
            player.removeTag("matrix:knockback")
        }
    }
    player.lastApplyDamage = Date.now()
}, { entityTypes: ["minecraft:player"] });

world.beforeEvents.itemUse.subscribe((event) => {
    const player = event.source
    if (player.hasTag("matrix:item-disabled")) {
        event.cancel = true;
    }
})

world.afterEvents.playerBreakBlock.subscribe(({ player: { id }, player, brokenBlockPermutation, block: { location }, block }: PlayerBreakBlockAfterEvent) => {
    if (player.hasTag("matrix:break-disabled")) {
        block.dimension.getEntities({
            location: block.location, maxDistance: 2, minDistance: 0, type: "minecraft:item"
        }).forEach((item) => { item.kill() })
        block.setPermutation(block.permutation.clone())
    } else {
        if (brokenBlockPermutation.type.id !== MinecraftBlockTypes.Air)
            logBreak(brokenBlockPermutation.clone(), location, id)
    }
})

world.afterEvents.playerLeave.subscribe(({ playerId }) => {
    clearBlockBreakLog(playerId)
})

world.beforeEvents.playerBreakBlock.subscribe((event) => {
    const { player } = event
    if (player.hasTag("matrix:break-disabled")) {
        event.cancel = true
    }
})

world.beforeEvents.playerPlaceBlock.subscribe((event) => {
    const { player } = event
    if (player.hasTag("matrix:place-disabled")) {
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

system.runInterval(async () => {
    const players = world.getAllPlayers()
    for (const player of players) {
        // knockback
        const v = player.getVelocity()
        if (v.y <= 0) player.removeTag("matrix:knockback")

        // item use
        if (player.hasTag("matrix:using_item") && !player.lastItemUsed) {
            player.lastItemUsed = Date.now();
        } else if (!player.hasTag("matrix:using_item")) {
            player.lastItemUsed = undefined;
        }

        // slime
        const slimeUnder = findSlime(player.dimension, player.location)
        if (slimeUnder) {
            player.addTag("matrix:slime")
        } else if (v.y <= 0) player.removeTag("matrix:slime")

        // Not useful lmao
        if (player.lastVelObject && player.lastLocObject) {
            if ((v.x != 0 || v.y != 0 || v.z != 0) &&
                JSON.stringify(player.lastVelObject) == JSON.stringify(v) &&
                JSON.stringify(player.lastLocObject) == JSON.stringify(player.location)) {
                system.run(() => {
                    player.pingTick ??= 0
                    player.pingTick += 1
                })
            } else system.run(() => player.pingTick = 0)
        }

        player.lastVelObject = v
        player.lastLocObject = player.location
    }
})

import allProperty from "../Data/ValidPlayerProperty";

world.beforeEvents.playerLeave.subscribe(({ player }) => {
    // delete all property saved
    allProperty.forEach(property => delete (player as { [key: string]: any | Player })[property])
})
