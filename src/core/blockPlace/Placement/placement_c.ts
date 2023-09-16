import { BlockPistonComponent, BlockType, world } from '@minecraft/server';
import config from '../../../data/config.js';
import { flag, uniqueId, punish } from '../../../util/World.js';

const placement_c = () => {
  const EVENT = world.afterEvents.blockPlace.subscribe(ev => {
    const player = ev.player;
    if(uniqueId(player)) return;
    const block = ev.block;
    if(!block.typeId.endsWith('piston')) return;
    const piston = block.getComponent("minecraft:piston") as BlockPistonComponent
    if(piston.isExpanded || piston.isMoving) {
      block.setType({id: 'minecraft:air'} as BlockType);
      flag(player, 'Placement/C', 0);
      punish(player, 'Placement/C', config.modules.placementC.punishment)
    }
  });
  if(!config.modules.placementC.state) {
    world.afterEvents.blockPlace.unsubscribe(EVENT);
  };
};

export { placement_c }