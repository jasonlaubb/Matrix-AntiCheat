import { world, system } from '@minecraft/server';
import { flag, punish, uniqueId, addScore, getScore, clearScore } from '../../../util/World.js';
import config from '../../../data/config.js';
import { State } from '../../../util/Toggle.js';

const fly_e = () => {
  const EVENT = system.runInterval(() => {
    for(const player of world.getPlayers()) {
      if (uniqueId(player) || player.isFlying) continue
      if (player.fallDistance < -1 && !player.isSwimming && !player.isJumping && !player.hasTag('anticheat:trident')) {
        player.applyDamage(6);
        player.teleport(player.location);
        addScore(player, 'anticheat:flyEVl', 1);
        flag(player, 'Fly/E', getScore(player, 'anticheat:flyEVl'), [`fallDistance=${player.fallDistance}`]);
        if (getScore(player, 'anticheat:flyEVl') > config.module.flyE.VL) {
          clearScore(player, 'anticheat:flyEVl');
          punish(player, 'Fly/E', config.modules.flyE.punishment)
        }
      }
    };
    if(!State('FLYB', config.modules.flyB.state)) {
      system.clearRun(EVENT)
    }
  })
};

export { fly_e }