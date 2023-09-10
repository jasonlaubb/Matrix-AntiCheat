import { addScore, flag, getScore, punish, uniqueId } from '../../../unti/World.js';
import config from '../../../data/config.js';
import { world, system } from '@minecraft/server';

export const aimbot_a = () => {
  const EVENT = system.runInterval(() => {
    for(const player of world.getPlayers()){
      if(uniqueId(player)) continue;
      if(player.lastRotationDeff !== undefined) {
        const locationdeff = { x: Math.abs(player.getRotation().x - player.lastRotation.x), y: player.getRotation().x - player.lastRotation}
        if(locationdeff.x == player.lastRotationDeff.x && locationdeff.x !== 0 && locationdeff.y == player.lastRotationDeff.y && locationdeff.z !== 0) {
          player.setRotation({ x: player.lastRotation.x, y: player.lastRotation.y });
          addScore(player, 'anticheat:aimbotAVl', 1);
          flag(player, 'aimbot/A', getScore(player, 'anticheat:aimbotAVl'));
          if(getScore('anticheat:aimbotAVl') > config.modules.aimbotA.VL) {
            punish(player, 'crasher/A', config.modules.crasherA.punishment)
          }
        }
      } else {
        player.lastRotationDeff = { x: 0, y: 0 };
      };
      player.lastRotation = { x: player.getRotation().x, y: player.getRotation().y }
    }
  });
  if(!config.modules.aimbotA.state) {
    system.clearRun(EVENT)
  }
};

export { aimbot_a }