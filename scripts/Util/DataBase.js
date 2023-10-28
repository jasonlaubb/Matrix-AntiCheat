import { world } from "@minecraft/server"

class LocalData {
  id
  constructor (id) {
    this.id = id
  }
  get (player) {
    return world.getDynamicProperty(`LocalData:${player.id}:${this.id}`)
  }
  set (player, value) {
    world.setDynamicProperty(`LocalData:${this.id}:${player.id}`, value)
  }
}

class GobalData {
  static get (key) {
    return world.getDynamicProperty(`GobalData:${key}`)
  }
  static set (key, value) {
    world.setDynamicProperty(`GobalData:${key}`, value)
  }
}

export { LocalData, GobalData }
