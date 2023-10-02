import { Player, world, system } from '@minecraft/server';
import { uniqueId } from '../../../util/World.js';
import config from '../../../data/config.js';
import { State } from '../../../util/Toggle.js';
import { flag } from '../../../util/Flag.js';
import { ActiveTempkick } from '../../../util/action/tempkick.js';

const namespoof_a = () => {
  const EVENT = world.afterEvents.playerSpawn.subscribe(ev => {
    const player: Player = ev.player;
    if(uniqueId(player) || !ev.initialSpawn) return;
    if(player.name.length > 16 || player.name.length < 3) {
      flag(player, 'NameSpoof/A', config.modules.namespoofA, [`NameLength=${player.name.length}`]);
      system.run(() => {
        if (!(world.getPlayers(player)[0] === undefined)) {
          ActiveTempkick(player);
          //At least tempkick them
        }
      })
    }
  });
  if(!State('NAMESPOOFA', config.modules.namespoofA.state)) {
    world.afterEvents.playerSpawn.unsubscribe(EVENT)
  }
};

export { namespoof_a }