import { Entity, Player, world, system } from '@minecraft/server';
import { addScore, clearScore, flag, getScore, punish, uniqueId } from '../../../util/World.js';
import config from '../../../data/config.js';
import { State } from '../../../util/Toggle.js';

const killauraHitList = new Map<string, any>();

export const killaura_a = () => {
  const EVENT1 = world.afterEvents.entityHitEntity.subscribe(ev => {
    const player = ev.damagingEntity as Player;
    if(player.typeId !== 'minecraft:player' || uniqueId(player)) return;
    const hitEntity: Entity = ev.hitEntity;
    if(!killauraHitList.get(player.id).includes(hitEntity.id)) killauraHitList.set(player.id, killauraHitList.get(player.id).push(hitEntity.id));
    if(killauraHitList.get(player.id) > config.modules.killauraA.maxHit) {
      player.kill();
      addScore(player, 'anticheat:killauraAVl', 1);
      flag(player, 'killaura/A', getScore(player, 'anticheat:killauraAVl'));
      if(getScore(player, 'anticheat:killauraAVl') > config.modules.killauraA.VL) {
        clearScore(player, 'anticheat:killauraAVl');
        punish(player, 'killaura/A', config.modules.killauraA.punishment)
      }
    } 
  });
  const EVENT2 = world.afterEvents.playerLeave.subscribe(ev => {
    killauraHitList.delete(ev.playerId)
  });
  const EVENT3 = system.runInterval(() => {
    for(const player of world.getAllPlayers())
    killauraHitList.set(player.id, [])
  });

  if(!State('KILLAURAA', config.modules.killauraA.state)) {
    world.afterEvents.entityHitEntity.unsubscribe(EVENT1);
    world.afterEvents.playerLeave.unsubscribe(EVENT2);
    system.clearRun(EVENT3)
  }
}