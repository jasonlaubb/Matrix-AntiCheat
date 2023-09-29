import { Player, world } from '@minecraft/server';
import { addScore, clearScore, getScore, punish, uniqueId, flag } from '../../../util/World.js';
import config from '../../../data/config.js';
import { State } from '../../../util/Toggle.js';

export const killaura_b = () => {
  const EVENT = world.afterEvents.entityHitEntity.subscribe(ev => {
    const player = ev.damagingEntity as Player;
    if(uniqueId(player) || player.typeId !== 'minecraft:player') return;
    const hitEntity = ev.hitEntity;
    const pos1 = { x: player.location.x, y: player.location.y, z: player.location.z };
    const pos2 = { x: hitEntity.location.x, y: hitEntity.location.y, z: hitEntity.location.z };
    const distance = Math.sqrt((pos1.x - pos2.x) ** 2 + (pos1.z - pos2.z) ** 2);
    if (distance <= 2) return;
    let angle = Math.atan2((pos2.z - pos1.z), (pos2.x - pos1.x)) * 180 / Math.PI - player.getRotation().y - 90;
    if (angle <= -180) angle += 360;
    angle = Math.abs(angle);
    if (angle > config.modules.killauraB.maxAngle && Math.sqrt((pos1.x - pos2.x) ** 2 +(pos1.z - pos2.z) ** 2) > 2) {
      addScore(player, 'anticheat:killauraBVl', 1);
      flag(player, 'killaura/B', getScore(player, 'anticheat:killauraBVl'));
      if(getScore(player, 'anticheat:killauraBVl') > config.modules.killauraB.VL) {
        clearScore(player, 'anticheat:killauraB');
        punish(player, 'killaura/B', config.modules.killauraB.punishment)
      }
    }
  });
  if(!State('KILLAURAB', config.modules.killauraB.state)) {
    world.afterEvents.entityHitEntity.unsubscribe(EVENT)
  }
}