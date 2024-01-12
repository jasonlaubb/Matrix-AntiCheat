import { world, system, EntityHitBlockAfterEvent, Player, EntityInventoryComponent } from "@minecraft/server"
import { flag, c, isAdmin } from "../../Assets/Util"

const antiAutoTool = ({ damagingEntity: player }: EntityHitBlockAfterEvent) => {
    if (!(player instanceof Player) || isAdmin(player) || !player.lastSelectSlot) return
    const config = c()
    const itemStack = player.getComponent(EntityInventoryComponent.componentId).container.getItem(player.selectedSlot)?.typeId ?? "air"
    if (config.antiAutoTool.toolType.some(eit => itemStack.endsWith(eit)) == false) return

    if (player.lastSelectSlot != player.selectedSlot) {
        player.applyDamage(4)
        flag (player, "Auto Tool", "A", config.antiAutoTool.maxVL, config.antiAutoTool.punishment, undefined)
    }
}

const slotLogger = () => {
    const players = world.getAllPlayers()
    for (const player of players) {
        if (isAdmin(player)) continue
        const selectSlot = player.selectedSlot
        system.run(() => player.lastSelectSlot = selectSlot)
    }
}

let id: number

export default {
    enable () {
        world.afterEvents.entityHitBlock.subscribe(antiAutoTool)
        id = system.runInterval(slotLogger)
    },
    disable () {
        world.afterEvents.entityHitBlock.unsubscribe(antiAutoTool)
        system.clearRun(id)
    }
}
