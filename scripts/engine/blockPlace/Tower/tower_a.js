import { world } from '@minecraft/server';
import config from '../../../data/config.js';
import { flag, getScore, addScore, clearScore, uniqueId, getGamemode, punish } from '../../../unti/World.js';

const tower_a = () => {
  const EVENT = world.beforeEvents.playerPlaceBlock.subscribe(ev => {
    const player = ev.player;
    if(uniqueId(player)) return;
    const block = player.dimension.getBlock({x: Math.floor(player.location.x), y: Math.floor(player.location.y) - 1, z: Math.floor(player.location.z)});
    const realblock = ev.block;
    if(player.isJumping && !player.isFlying && !player.getEffect("jump_boost") && !getGamemode(player) == 1 && block.id == realblock.id) {
      const locationDeff = player.location.y - Math.abs(Math.trunc(player.location));
      if(locationDeff > config.modules.towerA.maxLocationDeff) {
        ev.cancel = true;
        addScore(player, 'anticheat:towerAVl');
        flag(player, 'tower/A', getScore(player, 'anticheat:towerAVl'));
        if(getScore(player, 'anticheat:towerAVl') > config.modules.towerA.VL) {
          punish(player, 'anticheat:tower/A', config.modules.towerA.punishment)
        }
      }
    }
  });
  if(!config.modules.towerA.state) {
    world.afterEvents.playerPlaceBlock.unsubscribe(EVENT);
  };
};

export { tower_a }