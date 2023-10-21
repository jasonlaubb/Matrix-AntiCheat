import { world, system } from '@minecraft/server';
import {
  antiBadPacketEnabled, antiInvalidSrpintEnabled,

} from '../../config';

const isBadPacket = (player, a) => {
  world.sendMessage(`§e[§cMatrix§e] §b${player.name} §chas been kicked!§r\n§gBy§8:§cMatrix\n§gReason§8:§cbadpacket §8(§g${a}§8)§r`)
  player.runCommand(`tellraw @a[tag=notify]{"rawtext":[{"text":"§g[§cMatrix§g] §gbadpacket §8(§g${a}§8) §chas been detected from §b${player.name}"}]}`)
  player.runCommand(`kick "${player.name}" .\n§8 >> §c§lYou are kicked bad boy\n§r§8 >> §gReason§8:§cbadpacket §8(§g${a}§8)§r\n§8 >> §gBy§8:§cMatrix`)
}

const detect2 = (player, a, module) => {
  world.sendMessage(`§e[§cMatrix§e] §b${player.name} §chas been kicked!§r\n§gBy§8:§cMatrix\n§gReason§8:§c${module} §8(§g${a}§8)§r`)
  player.runCommand(`tellraw @a[tag=notify]{"rawtext":[{"text":"§g[§cMatrix§g] §g${module} §8(§g${a}§8) §chas been detected from §b${player.name}"}]}`)
  player.runCommand(`kick "${player.name}" .\n§8 >> §c§lYou are kicked bad boy\n§r§8 >> §gReason§8:§c${module} §8(§g${a}§8)§r\n§8 >> §gBy§8:§cMatrix`)
}

async function antiBadPacket (player) {
  if (!antiBadPacketEnabled || world.scoreboard.getObjective('toggle:badpacket') || player.hasTag('MatrixOP')) return
  const rotation = player.getRotation()
  const selectedSlot = player.selectedSlot()

  if (rotation.x > 90 || rotation.x < 90 || rotation.y > 180 || rotation.y < 180) {
    player.setRotation({ x: 0, y: 0 })
    isBadPacket (player, 'A')
  }

  if (selectedSlot < 0 || selectedSlot > 8 || Number.isNaN(selectedSlot)) {
    player.selectedSlot = 0
    isBadPacket (player, 'B')
  }
}

async function antiInvalidSprint (player2) {
  const player = world.getPlayers()[0]
  if (!antiInvalidSrpintEnabled || world.scoreboard.getObjective('toggle:invalidsrpint') || player.hasTag('MatrixOP')) return

  if (player.isSprinting) {
    try {
      const velocity = player.getVelocity()
      const pos1 = player.location
      const pos2 = { x: pos1.x + velocity.x, z: pos1.z + velocity.z }

      let angle = Math.atan2((pos2.z - pos1.z), (pos2.x - pos1.x)) * 180 / Math.PI - player.getRotation().y - 90;
      if (angle <= -180) angle += 360;
      angle = Math.abs(angle);

      if (angle > 120 && !player.isFlying) {
        //this modules is on beta
        player.teleport(player.location)
        player.runCommand(`tellraw @a[tag=notify]{"rawtext":[{"text":"§g[§cMatrix§g] §gInvalidSprint §chas been detected from §b${player.name}\n§cSprintAngle§8 = §8(§g${angle.toFixed(2)}§8)"}]}`)
      }
    } catch { }
    
    //Other small checking
    if (player.isGliding) {
      player.teleport(player.location)
      detect2 (player, 'A', 'AutoSprint')
    }

    if (player.getEffect('blindness')) {
      system.run(() => {
        const player2 = world.getPlayers({ name: player.name })[0]
        if (player2.isSprinting && player2.getEffect('blindness')) {
          player.teleport(player.location)
          detect2 (player, 'B', 'AutoSprint')
        }
      })
    }

    if (player.isSneaking) {
      player.teleport(player.location)
      detect2 (player, 'A', 'AutoMove')
    }
  }
}

world.beforeEvents.playerPlaceBlock.subscribe(ev => {
  const player = ev.player
  const block = ev.block

  if (!antiBadPacketEnabled || player.hasTag('MatrixOP')) return

  const p = block.location
  const isAroundAir =
    [-1, 1].every(x => 
      [-1, 1].every(y =>
        [-1, 1].every(z => {
          player.dimension.getBlock({ x: p.x + x, y: p.y + y, z: p.z + z})?.isAir ||
          player.dimension.getBlock({ x: p.x + x, y: p.y + y, z: p.z + z})?.isLiquid
        })
      )
    )
  if (isAroundAir) {
    ev.cancel = true
    system.run(() => {
      isBadPacket (player, 'C')
    })
  }
})

export { antiBadPacket, antiInvalidSprint }