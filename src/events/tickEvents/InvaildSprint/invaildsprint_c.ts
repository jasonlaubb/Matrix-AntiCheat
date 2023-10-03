import { world, system } from '@minecraft/server';
import { uniqueId } from '../../../util/World.js';
import config from '../../../data/config.js';
import { State } from '../../../util/Toggle.js';
import { flag } from '../../../util/Flag.js';

const invaildSprint_c = () => {
  const EVENT = system.runInterval(() => {
    for(const player of world.getPlayers()) {
      if(uniqueId(player)) continue;
      if(player.isGliding && player.isSprinting) {
        system.runTimeout(() => {
          if(player.isSprinting) {
            player.teleport(player.location);
            flag(player, 'InvaildSprint/C', config.modules.invaildSprintC, [`isGliding=true`])
          }
        }, 1)
      }
    };
    if(!State('INVAILDSPRINTC', config.modules.invaildSprintC.state)) {
      system.clearRun(EVENT)
    }
  })
};

export { invaildSprint_c }