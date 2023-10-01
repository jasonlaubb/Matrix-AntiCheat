import { world } from '@minecraft/server';
import config from '../../../data/config.js';
import { uniqueId, getGamemode } from '../../../util/World.js';
import { State } from '../../../util/Toggle.js';
import { flag } from '../../../util/Flag.js';

const insteabreak_a = () => {
  const EVENT = world.beforeEvents.playerBreakBlock.subscribe(ev => {
    const player = ev.player;
    if (getGamemode(player) == 1 || uniqueId(player)) return;
    const block = ev.block;
    if (config.modules.insteabreakA.unbreakable.includes(block.typeId)) {
      ev.cancel = true;
      flag(player, 'InsteaBreak/A', config.modules.insteaBreakA, [`block=${block.typeId}`])
    }
  });
  if(!State('INSTEABREAKA', config.modules.insteabreakA.state)) {
    world.beforeEvents.playerBreakBlock.unsubscribe(EVENT);
  };
};

export { insteabreak_a }