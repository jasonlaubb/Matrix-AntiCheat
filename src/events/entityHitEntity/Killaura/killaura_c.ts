import { Player, world } from '@minecraft/server';
import { uniqueId } from '../../../util/World.js';
import config from '../../../data/config.js';
import { State } from '../../../util/Toggle.js';
import { flag } from '../../../util/Flag.js';

export const killaura_c = () => {
  const EVENT = world.afterEvents.entityHitEntity.subscribe(ev => {
    const player = ev.damagingEntity as Player;
    if(uniqueId(player) || player.typeId !== 'minecraft:player') return;
    if(player.hasTag('anticheat:hasGuiOpen')) {
      player.kill();
      flag(player, 'KillAura/C', config.modules.killauraC, [`hasGuiOpen=true`])
    }
  });
  if(!State('KILLAURAC', config.modules.killauraC.state)) {
    world.afterEvents.entityHitEntity.unsubscribe(EVENT)
  }
}