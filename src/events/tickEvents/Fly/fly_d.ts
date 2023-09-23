/*
import { world, system, Vector } from "@minecraft/server";
import config from "../assets/config.js";

const flyData = new Map();

system.runInterval(() => {
      const currentTime = Date.now();
      for (const player of world.getPlayers({ excludeTag: 'admin', excludeGameModes: ['creative', 'spectator'] })) {
        const { id, location, dimension } = player;
        const airData = flyData.get(id);
        const hasAnimate = player.isOnGround || player.isGliding || player.isInWater || player.isSwimming || player.isFalling;

        if (hasAnimate) {
          flyData.set(id, { time: currentTime, prevLoc: location, airTime: 0 });
          console.warn(hasAnimate);
          continue;
        }

        if (!player.isJumping && airData) {
          const { time, prevLoc, airTime } = airData;
          const deltaTime = currentTime - time;
          const newAirTime = airTime + deltaTime;

          if (newAirTime >= config.antiFly.maxAirTime && isPlayerOnAir(player, dimension)) {
            const velocity = player.getVelocity();
            const horizontalVelocity = new Vector(velocity.x, 0, velocity.z);

            if (horizontalVelocity.length() > 0.3) {
              player.teleport(prevLoc);
              world.sendMessage(`§u§l§¶OAC >§4 ${player.name}§c has been detected flying\n§r§l§¶Air time: ${newAirTime / 1000}s`);
              player.applyDamage(6);
            }
          }

          flyData.set(id, { time: currentTime, prevLoc, airTime: newAirTime });
        }
      }
    }, 20),
world.afterEvents.playerLeave.subscribe(id => {
        flyData.delete(id);
      })
  },

    world.afterEvents.playerLeave.unsubscribe(this.two);
    system.clearRun(this.one);
    flyData.clear();
  }
}

function isPlayerOnAir({ location: { x, y, z }, dimension }) {
  return [-1, 0, 1].every(i =>
    [-1, 0, 1].every(j =>
      [-1, 0, 1].every(k => {
        const block = dimension.getBlock({ x: x + i, y: y + j, z: z + k });
        return block.typeId === 'minecraft:air';
      })
    )
  );
*/