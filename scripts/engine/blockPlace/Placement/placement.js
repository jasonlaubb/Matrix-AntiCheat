import { world } from '@minecraft/server';
import config from '../../../data/config.js';
import { flag, getScore, addScore, clearScore, uniqueId, getGamemode, punish } from '../../../unti/World.js';

const tower_a = () => {
  const EVENT = world.beforeEvents.playerPlaceBlock.subscribe(ev => {
    const player = ev.player;
    if(uniqueId(player)) return;
    const block = ev.block;
    if(block.t)
  });
  if(!config.modules.towerA.state) {
    world.afterEvents.playerPlaceBlock.unsubscribe(EVENT);
  };
};

export { tower_a }