import { Block, Player, world } from '@minecraft/server';
import config from '../../../data/config.js';
import { uniqueId } from '../../../util/World.js';
import { State } from '../../../util/Toggle.js';
import { flag } from '../../../util/Flag.js';

const scaffold_a = () => {
    const EVENT = world.beforeEvents.playerPlaceBlock.subscribe(ev => {
      const player: Player = ev.player;
      if(uniqueId(player)) return;
      const block: Block = ev.block;
      const block2: Block = player.dimension.getBlock({ x: Math.trunc(player.location.x), y: Math.trunc(player.location.y) - 1, z: Math.trunc(player.location.z) });
      const blockFromViewDirection = player.getBlockFromViewDirection();
      if (blockFromViewDirection.block !== block && block == block2) {
        ev.cancel = true;
        flag(player, 'Scaffold/A', config.modules.scaffoldA, undefined)
      }
    });
    if(!State('SCAFFOLDA', config.modules.scaffoldA.state)) {
      world.beforeEvents.playerPlaceBlock.unsubscribe(EVENT);
    };
  };
  
  export { scaffold_a }