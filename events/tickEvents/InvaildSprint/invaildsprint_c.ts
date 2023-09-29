import { world, system } from '@minecraft/server';
import { addScore, clearScore, flag, getScore, punish, uniqueId } from '../../../util/World.js';
import config from '../../../data/config.js';
import { State } from '../../../util/Toggle.js';

const invaildSprint_c = () => {
  const EVENT = system.runInterval(() => {
    for(const player of world.getPlayers()) {
      if(uniqueId(player)) continue;
      if(player.isGliding) {
        system.runTimeout(() => {
          if(player.isSprinting) {
            player.teleport(player.location);
            addScore(player, 'anticheat:invaildSprintCVl', 1);
            flag(player, 'invaildSprint/C', getScore(player, 'anticheat:invaildSprintCVl'));
            if(getScore(player, 'anticheat:invaildSprintCVl') > config.modules.invaildSprintC.VL) {
              clearScore(player, 'anticheat:invaildSprintC');
              punish(player, 'invaildSprint/C', config.modules.invaildSprintC.punishment)
            }
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