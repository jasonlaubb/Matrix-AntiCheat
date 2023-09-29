import { Block, Player, world } from '@minecraft/server';
import config from '../../../data/config.js';
import { flag, getScore, addScore, clearScore, uniqueId, punish } from '../../../util/World.js';
import { State } from '../../../util/Toggle.js';

const scaffold_c = () => {
    const EVENT = world.beforeEvents.playerPlaceBlock.subscribe(ev => {
      const player: Player = ev.player;
      if(uniqueId(player)) return;
      const block: Block = ev.block;
      const block2: Block = player.dimension.getBlock({ x: Math.trunc(player.location.x), y: Math.trunc(player.location.y) - 1, z: Math.trunc(player.location.z)});
      if (block == block2 && player.getRotation().x >= config.modules.scaffoldC.angle) {
        ev.cancel = true;
        addScore(player, 'anticheat:scaffoldCVl', 1);
        flag(player, 'scaffold/C', getScore(player, 'anticheat:scaffoldCVl'));
        if(getScore(player, 'anticheat:scaffoldCVl') > config.modules.scaffoldC.VL) {
          clearScore(player, 'anticheat:scaffoldCVl');
          punish(player, 'scaffold/C', config.modules.scaffoldC.punishment)
        }
      }
    });
    if(!State('SCAFFOLDC', config.modules.scaffoldC.state)) {
      world.beforeEvents.playerPlaceBlock.unsubscribe(EVENT);
    };
  };
  
  export { scaffold_c }