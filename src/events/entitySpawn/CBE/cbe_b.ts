import { world } from '@minecraft/server';
import config from '../../../data/config.js';
import { getClosestPlayer, stop, tempkick } from '../../../util/World.js';
import { State } from '../../../util/Toggle.js';

const cbe_b = () => {
  const EVENT = world.afterEvents.entitySpawn.subscribe(ev => {
    const entity = ev.entity;
    if(entity.typeId !== 'minecraft:npc') return;
    const player = getClosestPlayer(entity);
    stop('commandBlockExploit/B', 'player', player.name);
    entity.kill();
    if(config.modules.cbeB.tempkickNearest) tempkick(player)
  });
  if(!State('CBEB', config.modules.cbeB.state)) {
    world.afterEvents.entitySpawn.unsubscribe(EVENT);
  }
};

export { cbe_b }