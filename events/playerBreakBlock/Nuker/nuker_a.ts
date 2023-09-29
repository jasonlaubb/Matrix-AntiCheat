import { world, system } from '@minecraft/server';
import config from '../../../data/config.js';
import { flag, getScore, addScore, clearScore, uniqueId, getGamemode, revertBlock, punish } from '../../../util/World.js';
import { State } from '../../../util/Toggle.js';

const nuker_a = () => {
  const EVENT = world.beforeEvents.playerBreakBlock.subscribe(ev => {
    const player = ev.player;
    if (player.hasTag('anticheat:nukerflagged')) return revertBlock(ev.block);
    if (getGamemode(player) == 1 || uniqueId(player)) return;
    addScore(player, 'anticheat:blockbreak', 1);
    if(getScore(player, 'anticheat:blockbreak') > config.modules.nukerA.maxBreakInTick) {
      clearScore(player, 'anticheat:blockbreak');
      ev.cancel = true;
      flag(player, 'nuker/A', 0);
      punish(player, 'nuker/A', config.modules.nukerA.punishment);
      player.addTag('anticheat:nukerflagged');
    };
    system.runTimeout(() => {
      addScore(player, 'anticheat:blockbreak', -1);
    }, 1);
  });
  if(!State('NUKERA', config.modules.nukerA.state)) {
    world.beforeEvents.playerBreakBlock.unsubscribe(EVENT);
  };
};

export { nuker_a }