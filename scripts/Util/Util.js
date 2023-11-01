import {
  Block,
  Dimension,
  Player,
  Vector,
  world, 
  GameMode 
} from '@minecraft/server'

/**
 * @param {*} input 
 * @param {boolean} sameline 
 * @returns
 */
const infromationHandler = (input, sameline) => {
  if (input === undefined || input === null) return ''

  let output = ''
  const index = sameline === false ? '\n' : ' '
  for (const infromation of input) {
    const maxLimit = infromation[2] === undefined ? '' : `§8/§g${infromation[2]}`
    output += `${index}§c${infromation[0]} §8= §8(§g${infromation[1]}${maxLimit}§8)`
  }

  return output
}

class Detect {
/**
 * @remarks
 * post this message with [Matrix] to all player has 'notify' tag
 * 
 * @param {string} message
 */
  static notify (message) {
    [...world.getPlayers({ tag: 'notify' })].forEach(player => player.sendMessage('§e[§cMatrix§e] ' + message))
  }
/**
 * @remarks
 * post this message with [Matrix] to all player has 'notify' tag
 * 
 * @param {string} message
 * @param {string} tag
 */
  static notifyToTag (message, tag) {
    [...world.getPlayers({ tag: tag })].forEach(player => player.sendMessage('§e[§cMatrix§e] ' + message))
  }
/**
 * @remarks
 * flag the player if it is cheating
 * 
 * @param {Player} player
 * The player that going to be flagged
 * 
 * @param {string} module
 * The string present the module that detected
 * 
 * @param {string} type
 * The type of module
 * 
 * @param {string} punishment
 * The punishment here
 * 
 * @param {string[[]]} infromation
 * Input the value that anticheat detect
 * [[<class>,<value>,<max value?>]]
 * Like [['SprintAngle','203.15'],['isSprinting','true']]
 * null when no need
 * 
 * @param {boolean} teleportState
 * True if need teleport (Boolean)
 * false when no need
 * 
 * @param {Vector} teleportPos
 * The pos that should lagged back the player (Vector3)
 * 
 * @returns
 * If their the infromation or player is op it will return false,
 * else it will alway return true
 */
  static flag (player, module, type, punishment, infromation,  teleportState, teleportPos) {
    //stop running and return false when got Error
    if (!!player === false || !!module === false || !!type === false || !!punishment === false) return false
    if (player.hasTag('MatrixOP')) return false

    const infromation2 = infromationHandler(infromation, false)

    switch (punishment) {
      case "none": {
        break
      }
      case "kick": {
        world.sendMessage(`§e[§cMatrix§e] §b${player.name} §chas been kicked!§r\n§gBy§8:§cMatrix\n§gReason§8:§c${module} §8(§g${type}§8)§r`)
        player.runCommand(`kick "${player.name}" \n§8 >> §c§lYou are kicked!\n§r§8 >> §gReason§8:§c${module} §8(§g${type}§8)${infromationHandler(infromation, true)}\n§r§8 >> §gBy§8:§cMatrix`)
        break
      }
      case "ban": {
        player.addTag("ban")
        player.addTag(`Reason:§c${module} §8(§g${type}§8)§r`)
        player.addTag(`By:Matrix§r`)
        world.scoreboard.getObjective('bantimer').setScore(player, 40)
      }
      default: {
        console.warn("Invalid punishment on " + module + type)
        return false
      }
    }  
    if (teleportState === true) {
      player.teleport(teleportPos)
    }
    
    this.notify(`§g${module} §8(§g${type}§8) §chas been detected from §b${player.name}${infromation2}`)
    return true
  }
}

class Util {
/**
 * @remarks
 * get the gamemode of the player
 * 
 * @param {Player} player
 * 
 * @returns
 * return the number of gamemode
 */
  static GamemodeOf (player) {
    const gamemodes = {
      survival: 0,
      creative: 1,
      adventure: 2,
      spectator: 3
    }
      
    for (const gamemode in GameMode) {
      if ([...world.getPlayers({
        name: player.name,
        gameMode: GameMode[gamemode]
      })].length > 0) return gamemodes[gamemode]
    }
  }

/**
 * @remarks
 * set the score of a player on a scoreboard
 * 
 * @param {Player} player 
 * @param {string} scoreboard 
 * @param {number} amount
 */
  static setScore (world, player, scoreboard, amount) {
    world.scoreboard.getObjective(scoreboard).setScore(player.scoreboardIdentity, amount)
  }

/**
 * @remarks
 * add the score of a player on a scoreboard
 * 
 * @param {Player} player 
 * @param {string} scoreboard 
 * @param {number} amount
 */
  static addScore (world, player, scoreboard, amount) {
    world.scoreboard.getObjective(scoreboard).addScore(player.scoreboardIdentity, amount)
  }
/**
 * @remarks
 * recover the block of the location of dimenson without beforeEvents
 * 
 * @param {Dimension} dimenson 
 * @param {Vector} pos 
 * @param {Block} block 
 */
  static RecoverBlock (dimenson, pos, block) {
    dimenson.getEntities({
      minDistance: 0,
      maxDistance: 2,
      location: pos,
      type: 'minecraft:item'
    }).forEach(item => item.kill())
    block.setPermutation(block.clone())
  }
}

//export the method class
export { Detect, Util }
