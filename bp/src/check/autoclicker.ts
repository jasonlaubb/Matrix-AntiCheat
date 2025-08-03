import { EntityDamageCause, EntityHitEntityAfterEvent, EntityHurtAfterEvent, Player, system, world } from "@minecraft/server";

function onEntityHit ({ damagingEntity: player }: EntityHitEntityAfterEvent) {
    if (!(player instanceof Player) || player.isOp()) return;
    // Delay 1 tick
    system.run(() => {
        player.autoclickerCpsCount++;
        if (player.autoclickerAttackDuration >= 3) {
            const avgCps = player.autoclickerCpsCount / player.autoclickerAttackDuration * 2;
            player.sendMessage("Avg cps: " + avgCps); // Debug message
        }
    });
}
function onEntityHurt ({ damageSource: { damagingEntity, damagingProjectile, cause } }: EntityHurtAfterEvent) {
    if (!damagingEntity || cause !== EntityDamageCause.entityAttack || damagingProjectile || !(damagingEntity instanceof Player) || damagingEntity.isOp()) return;
    const now = Date.now();
    if (!damagingEntity.autoclickerAttackDuration || damagingEntity.autoclickerInitTimestamp && now - damagingEntity.autoclickerInitTimestamp > 12000) {
        damagingEntity.autoclickerAttackDuration = 0;
        damagingEntity.autoclickerInitTimestamp = now;
    }
    damagingEntity.autoclickerAttackDuration++;
}
export default {
    property: "antiAutoClickerEnable",
    enable: () => {
        world.afterEvents.entityHitEntity.subscribe(onEntityHit);
        world.afterEvents.entityHurt.subscribe(onEntityHurt);
    },
    disable: () => {
        world.afterEvents.entityHitEntity.unsubscribe(onEntityHit);
        world.afterEvents.entityHurt.unsubscribe(onEntityHurt);
    }
}