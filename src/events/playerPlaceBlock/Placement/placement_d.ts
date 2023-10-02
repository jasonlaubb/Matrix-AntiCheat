import { world } from '@minecraft/server';
import config from '../../../data/config.js';
import { uniqueId } from '../../../util/World.js';
import { State } from '../../../util/Toggle.js';
import { flag } from '../../../util/Flag.js';

const placement_d = () => {
  const EVENT = world.beforeEvents.playerPlaceBlock.subscribe(ev => {
    const player = ev.player;
    if(uniqueId(player)) return;
    const block = ev.block;
    if(block.typeId.endsWith('shulker_box')) {
      ev.cancel = true;
      flag(player, 'Placement/D', config.modules.placementD, [`TypeId=${block.typeId}`])
    }
  });
  if(!State('PLACEMENTD', config.modules.placementD.state)) {
    world.beforeEvents.playerPlaceBlock.unsubscribe(EVENT);
  };
};

export { placement_d }