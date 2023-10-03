import { world, system, Vector3, Dimension } from '@minecraft/server';
import { uniqueId } from '../../../util/World.js';
import config from '../../../data/config.js';
import { State } from '../../../util/Toggle.js';
import { flag } from '../../../util/Flag.js';

function isPlayerOnAir( location: Vector3, dimension: Dimension) {
  const { x, y, z } = location;
  return [-1, 0, 1].every(i =>
    [-1, 0, 1].every(j =>
      [-1, 0, 1].every(k => {
        const block = dimension.getBlock({ x: x + i, y: y + j, z: z + k });
        return block.typeId === 'minecraft:air';
      })
    )
  );
};

const oldYPos = new Map<string, number>();
const oldOldYPos = new Map<string, number>();

const fly_c = () => {
  const EVENT = system.runInterval(() => {
    for(const player of world.getPlayers()) {
      if (uniqueId(player)) continue;

			if(isPlayerOnAir(player.location, player.dimension) === true && !player.getEffect("jump_boost")) {
				const currentYPos = player.location.y;
				const oldY = oldYPos.get(player.id) || currentYPos;
        const playerVelocity = player.getVelocity();

				let max_v_up = 0.42;
				if(player.isJumping) {
					max_v_up = 0.6;
				}
				if(!player.hasTag("nofly") && !player.hasTag("nofly") && (!player.hasTag("damaged") && !player.hasTag("fall_damage")) && !player.isGliding) {						
					const prediction = (playerVelocity.y > max_v_up && playerVelocity.y !== 1 || playerVelocity.y < -3.92) && playerVelocity.y !== -1 && playerVelocity.y > -9
					if(player.getEffect("speed") && player.getEffect("speed").amplifier > 5)  continue;
					if(prediction /*&& getScore(player, "tick_counter2", 0) > 3*/ && player.fallDistance < 25) {
						flag(player, 'Fly/C', config.modules.flyC, [`Yspeed=${playerVelocity.y}`])
					}
				}
				oldOldYPos.set(player.id, oldY);
				oldYPos.set(player.id, currentYPos);
		  }
    }
  });
  if(!State('FLYC', config.modules.flyC.state)) {
    system.clearRun(EVENT)
  }
};

export { fly_c }