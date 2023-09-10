import { world, system } from '@minecraft/server';
import { addScore, clearScore, flag, getScore, punish, uniqueId } from '../../../unti/World.js';
import config from '../../../data/config.js';

const invaildSprint_c = () => {
  const EVENT = system.runInterval(() => {
    for(const player of world.getPlayers()) {
      if(uniqueId(player)) continue;
      if(player.isGliding) {
        system.runTimeOut(() => {
          if(player.isSprinting) {
            player.isSprinting = false;
            addScore(player, 'anticheat:invaildSprintCVl');
            flag(player, 'invaildSprint/C', getScore(player, 'anticheat:invaildSprintCVl'));
            if(getScore(player, 'anticheat:invaildSprintCVl') > config.modules.invaildSprintC.VL) {
              clearScore(player, 'anticheat:invaildSprintC');
              punish(player, 'invaildSprint/C', config.modules.invaildSprintC.punishment)
            }
          }
        }, 1)
      }
    };
    if(!config.modules.invaildSprintC.state) {
      system.clearRun(EVENT)
    }
  })
};

export { invaildSprint_c }