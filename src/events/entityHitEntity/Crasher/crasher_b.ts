import { Entity, Player, world } from '@minecraft/server';
import config from '../../../data/config.js';
import { uniqueId } from '../../../util/World.js';
import { State } from '../../../util/Toggle.js';
import { flag } from '../../../util/Flag.js';

const crasher_b = () => {
  const EVENT = world.afterEvents.entityHitEntity.subscribe(ev => {
    const player = ev.damagingEntity as Player;
    if(player.typeId !== "minecraft:player" || uniqueId(player)) return;
    const hurtEntity: Entity = ev.damagingEntity;
    if(player.id == hurtEntity.id) {
      player.kill();
      flag(player, 'Crasher/B', config.modules.crasherB, [`hurtEntity=${hurtEntity.id}`])
    }
  });
  if(!State('CRASHERB', config.modules.crasherCB.state)) {
    world.afterEvents.entityHitEntity.unsubscribe(EVENT);
  };
};

export { crasher_b }