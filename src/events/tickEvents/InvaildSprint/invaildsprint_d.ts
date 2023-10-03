import { world, system, Vector3 } from '@minecraft/server';
import { uniqueId } from '../../../util/World.js';
import config from '../../../data/config.js';
import { State } from '../../../util/Toggle.js';
import { flag } from '../../../util/Flag.js';

const lastLocation = new Map<string, Vector3>();

const invaildSprint_d = () => {
  const EVENT = system.runInterval(() => {
    for(const player of world.getPlayers()) {
      if(uniqueId(player)) continue;
      const pos1: Vector3 = player.location;
      const pos2: Vector3 = lastLocation.get(player.id) ?? player.location;
      let angle = Math.atan2((pos2.z - pos1.z), (pos2.x - pos1.x)) * 180 / Math.PI - player.getRotation().y - 90;
      if (angle <= -180) angle += 360;
      angle = Math.abs(angle);
      if(!player.hasTag('anticheat:damaged') && player.isOnGround && player.isSprinting && angle <= 120 && Math.sqrt((pos1.x - pos2.x) ** 2 + (pos1.z - pos2.z) ** 2) > 0) {
        system.runTimeout(() => {
          if(player.isSprinting) {
            player.teleport(player.location);
            flag(player, 'InvalidSprint/D', config.modules.invalidSprintD, [`Angle=${angle.toFixed(1)}`])
          }
        }, 1)
      };
      lastLocation.set(player.id, player.location)
    };
    if(!State('INVAILDSPRINTD', config.modules.invaildSprintD.state)) {
      system.clearRun(EVENT)
    }
  })
};

export { invaildSprint_d }