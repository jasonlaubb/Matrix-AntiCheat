import { EntityDamageCause, EntityHurtAfterEvent, ItemReleaseUseAfterEvent, ItemStartUseAfterEvent, ItemStopUseAfterEvent, Player } from "@minecraft/server";

export function riptide({ source: player, itemStack }: ItemReleaseUseAfterEvent) {
    if (!itemStack || itemStack.typeId !== "minecraft:trident" || player.isOp() || !itemStack.getComponent("enchantable")?.hasEnchantment("minecraft:riptide")) return;
    player.lastRiptide = Date.now();
}
export function knockback({ hurtEntity, damageSource: { cause } }: EntityHurtAfterEvent) {
    if (!(hurtEntity instanceof Player)) return;
    if ([cause === EntityDamageCause.entityAttack, EntityDamageCause.entityExplosion, EntityDamageCause.blockExplosion, cause == EntityDamageCause.projectile].includes(cause)) {
        hurtEntity.lastKnockback = Date.now();
    }
}
export function itemStartUse({ source, itemStack }: ItemStartUseAfterEvent) {
    if (itemStack.typeId === "minecraft:fishing_rod") return;
    source.itemStartUse = Date.now();
}
export function itemStopUse({ source }: ItemStopUseAfterEvent) {
    delete source.itemStartUse;
}