import { Block, Player, world } from '@minecraft/server';
import config from '../../../data/config.js';
import { uniqueId } from '../../../util/World.js';
import { State } from '../../../util/Toggle.js';
import { flag } from '../../../util/Flag.js';

const scaffold_b = () => {
  const EVENT = world.beforeEvents.playerPlaceBlock.subscribe(ev => {
    const player: Player = ev.player;
    if(uniqueId(player)) return;
    const block: Block = ev.block;
    const block2: Block | undefined = player.dimension.getBlock({ x: Math.trunc(player.location.x), y: Math.trunc(player.location.y) - 1, z: Math.trunc(player.location.z)});
    const xRotation: number = player.getRotation().x;
    if (block == block2 && (xRotation === 60 || xRotation.toFixed(2) === '84.63' || xRotation.toFixed(2) === '84.89' || xRotation.toFixed(2) === '65.31')) {
      ev.cancel = true;
      flag(player, 'Scaffold/B', config.modules.scaffoldB, [`rotation=${xRotation.toFixed(5)}`])
    }
  });
  if(!State('SCAFFOLDB', config.modules.scaffoldB.state)) {
      world.beforeEvents.playerPlaceBlock.unsubscribe(EVENT);
  };
};
  
export { scaffold_b }