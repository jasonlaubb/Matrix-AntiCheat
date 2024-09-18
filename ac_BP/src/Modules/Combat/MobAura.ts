import { Dimension, Entity, EntityHitEntityAfterEvent, Player, Vector3, world } from "@minecraft/server";
import { configi, registerModule } from "../Modules";
import MathUtil from "../../Assets/MathUtil";
import { flag } from "../../Assets/Util";

/**
 * @author jasonlaubb
 * @description Strongest Anti-Aura for Minecrft Bedrock, bypass any-type of anti bot hacks
 * Detect if the player hit the dammy (with same entity id)
 */
async function auraCheck(config: configi, { damagingEntity, hitEntity: dammy }: EntityHitEntityAfterEvent) {
    const player = damagingEntity as Player;
    if (isDammy(dammy, player.id)) {
        playerHitDammy(player, config, dammy.location.y);
    } else {
        playerStartCombat(player, config);
    }
}

function isDammy(dammy: Entity, playerId: string) {
    let w;
    try {
        w = dammy.getDynamicProperty(playerId);
    } catch {
        w = false;
    }
    return w;
}

function playerStartCombat(player: Player, config: configi) {
    // Spawn the dammy
    if (player.dimension.getEntities().filter((e) => isDammy(e, player.id)).length == 0) {
        spawnDammy(player.id, player.dimension, player.location, config);
    }
}

function spawnDammy(id: string, dimension: Dimension, loc: Vector3, config: configi): Entity {
    loc.y += config.antiMobAura.spawnHeightOffset;
    const offset = MathUtil.randomOffset(config.antiMobAura.spawnRadius, -config.antiMobAura.spawnRadius);
    loc.x += offset.x;
    loc.z += offset.z;
    const dammy = dimension.spawnEntity("minecraft:player", loc);
    dammy.triggerEvent("matrix:dummy");
    dammy.setDynamicProperty(id, true);
    return dammy;
}

interface AuraData {
    firstHit: number;
    amount: number;
}
const auraData = new Map<string, AuraData>();
function playerHitDammy(player: Player, config: configi, dammyY: number) {
    const now = Date.now();
    const data = auraData.get(player.id) ?? {
        firstHit: now,
        amount: 0,
    };
    //player.sendMessage("Hit Amount: " + data.amount);
    if (now - data.firstHit > config.antiMobAura.comboTime) {
        data.firstHit = now;
        data.amount = 0;
    }
    data.amount++;
    if (data.amount >= config.antiMobAura.minHitRequired) {
        flag(player, "Mob Aura", "A", config.antiMobAura.maxVL, config.antiMobAura.punishment, ["distanceY:" + (dammyY - player.location.y).toFixed(2)]);
    }
    auraData.set(player.id, data);
    // Prevent the crash (max 3 dammy entity)
    if (player.dimension.getEntities().filter((e) => isDammy(e, player.id)).length < 3) {
        spawnDammy(player.id, player.dimension, player.location, config);
    }
}

registerModule("antiMobAura", false, [auraData], {
    worldSignal: world.afterEvents.entityHitEntity,
    playerOption: {
        entityTypes: ["minecraft:player"],
    },
    then: auraCheck,
});
