import { world, Player } from '@minecraft/server';
import { addScore, flag, getScore, punish } from '../../../util/World';
import config from '../../../data/config.js';

const movement_a = () => {
  const EVENT = world.afterEvents.entityHurt.subscribe(ev => {
    const player = ev.hurtEntity as Player;
    if (player.typeId !== 'minecraft:player' || ev.damageSource.cause !== 'fall' || ev.damage <= 0) return;
    if (!player.isOnGround) {
      addScore(player, 'anticheat:movementAVl', 1);
      flag(player, 'movement/A', getScore(player, 'anticheat:movementAVl'));
      if (getScore(player, 'anticheat:movementAVl') > config.modules.movementA.VL) {
        punish(player, 'movement/A', config.modules.movementA.punishment)
      }
    }
  });
  if (!config.modules.movementA.state) {
    world.afterEvents.entityHurt.unsubscribe(EVENT)
  }
};

export { movement_a }