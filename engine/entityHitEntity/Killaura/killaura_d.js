import { world } from '@minecraft/server';
import { addScore, clearScore, getScore, punish, uniqueId } from '../../../unti/World.js';
import config from '../../../data/config.js';

export const killaura_d = () => {
  const EVENT = world.afterEvents.entityHitEntity.subscribe(ev => {
    const player = ev.damagingEntity;
    if(uniqueId(player) || player.typeId !== 'minecraft:player') return;
    if(player.isSleeping) {
      player.kill();
      addScore(player, 'anticheat:killauraDVl');
      flag(player, 'anticheat:killauraDVl', getScore(player, 'anticheat:killauraDVl'))
      if(player.getScore(player, 'anticheat:killauraDVl')) {
        clearScore(player, 'anticheat:killauraDVl');
        punish(player, 'killaura/D', config.modules.killauraC.punishment)
      }
    }
  });
  if(!config.modules.killauraD.state) {
    world.afterEvents.entityHitEntity.unsubscribe(EVENT)
  }
}