import { addScore, flag, getScore, punish, uniqueId } from '../../../util/World.js';
import config from '../../../data/config.js';
import { world, system, Vector2 } from '@minecraft/server';
import { lastRotationDeff as lr } from '../../../util/Map.js';
import { State } from '../../../util/Toggle.js';

const aimbot_a = () => {
  const EVENT = system.runInterval(() => {
    for(const player of world.getPlayers()){
      if(uniqueId(player)) continue;
      const lastRotationDeff = lr.get(player.id)
      if(lastRotationDeff !== undefined) {
        const locationdeff: Vector2 = { x: Math.abs(player.getRotation().x - lastRotationDeff.x), y: player.getRotation().y - lastRotationDeff.y}
        if(locationdeff.x == lastRotationDeff.x && locationdeff.x !== 0 && locationdeff.y == lastRotationDeff.y) {
          player.setRotation({ x: lastRotationDeff.x, y: lastRotationDeff.y });
          addScore(player, 'anticheat:aimbotAVl', 1);
          flag(player, 'aimbot/A', getScore(player, 'anticheat:aimbotAVl'));
          if(getScore(player, 'anticheat:aimbotAVl') > config.modules.aimbotA.VL) {
            punish(player, 'aimbot/A', config.modules.aimbotA.punishment)
          }
        }
      } else {
        lr.set(player.id, { x: 0, y: 0 })
      };
      lr.set(player.id, { x: player.getRotation().x, y: player.getRotation().y })
    }
  });
  if(!State('AIMBOTA', config.modules.aimbotA.state)) {
    system.clearRun(EVENT)
  }
};

export { aimbot_a }