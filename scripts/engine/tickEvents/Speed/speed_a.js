import { getScore, clearScore, uniqueId, getGamemode, flag, addScore, punish } from '../../../unti/World.js';
import { world, system } from '@minecraft/server';
import config from '../../../data/config.js';

export const speed_a = () => {
  const EVENT = system.runInterval(() => {
    for(const player of world.getPlayers()) {
      if(uniqueId(player) || getGamemode(player) == 1 || getGamemode(player) == 3) return;
      const playerSpeed = Math.abs(Math.sqrt(player.getVelocity().x ** 2 + player.getVelocity().y ** 2));
      if(playerSpeed > config.modules.speedA.maxSpeed) {
        if(!player.isGliding && !player.getEffect('speed') && !player.isSwimming) {
          player.teleport({x: player.location.x, y: player.location.y, z: player.location.z});
          addScore(player, 'anticheat:speedWARN');
          if(getScore(player, 'anticheat:speedWARN') > config.modules.speedA.MaxWarnTime) {
            addScore(player, 'anticheat:speedAVl');
            clearScore(player, 'anticheat:speedAWARN');
            flag(player, 'speed/A', getScore(player, 'anticheat:speedAVl'));
            if(getScore(player, 'anticheat:speedAVl' > config.modules.speedA.VL)) {
              clearScore(player, 'anticheatspeedAVl');
              punish(player, 'speed/A', config.modules.speedA.punishment)
            }
          }
        }
      }
    }
  });
  if(!config.modules.speedA.state) {
    system.clearRun(EVENT);
  }
}