import { world } from '@minecraft/server';
import config from '../../../data/config.js';
import { flag, getScore, addScore, clearScore, uniqueId, revertBlock, punish } from '../../../util/World.js';

const surround_a = () => {
  const EVENT = world.afterEvents.blockBreak.subscribe(ev => {
    const player = ev.player;
    if(uniqueId(player)) return;
    const block = ev.block;
    const pos1 = { x: player.location.x, y: player.location.y, z: player.location.z };
    const pos2 = { x: block.location.x, y: block.location.y, z: block.location.z };
    let angle = Math.atan2((pos2.z - pos1.z), (pos2.x - pos1.x)) * 180 / Math.PI - player.getRotation().y - 90;
    if (angle <= -180) angle += 360;
    angle = Math.abs(angle);
    if (angle > config.modules.surroundA.maxAngle && Math.sqrt((pos1.x - pos2.x) ** 2 +(pos1.z - pos2.z) ** 2) > 2) {
      revertBlock(block);
      addScore(player, 'anticheat:surroundAVl', 1);
      flag(player, 'surround/A', getScore(player, 'anticheat:surroundAVl'));
      if(getScore(player, 'anticheat:surroundAVl') > config.modules.surroundA.VL) {
        clearScore(player, 'anticheat:surroundA');
        punish(player, 'surround/A', config.modules.surroundA.punishment)
      }
    }
  });
  if(!config.modules.surroundA.state) {
    world.afterEvents.blockBreak.unsubscribe(EVENT);
  };
};

export { surround_a }