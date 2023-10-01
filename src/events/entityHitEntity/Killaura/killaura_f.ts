import { Entity, Player, world } from '@minecraft/server';
import { uniqueId } from '../../../util/World.js';
import config from '../../../data/config.js';
import { State } from '../../../util/Toggle.js';
import { flag } from '../../../util/Flag.js';

const killaura_f = () => {
  const EVENT = world.afterEvents.entityHitEntity.subscribe(ev => {
    const player = ev.damagingEntity as Player;
    if(uniqueId(player)) return;
    const hitEntity: Entity = ev.hitEntity;
    const distance: number = Math.sqrt((player.location.x - hitEntity.location.x) ** 2 + (player.location.z - hitEntity.location.z) ** 2);
    if(distance > 2 && (player.getRotation().x > -79 || player.getRotation().x < 79)) {
      flag(player, 'KillAura/F', config.modules.killauraF, [`x=${player.getRotation().x}, y=${player.getRotation().y}`])
    }
  });
  if(!State('KILLAURAF', config.modules.killauraF.state)) {
    world.afterEvents.entityHitEntity.unsubscribe(EVENT)
  }
};

export { killaura_f }