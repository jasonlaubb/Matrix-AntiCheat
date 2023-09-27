import { Block, Vector3, world } from '@minecraft/server';
import { addScore, flag, getGamemode, getScore, punish, revertBlock, uniqueId } from '../../../util/World.js';
import config from '../../../data/config.js';
import { State } from '../../../util/Toggle.js';

const reach_c = () => {
  const EVENT = world.beforeEvents.playerBreakBlock.subscribe(ev => {
    const player = ev.player;
    if(uniqueId(player) || player.typeId !== 'minecraft:player' || getGamemode(player) == 1) return;
    const block: Block = ev.block
    const pos1: Vector3 = player.getHeadLocation();
    const pos2: Vector3 = block.location;
    const distance: number = Number(Math.abs(Math.sqrt((pos1.x - pos2.x) ** 2 + (pos1.y - pos2.y) ** 2 + (pos1.z - pos2.z) ** 2)).toFixed(3));
    if (distance > config.modules.reachB.maxdistance) {
      addScore(player, 'anticheat:reachCVl', 1);
      flag(player, 'reach/C', getScore(player, 'anticheat:reachCVl'));
      revertBlock(ev.block)
      if (getScore(player, 'anticheat:reachCVl') > config.modules.reachB.VL) {
        punish(player, 'reach/C', config.modules.reachB.punishment)
      }
    }
  });
  if (!State('REACHB', config.modules.reachB.state)) {
    world.beforeEvents.playerBreakBlock.unsubscribe(EVENT)
  }
};

export { reach_c }