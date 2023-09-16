import { Block, BlockType, Player, world } from '@minecraft/server';
import config from '../../../data/config.js';
import { flag, getScore, addScore, clearScore, uniqueId, punish } from '../../../util/World.js';

const scaffold_b = () => {
    const EVENT = world.afterEvents.blockPlace.subscribe(ev => {
      const player: Player = ev.player;
      if(uniqueId(player)) return;
      const block: Block = ev.block;
      const block2: Block = player.dimension.getBlock({ x: Math.trunc(player.location.x), y: Math.trunc(player.location.y) - 1, z: Math.trunc(player.location.z)});
      if (block == block2 && player.getRotation().x == 60) {
        block.setType({id: 'minecraft:air'} as BlockType);
        addScore(player, 'anticheat:scaffoldBVl', 1);
        flag(player, 'scaffold/B', getScore(player, 'anticheat:scaffoldBVl'));
        if(getScore(player, 'anticheat:scaffoldBVl') > config.modules.scaffoldB.VL) {
          clearScore(player, 'anticheat:scaffoldBVl');
          punish(player, 'scaffold/B', config.modules.scaffoldB.punishment)
        }
      }
    });
    if(!config.modules.scaffoldB.state) {
      world.afterEvents.blockPlace.unsubscribe(EVENT);
    };
  };
  
  export { scaffold_b }