import { world, system } from '@minecraft/server';
import { addScore, clearScore, flag, getScore, punish } from '../../../unti/World.js';
import config from '../../../data/config.js';

const invaildsprint_a = () => {
  const EVENT = system.runInterval(() => {
    for(const player of world.getPlayers()) {
      if(player.getEffect('blindness')) {
        system.runTimeOut(() => {
          if(player.isSprinting) {
            player.isSprinting = false;
            addScore(player, 'anticheat:invaildSprintAVl');
            flag(player, 'invaildSprint/A', getScore(player, 'anticheat:invaildSprintAVl'));
            if(getScore(player, 'anticheat:invaildSprintAVl') > config.modules.invaildSprintA.VL) {
              clearScore(player, 'anticheat:invaildSprintA');
              punish(player, 'invaildSprint/A', config.modules.invaildSprintA.punishment)
            }
          }
        }, 1)
      }
    };
    if(!config.modules.invaildSprintA.state) {
      system.clearRun(EVENT)
    }
  })
};

export { invaildsprint_a }