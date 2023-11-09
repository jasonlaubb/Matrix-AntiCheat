import { world, system } from '@minecraft/server';
import {
  antiBadPacketEnabled, antiInvalidSrpintEnabled,
} from '../../config';
import { LocalData } from "../../Util/DataBase"

const isBadPacket = (player, a) => {
  Detect.flag(player, "BadPacket", a, "kick", null, false)
}

const detect2 = (player, a, module) => {
  Detect.flag(player, module, a, "kick", null, false)
}

async function antiBadPacket (player) {
  try{
  if (!antiBadPacketEnabled || world.scoreboard.getObjective('toggle:badpacket') || player.hasTag('MatrixOP')) return
  const rotation = player.getRotation()
  const selectedSlot = player.selectedSlot
  if (rotation.x > 90 || rotation.x < -90 || rotation.y > 180 || rotation.y < -180) {
    player.setRotation({ x: 0, y: 0 })
    isBadPacket (player, 'A')
  }

  /* This check is no longer been used
  if (selectedSlot < 0 || selectedSlot > 8 || Number.isNaN(selectedSlot)) {
    player.selectedSlot = 0
    isBadPacket (player, 'B')
  }
  */

  if (player.isJumping && player.fallDistance === 0) {
    const pos = { x: Math.floor(player.location.x), y: Math.floor(player.location.y) + 2, z: Math.floor(player.location.z) }
    if ([-1,0,1].every(x => [-1,0,1].every(z => player.dimension.getBlock({ location: { x: pos.x + x, y: pos.y, z: pos.z }})?.isAir))) {
      isBadPacket (player, 'C')
    }  
  }} catch {} 
}

world.afterEvents.entityHurt.subscribe(ev => {
  const player = ev.hurtEntity
  if (!antiBadPacketEnabled || world.scoreboard.getObjective('toggle:badpacket') || player.typeId !== 'minecraft:player' || player.hasTag('MatrixOP') || ev.damageSource.cause !== 'entityAttack') return
  if (player.getEffect('weakness')?.amplifier >= 255) return
  if (player.id === ev.damageSource.damagingEntity.id) {
    player.addEffect('weakness', 60, { amplifier: 255, showParticles: false })
    isBadPacket (player, 'D')
  }
})

const InvalidSprintBuff = new LocalData("InvalidSprintBuff")
async function antiInvalidSprint (player) {
try{
  if (!antiInvalidSrpintEnabled || world.scoreboard.getObjective('toggle:invalidsrpint') || player.hasTag('MatrixOP') || player.isGliding == true) return

  if (player.isSprinting) {
    try {
      const buff = InvalidSprintBuff.get(player) ?? 0
      const velocity = player.getVelocity()
      const pos1 = player.location
      const pos2 = { x: pos1.x + velocity.x, z: pos1.z + velocity.z }

      let angle = Math.atan2((pos2.z - pos1.z), (pos2.x - pos1.x)) * 180 / Math.PI - player.getRotation().y - 90;
      if (angle <= -180) angle += 360;
      angle = Math.abs(angle);

      if (angle > 180 && !player.isFlying && !player.isSwimming) {
        //this modules is on beta
        if (buff <= 0) return InvalidSprintBuff.set(player, buff + 1)
        InvalidSprintBuff.set(player, undefined)
        Detect.flag(player, "InvalidSprint", "A", "none", [["SprintAngle",angle,"180"]], true, player.location)
      } else InvalidSprintBuff.set(player, undefined)
    } catch { }
    
    //Other small checking
    /* This checks is no longer been used
    if (player.isGliding) {
      player.teleport(player.location)
      detect2 (player, 'A', 'AutoSprint')
    }
    */

    if (player.getEffect('blindness')) {
      system.run(() => {
        const player2 = world.getPlayers({ name: player.name })[0]
        if (player2.isSprinting && player2.getEffect('blindness')) {
          player.teleport(player.location)
          detect2 (player, 'B', 'AutoSprint')
        }
      })
    }

    if (player.isSneaking && !player.isSwimming) {
      player.teleport(player.location)
      detect2 (player, 'A', 'AutoMove')
    }
  }} catch{
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
