import { uniqueId } from '../../../util/World.js';
import { world, system } from '@minecraft/server';
import config from '../../../data/config.js';
import { State } from '../../../util/Toggle.js';
import { flag } from '../../../util/Flag.js';

const knockback_a = () => {
  const EVENT = system.runInterval(() => {
    for(const player of world.getPlayers()) {
      if(uniqueId(player) || player.hasTag('anticheat:trident')) continue;
      const magnitude: number = Math.abs(player.getVelocity().x) + Math.abs(player.getVelocity().y) + Math.abs(player.getVelocity().z);
      if(magnitude <= config.modules.knockbackA.magnitude) {
        if(player.hasTag('anticheat:damaged') && !player.hasTag('anticheat:dead') && !player.isGliding && !player.hasTag('anticheat:levitating') && !player.isFlying)
        player.teleport(player.location);
        flag(player, 'KnockBack/A', config.modules.knockbackA, [`magnitude=${magnitude}`])
      }
    }
  });
  if(!State('KBA', config.modules.knockbackA.state)) {
    system.clearRun(EVENT);
  }
};

export { knockback_a }