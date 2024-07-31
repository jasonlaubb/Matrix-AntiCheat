import { world, system, Player, Entity, EntityDamageCause, EntityHurtAfterEvent } from "@minecraft/server";
import { flag, isAdmin } from "../../Assets/Util.js";
import { MinecraftEntityTypes } from "../../node_modules/@minecraft/vanilla-data/lib/index";
import { configi, registerModule } from "../Modules.js";

const reachData: Map<string, number> = new Map<string, number>();

/**
 * @author ravriv && RamiGamerDev
 * @description This checks if the player is hitting another player from a long distance.
 */

function calculateDistance(b1: Entity, b2: Entity) {
    //constant the velocity
    const { x: x1, z: z1 } = b1.getVelocity();
    const { x: x2, z: z2 } = b2.getVelocity();

    //get the total velocity for calculation
    const velocityB1 = Math.abs(x1) + Math.abs(z1);
    const velocityB2 = Math.abs(x2) + Math.abs(z2);

    //calculate the defference between the two players's location and the velocity
    const dx: number = b1.location.x - b2.location.x - velocityB1;
    const dz: number = b1.location.z - b2.location.z - velocityB2;

    //calculate the distance and return it
    return Math.floor(Math.hypot(dx, dz)) - (velocityB1 + velocityB2);
}

function antiReach(hurtEntity: Player, damagingEntity: Player, config: configi) {
    //calculate the y reach
    const yReach: number = Math.abs(damagingEntity.location.y - hurtEntity.location.y) - Math.abs(damagingEntity.getVelocity().y);

    //constant the max y reach
    let maximumYReach: number = config.antiReach.maxYReach;

    //if the player is jumping, increase the max y reach by 1
    if (damagingEntity.isJumping) {
        maximumYReach += 1;
    }

    //if the player is higher than the target, decrease the max y reach by 1
    if (damagingEntity.location.y > hurtEntity.location.y) {
        maximumYReach -= 1;
    }

    //constant the distance
    const distance: number = calculateDistance(damagingEntity, hurtEntity);

    let data = reachData.get(damagingEntity.id);

    //if the distance is higher than the max reach or the y reach is higher than the max y reach, add a vl
    if (distance > config.antiReach.maxReach || yReach > maximumYReach) {
        if (!data) {
            data = 0;
            system.runTimeout(() => {
                reachData.delete(damagingEntity.id);
            }, 80);
        }
        data++;
    }

    //if the vl is higher than 2, flag the player
    if (data! >= 2) {
        //A - false positive: very low, efficiency: high
        flag(damagingEntity, "Reach", "A", config.antiReach.maxVL, config.antiReach.punishment, ["distance" + ":" + distance.toFixed(2), "yReach" + ":" + yReach.toFixed(2)]);
        damagingEntity.applyDamage(6);
        reachData.delete(damagingEntity.id);
    }

    if (data) reachData.set(damagingEntity.id, data);
}

// Register the module
registerModule("antiReach", false, [reachData], {
    worldSignal: world.afterEvents.entityHurt,
    playerOption: { entityTypes: [MinecraftEntityTypes.Player] },
    then: async (config, { hurtEntity, damageSource: { cause, damagingEntity, damagingProjectile } }: EntityHurtAfterEvent) => {
        if (cause !== EntityDamageCause.entityAttack || damagingProjectile || !(damagingEntity instanceof Player) || isAdmin(damagingEntity)) return;

        antiReach(hurtEntity as Player, damagingEntity, config);
    },
});
