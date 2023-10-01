import { world } from '@minecraft/server';
import config from '../../../data/config.js';
import { getClosestPlayer, uniqueId } from '../../../util/World.js';
import { State } from '../../../util/Toggle.js';
import { flag } from '../../../util/Flag.js';
import { ActiveTempkick } from '../../../util/action/tempkick.js';

const cbe_b = () => {
  const EVENT = world.afterEvents.entitySpawn.subscribe(ev => {
    const entity = ev.entity;
    if(entity.typeId !== 'minecraft:npc') return;
    const player = getClosestPlayer(entity);
    if (uniqueId(player)) return;
    flag(player, 'commandBlockExploit/B', config.modules.cbeB, undefined)
    entity.kill();
    if(config.modules.cbeB.tempkickNearest) ActiveTempkick(player)
  });
  if(!State('CBEB', config.modules.cbeB.state)) {
    world.afterEvents.entitySpawn.unsubscribe(EVENT);
  }
};

export { cbe_b }