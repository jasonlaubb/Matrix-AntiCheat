import { world } from '@minecraft/server';
import config from '../../../data/config.js';
import { flag, uniqueId, punish } from '../../../unti/World.js';

const crasher_b = () => {
  const EVENT = world.afterEvents.entityHitEntity.subscribe(ev => {
    const player = ev.damagingEntity;
    if(player.typeId !== "minecraft:player") return;
    const hurtEntity = ev.damagingEntity;
    if(player.id == hurtEntity) {
      player.kill();
      flag(player, 'crasher/B', config.modules.crasherB.state);
      if(!uniqueId(player)) punish(player, 'crasher/B', config.modules.crasherB.punishment)
    }
  });
  if(!config.modules.autoclickerA.state) {
    world.afterEvents.entityHitEntity.unsubscribe(EVENT);
  };
};

export { crasher_b }