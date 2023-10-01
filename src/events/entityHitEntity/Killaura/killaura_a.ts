import { Entity, Player, world, system } from '@minecraft/server';
import { uniqueId } from '../../../util/World.js';
import config from '../../../data/config.js';
import { State } from '../../../util/Toggle.js';
import { flag } from '../../../util/Flag.js';

const killauraHitList = new Map<string, Array<string>>();

export const killaura_a = () => {
  const EVENT1 = world.afterEvents.entityHitEntity.subscribe(ev => {
    const player = ev.damagingEntity as Player;
    if(player.typeId !== 'minecraft:player' || uniqueId(player)) return;
    const hitEntity: Entity = ev.hitEntity;
    //@ts-expect-error
    if(!killauraHitList.get(player.id).includes(hitEntity.id)) killauraHitList.set(player.id, killauraHitList.get(player.id).push(hitEntity.id));
    if(killauraHitList.get(player.id).length > config.modules.killauraA.maxHit) {
      player.kill();
      flag(player, 'KillAura/A', config.modules.killauraA, [`hitList=${killauraHitList.get(player.id).length}`]);
      killauraHitList.delete(player.id)
    } 
  });
  const EVENT2 = world.afterEvents.playerLeave.subscribe(ev => {
    killauraHitList.delete(ev.playerId)
  });
  const EVENT3 = system.runInterval(() => {
    world.getAllPlayers().forEach(player => killauraHitList.set(player.id, []))
  });

  if(!State('KILLAURAA', config.modules.killauraA.state)) {
    world.afterEvents.entityHitEntity.unsubscribe(EVENT1);
    world.afterEvents.playerLeave.unsubscribe(EVENT2);
    system.clearRun(EVENT3)
  }
}