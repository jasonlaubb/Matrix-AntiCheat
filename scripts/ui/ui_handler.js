import { DynamicPropertiesDefinition, world } from "@minecraft/server";
import { openTheUI } from "./ui";

world.afterEvents.worldInitialize.subscribe(ev => {
  ev.propertyRegistry.registerWorldDynamicProperties(new DynamicPropertiesDefinition().defineNumber('Matrix:UI-key'))

  if (!world.getDynamicProperty('Matrix:UI-key')) {
    const random = Math.random()
    world.setDynamicProperty('Matrix:UI-key', random)
  }
})

world.afterEvents.itemUse.subscribe(ev => {
  const player = ev.source;
  if (player.typeId !== 'minecraft:player' || !player.hasTag('MatrixOP')) return;
  const item = ev.itemStack.getLore()
  try {
    if (item[1].slice(4) !== world.getDynamicProperty('Matrix:UI-key')) return;
  } catch { return }

  //open the ui for player
  openTheUI(player)
})