import { Block, BlockType, Vector3, world } from '@minecraft/server';
import { addScore, flag, getGamemode, getScore, punish, uniqueId } from '../../../util/World.js';
import config from '../../../data/config.js';

const reach_b = () => {
  const EVENT = world.afterEvents.blockPlace.subscribe(ev => {
    const player = ev.player;
    if(uniqueId(player) || player.typeId !== 'minecraft:player' || getGamemode(player) == 1) return;
    const block: Block = ev.block;
    const pos1: Vector3 = player.getHeadLocation();
    const pos2: Vector3 = block.location;
    const distance: number = Number(Math.abs(Math.sqrt((pos1.x - pos2.x) ** 2 + (pos1.y - pos2.y) ** 2 + (pos1.z - pos2.z) ** 2)).toFixed(3));
    if (distance > config.modules.reachB.maxdistance) {
      addScore(player, 'anticheat:reachBVl', 1);
      flag(player, 'reach/B', getScore(player, 'anticheat:reachBVl'));
      block.setType({id: 'minecraft:air'} as BlockType);
      if (getScore(player, 'anticheat:reachBVl') > config.modules.reachB.VL) {
        punish(player, 'reach/B', config.modules.reachB.punishment)
      }
    }
  });
  if (!config.modules.reachB.state) {
    world.afterEvents.blockPlace.unsubscribe(EVENT)
  }
};

export { reach_b }