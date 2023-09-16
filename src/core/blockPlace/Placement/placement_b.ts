import { Block, BlockSignComponent, BlockType, Player, world } from '@minecraft/server';
import config from '../../../data/config.js';
import { flag, uniqueId, punish } from '../../../util/World.js';

const placement_b = () => {
  const EVENT = world.afterEvents.blockPlace.subscribe(ev => {
    const player: Player = ev.player;
    if(uniqueId(player)) return;
    const block: Block = ev.block;
    if(!block.typeId.endsWith('sign')) return;
    const signstate: boolean = (block.getComponent("minecraft:sign") as BlockSignComponent).getText == undefined ? true : false
    if(signstate) {
      block.setType({id: 'minecraft:air'} as BlockType);
      flag(player, 'Placement/B', 0);
      punish(player, 'Placement/B', config.modules.placementB.punishment)
    }
  });
  if(!config.modules.placementB.state) {
    world.afterEvents.blockPlace.unsubscribe(EVENT);
  };
};

export { placement_b }