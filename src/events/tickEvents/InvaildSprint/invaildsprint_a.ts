import { world, system } from '@minecraft/server';
import { addScore, clearScore, flag, getScore, punish, uniqueId } from '../../../util/World.js';
import config from '../../../data/config.js';

const invaildsprint_a = () => {
  const EVENT = system.runInterval(() => {
    for(const player of world.getPlayers()) {
      if(uniqueId(player)) continue
      if(player.getEffect('blindness')) {
        system.runTimeout(() => {
          if(player.isSprinting) {
            player.teleport(player.location)
            addScore(player, 'anticheat:invaildSprintAVl', 1);
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