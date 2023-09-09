import { world, system } from '@minecraft/server';
import { addScore, clearScore, flag, getScore, punish } from '../../../unti/World.js';
import config from '../../../data/config.js';

const invaildSprint_b = () => {
  const EVENT = system.runInterval(() => {
    for(const player of world.getPlayers()) {
      if(player.isSneaking) {
        system.runTimeOut(() => {
          if(player.isSprinting) {
            player.isSprinting = false;
            addScore(player, 'anticheat:invaildSprintBVl');
            flag(player, 'invaildSprint/B', getScore(player, 'anticheat:invaildSprintBVl'));
            if(getScore(player, 'anticheat:invaildSprintBVl') > config.modules.invaildSprintB.VL) {
              clearScore(player, 'anticheat:invaildSprintB');
              punish(player, 'invaildSprint/B', config.modules.invaildSprintB.punishment)
            }
          }
        }, 1)
      }
    };
    if(!config.modules.invaildSprintB.state) {
      system.clearRun(EVENT)
    }
  })
};

export { invaildSprint_b }