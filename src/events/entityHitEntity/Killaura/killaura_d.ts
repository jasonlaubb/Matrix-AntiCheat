import { Player, world } from '@minecraft/server';
import { addScore, clearScore, getScore, punish, uniqueId, flag } from '../../../util/World.js';
import config from '../../../data/config.js';

export const killaura_d = () => {
  const EVENT = world.afterEvents.entityHitEntity.subscribe(ev => {
    const player = ev.damagingEntity as Player;
    if(uniqueId(player) || player.typeId !== 'minecraft:player') return;
//@ts-ignore
    if(ev.damagingEntity.isSleeping) {
      player.kill();
      addScore(player, 'anticheat:killauraDVl', 1);
      flag(player, 'killaura/D', getScore(player, 'anticheat:killauraDVl'))
      if(getScore(player, 'anticheat:killauraDVl')) {
        clearScore(player, 'anticheat:killauraDVl');
        punish(player, 'killaura/D', config.modules.killauraC.punishment)
      }
    }
  });
  if(!config.modules.killauraD.state) {
    world.afterEvents.entityHitEntity.unsubscribe(EVENT)
  }
}