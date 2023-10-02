import { world, system } from '@minecraft/server';
import { uniqueId, isAllBlockAir } from '../../../util/World.js';
import config from '../../../data/config.js';
import { State } from '../../../util/Toggle.js';
import { flag } from '../../../util/Flag.js';

/*
  Fly/C from Islote AntiCheat Fly/A
  it is not finished to let the code go in to nokararos enviroment
*/

const fly_c = () => {
  const EVENT = system.runInterval(() => {
    for(const player of world.getPlayers()) {
      if(aroundAir(player) === true && !player.getEffect("jump_boost")) {
        const currentYPos = player.location.y;
        const oldY = oldYPos.get(player) || currentYPos;
        let max_v_up = 0.42;
        if(player.isJumping) {
          max_v_up = 0.6;
        }
        if(!player.hasTag("nofly") && !player.hasTag("nofly") && (!player.hasTag("damaged") && !player.hasTag("fall_damage")) && !player.isGliding) {
          //const simYPos = Math.abs(currentYPos - oldY) <= config.modules.flyF.diff && Math.abs(currentYPos - oldOldY) <= config.modules.flyF.diff;
          
          const prediction = (playerVelocity.y > max_v_up && aroundAir(player) === true && playerVelocity.y !== 1 || playerVelocity.y < -3.92 && aroundAir(player) === true) && playerVelocity.y !== -1 && playerVelocity.y > -9
          if(player.getEffect("speed") && player.getEffect("speed").amplifier > 5)  continue;
          if(prediction && getScore(player, "tick_counter2", 0) > 3 && player.fallDistance < 25) {
            flag(player, "Fly", "A", "Movement", "y-velocity", playerVelocity.y, false);
          }
        }
        oldOldYPos.set(player, oldY);
        oldYPos.set(player, currentYPos);
      }
    };
    if(!State('FLYC', config.modules.flyC.state)) {
      system.clearRun(EVENT)
    }
  })
};

export { fly_c }