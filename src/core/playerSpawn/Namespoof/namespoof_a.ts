import { Player, world } from '@minecraft/server';
import { stop, uniqueId } from '../../../util/World.js';
import config from '../../../data/config.js';

const namespoof_a = () => {
  const EVENT = world.afterEvents.playerSpawn.subscribe(ev => {
    const player: Player = ev.player;
    if(uniqueId(player) || !ev.initialSpawn) return;
    if(player.name.length > 16 || player.name.length < 3) {
      player.runCommand(`kick "${player.name}"`);
      stop('NameSpoof/A','playername', player.name)
    }
  });
  if(!config.modules.namespoofA.state) {
    world.afterEvents.playerSpawn.unsubscribe(EVENT)
  }
};

export { namespoof_a }