import { world, system } from '@minecraft/server';
import { flag, punish, uniqueId, getGamemode, isAllBlockAir, addScore, getScore, clearScore } from '../../../unti/World.js';
import config from '../../../data/config.js';

const fly_b = () => {
  const EVENT = system.runInterval(() => {
    for(const player of world.getPlayers()) {
      if(uniqueId(player) || player.isFlying) continue
      if(Math.abs(player.getVelocity().y).toFixed(4) == "0.1552" && !getGamemode(player) == 1 && !player.isJumping && !player.isGliding && !player.isFlying && !player.hasTag('anticheat:riding') && !player.hasTag('anticheat:levitating') && player.hasTag('anticheat:moving')) {
        if(!player.isOnGround) {
          const startpos = { x: Math.trunc(player.location.x - 2), y: Math.trunc(player.location.y - 1), z: Math.trunc(player.location.z - 2) };
          const endpos = { x: Math.trunc(player.location.x + 2), y: Math.trunc(player.location.y + 2), z: Math.trunc(player.location.z + 2) };
          const inAirState = isAllBlockAir(player, startpos, endpos);
          if(inAirState) {
            addScore(player, 'anticheat:flyBVl', 1);
            flag(player, 'fly/B', getScore(player, 'anticheat:flyBVl', 1));
            player.teleport({ x: player.location.x, y: player.location.y, z: player.location.z });
            if(getScore(player, 'anticheat') > config.modules.flyB.VL) {
              clearScore(player, 'anticheat:flyBVl');
              punish(player, 'fly/B', config.modules.flyB.punishment)
            }
          }
        }
      }
    };
    if(!config.modules.flyB.state) {
      system.clearRun(EVENT)
    }
  })
};

export { fly_b }