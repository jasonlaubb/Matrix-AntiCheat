import { world, system } from '@minecraft/server';
import config from '../../../data/config.js';
import { flag, getScore, addScore, clearScore, uniqueId, getGamemode } from '../../../unti/World.js';

const nuker_a = () => {
  const EVENT = world.beforeEvents.playerBreakBlock.subscribe(ev => {
    const player = ev.player;
    if (player.hasTag('anticheat:nukerflagged')) return ev.cancel = true;
    if (getGamemode(player) == 1 || uniqueId(player)) return;
    addScore(player, 'anticheat:blockbreak', 1);
    if(getScore(player, 'anticheat:blockbreak') > config.modules.nukerA.maxBreakInTick) {
      clearScore(player, 'anticheat:blockbreak');
      ev.cancel = true;
      flag(player, 'nuker/A', 0, config.modules.nukerA.punishment);
      player.addTag('anticheat:nukerflagged');
    };
    system.runTimeOut(() => {
      addScore(player, 'anticheat:blockbreak', -1);
    }, 1);
  });
  if(!config.modules.nukerA.state) {
    world.afterEvents.playerBreakBlock.unsubscribe(EVENT);
  };
};

export { nuker_a }