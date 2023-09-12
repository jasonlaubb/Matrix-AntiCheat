import { world, system } from '@minecraft/server';
import config from '../../../data/config.js';
import { flag, uniqueId, getGamemode, punish } from '../../../unti/World.js';

const insteabreak_a = () => {
  const EVENT = world.beforeEvents.playerBreakBlock.subscribe(ev => {
    const player = ev.player;
    if (getGamemode(player) == 1 || uniqueId(player)) return;
    const block = ev.block;
    if (config.modules.insteabreakA.unbreakable.includes(block.typeId)) {
      ev.cancel = true;
      flag(player, 'InsteaBreak/A', 0);
      punish(player, 'InsteaBreak/A', config.modules.insteabreakA.punishment);
    }
  });
  if(!config.modules.insteabreak.state) {
    world.afterEvents.playerBreakBlock.unsubscribe(EVENT);
  };
};

export { insteabreak_a }