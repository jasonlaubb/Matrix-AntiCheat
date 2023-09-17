import { addScore, getScore, flag, clearScore, punish, uniqueId } from '../../../util/World.js';
import config from '../../../data/config.js';
import { world, system } from '@minecraft/server';
import { lastfallingspeed } from '../../../util/Map.js';

export const nofall_a = () => {
  const EVENT = system.runInterval(() => {
    for(const player of world.getPlayers()){
      if(uniqueId(player)) continue;
      if(lastfallingspeed.get(player.id) == undefined) lastfallingspeed.set(player.id, 0);
      if(lastfallingspeed.get(player.id) < 0 && player.getVelocity().y == 0 && !player.isFlying && !player.isOnGround) {
        player.teleport(player.location);
        addScore(player, 'anticheat:nofallVl', 1);
        flag(player, 'nofall/A', getScore(player, 'anticheat:nofallVl'))
        if(getScore(player, 'anticheat:nofallVl') > config.modules.nofallA.VL) {
          clearScore(player, 'anticheat:nofallVl');
          punish(player, 'nofall/A', config.modules.nofallA.punishment);
        };
      };
    lastfallingspeed.set(player.id, player.getVelocity().y);
    }
  });
  if(!config.modules.nofallA.state) {
    system.clearRun(EVENT)
  }
}