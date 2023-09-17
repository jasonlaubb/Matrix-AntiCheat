import { Player, Vector3, world } from '@minecraft/server';
import { addScore, clearScore, getScore, punish, uniqueId, flag } from '../../../util/World.js';
import config from '../../../data/config.js';
import { lastAttackDelayCombo, lastAttackVector2Angle } from '../../../util/Map.js';

const killaura_f = () => {
//@ts-expect-error
  const EVENT = world.afterEvents.entityHitEntity.subscribe(ev => {
    const player = ev.damagingEntity as Player;
    if(lastAttackDelayCombo.get(player.id) == undefined) {
      return lastAttackDelayCombo.set(player.id, Date.now())
    };
    if(Date.now() - lastAttackDelayCombo.get(player.id) > config.modules.killauraF.maxDelay) {
      clearScore(player, 'anticheat:killauraFgotCheck');
    };
    lastAttackDelayCombo.set(player.id, Date.now())
    const hitEntity = ev.hitEntity;
    if(lastAttackVector2Angle.get(player.id) == undefined) return lastAttackVector2Angle.set(player.id, { x: 0, y: 0});
    if(uniqueId(player) || player.typeId !== 'minecraft:player') return null;
    if(config.modules.killauraF.attackerMove && !player.hasTag('anticheat:moving')) return null;
    if(config.modules.killauraF.targetMove && (!hitEntity.hasTag('anticheat:moving') || hitEntity.typeId !== 'minecraft:player')) return null;
    const pos1: Vector3 = player.getHeadLocation();
    const pos2: Vector3 = hitEntity.getHeadLocation();
    let angle1 = Math.atan2((pos2.z - pos1.z), (pos2.x - pos1.x)) * 180 / Math.PI - player.getRotation().y - 90;
    if (angle1 <= -180) angle1 += 360;
    angle1 = Math.abs(angle1);
    let angle2 = Math.atan2((pos2.y - pos1.y), (pos2.x - pos1.x)) * 180 / Math.PI - (player.getRotation().x * 2) - 90;
    if (angle2 <= -180) angle2 += 360;
    angle2 = Math.abs(angle2);
    const AttackVector2Angle = { x: angle1, y: angle2 };
    if(lastAttackVector2Angle.get(player.id).x == AttackVector2Angle.x && lastAttackVector2Angle.get(player.id).y == AttackVector2Angle.y) {
      addScore(player, 'anticheat:killauraFgotCheck', 1);
      if(getScore(player, 'anticheat:killauraFgotCheck') >= config.modules.killauraF.gotCheck) {
        clearScore(player, 'anticheat:killauraFgotCheck');
        addScore(player, 'anticheat:killauraFVl', 1);
        flag(player, 'Killaura/F', getScore(player, 'anticheat:killauraFVl'))
        if(getScore(player, 'anticheat:killauraFVl') > config.modules.killauraF.VL) {
          clearScore(player, 'anticheat:killauraFVl');
          punish(player, 'Killaura/F', config.modules.killauraF.punishment)
        }
      }
    } else clearScore(player, 'anticheat:killauraFgotCheck')
    lastAttackVector2Angle.set(player.id, AttackVector2Angle)
  });
  if(!config.modules.killauraF.state) {
    world.afterEvents.entityHitEntity.unsubscribe(EVENT)
  }
};

export { killaura_f }