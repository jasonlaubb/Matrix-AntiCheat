import { addScore, getScore, flag, clearScore, punish, uniqueId, getGamemode } from '../../../unti/World.js';
import config from '../../../data/config.js';
import { world, system } from '@minecraft/server';

export const nofall_a = () => {
  const EVENT = system.runInterval(() => {
    for(const player of world.getPlayers()){
      if(uniqueId(player)) continue;
      if(player.lastfallingspeed == undefined) player.lastfallingspeed = player.getVelocity().y;
      if(player.lastfallingspeed < 0 && player.getVelocity().y == 0 && !player.isFlying && !player.isOnGround) {
        player.teleport({ x: player.location.x, y: player.location.y, z: player.location.z });
        addScore(player, 'anticheat:nofallVl', 1);
        flag(player, 'nofall/A', getScore(player, 'anticheat:nofallVl'))
        if(getScore(player, 'anticheat:nofallVl') > config.modules.nofallA.VL) {
          clearScore(player, 'anticheat:nofallVl');
          punish(player, 'nofall/A', config.modules.nofallA.punishment);
        };
      };
      player.lastfallingspeed = player.getVelocity().y;
    }
  });
  if(!config.modules.nofallA.state) {
    system.clearRun(EVENT)
  }
}