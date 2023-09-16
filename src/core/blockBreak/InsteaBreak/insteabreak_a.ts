import { world } from '@minecraft/server';
import config from '../../../data/config.js';
import { flag, uniqueId, getGamemode, punish, revertBlock } from '../../../util/World.js';

const insteabreak_a = () => {
  const EVENT = world.afterEvents.blockBreak.subscribe(ev => {
    const player = ev.player;
    if (getGamemode(player) == 1 || uniqueId(player)) return;
    const block = ev.block;
    if (config.modules.insteabreakA.unbreakable.includes(block.typeId)) {
      revertBlock(block)
      flag(player, 'InsteaBreak/A', 0);
      punish(player, 'InsteaBreak/A', config.modules.insteabreakA.punishment);
    }
  });
  if(!config.modules.insteabreakA.state) {
    world.afterEvents.blockBreak.unsubscribe(EVENT);
  };
};

export { insteabreak_a }