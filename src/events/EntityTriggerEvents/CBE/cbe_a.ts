import config from '../../../data/config.js';
import { getClosestPlayer } from '../../../util/World.js';
import { world, Player, Entity } from '@minecraft/server';
import { State } from '../../../util/Toggle.js';
import { flag } from '../../../util/Flag.js';
import { ActiveTempkick } from '../../../util/action/tempkick.js';

const cbe_a = () => {
  const EVENT = world.afterEvents.dataDrivenEntityTriggerEvent.subscribe(ev => {
    const id: string = ev.id;
    const entity: Entity = ev.entity
    if(id !== 'anticheat:wear_totem') return;
    const player: Player = getClosestPlayer(entity);
    flag(player, 'CommandBlockExpolit/A', config.modules.cbeA, undefined);
    if(config.modules.cbeA.tempkickNearest) ActiveTempkick(player);
  });
  if(!State('CBEA', config.modules.cbeA.state)) {
    world.afterEvents.dataDrivenEntityTriggerEvent.unsubscribe(EVENT)
  }
};

export { cbe_a }