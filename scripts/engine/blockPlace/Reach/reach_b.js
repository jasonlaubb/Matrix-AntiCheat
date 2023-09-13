import { world, system } from '@minecraft/server';
import { addScore, flag, getGamemode, getScore, punish, uniqueId } from '../../../unti/World.js';
import config from '../../../data/config.js';

const reach_b = () => {
  const EVENT = world.beforeEvents.playerPlaceBlock.subscribe(ev => {
    const player = ev.player;
    if(uniqueId(player) || player.typeId !== 'minecraft:player' || getGamemode(player) == 1) return;
    const hitEntity = ev.hitEntity;
    const block = ev.block;
    const pos1 = player.getHeadLocation();
    const pos2 = block.location;
    const distance = Math.abs(Math.sqrt((pos1.x - pos2.x) ** 2 + (pos1.y - pos2.y) ** 2 + (pos1.z - pos2.z) ** 2)).toFixed(3);
    if (distance > config.modules.reachB.maxdistance) {
      addScore(player, 'anticheat:reachBVl', 1);
      flag(player, 'reach/B', getScore(player, 'anticheat:reachBVl'));
      ev.cancel = true;
      if (getScore(player, 'anticheat:reachBVl') > config.modules.reachB.VL) {
        punish(player, 'reach/B', config.modules.reachB.punishment)
      }
    }
  });
  if (!config.modules.reachB.state) {
    world.afterEvents.playerPlaceBlock.unsubscribe(EVENT)
  }
};

export { reach_b }