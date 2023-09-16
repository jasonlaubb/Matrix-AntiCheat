import { Entity, Player, Vector3, world } from '@minecraft/server';
import { addScore, flag, getGamemode, getScore, punish, uniqueId } from '../../../util/World.js';
import config from '../../../data/config.js';

const reach_a = () => {
  const EVENT = world.afterEvents.entityHitEntity.subscribe(ev => {
    const player = ev.damagingEntity as Player;
    if(uniqueId(player) || player.typeId !== 'minecraft:player' || getGamemode(player) == 1) return;
    const target: Entity = ev.hitEntity;
    const pos1: Vector3 = player.getHeadLocation();
    const pos2: Vector3 = target.getHeadLocation();
    const distance: number = Number(Math.abs(Math.sqrt((pos1.x - pos2.x) ** 2 + (pos1.y - pos2.y) ** 2 + (pos1.z - pos2.z) ** 2)).toFixed(3));
    if (distance > config.modules.reachA.maxdistance) {
      addScore(player, 'anticheat:ReachAVl', 1);
      flag(player, 'reach/A', getScore(player, 'anticheat:ReachAVl'));
      player.kill();
      if (getScore(player, 'anticheat:ReachAVl') > config.modules.reachA.VL) {
        punish(player, 'reach/A', config.modules.reachA.punishment)
      }
    }
  });
  if (!config.modules.reachA.state) {
    world.afterEvents.entityHitEntity.unsubscribe(EVENT)
  }
};

export { reach_a }