import { Block, Player, world } from '@minecraft/server';
import config from '../../../data/config.js';
import { uniqueId } from '../../../util/World.js';
import { State } from '../../../util/Toggle.js';
import { flag } from '../../../util/Flag.js';

const scaffold_c = () => {
    const EVENT = world.beforeEvents.playerPlaceBlock.subscribe(ev => {
      const player: Player = ev.player;
      if(uniqueId(player)) return;
      const block: Block = ev.block;
      const block2: Block = player.dimension.getBlock({ x: Math.trunc(player.location.x), y: Math.trunc(player.location.y) - 1, z: Math.trunc(player.location.z)});
      if (block == block2 && player.getRotation().x >= config.modules.scaffoldC.angle) {
        ev.cancel = true;
        flag(player, 'Scaffold/C', config.modules.scaffoldC, [`rotation=${player.getRotation().x}`])
      }
    });
    if(!State('SCAFFOLDC', config.modules.scaffoldC.state)) {
      world.beforeEvents.playerPlaceBlock.unsubscribe(EVENT);
    };
  };
  
  export { scaffold_c }