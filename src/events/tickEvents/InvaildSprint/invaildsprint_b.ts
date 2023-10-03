import { world, system } from '@minecraft/server';
import { uniqueId } from '../../../util/World.js';
import config from '../../../data/config.js';
import { State } from '../../../util/Toggle.js';
import { flag } from '../../../util/Flag.js';

const invaildSprint_b = () => {
  const EVENT = system.runInterval(() => {
    for(const player of world.getPlayers()) {
      if(uniqueId(player)) continue;
      if(player.isSneaking && player.isSprinting) {
        system.runTimeout(() => {
          if(player.isSprinting) {
            player.teleport(player.location);
            flag(player, 'InvalidSprint/B', config.modules.InvalidSprintB, [`isSneaking=true`])
          }
        }, 1)
      }
    };
    if(!State('INVAILDSPRINT', config.modules.invaildSprintB.state)) {
      system.clearRun(EVENT)
    }
  })
};

export { invaildSprint_b }