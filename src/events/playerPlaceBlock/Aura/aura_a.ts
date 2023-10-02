import { world, system, EntityInventoryComponent, Container, Block, Player } from '@minecraft/server';
import config from '../../../data/config.js';
import { uniqueId } from '../../../util/World.js';
import { State } from '../../../util/Toggle.js';
import { flag } from '../../../util/Flag.js';

const aura_a = () => {
  const EVENT = world.beforeEvents.playerPlaceBlock.subscribe(ev => {
    const player: Player = ev.player;
    if(uniqueId(player)) return;
    const block: Block = ev.block;
    if(block.typeId !== 'minecraft:obsidian') return;
    system.runTimeout(() => {
      const container: Container = (player.getComponent("inventory") as EntityInventoryComponent).container
      if(container.getItem(player.selectedSlot).typeId == 'minecraft:ender_crystal') {
        ev.cancel = true;
        container.setItem(player.selectedSlot);
        flag(player, 'Aura/A', config.modules.auraA, undefined)
      }
    }, 1)
  });
  if(!State('AURAA', config.modules.auraA.state)) {
    world.beforeEvents.playerPlaceBlock.unsubscribe(EVENT);
  }
};

export { aura_a }