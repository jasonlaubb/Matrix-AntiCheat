import { Block, Player, world } from '@minecraft/server';
import config from '../../../data/config.js';
import { flag, getScore, addScore, clearScore, uniqueId, punish } from '../../../util/World.js';
import { State } from '../../../util/Toggle.js';

const scaffold_b = () => {
    const EVENT = world.beforeEvents.playerPlaceBlock.subscribe(ev => {
      const player: Player = ev.player;
      if(uniqueId(player)) return;
      const block: Block = ev.block;
      const block2: Block = player.dimension.getBlock({ x: Math.trunc(player.location.x), y: Math.trunc(player.location.y) - 1, z: Math.trunc(player.location.z)});
      if (block == block2 && player.getRotation().x == 60) {
        ev.cancel = true;
        addScore(player, 'anticheat:scaffoldBVl', 1);
        flag(player, 'scaffold/B', getScore(player, 'anticheat:scaffoldBVl'));
        if(getScore(player, 'anticheat:scaffoldBVl') > config.modules.scaffoldB.VL) {
          clearScore(player, 'anticheat:scaffoldBVl');
          punish(player, 'scaffold/B', config.modules.scaffoldB.punishment)
        }
      }
    });
    if(!State('SCAFFOLDB', config.modules.scaffoldB.state)) {
      world.beforeEvents.playerPlaceBlock.unsubscribe(EVENT);
    };
  };
  
  export { scaffold_b }