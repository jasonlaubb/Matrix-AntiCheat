import config from '../../../data/config.js';
import { getClosestPlayer, stop, tempkick } from '../../../util/World.js';
import { world, Player, Entity } from '@minecraft/server';

const cbe_a = () => {
  const EVENT = world.afterEvents.dataDrivenEntityTriggerEvent.subscribe(ev => {
    const id: string = ev.id;
    const entity: Entity = ev.entity
    if(id !== 'anticheat:wear_totem') return;
    const player: Player = getClosestPlayer(entity);
    stop('commandBlockExploit/A', 'player', player.name);
    tempkick(player)
  });
  if(!config.modules.autototemA.state) {
    world.afterEvents.dataDrivenEntityTriggerEvent.unsubscribe(EVENT)
  }
};

export { cbe_a }