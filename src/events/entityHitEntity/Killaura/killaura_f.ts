import { Entity, Player, world } from '@minecraft/server';
import { addScore, clearScore, getScore, punish, uniqueId, flag } from '../../../util/World.js';
import config from '../../../data/config.js';
import { State } from '../../../util/Toggle.js';

const killaura_f = () => {
  const EVENT = world.afterEvents.entityHitEntity.subscribe(ev => {
    const player = ev.damagingEntity as Player;
    if(uniqueId(player)) return;
    const hitEntity: Entity = ev.hitEntity;
    const distance: number = Math.sqrt((player.location.x - hitEntity.location.x) ** 2 + (player.location.z - hitEntity.location.z) ** 2);
    if(distance > 2 && (player.getRotation().x > -79 || player.getRotation().x < 79)) {
      addScore(player, 'anticheat:killauraFVl', 1);
      flag(player, 'Killaura/F', getScore(player, 'anticheat:killauraFVl'));
      if(getScore(player, 'anticheat:killauraFVl') > config.modules.killauraF.VL) {
        clearScore(player, 'anticheat:killauraFVl');
        punish(player, 'Killaura/F', config.modules.killauraF.punishment)
      }
    }
  });
  if(!State('KILLAURAF', config.modules.killauraF.state)) {
    world.afterEvents.entityHitEntity.unsubscribe(EVENT)
  }
};

export { killaura_f }