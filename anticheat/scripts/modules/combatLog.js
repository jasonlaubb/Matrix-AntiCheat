import { antiCombatLogEnabled } from "../config";
import { world } from "@minecraft/server"

const getSetting = () => {
  return {
    canAdmin: world.scoreboard.getObjective('setting:combatLogCanAdmin') === undefined ? true : false,
    entityTrigger: world.scoreboard.getObjective('setting:entityTrigger') === undefined ? false : true,
    showOnActionBar: world.scoreboard.getObjective('setting:showOnActionBar') === undefined ? true : false,
    combatTimeDuration: world.scoreboard.getObjective('settng:combatLogDuration').getScore('combat_time') ?? 30,
    killPlayerWhoLeft: world.scoreboard.getObjective('setting:killPlayerWhoLeft') === undefined ? false : true,
    giveSpawnProtection: world.scoreboard.getObjective('setting:spawnProtection') === undefined ? false : true,
    spawnProtectionDuration: world.scoreboard.getObjective('settng:combatLogDuration').getScore('protect_time') ?? 30
  }
}

const startCombat = (player, setting) => {
  world.scoreboard.getObjective('combatingTime').setScore(player, setting.combatTimeDuration)
  if (!player.hasTag('combating')) {
    player.sendMessage('§e[§cMatrix§e]§c You are combat logged!')
    player.addEffect()
  }
}

const startSpawnProtection = (player, time) => {
  world.scoreboard.getObjective('protectionTime').setScore(player, time)
}

if (antiCombatLogEnabled === true) {
  world.afterEvents.entityHurt.subscribe(ev => {
    const player = ev.hurtEntity
    const source = ev.damageSource
    const setting = getSetting()
    if (world.scoreboard.getObjective('toggle:c-log') === undefined) return;

    if (player.hasTag('protecting') && player.typeId === 'minecraft:player') {
      player.getComponent('health').resetToMaxValue()
    }
    
    if (source.cause !== 'entityAttack' || (setting.canAdmin && ((player.hasTag('MatrixOP') && player.typeId === 'minecraft:player') || (source.damagingEntity.hasTag('MatrixOP') && source.damagingEntity.typeId === 'minecraft:player')))) return;

    if (player.typeId === 'minecraft:player') {
      if (source.damagingEntity.typeId === 'minecraft:player') {
        startCombat(player, setting)
        startCombat(source.damagingEntity, setting)
      } else {
        if (setting.entityTrigger) {
          startCombat(player, setting)
        }
      }
    } else {
      if (setting.entityTrigger) {
        startCombat(player, setting)
      }
    }
  })
  world.afterEvents.playerLeave.subscribe(ev => {
    const player = ev.playerName;
    if (world.scoreboard.getObjective('toggle:c-log') === undefined) return;
    if (world.scoreboard.getObjective('inCombat').hasParticipant('player:' + player)) {
      world.sendMessage(`§g[§cMatrix§g] §gCombat Log §8(§gA§8) §chas been detected from §b${player}`)
    }
  })
  world.afterEvents.playerSpawn.subscribe(ev => {
    const player = ev.player
    if (world.scoreboard.getObjective('toggle:c-log') === undefined) return;
    const setting = getSetting()
    if (ev.initialSpawn) {
      if (world.scoreboard.getObjective('inCombat').hasParticipant('player:' + player) || player.hasTag('combating')) {
        world.sendMessage(`§g[§cMatrix§g] §gCombat Log §8(§gA§8) §cflagged §b${player.name}`)
        if (setting.killPlayerWhoLeft === true) player.kill()
      }
    } else {
      world.scoreboard.getObjective('combatingTime').setScore(player, 0)
      if (setting.giveSpawnProtection) startSpawnProtection(player, setting.spawnProtectionDuration)
    }
  })
}

async function antiCombatLog (player2) {
  if (antiCombatLogEnabled !== true || world.scoreboard.getObjective('toggle:c-log') === undefined) return;

  if ((!getSetting().canAdmin && player.hasTag('MatrixOP')) || !player.hasTag('combating')) return;
  const player = world.getPlayers()[0]

  if (player.hasTag('combating')) {
    const canShow = getSetting().showOnActionBar
    if (canShow === true) player.onScreenDisplay.setActionBar(`§r§eYour are §ccombat logged §l§b(§g${world.scoreboard.getObjective('combat_time').getScore(player)}§b)§r`)
    if (!world.scoreboard.getObjective('inCombat').hasParticipant('player:' + player.name)) {
      world.scoreboard.getObjective('inCombat').addScore('player' + player.name, 0)
    }
  } else {
    if (world.scoreboard.getObjective('inCombat').hasParticipant('player:' + player.name)) {
      world.scoreboard.getObjective('inCombat').removeParticipant('player:' + player.name)
      if (canShow === true) player.onScreenDisplay.setActionBar(`§r§eYour are §ano longer §ecombat logged§r`)
      player.sendMessage('§e[§cMatrix§e]§c You are no longer combat logged')
    }
  }

  if (player.hasTag('protecting')) {
    if (player.getEffect('resistance').duration <= 10 || player.getEffect('resistance').amplifier < 255) player.addEffect('resistance', 20, { amplifier: 255, showParticles: false })
  }
}

export { antiCombatLog }