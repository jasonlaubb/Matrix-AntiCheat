import { world } from '@minecraft/server';
import config from '../../../data/config.js';
import { flag, uniqueId, punish } from '../../../unti/World.js';

const placement_a = () => {
  const EVENT = world.afterEvents.playerPlaceBlock.subscribe(ev => {
    const player = ev.player;
    if(uniqueId(player)) return;
    const block = ev.block;
    if(!config.modules.placementA.containerblock.includes(block.typeId)) return;
    const inv = block.getComponent("inventory").container;
    let getItem = false;
    for(let i = 0; i < inv.size; i++) {
      if(inv.getItem(i)) {
        getItem = true;
        break
      }
    };
    if(getItem) {
      for(let i = 0; i < inv.size; i++) {
        inv.setItem(i)
      };
      flag(player, 'Placement/A', 0);
      punish(player, 'Placement/A', config.modules.placementA.punishment)
    }
  });
  if(!config.modules.placementA.state) {
    world.afterEvents.playerPlaceBlock.unsubscribe(EVENT);
  };
};

export { placement_a }