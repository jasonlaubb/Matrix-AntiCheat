import { world, Vector } from "@minecraft/server"

const LastVelocity = new Map()

const antiKnockBackEnabled = true
if (antiKnockBackEnabled) {
  world.afterEvents.playerLeave.subscribe(ev => {
    try {
      lastSpeed.delete(ev.playerId)
    } catch { }
  })
  world.afterEvents.entityHurt.subscribe(ev => {
    if (!!world.scoreboard.getObjective("toggle:noKB") === true) return
    
    const player = ev.hurtEntity
    if (player.typeId !== "minecraft:player" || player.hasTag("MatrixOP")) return

    //hurt timer
  })
}

async function antiKnockBack (player) {
  if (!antiKnockBackEnabled || !!world.scoreboard.getObjective("toggle:noKB") === true) return
  const lastPos = {
      x: world.scoreboard.getObjective("KBposX").getScore(player) / 100,
      y: world.scoreboard.getObjective("KBposY").getScore(player) / 100,
      z: world.scoreboard.getObjective("KBposZ").getScore(player) / 100
    }
  world.scoreboard.getObjective("KBposX").setScore(player, player.location.x.toFixed(3) * 100)
  world.scoreboard.getObjective("KBposY").setScore(player, player.location.y.toFixed(3) * 100)
  world.scoreboard.getObjective("KBposZ").setScore(player, player.location.z.toFixed(3) * 100)
  
  const velocity = player.getVelocity()
  const lastVelocity = LastVelocity.get(player.id)
  LastVelocity.set(player.id, velocity)
  
  if (Vector.distance(lastPos, player.location) < 0.1) 
  
  const lastIsOnGround = player.hasTag("lastIsOnGround")
  try {
    player.removeTag("lastIsOnGround")
  } catch { }
  if (player.isOnGround) player.addTag("lastIsOnGround")
  //return if player is on ground last tick
  if (lastIsOnGround) return
  
  const testPos = {
    x: lastPos.x + velocity.x,
    y: lastPos.y + velocity.y,
    z: lastPos.z + velocity.z
  }
  
  const prevDis = Vector.distance(testPos, player.location)
  const testDis = Vector.distance(testPos, lastPos)
  if (Math.abs(prevDis - testDis) < 0.1) return
  
  const playerSpeed = Math.abs(Math.sqrt(lastVelocity.x ** 2 + lastVelocity.y ** 2 + lastVelocity.z ** 2))
  if (playerSpeed < 0.05) return
  
  if (player.hasTag("getAttacked") && Math.min(testPos, lastPos) === prevDis && velocity.x === 0 && velocity.z === 0) {
    player.teleport(lastPos)
    //flag them
  }
}
