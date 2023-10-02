import { Player, world, system } from '@minecraft/server';
import { uniqueId } from '../../../util/World.js';
import config from '../../../data/config.js';
import { State } from '../../../util/Toggle.js';
import { flag } from '../../../util/Flag.js';
import { ActiveTempkick } from '../../../util/action/tempkick.js';

const namespoof_b = () => {
  const EVENT = world.afterEvents.playerSpawn.subscribe(ev => {
    const player: Player = ev.player;
    if(uniqueId(player) || !ev.initialSpawn) return;
    if(config.modules.namespoofB.strings.test(player.name)) {
      player.nameTag = player.name.replace(config.modules.namespoofB.strings, "");
      flag(player, 'NameSpoof/B', config.modules.namespoofB, undefined);
      system.run(() => {
        if (!(world.getPlayers(player)[0] === undefined)) {
          ActiveTempkick(player);
          //At least tempkick them
        }
      })
    }
  });
  if(!State('NAMESPOOFB', config.modules.namespoofB.state)) {
    world.afterEvents.playerSpawn.unsubscribe(EVENT)
  }
};

export { namespoof_b }