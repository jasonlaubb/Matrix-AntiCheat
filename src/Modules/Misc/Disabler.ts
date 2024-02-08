import { EntityDamageCause, EntityEquippableComponent, EntityHurtAfterEvent, EquipmentSlot, ItemDurabilityComponent, Player, PlayerSpawnAfterEvent, system, world } from "@minecraft/server"
import { isAdmin, c, flag } from "../../Assets/Util"
import { MinecraftEntityTypes, MinecraftItemTypes } from "../../node_modules/@minecraft/vanilla-data/lib/index"

/**
 * @author jasonlaubb
 * @description Detect if player try to use disabler to bypass anti-cheat
 * Thanks for RaMi helps to test!
 */

let id: number
export default {
    enable () {
        id = system.runInterval(antiDisabler)
        world.afterEvents.playerSpawn.subscribe(playerSpawn)
        world.afterEvents.entityHurt.subscribe(entityHurt, { entityTypes: [MinecraftEntityTypes.Player] })
    },
    disable () {
        system.clearRun(id)
        world.afterEvents.playerSpawn.unsubscribe(playerSpawn)
        world.afterEvents.entityHurt.unsubscribe(entityHurt)
    }
}

const antiDisabler = () => {
    const players = world.getAllPlayers()
    for (const player of players) {
        if (isAdmin(player) || player.hasTag("matrix:disabler-patched") || !player.hasTag("matrix:alive")) continue
        if (player.isGliding) {
            const elytra = player.getComponent(EntityEquippableComponent.componentId)!?.getEquipment(EquipmentSlot.Chest)!
            const durability = elytra?.getComponent(ItemDurabilityComponent.componentId)
            if (elytra?.typeId != MinecraftItemTypes.Elytra || (elytra?.typeId == MinecraftItemTypes.Elytra && durability.maxDurability - durability.damage <= 1)) {
            const config = c()
                player.addTag("matrix:disabler-patched")
                system.runTimeout(() => player.removeTag("matrix:disabler-patched"), 10)
                player.teleport(player.lastNonGlidingPoint)
                flag(player, "Disabler", "A", config.antiDisabler.maxVL, config.antiDisabler.punishment, undefined)
            }
        } else {
            player.lastNonGlidingPoint = player.location
        }
    }
}

const entityHurt = ({ hurtEntity, damageSource: { damagingEntity, damagingProjectile, cause }}: EntityHurtAfterEvent) => {
    if (isAdmin(hurtEntity as Player) || !damagingEntity || cause != EntityDamageCause.entityAttack || damagingProjectile || !damagingEntity) return;
    if (hurtEntity.id == damagingEntity.id) {
        const location = hurtEntity.location
        system.run(() => hurtEntity.teleport(location))
        const config = c()
        flag (hurtEntity as Player, "Disabler", "B", config.antiDisabler.maxVL, config.antiDisabler.punishment, undefined)
    }
}

const playerSpawn = ({ player, initialSpawn }: PlayerSpawnAfterEvent) => {
    if (!initialSpawn) return
    player.removeTag("matrix:disabler-patched")
}