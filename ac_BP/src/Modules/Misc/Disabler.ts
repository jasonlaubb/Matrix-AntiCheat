import { Entity, EntityDamageCause, EntityEquippableComponent, EntityHurtAfterEvent, EquipmentSlot, ItemDurabilityComponent, Player, PlayerSpawnAfterEvent, system, world } from "@minecraft/server";
import { isAdmin, flag } from "../../Assets/Util";
import { MinecraftEntityTypes, MinecraftItemTypes } from "../../node_modules/@minecraft/vanilla-data/lib/index";
import { registerModule, configi } from "../Modules.js";
import { AnimationControllerTags, MatrixUsedTags } from "../../Data/EnumData";

/**
 * @author jasonlaubb
 * @description Detect if player try to use disabler to bypass anti-cheat
 * Thanks for RaMi helps to test!
 */

function intickEvent(config: configi, player: Player) {
    if (isAdmin(player) || player.hasTag(MatrixUsedTags.disabler) || !player.hasTag(AnimationControllerTags.alive)) return;
    if (player.isGliding) {
        const elytra = player.getComponent(EntityEquippableComponent.componentId)!?.getEquipment(EquipmentSlot.Chest)!;
        const durability = elytra?.getComponent(ItemDurabilityComponent.componentId);
        if (elytra?.typeId != MinecraftItemTypes.Elytra || (elytra?.typeId == MinecraftItemTypes.Elytra && durability.maxDurability - durability.damage <= 1)) {
            player.addTag(MatrixUsedTags.disabler);
            system.runTimeout(() => player.removeTag(MatrixUsedTags.disabler), 10);
            player.teleport(player.lastNonGlidingPoint);
            flag(player, "Disabler", "A", config.antiDisabler.maxVL, config.antiDisabler.punishment, undefined);
        }
    } else {
        player.lastNonGlidingPoint = player.location;
    }
}

function doubleEvent(config: configi, damagingEntity: Entity, hurtEntity: Entity) {
    if (hurtEntity.id == damagingEntity.id) {
        const location = hurtEntity.location;
        system.run(() => hurtEntity.teleport(location));
        flag(hurtEntity as Player, "Disabler", "B", config.antiDisabler.maxVL, config.antiDisabler.punishment, undefined);
    }
}

function tripleEvent({ player, initialSpawn }: PlayerSpawnAfterEvent) {
    if (!initialSpawn) return;
    player.removeTag(MatrixUsedTags.disabler);
}

registerModule(
    "antiDisabler",
    false,
    [],
    {
        intick: async (config, player) => intickEvent(config, player),
        tickInterval: 1,
    },
    {
        worldSignal: world.afterEvents.entityHurt,
        playerOption: { entityTypes: [MinecraftEntityTypes.Player] },
        then: async (config, { damageSource: { damagingEntity, damagingProjectile, cause }, hurtEntity }: EntityHurtAfterEvent) => {
            if (!(hurtEntity instanceof Player) || isAdmin(hurtEntity as Player) || !damagingEntity || cause != EntityDamageCause.entityAttack || damagingProjectile || !damagingEntity) return;
            doubleEvent(config, damagingEntity, hurtEntity);
        },
    },
    {
        worldSignal: world.afterEvents.playerSpawn,
        playerOption: { entityTypes: [MinecraftEntityTypes.Player] },
        then: async (_config, event: PlayerSpawnAfterEvent) => {
            tripleEvent(event);
        },
    }
);
