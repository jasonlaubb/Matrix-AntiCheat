import { Entity, Player, Vector3, world } from '@minecraft/server';
import { getGamemode, uniqueId } from '../../../util/World.js';
import config from '../../../data/config.js';
import { State } from '../../../util/Toggle.js';
import { flag } from '../../../util/Flag.js';

const reach_a = () => {
  const EVENT = world.afterEvents.entityHitEntity.subscribe(ev => {
    const player = ev.damagingEntity as Player;
    if(uniqueId(player) || player.typeId !== 'minecraft:player' || getGamemode(player) == 1) return;
    const target: Entity = ev.hitEntity;
    const pos1: Vector3 = player.getHeadLocation();
    const pos2: Vector3 = target.getHeadLocation();
    const distance: number = Number(Math.abs(Math.sqrt((pos1.x - pos2.x) ** 2 + (pos1.y - pos2.y) ** 2 + (pos1.z - pos2.z) ** 2)).toFixed(3));
    if (distance > config.modules.reachA.maxdistance) {
      flag(player, 'Reach/A', config.modules.reachA, [`distance=${distance}`])
    }
  });
  if (!State('REACHA', config.modules.reachA.state)) {
    world.afterEvents.entityHitEntity.unsubscribe(EVENT)
  }
};

export { reach_a }