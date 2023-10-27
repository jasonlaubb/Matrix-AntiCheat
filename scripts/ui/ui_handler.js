import { world, system } from "@minecraft/server";
import { openTheUI } from "./ui";

function afterLoad () {
  //generate a new key
  const random = Math.random()
  world.setDynamicProperty('Matrix:UI-key', random)

  world.afterEvents.itemUse.subscribe(ev => {
    const player = ev.source;
    if (player.typeId !== 'minecraft:player' || !player.hasTag('MatrixOP')) return;
    const item = ev.itemStack.getLore()
    try {
      if (Number(item[1].replace("§0§k","")) !== world.getDynamicProperty('Matrix:UI-key')) return;
    } catch { return }

    //open the ui for player
    openTheUI(player)
  })
}

system.run(() => afterLoad())
