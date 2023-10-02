import { world, system } from '@minecraft/server';
import { uniqueId, getGamemode } from '../../../util/World.js';
import config from '../../../data/config.js';
import { State } from '../../../util/Toggle.js';
import { flag } from '../../../util/Flag.js';

const fly_a = () => {
  const EVENT = system.runInterval(() => {
    for(const player of world.getPlayers()) {
      if(uniqueId(player) || getGamemode(player) == 1 || getGamemode(player) == 3 || player.hasTag('anticheat:may_fly')) continue
      if(player.isFlying) {
        player.teleport(player.location);
        player.kill();
        flag(player, 'Fly/A', config.modules.flyA, [`isFlying=true`])
      }
    };
  });
  if(!State('FLYA', config.modules.flyA.state)) {
    system.clearRun(EVENT)
  }
};

export { fly_a }