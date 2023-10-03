import { world, system } from '@minecraft/server';
import { uniqueId } from '../../../util/World.js';
import config from '../../../data/config.js';
import { State } from '../../../util/Toggle.js';
import { flag } from '../../../util/Flag.js';

const invaildsprint_a = () => {
  const EVENT = system.runInterval(() => {
    for(const player of world.getPlayers()) {
      if(uniqueId(player)) continue
      if(player.getEffect('blindness') && player.isSprinting) {
        system.runTimeout(() => {
          if(player.isSprinting) {
            player.teleport(player.location)
            flag(player, 'InvalidSprint/A', config.modules.invaildSprintA, [`blindness=true`])
          }
        }, 1)
      }
    };
    if(!State('INVAILDSPRINTA', config.modules.invaildSprintA.state)) {
      system.clearRun(EVENT)
    }
  })
};

export { invaildsprint_a }