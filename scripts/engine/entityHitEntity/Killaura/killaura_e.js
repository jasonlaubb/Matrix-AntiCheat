import { world } from '@minecraft/server';
import { addScore, clearScore, getScore, punish, uniqueId } from '../../../unti/World.js';
import config from '../../../data/config.js';

export const killaura_e = () => {
  const EVENT = world.afterEvents.entityHitEntity.subscribe(ev => {
    const player = ev.damagingEntity;
    if(uniqueId(player) || player.typeId !== 'minecraft:player') return;
    if(player.hasTag('anticheat:usingItem')) {
      player.kill();
      addScore(player, 'anticheat:killauraEVl');
      flag(player, 'killaura/E', getScore(player, 'anticheat:killauraEVl'))
      if(player.getScore(player, 'anticheat:killauraEVl')) {
        clearScore(player, 'anticheat:killauraEVl');
        punish(player, 'killaura/E', config.modules.killauraE.punishment)
      }
    }
  });
  if(!config.modules.killauraE.state) {
    world.afterEvents.entityHitEntity.unsubscribe(EVENT)
  }
}