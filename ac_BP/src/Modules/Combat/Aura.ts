import { Dimension, Entity, EntityHitEntityAfterEvent, Player, Vector3, world } from "@minecraft/server";
import { configi, registerModule } from "../Modules";
import MathUtil from "../../Assets/MathUtil";
import { flag } from "../../Assets/Util";

async function auraCheck(config: configi, { damagingEntity, hitEntity: dammy }: EntityHitEntityAfterEvent) {
    const player = damagingEntity as Player;
    if (dammy.typeId == "minecraft:player" && dammy.getDynamicProperty(player.id)) {
        playerHitDammy(player, config);
    } else {
        playerStartCombat(player, config);
    }
}

function playerStartCombat(player: Player, config: configi) {
    // Spawn the dammy
    try {
        if (!player.dimension.getEntities({ type: "minecraft:player" }).some((w) => w.getDynamicProperty(player.id))) {
            spawnDammy(player.id, player.dimension, player.location, config);
        }
    } catch {}
}

function spawnDammy(id: string, dimension: Dimension, loc: Vector3, config: configi): Entity {
    loc.y += config.antiAura.spawnHeightOffset;
    const offset = MathUtil.randomOffset(config.antiAura.spawnRadius, -config.antiAura.spawnRadius);
    loc.x += offset.x;
    loc.z += offset.z;
    const dammy = dimension.spawnEntity("minecraft:player", loc);
    dammy.triggerEvent("matrix:dummy")
    dammy.setDynamicProperty(id, true);
    return dammy;
}

interface AuraData {
    firstHit: number;
    amount: number;
}
const auraData = new Map<string, AuraData>();
function playerHitDammy(player: Player, config: configi) {
    const now = Date.now();
    const data = auraData.get(player.id) ?? {
        firstHit: now,
        amount: 0,
    };
    //player.sendMessage("Hit Amount: " + data.amount);
    if (now - data.firstHit > config.antiAura.comboTime) {
        data.firstHit = now;
        data.amount = 0;
    }
    data.amount++;
    if (data.amount >= config.antiAura.minHitRequired) {
        flag(player, "Aura", "A", config.antiAura.maxVL, config.antiAura.punishment, undefined);
    }
    auraData.set(player.id, data);
    // Prevent the crash (max 3 dammy entity)
    if (player.dimension.getEntities({ type: "minecraft:player" }).filter((w) => w.getDynamicProperty(player.id)).length <= 2)
        spawnDammy(player.id, player.dimension, player.location, config);
}

registerModule("antiAura", false, [auraData], {
    worldSignal: world.afterEvents.entityHitEntity,
    playerOption: {
        entityTypes: ["minecraft:player"],
    },
    then: auraCheck,
});
