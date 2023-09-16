import { addScore, flag, getScore, punish, uniqueId } from '../../../util/World.js';
import config from '../../../data/config.js';
import { world, system, Vector2 } from '@minecraft/server';

const aimbot_a = () => {
  const EVENT = system.runInterval(() => {
    for(const player of world.getPlayers()){
      if(uniqueId(player)) continue;
//@ts-ignore
      if(player.lastRotationDeff !== undefined) {
//@ts-ignore
        const locationdeff: Vector2 = { x: Math.abs(player.getRotation().x - player.lastRotation.x), y: player.getRotation().y - player.lastRotation.y}
//@ts-ignore
        if(locationdeff.x == player.lastRotationDeff.x && locationdeff.x !== 0 && locationdeff.y == player.lastRotationDeff.y) {
//@ts-ignore
          player.setRotation({ x: player.lastRotation.x, y: player.lastRotation.y });
          addScore(player, 'anticheat:aimbotAVl', 1);
          flag(player, 'aimbot/A', getScore(player, 'anticheat:aimbotAVl'));
          if(getScore(player, 'anticheat:aimbotAVl') > config.modules.aimbotA.VL) {
            punish(player, 'aimbot/A', config.modules.aimbotA.punishment)
          }
        }
      } else {
//@ts-ignore
        player.lastRotationDeff = { x: 0, y: 0 };
      };
//@ts-ignore
      player.lastRotation = { x: player.getRotation().x, y: player.getRotation().y }
    }
  });
  if(!config.modules.aimbotA.state) {
    system.clearRun(EVENT)
  }
};

export { aimbot_a }