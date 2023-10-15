import { DynamicPropertiesDefinition, world } from "@minecraft/server";
import { openTheUI } from "./ui";

world.afterEvents.worldInitialize.subscribe(ev => {
  ev.propertyRegistry.registerWorldDynamicProperties(new DynamicPropertiesDefinition().defineString('Matrix:UI-key'))

  if (!world.getDynamicProperty('Matrix:UI-key')) {
    const random = Math.floor(Math.random() * 32 + 1)
    world.setDynamicProperty('Matrix:UI-key', random)
  }
})

world.afterEvents.itemUse.subscribe(ev => {
  const player = ev.source;
  if (player.typeId !== 'minecraft:player' || !player.hasTag('MatrixOP')) return;
  const item = ev.itemStack.getLore()
  if (item[1].replace('§0§k','') !== world.getDynamicProperty('Matrix:UI-key')) return;

  //open the ui for player
  openTheUI(player)
})