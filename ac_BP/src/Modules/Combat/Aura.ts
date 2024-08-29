import { Dimension, Entity, EntityHitEntityAfterEvent, Player, system, Vector3, world } from "@minecraft/server";
import { configi, registerModule } from "../Modules";
import MathUtil from "../../Assets/MathUtil";
import { flag } from "../../Assets/Util";

async function auraCheck(config: configi, { damagingEntity, hitEntity: dammy }: EntityHitEntityAfterEvent) {
    const player = damagingEntity as Player;
    if (dammy.typeId == "matrix:aura") {
        playerHitDammy(player, dammy, config);
    } else {
        playerStartCombat(player, config);
    }
}

function playerStartCombat(player: Player, config: configi) {
    // Spawn the dammy
    if (!player.dimension.getEntities({ type: "matrix:aura" }).some((w) => w.getDynamicProperty(player.id))) {
        spawnDammy(player.id, player.dimension, player.location, config);
    }
}

function spawnDammy(id: string, dimension: Dimension, loc: Vector3, config: configi): Entity {
    loc.y += config.antiAura.spawnHeightOffset;
    const offset = MathUtil.randomOffset(config.antiAura.spawnRadius, -config.antiAura.spawnRadius);
    loc.x += offset.x;
    loc.z += offset.z;
    const dammy = dimension.spawnEntity("matrix:aura", loc);
    dammy.setDynamicProperty(id, true);
    return dammy;
}

interface AuraData {
    firstHit: number;
    amount: number;
}
const auraData = new Map<string, AuraData>();
function playerHitDammy(player: Player, dammy: Entity, config: configi) {
    if (!dammy.getDynamicProperty(player.id)) return;
    const now = Date.now();
    const data = auraData.get(player.id) ?? {
        firstHit: now,
        amount: 0,
    };
    if (now - data.firstHit > config.antiAura.comboTime) {
        data.firstHit = now;
        data.amount = 0;
    }
    data.amount++;
    if (data.amount >= config.antiAura.minHitRequired) {
        flag(player, "Aura", "A", config.antiAura.maxVL, config.antiAura.punishment, undefined);
    }
    system.runTimeout(() => {
        spawnDammy(player.id, player.dimension, player.location, config);
    }, 2);
}

registerModule("antiAura", false, [auraData], {
    worldSignal: world.afterEvents.entityHitEntity,
    playerOption: {
        entityTypes: ["minecraft:player"],
    },
    then: auraCheck,
});
