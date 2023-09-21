import { flag, punish, uniqueId } from '../../../util/World.js';
import config from '../../../data/config.js';
import { world, system } from '@minecraft/server';

const crasher_a = () => {
  const EVENT = system.runInterval(() => {
    for(const player of world.getPlayers()){
      let vaild: boolean = false;
      if(player.location.x < 30000000 && player.location.x > -30000000 && player.location.y < 30000000 && player.location.y > -30000000 && player.location.z < 30000000 && player.location.z > -30000000) {
        vaild = true;
      };
      if(!vaild) {
        player.teleport({ x: 0, y: 0, z: 0 });
        flag(player, 'crasher/A', 0);
        if(!uniqueId(player)) punish(player, 'crasher/A', config.modules.crasherA.punishment)
      }
    }
  });
  if(!config.modules.crasherB.state) {
    system.clearRun(EVENT)
  }
};

export { crasher_a }