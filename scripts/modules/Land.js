//@ts-check

import {
  Player,
  world,
  system
} from '@minecraft/server'
import { Error } from '../Commands/commands'

import { _uuid } from '../Util/Util'

import { prefix } from '../config'

//The only input thing
export { LandHandler }

// ============= EVENT =============
world.afterEvents.worldInitialize.subscribe(() => {
  //Give the first value to world dynamic properties
  if (world.getDynamicProperty('LAND_DATA') === undefined) {
    world.setDynamicProperty('LAND_DATA', JSON.stringify([]))
  }

  if (world.getDynamicProperty('MATCH_TAG') === undefined) {
    world.setDynamicProperty('MATCH_TAG', JSON.stringify([]))
  }
})

world.afterEvents.playerSpawn.subscribe(({ initialSpawn, player }) => {
  if (!initialSpawn) return

  if (player.getDynamicProperty('LAND_TAG') === undefined) {
    //Give the first value to world dynamic properties
    const landData = JSON.parse(String(world.getDynamicProperty('MATCH_TAG')))
    let uuid

    while (true) {
      const uuid2 = _uuid()
      if (landData.every(id => id.uuid !== uuid2)) {
        uuid = uuid2
        break
      }
    }

    player.setDynamicProperty('LAND_TAG', uuid)
    world.setDynamicProperty('MATCH_TAG', JSON.stringify([
      ...JSON.parse(String(world.getDynamicProperty('MATCH_TAG'))),
      { name: player.name, id: uuid }
    ]))
  } else {
    const DynamicProperty = JSON.parse(String(player.getDynamicProperty('LAND_TAG')))

    //If player name is outdated, update the data
    if (DynamicProperty.name !== player.name) {
      player.setDynamicProperty('LAND_TAG', JSON.stringify({ name: player.name, uuid: DynamicProperty.uuid }))
      world.setDynamicProperty('MATCH_TAG', JSON.stringify(updateNameByUUID(DynamicProperty, JSON.parse(String(world.getDynamicProperty('MATCH_TAG'))))))
    }
  }
})

world.beforeEvents.playerBreakBlock.subscribe(({ player, block, cancel }) => {
  const isOnLand = onLand (block.location)

  if (isOnLand.state === false) return

  const uuid = JSON.parse(String(player.getDynamicProperty('LAND_TAG')))

  if (isOnLand.land.owner === uuid || isOnLand.land.member.includes(uuid)) return

  if (isOnLand.land.permisson.Destroy === true) return

  cancel = true
  player.sendMessage(`§e[§cMatrix§e]§c No §gdestroy §cpermisson`)
})

world.beforeEvents.playerBreakBlock.subscribe(({ player, block, cancel }) => {
  const isOnLand = onLand (block.location)

  if (isOnLand.state === false) return

  const uuid = JSON.parse(String(player.getDynamicProperty('LAND_TAG')))

  if (isOnLand.land.owner === uuid || isOnLand.land.member.includes(uuid)) return

  if (isOnLand.land.permisson.Placement === true) return

  cancel = true
  player.sendMessage(`§e[§cMatrix§e]§c No §gplacement §cpermisson`)
})

world.beforeEvents.itemUseOn.subscribe(({ source: player, block, cancel }) => {
  const isOnLand = onLand (block.location)

  if (isOnLand.state === false) return

  const uuid = JSON.parse(String(player.getDynamicProperty('LAND_TAG')))

  if (isOnLand.land.owner === uuid || isOnLand.land.member.includes(uuid)) return

  if (isOnLand.land.permisson.UseItemOn === true) return

  cancel = true
  player.sendMessage(`§e[§cMatrix§e]§c No §guseItemOn §cpermisson`)
})

world.beforeEvents.itemUse.subscribe(({ source: player, cancel, itemStack: item }) => {
  if (item.typeId !== 'minecraft:ender_peal' && item.typeId !== 'minecraft:chorus_fruit') return
  const isOnLand = onLand ({
    x: Math.floor(player.location.x),
    y: Math.floor(player.location.y),
    z: Math.floor(player.location.z)
  })

  if (isOnLand.state === false) return

  const uuid = JSON.parse(String(player.getDynamicProperty('LAND_TAG')))

  if (isOnLand.land.owner === uuid || isOnLand.land.member.includes(uuid)) return

  if (isOnLand.land.permisson.Teleport === true) return

  cancel = true
  player.sendMessage(`§e[§cMatrix§e]§c No §gteleport §cpermisson`)
})

world.beforeEvents.playerInteractWithBlock.subscribe(({ player, block, cancel }) => {
  const isOnLand = onLand (block.location)

  if (isOnLand.state === false) return

  const uuid = JSON.parse(String(player.getDynamicProperty('LAND_TAG')))

  if (isOnLand.land.owner === uuid || isOnLand.land.member.includes(uuid)) return

  if (isOnLand.land.permisson.Container === true) return

  cancel = true
  player.sendMessage(`§e[§cMatrix§e]§c No §gcontainer §cpermisson`)
})


// ============= FUNCTION =============

/** 
 * @param {string[]} regax 
 * @param {Player} player
*/
function LandHandler (player, regax) {
  switch (regax[1]) {
    case "force": {
      if (!player.hasTag('MatrixOP')) return new Error().NoOp()

      switch (regax[2]) {
        case "create": {
          
          system.run(() => create (player, 'create', Number(regax[3]), Number(regax[5]), Number(regax[4]), Number(regax[6])))
          break
        }
        case "delete": {
          system.run(() => deletes (player, 'delete', regax[3]))
          break
        }
        default: {
          if (player.hasTag('MatrixOP'))
          system.run(() => player.sendMessage([
            `§b====== §cLand §b ======`,
            `§b${prefix}land force create <x1> <z1> <x2> <z2>`
          ].join('\n')))
        }
      }
    }
  }
}

/** @param {Player} player  */
function landTag (player) {
  return player.getDynamicProperty('LAND_TAG')
}

function formatNumber(number) {
  const str = String(number);
  const length = str.length;
  
  if (length <= 4) {
    return str.padStart(4, '0');
  } else if (length === 5) {
    return `${str.slice(0, 1).padStart(4, '0')}-${str.slice(1)}`;
  } else if (length === 6) {
    return `${str.slice(0, 2).padStart(4, '0')}-${str.slice(2)}`;
  } else if (length === 8) {
    return `${str.slice(0, 4)}-${str.slice(4)}`;
  } else if (length === 12) {
    return `${str.slice(0, 4)}-${str.slice(4, 8)}-${str.slice(8)}`;
  }
  
  return str;
}

function deletes (player, keyword, uuid) {
  const deleted = findAndDeleteObjectByUUID (uuid, JSON.parse(String(world.getDynamicProperty('LAND_DATA'))), player.getDynamicProperty('LAND_TAG').uuid, true)

  switch (deleted) {
    case undefined: {
      player.sendMessage(`§e[§cMatrix§e]§c This land isn't defined`)
      return
    }
    case false: {
      player.sendMessage(`§e[§cMatrix§e]§c No! You aren't the owner of this land!`)
      return
    }
    default:
      break
  }

  player.sendMessage(`§e[§cMatrix§e]§b Land ${keyword}!\n\n§gLand:§c${deleted.uuid}\n§gOwner:§c${getNameFromUUID(deleted.uuid)}`)
}

function create (player, keyword, x1, x2, z1, z2) {
  if (Number.isNaN (x1) || Number.isNaN (x2) || Number.isNaN (z1) || Number.isNaN (z2) || Math.abs (x1) > 30000000 || Math.abs (x2) > 30000000 || Math.abs (z1) > 30000000 || Math.abs (z2) > 30000000) {
    return player.sendMessage (`§e[§cMatrix§e]§cYou location provided is invalid`)
  }
  const land = JSON.parse(String(world.getDynamicProperty('LAND_DATA')))
  let uuid
  for (let i = 0; true; i++) {
    let time = 10 ** Math.trunc(i / 10000)
    time = time === 0 ? 1 : time
    const random = Math.round(Math.random() * 10000 * time)
    if (land.every(id => id.uuid !== formatNumber(random))) {
      uuid = formatNumber(random)
      break
    }
  }
  const landData = {
    startPos: { x: Math.min(Math.floor(x1), Math.floor(x2)), z: Math.min(Math.floor(z1), Math.floor(z2))}, //Smallest location of the land
    endPos: { x: Math.max(Math.floor(x1), Math.floor(x2)), z: Math.max(Math.floor(z1), Math.floor(z2))}, //Biggest location of the land
    owner: landTag (player), //the uuid of owner
    uuid: uuid, //the uuid of land
    permissons: { //default permisson list
      Destroy: false,
      Placement: false,
      Container: false,
      UseItemOn: false,
      GTeleport: true,
      Teleport: false
    },
    member: [] //empty member array
  }

  const isRepeated = checkRepeatedLand (landData)

  if (isRepeated.state === false) {
    world.setDynamicProperty('LAND_DATA', JSON.stringify([
      ...JSON.parse(String(world.getDynamicProperty('LAND_DATA'))),
      landData
    ]))
    player.sendMessage(`§e[§cMatrix§e]§b Sucess to ${keyword} a land! Land ID: ${landData.uuid}`)
  } else {
    player.sendMessage(`§e[§cMatrix§e]§c Your land overlap with others!\n§gLand:§c${isRepeated.land.uuid}\n§gOwner:§c${getNameFromUUID(isRepeated.land.uuid)}`)
  }
}

function findAndDeleteObjectByUUID(uuid, array, owner, bypass) {
  const index = array.findIndex(item => item.uuid === uuid);
  if (index === -1) {
    return undefined;
  }
  if (bypass || array[index].owner === owner) {
    const deletedObject = array[index];
    array.splice(index, 1);
    return deletedObject;
  }
  return false;
}

function getNameFromUUID (uuid) {
  const arr = JSON.parse(String(world.getDynamicProperty('MATCH_TAG')))
  const found = arr.find(item => item.uuid === uuid)
  return found ? found.name : null
}

function updateNameByUUID (obj, array) {
  const index = array.findIndex(item => item.uuid === obj.uuid);
  if (index !== -1) {
    array[index].name = obj.name;
  }
  return array
}

function checkOverlap (startPosA, endPosA, startPosB, endPosB) {
  if (startPosA.x > endPosB.x || startPosB.x > endPosA.x) {
    return false
  }
  if (startPosA.z > endPosB.z || startPosB.z > endPosA.z) {
    return false
  }
  return true
}

function onLand (position) {
  const DynamicProperty = JSON.parse(String(world.getDynamicProperty('LAND_DATA')))

  let repeated = undefined
  for (const land of DynamicProperty) {
    const { startPos, endPos } = land
    let overlap = true
    if (position.x > endPos.x || position.x < startPos.x) {
      overlap = false
    }
    if (position.z > endPos.z || position.z < startPos.z) {
      overlap = false
    }
    if (overlap === true) {
      repeated = land
      break
    } else continue
  }

  if (repeated === undefined) {
    return { state: false, land: null }
  } else {
    return { state: true, land: repeated }
  }
}

function checkRepeatedLand (landData) {
  const DynamicProperty = JSON.parse(String(world.getDynamicProperty('LAND_DATA')))

  let repeated = undefined
  const { startPos: startPosA, endPos: endPosA } = landData
  for (const land of DynamicProperty) {
    const { startPos: startPosB, endPos: endPosB } = land
    const overlap = checkOverlap (startPosA, endPosA, startPosB, endPosB)
    if (overlap === true) {
      repeated = land
      break
    } else continue
  }

  if (repeated === undefined) {
    return { state: false, land: null }
  } else {
    return { state: true, land: repeated }
  }
}
