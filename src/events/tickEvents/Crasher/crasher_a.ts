import { uniqueId } from '../../../util/World.js';
import config from '../../../data/config.js';
import { world, system, Vector3 } from '@minecraft/server';
import { State } from '../../../util/Toggle.js';
import { flag } from '../../../util/Flag.js';

const crasher_a = () => {
  const EVENT = system.runInterval(() => {
    for(const player of world.getPlayers()){
      if (isLocationValid(player.location)) {
        player.teleport({ x: 0, y: 0, z: 0});
        if (!uniqueId(player)) flag(player, 'Crasher/A', config.modules.crasherA, undefined)
      }
    }
  });
  if(!State('CRASHERA', config.modules.crasherB.state)) {
    system.clearRun(EVENT)
  }
};

function isLocationValid (location: Vector3) {
  if (
    Number.isNaN(location.x) ||
    Number.isNaN(location.y) ||
    Number.isNaN(location.z) ||
    location.x > 30000000 ||
    location.y > 30000000 ||
    location.z > 30000000 ||
    location.x < -30000000 ||
    location.y < -30000000 ||
    location.z < -30000000 ||
    location.x === undefined ||
    location.y === undefined ||
    location.z === undefined
  ) {
    return true;
  } else {
    return false
  }
}

export { crasher_a }