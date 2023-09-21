import { getScore, clearScore, uniqueId, flag, addScore, punish } from '../../../util/World.js';
import { world, system } from '@minecraft/server';
import config from '../../../data/config.js';

const knockback_a = () => {
  const EVENT = system.runInterval(() => {
    for(const player of world.getPlayers()) {
      if(uniqueId(player) || player.hasTag('anticheat:trident')) continue;
      const magnitude: number = Math.abs(player.getVelocity().x) + Math.abs(player.getVelocity().y) + Math.abs(player.getVelocity().z);
      if(magnitude <= config.modules.knockbackA.magnitude) {
        if(player.hasTag('anticheat:damaged') && !player.hasTag('anticheat:dead') && !player.isGliding && !player.hasTag('anticheat:levitating') && !player.isFlying)
        player.teleport(player.location);
        addScore(player, 'anticheat:knockbackAVl', 1);
        flag(player, 'KnockBack/A', getScore(player, 'anticheat:knockbackAVl'));
        if(getScore(player, 'anticheat:knockbackAVl') > config.modules.knockbackA.VL) {
          clearScore(player, 'anticheat:knockbackAVl')
          punish(player, 'KnockBack/A', config.modules.knockbackA.punishment)
        }
      }
    }
  });
  if(!config.modules.knockbackA.state) {
    system.clearRun(EVENT);
  }
};

export { knockback_a }