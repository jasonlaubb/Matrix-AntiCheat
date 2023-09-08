import { world } from '@minecraft/server';
import config from '../../../data/config.js';
import { flag, getScore, addScore, clearScore, uniqueId } from '../../../unti/World.js';

const surround_b = () => {
  const EVENT = world.beforeEvents.playerPlaceBlock.subscribe(ev => {
    const player = ev.player;
    if(uniqueId(player)) return;
    const block = ev.block;
    const pos1 = { x: player.location.x, y: player.location.y, z: player.location.z };
    const pos2 = { x: block.location.x, y: block.location.y, z: block.location.z };
    let angle = Math.atan2((pos2.z - pos1.z), (pos2.x - pos1.x)) * 180 / Math.PI - player.getRotation().y - 90;
    if (angle <= -180) angle += 360;
    angle = Math.abs(angle);
    if (angle > config.modules.surroundB.maxAngle && Math.sqrt((pos1.x - pos2.x) ** 2 +(pos1.z - pos2.z) ** 2) > 2) {
      ev.cancel = true;
      addScore(player, 'anticheat:surroundBVl');
      flag(player, 'surround/B', getScore(player, 'anticheat:surroundBVl'));
      if(getScore(player, 'anticheat:surroundBVl') > config.modules.surroundB.VL) {
        clearScore(player, 'anticheat:surroundB');
        punish(player, 'surround/B', config.modules.surroundB.punishment)
      }
    }
  });
  if(!config.modules.surroundB.state) {
    world.afterEvents.playerPlaceBlock.unsubscribe(EVENT);
  };
};

export { surround_b }