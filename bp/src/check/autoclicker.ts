import { EntityDamageCause, EntityHitEntityAfterEvent, EntityHurtAfterEvent, Player, system, world } from "@minecraft/server";
import { get } from "../util/database";
import { banAttack } from "../util/util";

function onEntityHit({ damagingEntity: player }: EntityHitEntityAfterEvent) {
    if (!(player instanceof Player) || player.isOp()) return;
    // Delay 1 tick
    system.run(() => {
        player.autoclickerCpsCount ??= 0;
        if (player.autoclickerLastAttack && system.currentTick - player.autoclickerLastAttack <= 11) player.autoclickerCpsCount++; // If we do not get hurt packet, then we do not add the cps
        if (player.autoclickerAttackDuration >= 3 && !player.getEffect("minecraft:weakness")) {
            const avgCps = (player.autoclickerCpsCount / player.autoclickerAttackDuration) * 2;
            if (avgCps > get("antiAutoClickerMaxCps")) {
                banAttack(player, 40);
                player.autoclickerAttackDuration = 0;
                player.autoclickerCpsCount = 0;
                const now = Date.now();
                player.autoclickerFlag ??= 0;
                player.autoclickerLastFlag ??= 0;
                if (now - player.autoclickerLastFlag > 30000) player.autoclickerFlag = 0;
                if (now - player.autoclickerLastFlag > 2000) {
                    player.autoclickerFlag++;
                    player.autoclickerLastFlag = now;
                    if (get("antiAutoClickerWarning")) {
                        player.sendMessage("§c§lHey!§r§7 Slow down your clicking");
                        world.getAllPlayers().forEach((target) => {
                            if (!target.isOp()) return;
                            player.sendMessage(`§7[§aMatrix§7] §e${player.name} §fhas triggered auto-clicker flag.`);
                        });
                    }
                    if (player.autoclickerFlag >= get("antiAutoClickerMaxFlag")) {
                        player.autoclickerFlag = 0;
                        player.flag("AutoClicker", "A", "Combat", { avgCps });
                    }
                }
            }
        }
    });
}
function onEntityHurt({ damageSource: { damagingEntity, damagingProjectile, cause } }: EntityHurtAfterEvent) {
    if (!damagingEntity || cause !== EntityDamageCause.entityAttack || damagingProjectile || !(damagingEntity instanceof Player) || damagingEntity.isOp()) return;
    const now = Date.now();
    if (!damagingEntity.autoclickerAttackDuration || (damagingEntity.autoclickerInitTimestamp && now - damagingEntity.autoclickerInitTimestamp > 12000)) {
        damagingEntity.autoclickerAttackDuration = 0;
        damagingEntity.autoclickerCpsCount = 0;
        damagingEntity.autoclickerInitTimestamp = now;
    }
    damagingEntity.autoclickerLastAttack = system.currentTick;
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
    },
};
