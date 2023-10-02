import { world, system, Vector, Vector3, GameMode, Dimension } from "@minecraft/server";
import config from "../../../data/config.js";
import { uniqueId } from "../../../util/World.js";
import { flag } from "../../util/Flag.js";
import { State } from '../../../util/Toggle.js';

const flyData = new Map();

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

const fly_d = () => {
  const EVENT1 = system.runInterval(() => {
    const currentTime = Date.now();
    for (const player of world.getPlayers({ excludeGameModes: ['creative' as GameMode, 'spectator' as GameMode] })) {
      if(uniqueId(player)) continue;
      const { id, location, dimension } = player;
      const airData = flyData.get(id);
      const hasAnimate = player.isOnGround || player.isGliding || player.isInWater || player.isSwimming || player.isFalling;
  
      if (hasAnimate) {
        flyData.set(id, { time: currentTime, prevLoc: location, airTime: 0 });
        continue;
      }

      if (!player.isJumping && airData) {
        const { time, prevLoc, airTime } = airData;
        const deltaTime = currentTime - time;
        const newAirTime = airTime + deltaTime;

        if (newAirTime >= config.modules.flyD.maxAirTime && isPlayerOnAir(player.location, dimension)) {
          const velocity = player.getVelocity();
          const horizontalVelocity = new Vector(velocity.x, 0, velocity.z);

          if (horizontalVelocity.length() > 0.3) {
            player.teleport(prevLoc);
            flag(player, "Fly/D", config.modules.flyD, [`hVel=${horizontalVelocity.length}`]);
          }
        }

        flyData.set(id, { time: currentTime, prevLoc, airTime: newAirTime });
      }
    }
  }, 20);
  const EVENT2 = world.afterEvents.playerLeave.subscribe(ev => {
    flyData.delete(ev.playerId);
  });
  if(!State('FLYD', config.modules.flyD.state)) {
    system.clearRun(EVENT1);
    flyData.clear();
    world.afterEvents.playerLeave.unsubscribe(EVENT2)
  }
};

export { fly_d };
