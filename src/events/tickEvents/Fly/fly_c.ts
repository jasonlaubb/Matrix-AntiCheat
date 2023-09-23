import { world, system } from '@minecraft/server';
import { flag, punish, uniqueId, isAllBlockAir, addScore, getScore, clearScore } from '../../../util/World.js';
import config from '../../../data/config.js';

const fly_c = () => {
  const EVENT = system.runInterval(() => {
    for(const player of world.getPlayers()) {
      if(uniqueId(player) || player.isFlying) continue
      if(!player.isFlying && !player.isGliding && player.getVelocity().y == 0) {
        if(!player.isOnGround) {
          const startpos = { x: Math.trunc(player.location.x - 2), y: Math.trunc(player.location.y - 1), z: Math.trunc(player.location.z - 2) };
          const endpos = { x: Math.trunc(player.location.x + 2), y: Math.trunc(player.location.y + 2), z: Math.trunc(player.location.z + 2) };
          const inAirState = isAllBlockAir(player, startpos, endpos);
          if(inAirState) {
            addScore(player, 'anticheat:flyCVl', 1);
            player.applyDamage(6);
            flag(player, 'fly/C', getScore(player, 'anticheat:flyCVl'));
            player.teleport({ x: player.location.x, y: player.location.y - 2, z: player.location.z });
            if(getScore(player, 'anticheat:flyCVl') > config.modules.flyC.VL) {
              clearScore(player, 'anticheat:flyCVl');
              punish(player, 'fly/B', config.modules.flyC.punishment)
            }
          }
        }
      }
    };
    if(!config.modules.flyC.state) {
      system.clearRun(EVENT)
    }
  })
};

export { fly_c }