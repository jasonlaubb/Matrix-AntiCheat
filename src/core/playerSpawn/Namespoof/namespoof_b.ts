import { Player, world } from '@minecraft/server';
import { stop, uniqueId } from '../../../util/World.js';
import config from '../../../data/config.js';

const namespoof_b = () => {
  const EVENT = world.afterEvents.playerSpawn.subscribe(ev => {
    const player: Player = ev.player;
    if(uniqueId(player) || !ev.initialSpawn) return;
    if(config.modules.namespoofB.strings.test(player.name)) {
      player.nameTag = player.name.replace(config.modules.namespoofB.strings, "");
      stop('NameSpoof/A','playername', player.name);
      try {
        player.runCommand(`kick "${player.name}"`);
      } catch (e) {
        player.triggerEvent("anticheat:kick");
      }
    }
  });
  if(!config.modules.namespoofA.state) {
    world.afterEvents.playerSpawn.unsubscribe(EVENT)
  }
};

export { namespoof_b }