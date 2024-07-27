import { world, Player, EntityInventoryComponent, ItemEnchantableComponent, EntityDamageCause, system, PlayerBreakBlockAfterEvent } from "@minecraft/server";
import { MinecraftItemTypes, MinecraftEnchantmentTypes, MinecraftBlockTypes } from "../node_modules/@minecraft/vanilla-data/lib/index";
import { c, clearBlockBreakLog, findSlime, logBreak, isAdmin } from "./Util";
import { MatrixUsedTags, AnimationControllerTags, DisableTags } from "../Data/EnumData";
import { menu } from "../Functions/Ui Model/main";
import { error } from "../Functions/chatModel/CommandHandler";

world.afterEvents.itemReleaseUse.subscribe(({ itemStack, source: player }) => {
    if (itemStack?.typeId === MinecraftItemTypes.Trident && player instanceof Player) {
        const getItemInSlot = (player.getComponent(EntityInventoryComponent.componentId) as EntityInventoryComponent).container.getItem(player.selectedSlotIndex);
        if (getItemInSlot === undefined) return;
        if (getItemInSlot.typeId == MinecraftItemTypes.Trident && player.hasTag(AnimationControllerTags.wet)) {
            const checkRipTide = (getItemInSlot.getComponent(ItemEnchantableComponent.componentId) as ItemEnchantableComponent).hasEnchantment(MinecraftEnchantmentTypes.Riptide);
            if (checkRipTide) {
                player.threwTridentAt = Date.now();
            }
        }
    }
});

world.afterEvents.itemUse.subscribe(({ itemStack, source: player }) => {
    if (!itemStack.matches("matrix:itemui")) return;
    if (isAdmin(player)) {
        player.playSound("note.pling", { volume: 1.0, pitch: 3.0 });
        menu(player).catch((err) => error(player, err));
    } else {
        player.playSound("note.hat", { volume: 1.0, pitch: 3.0 });
        player.sendMessage(`§bMatrix §7> §cYou need to be an admin to use this item!`);
    }
});

world.afterEvents.entityHurt.subscribe(
    (event) => {
        const player = event.hurtEntity as Player;
        if (event.damageSource.cause == EntityDamageCause.blockExplosion || event.damageSource.cause == EntityDamageCause.entityExplosion || event.damageSource.cause === EntityDamageCause.entityAttack) {
            player.lastExplosionTime = Date.now();

            if (!player.hasTag(MatrixUsedTags.knockBack)) {
                player.addTag(MatrixUsedTags.knockBack);
            } else if (player.getVelocity().y <= 0) {
                player.removeTag(MatrixUsedTags.knockBack);
            }
        }
        player.lastApplyDamage = Date.now();
    },
    { entityTypes: ["minecraft:player"] }
);

world.beforeEvents.itemUse.subscribe((event) => {
    const player = event.source;
    if (player.hasTag(DisableTags.item)) {
        event.cancel = true;
    }
});

world.afterEvents.playerBreakBlock.subscribe(({ player: { id }, player, brokenBlockPermutation, block: { location }, block }: PlayerBreakBlockAfterEvent) => {
    if (player.hasTag(DisableTags.break)) {
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
    if (player.hasTag(DisableTags.break)) {
        event.cancel = true;
    }
});

world.beforeEvents.playerPlaceBlock.subscribe((event) => {
    const { player } = event;
    if (player.hasTag(DisableTags.place)) {
        event.cancel = true;
    }
});

world.afterEvents.playerSpawn.subscribe(({ player, initialSpawn }) => {
    if (initialSpawn) {
        player.removeTag(DisableTags.break);
        player.removeTag(DisableTags.place);
        player.removeTag(DisableTags.item);
        player.removeTag(DisableTags.pvp);
        player.removeTag(MatrixUsedTags.knockBack);
    }
    system.runTimeout(() => {
        player.isSpawning = false;
    }, c().spawnFinishDelay);
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
        if (v.y <= 0) player.removeTag(MatrixUsedTags.knockBack);

        // item use
        if (player.hasTag(AnimationControllerTags.usingItem) && !player.lastItemUsed) {
            player.lastItemUsed = now;
        } else if (!player.hasTag(AnimationControllerTags.usingItem)) {
            player.lastItemUsed = undefined;
        }

        // slime
        const slimeUnder = findSlime(player.dimension, player.location);
        if (slimeUnder) {
            player.addTag(MatrixUsedTags.slime);
        } else if (v.y <= 0) player.removeTag(MatrixUsedTags.slime);

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
