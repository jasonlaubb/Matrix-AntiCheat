import { Block, BlockType, Player, world } from '@minecraft/server';
import config from '../../../data/config.js';
import { flag, getScore, addScore, clearScore, uniqueId, punish } from '../../../util/World.js';

const scaffold_d = () => {
    const EVENT = world.afterEvents.blockBreak.subscribe(ev => {
      const player: Player = ev.player;
      if(uniqueId(player)) return;
      const block: Block = ev.block;
      const block2: Block = player.dimension.getBlock({ x: Math.trunc(player.location.x), y: Math.trunc(player.location.y) - 1, z: Math.trunc(player.location.z)});
      const block3: Block = player.dimension.getBlock({ x: Math.trunc(player.location.x), y: Math.trunc(player.location.y) - 2, z: Math.trunc(player.location.z)});
      const speedlimit: number = Math.sqrt((config.modules.scaffoldD.illegalSpeed ** 2) / 2);
      addScore(player, 'anticheat:scaffoldDgotcheck', 1);
      if(getScore(player, 'anticheat:scaffoldDgotcheck') <= config.modules.scaffoldD.gotcheck) return;
      clearScore(player, 'anticheat:scaffoldDgotcheck');
      if (block3.typeId == 'minecraft:air' && block == block2 && player.getVelocity().x > speedlimit && player.getVelocity().z > speedlimit && !player.hasTag('anticheat:damaged') && !player.isFlying) {
        block.setType({id: 'minecraft:air'} as BlockType);
        addScore(player, 'anticheat:scaffoldDVl', 1);
        flag(player, 'scaffold/D', getScore(player, 'anticheat:scaffoldDVl'));
        if(getScore(player, 'anticheat:scaffoldDVl') > config.modules.scaffoldD.VL) {
          clearScore(player, 'anticheat:scaffoldDVl');
          punish(player, 'scaffold/D', config.modules.scaffoldD.punishment)
        }
      }
    });
    if(!config.modules.scaffoldD.state) {
      world.afterEvents.blockPlace.unsubscribe(EVENT);
    };
  };
  
  export { scaffold_d }