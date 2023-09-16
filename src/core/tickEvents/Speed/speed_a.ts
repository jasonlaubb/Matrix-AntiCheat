import { getScore, clearScore, uniqueId, getGamemode, flag, addScore, punish } from '../../../util/World.js';
import { world, system } from '@minecraft/server';
import config from '../../../data/config.js';

const speed_a = () => {
  const EVENT = system.runInterval(() => {
    for (const player of world.getPlayers()) {
      if (uniqueId(player) || getGamemode(player) == 1 || getGamemode(player) == 3) continue;
      const playerSpeed: number = Math.abs(Math.sqrt(player.getVelocity().x ** 2 + player.getVelocity().y ** 2));
      if (playerSpeed > config.modules.speedA.maxSpeed) {
        if (!player.isGliding && !player.getEffect('speed') && !player.isSwimming) {
          player.teleport(player.location);
          addScore(player, 'anticheat:speedWARN', 1);
          if (getScore(player, 'anticheat:speedWARN') > config.modules.speedA.MaxWarnTime) {
            clearScore(player, 'anticheat:speedWARN');
            addScore(player, 'anticheat:speedAVl', 1);
            clearScore(player, 'anticheat:speedAWARN');
            flag(player, 'speed/A', getScore(player, 'anticheat:speedAVl'));
            if (getScore(player, 'anticheat:speedAVl') > config.modules.speedA.VL) {
              clearScore(player, 'anticheat:speedAVl');
              punish(player, 'speed/A', config.modules.speedA.punishment);
            }
          }
        }
      }
    }
  });
  if (!config.modules.speedA.state) {
    system.clearRun(EVENT);
  }
};

export { speed_a };