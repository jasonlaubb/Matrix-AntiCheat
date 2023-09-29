import { Player, world } from '@minecraft/server';
import { addScore, clearScore, getScore, punish, uniqueId, flag } from '../../../util/World.js';
import config from '../../../data/config.js';
import { State } from '../../../util/Toggle.js';

export const killaura_e = () => {
  const EVENT = world.afterEvents.entityHitEntity.subscribe(ev => {
    const player = ev.damagingEntity as Player;
    if(uniqueId(player) || player.typeId !== 'minecraft:player') return;
    if(player.hasTag('anticheat:usingItem')) {
      player.kill();
      addScore(player, 'anticheat:killauraEVl', 1);
      flag(player, 'killaura/E', getScore(player, 'anticheat:killauraEVl'))
      if(getScore(player, 'anticheat:killauraEVl')) {
        clearScore(player, 'anticheat:killauraEVl');
        punish(player, 'killaura/E', config.modules.killauraE.punishment)
      }
    }
  });
  if(!State('KILLAURAE', config.modules.killauraE.state)) {
    world.afterEvents.entityHitEntity.unsubscribe(EVENT)
  }
}