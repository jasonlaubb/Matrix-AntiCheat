import { world } from "@minecraft/server"

if (true) {
  world.afterEvents.entityHurt.subscribe(ev => {
    if (!!world.scoreboard.getObjective("toggle:noKB") === true) return
    
    const player = ev.hurtEntity
    if (player.typeId !== "minecraft:player" || player.hasTag("MatrixOP")) return
  }
}
