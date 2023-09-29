import { Entity, Player, world } from '@minecraft/server';
import config from '../../../data/config.js';
import { flag, uniqueId, punish } from '../../../util/World.js';
import { State } from '../../../util/Toggle.js';

const crasher_b = () => {
  const EVENT = world.afterEvents.entityHitEntity.subscribe(ev => {
    const player = ev.damagingEntity as Player;
    if(player.typeId !== "minecraft:player") return;
    const hurtEntity: Entity = ev.damagingEntity;
    if(player.id == hurtEntity.id) {
      player.kill();
      flag(player, 'crasher/B', 0);
      punish(player, 'crasher/B', config.modules.crasherB.punishment)
      if(!uniqueId(player)) punish(player, 'crasher/B', config.modules.crasherB.punishment)
    }
  });
  if(!State('CRASHERB', config.modules.autoclickerA.state)) {
    world.afterEvents.entityHitEntity.unsubscribe(EVENT);
  };
};

export { crasher_b }