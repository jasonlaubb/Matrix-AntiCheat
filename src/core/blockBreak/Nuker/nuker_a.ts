import { world, system } from '@minecraft/server';
import config from '../../../data/config.js';
import { flag, getScore, addScore, clearScore, uniqueId, getGamemode, revertBlock, punish } from '../../../util/World.js';

const nuker_a = () => {
  const EVENT = world.afterEvents.blockBreak.subscribe(ev => {
    const player = ev.player;
    if (player.hasTag('anticheat:nukerflagged')) return revertBlock(ev.block);
    if (getGamemode(player) == 1 || uniqueId(player)) return;
    addScore(player, 'anticheat:blockbreak', 1);
    if(getScore(player, 'anticheat:blockbreak') > config.modules.nukerA.maxBreakInTick) {
      clearScore(player, 'anticheat:blockbreak');
      revertBlock(ev.block);
      flag(player, 'nuker/A', 0);
      punish(player, 'nuker/A', config.modules.nukerA.punishment);
      player.addTag('anticheat:nukerflagged');
    };
    system.runTimeout(() => {
      addScore(player, 'anticheat:blockbreak', -1);
    }, 1);
  });
  if(!config.modules.nukerA.state) {
    world.afterEvents.blockBreak.unsubscribe(EVENT);
  };
};

export { nuker_a }