import { Player, world } from '@minecraft/server';
import { addScore, clearScore, getScore, punish, uniqueId, flag } from '../../../util/World.js';
import config from '../../../data/config.js';
import { State } from '../../../util/Toggle.js';

export const killaura_c = () => {
  const EVENT = world.afterEvents.entityHitEntity.subscribe(ev => {
    const player = ev.damagingEntity as Player;
    if(uniqueId(player) || player.typeId !== 'minecraft:player') return;
    if(player.hasTag('anticheat:hasGuiOpen')) {
      player.kill();
      addScore(player, 'anticheat:killauraCVl', 1);
      flag(player, 'Killaura/C', getScore(player, 'anticheat:killauraCVl'))
      if(getScore(player, 'anticheat:killauraCVl')) {
        clearScore(player, 'anticheat:killauraCVl');
        punish(player, 'killaura/C', config.modules.killauraC.punishment)
      }
    }
  });
  if(!State('KILLAURAC', config.modules.killauraC.state)) {
    world.afterEvents.entityHitEntity.unsubscribe(EVENT)
  }
}