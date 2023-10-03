import { world, Player } from '@minecraft/server';
import { flag } from '../../../util/Flag.js';
import config from '../../../data/default-config.js';

const movement_a = () => {
  const EVENT = world.afterEvents.entityHurt.subscribe(ev => {
    const player = ev.hurtEntity as Player;
    if (player.typeId !== 'minecraft:player' || ev.damageSource.cause !== 'fall' || ev.damage <= 0) return;
    let canntApply = false;
    if(player.isJumping) {
      for(let i = -1; i < 1; i++) {
        for(let i2 = -1; i2 < 1; i++) {
          if(!player.dimension.getBlock({ x: player.location.x + i, y: player.location.y - 1, z: player.location.z + i2 }).isAir ||
          !player.dimension.getBlock({ x: player.location.x + i, y: player.location.y - 2, z: player.location.z + i2 }).isAir
          ) {
            canntApply = true;
            break;
          }
        };
        if (canntApply) break
      }
    };
    if (!player.isOnGround && !canntApply) {
      flag(player, 'Movement/A', config.modules.movementA as ModuleClass, [`applyDamage=true`])
    }
  });
  if (!config.modules.movementA.state) {
    world.afterEvents.entityHurt.unsubscribe(EVENT)
  }
};

export { movement_a }
