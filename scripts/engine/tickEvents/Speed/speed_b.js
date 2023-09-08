import { flag, uniqueId, getGamemode, addScore, getScore, clearScore, punish } from '../../../unti/World.js';
import config from '../../../data/config.js';
import { world, system } from '@minecraft/server';

export const speed_b = () => {
  const EVENT = system.runInterval(() => {
    for(const player of world.getPlayers()) {
      if(getGamemode(player) == 1 || getGamemode(player) == 3 || uniqueId(player)) return;
      if(player.lastpos == undefined) {
        player.lastpos = { x: player.location.x, y: player.location.z}
      };
      const bps = Math.sqrt(Math.abs(player.lastpos.x - player.location.x) ** 2 + Math.abs(player.lastpos.y - player.location.x));
      if(bps > config.modules.speedB.maxPosDeff && player.getVelocity().x !== 0 && player.getVelocity().z !== 0) {
        player.teleport({ x: player.lastpos.x, y: player.location.y, z: player.lastpos.z });
        addScore(player, 'anticheat:speedBcombo', 1);
        if(getScore(player, 'anticheat:speedBcombo') > config.modules.speedB.MaxWarnTime) {
          clearScore(player, 'anticheat:speedBcombo');
          addScore(player, 'anticheat:speedBVl', 1);
          flag(player, 'speed/B', getScore(player, 'anticheat:speedBV;'));
          if(getScore(player, 'anticheat:speedBV;') > config.modules.speedB.VL) {
            clearScore(player, 'anticheat:speedBVl');
            punish(player, 'speed/B', config.modules.speedB.punishment)
          }
        }
      }
    }
  });
  if(!config.modules.speedB.state) {
    system.clearRun(EVENT);
  }
}