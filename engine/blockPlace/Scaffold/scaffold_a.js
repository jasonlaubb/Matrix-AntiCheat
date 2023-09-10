import { world } from '@minecraft/server';
import config from '../../../data/config.js';
import { flag, getScore, addScore, clearScore, uniqueId, punish } from '../../../unti/World.js';

const scaffold_a = () => {
    const EVENT = world.beforeEvents.playerPlaceBlock.subscribe(ev => {
      const player = ev.player;
      if(uniqueId(player)) return;
      const block = ev.block;
      if (player.getBlockFromViewDirection().id !== block.id && player.location.y > block.location.y) {
        ev.cancel = true;
        clearScore(player, 'anticheat:scaffoldAWarn');
        addScore(player, 'anticheat:scaffoldAVl');
        flag(player, 'scaffold/A', getScore(player, 'anticheat:scaffoldAVl'));
        if(getScore(player, 'anticheat:scaffoldAVl') > config.modules.scaffoldA.VL) {
          clearScore(player, 'anticheat:scaffoldAVl');
          punish(player, 'scaffold/A', config.modules.scaffoldA.punishment)
        }
      }
    });
    if(!config.modules.scaffoldA.state) {
      world.afterEvents.playerPlaceBlock.unsubscribe(EVENT);
    };
  };
  
  export { scaffold_a }