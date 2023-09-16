import { Block, BlockType, Player, world } from '@minecraft/server';
import config from '../../../data/config.js';
import { flag, getScore, addScore, clearScore, uniqueId, punish } from '../../../util/World.js';

const scaffold_a = () => {
    const EVENT = world.afterEvents.blockPlace.subscribe(ev => {
      const player: Player = ev.player;
      if(uniqueId(player)) return;
      const block: Block = ev.block;
      const block2: Block = player.dimension.getBlock({ x: Math.trunc(player.location.x), y: Math.trunc(player.location.y) - 1, z: Math.trunc(player.location.z)});
      if (player.getBlockFromViewDirection().block !== block && block == block2) {
        block.setType({id: 'minecraft:air'} as BlockType);
        clearScore(player, 'anticheat:scaffoldAWarn');
        addScore(player, 'anticheat:scaffoldAVl', 1);
        flag(player, 'scaffold/A', getScore(player, 'anticheat:scaffoldAVl'));
        if(getScore(player, 'anticheat:scaffoldAVl') > config.modules.scaffoldA.VL) {
          clearScore(player, 'anticheat:scaffoldAVl');
          punish(player, 'scaffold/A', config.modules.scaffoldA.punishment)
        }
      }
    });
    if(!config.modules.scaffoldA.state) {
      world.afterEvents.blockPlace.unsubscribe(EVENT);
    };
  };
  
  export { scaffold_a }