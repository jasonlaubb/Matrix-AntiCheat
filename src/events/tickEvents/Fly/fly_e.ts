import { world, system } from '@minecraft/server';
import { uniqueId } from '../../../util/World.js';
import config from '../../../data/config.js';
import { State } from '../../../util/Toggle.js';
import { flag } from '../../../util/Flag.js';

const fly_e = () => {
  const EVENT = system.runInterval(() => {
    for(const player of world.getPlayers()) {
      if (uniqueId(player) || player.isFlying) continue
      if (player.fallDistance < -1 && !player.isSwimming && !player.isJumping && !player.hasTag('anticheat:trident')) {
        player.applyDamage(6);
        player.teleport(player.location);
        flag(player, 'Fly/E', config.modules.flyE, [`fallDistance=${player.fallDistance.toFixed(6)}`])
      }
    };
    if(!State('FLYB', config.modules.flyB.state)) {
      system.clearRun(EVENT)
    }
  })
};

export { fly_e }