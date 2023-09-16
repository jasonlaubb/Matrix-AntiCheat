import { BlockType, world } from '@minecraft/server';
import config from '../../../data/config.js';
import { flag, uniqueId, punish } from '../../../util/World.js';

const placement_d = () => {
  const EVENT = world.afterEvents.blockPlace.subscribe(ev => {
    const player = ev.player;
    if(uniqueId(player)) return;
    const block = ev.block;
    if(block.typeId.endsWith('shulker_box')) {
      block.setType({id: 'minecraft:air'} as BlockType);
      flag(player, 'Placement/D', 0);
      punish(player, 'Placement/D', config.modules.placementD.punishment)
    }
  });
  if(!config.modules.placementD.state) {
    world.afterEvents.blockPlace.unsubscribe(EVENT);
  };
};

export { placement_d }