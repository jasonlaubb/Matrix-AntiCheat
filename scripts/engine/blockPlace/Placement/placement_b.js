import { world } from '@minecraft/server';
import config from '../../../data/config.js';
import { flag, uniqueId, punish } from '../../../unti/World.js';

const placement_b = () => {
  const EVENT = world.beforeEvents.playerPlaceBlock.subscribe(ev => {
    const player = ev.player;
    if(uniqueId(player)) return;
    const block = ev.block;
    if(!block.typeId.endsWith('sign')) return;
    const signstate = block.getComponent("minecraft:sign").getText == undefined ? true : false
    if(signstate) {
      ev.cancel = true;
      flag(player, 'Placement/B', 0);
      punish(player, 'Placement/B', config.modules.placementB.punishment)
    }
  });
  if(!config.modules.placementB.state) {
    world.beforeEvents.playerPlaceBlock.unsubscribe(EVENT);
  };
};

export { placement_b }