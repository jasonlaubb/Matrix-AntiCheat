import { Player, world } from '@minecraft/server';
import { uniqueId } from '../../../util/World.js';
import config from '../../../data/config.js';
import { State } from '../../../util/Toggle.js';
import { flag } from '../../../util/Flag.js';

export const killaura_d = () => {
  const EVENT = world.afterEvents.entityHitEntity.subscribe(ev => {
    const player = ev.damagingEntity as Player;
    if(uniqueId(player) || player.typeId !== 'minecraft:player') return;
    if(ev.damagingEntity.isSleeping) {
      player.kill();
      flag(player, 'KillAura/D', config.modules.killauraD, [`isSleeping=true`])
    }
  });
  if(!State('KILLAURAD', config.modules.killauraD.state)) {
    world.afterEvents.entityHitEntity.unsubscribe(EVENT)
  }
}