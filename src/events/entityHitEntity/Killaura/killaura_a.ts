import { Entity, Player, world } from '@minecraft/server';
import { addScore, clearScore, flag, getScore, punish, uniqueId } from '../../../util/World.js';
import config from '../../../data/config.js';

export const killaura_a = () => {
  const EVENT = world.afterEvents.entityHitEntity.subscribe(ev => {
    const player = ev.damagingEntity as Player;
    if(player.typeId !== 'minecraft:player' || uniqueId(player)) return;
    const hitEntity: Entity = ev.hitEntity;
//@ts-ignore
    if(player.killauaraHitList == undefined) player.killauraHitList = [];
//@ts-ignore
    if(!player.killauraHitList.includes(hitEntity.id)) player.killauraHitList.push(hitEntity.id);
//@ts-ignore
    if(player.killauraHitList.length > config.modules.killauraA.maxHit) {
      player.kill();
//@ts-ignore
      player.killauaraHitList = [];
      addScore(player, 'anticheat:killauraAVl', 1);
      flag(player, 'killaura/A', getScore(player, 'anticheat:killauraAVl'));
      if(getScore(player, 'anticheat:killauraAVl') > config.modules.killauraA.VL) {
        clearScore(player, 'anticheat:killauraAVl');
        punish(player, 'killaura/A', config.modules.killauraA.punishment)
      }
    } 
  });
  if(!config.modules.killauraA.state) {
    world.afterEvents.entityHitEntity.unsubscribe(EVENT)
  }
}