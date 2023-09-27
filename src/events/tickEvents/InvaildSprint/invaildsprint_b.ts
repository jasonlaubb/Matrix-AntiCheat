import { world, system } from '@minecraft/server';
import { addScore, clearScore, flag, getScore, punish, uniqueId } from '../../../util/World.js';
import config from '../../../data/config.js';
import { State } from '../../../util/Toggle.js';

const invaildSprint_b = () => {
  const EVENT = system.runInterval(() => {
    for(const player of world.getPlayers()) {
      if(uniqueId(player)) continue;
      if(player.isSneaking) {
        system.runTimeout(() => {
          if(player.isSprinting) {
            player.teleport(player.location);
            addScore(player, 'anticheat:invaildSprintBVl', 1);
            flag(player, 'invaildSprint/B', getScore(player, 'anticheat:invaildSprintBVl'));
            if(getScore(player, 'anticheat:invaildSprintBVl') > config.modules.invaildSprintB.VL) {
              clearScore(player, 'anticheat:invaildSprintB');
              punish(player, 'invaildSprint/B', config.modules.invaildSprintB.punishment)
            }
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