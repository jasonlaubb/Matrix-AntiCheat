import { world } from '@minecraft/server';
import { addScore, clearScore, getScore, punish, uniqueId } from '../../../unti/World.js';
import config from '../../../data/config.js';

export const killaura_c = () => {
  const EVENT = world.afterEvents.entityHitEntity.subscribe(ev => {
    const player = ev.damagingEntity;
    if(uniqueId(player) || player.typeId !== 'minecraft:player') return;
    if(player.hasTag('anticheat:hasGuiOpen')) {
      player.kill();
      addScore(player, 'anticheat:killauraCVl');
      flag(player, 'anticheat:killauraCVl', getScore(player, 'anticheat:killauraCVl'))
      if(player.getScore(player, 'anticheat:killauraCVl')) {
        clearScore(player, 'anticheat:killauraCVl');
        punish(player, 'killaura/C', config.modules.killauraC.punishment)
      }
    }
  });
  if(!config.modules.killauraC.state) {
    world.afterEvents.entityHitEntity.unsubscribe(EVENT)
  }
}