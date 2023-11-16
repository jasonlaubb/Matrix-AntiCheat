import {
    world,
    system,
    Player,
    Entity,
    EntityDamageCause
} from "@minecraft/server";
import config from "../../Data/Config.js";
import {
    flag, isAdmin
} from "../../Assets/Util.js";

const reachData: Map <string, number> = new Map <string, number> ();

/**
 * @author ravriv && RamiGamerDev
 * @description This is a simple reach detector.
 * it will detect if the player is hitting another player from a long distance.
 */

function calculateDistance(b1: Entity, b2: Entity) {
    const { x: x1, z: z1 } = b1.getVelocity();
    const { x: x2, z: z2 } = b2.getVelocity();

    const velocityB1 = Math.abs(x1) + Math.abs(z1);
    const velocityB2 = Math.abs(x2) + Math.abs(z2);

    const dx: number = b1.location.x - b2.location.x - velocityB1;
    const dz: number = b1.location.z - b2.location.z - velocityB2;

    const distance: number = Math.floor(Math.hypot(dx, dz)) - (velocityB1 + velocityB2);

    return distance;
}

async function AntiReach (hurtEntity: Player, damagingEntity: Player) {
    const yReach: number = Math.abs(damagingEntity.location.y - hurtEntity.location.y)

    let maximumYReach: number = config.antiReach.maxYReach
    
    if (damagingEntity.isJumping) {
        maximumYReach += 1
    }
    
    if (damagingEntity.location.y > hurtEntity.location.y) {
        maximumYReach -= 1
    }
    
    const distance: number = calculateDistance(damagingEntity, hurtEntity);

    if (distance > config.antiReach.maxReach || yReach > maximumYReach) {
        if (!reachData.has(damagingEntity.id)) {
            reachData.set(damagingEntity.id, 0);
            system.runTimeout(() => {
                reachData.delete(damagingEntity.id);
            }, 80);
        }
        reachData.set(damagingEntity.id, reachData.get(damagingEntity.id) + 1);
    }

    if (reachData.get(damagingEntity.id) >= 2) {
        flag(damagingEntity, 'Reach', config.antiReach.maxVL,config.antiReach.punishment, ["distance:" + distance.toFixed(2), "yReach:" + yReach.toFixed(2)])
        damagingEntity.applyDamage(6);
        reachData.delete(damagingEntity.id);
    }
}

world.afterEvents.entityHurt.subscribe(({ damageSource, hurtEntity }) => {
    const toggle: boolean = (world.getDynamicProperty("antiReach") ?? config.antiReach.enabled) as boolean;
    if (toggle !== true) return;

    const damagingEntity: Entity = damageSource.damagingEntity;
    if (damageSource.cause !== EntityDamageCause.entityAttack || !(damagingEntity instanceof Player) || !(hurtEntity instanceof Player) || isAdmin (damagingEntity)) return;

    AntiReach(hurtEntity, damagingEntity);
});

world.afterEvents.playerLeave.subscribe(({ playerId }) => {
    reachData.delete(playerId);
})