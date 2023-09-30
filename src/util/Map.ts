import { data } from '../nokararos.js';
import { Player, world } from '@minecraft/server';
import maps from '../data/maplist.js';

const clearMapdata = () => {
  for(const player of world.getAllPlayers()) {
    for(const map of maps) {
      data.set(`${map},${player.id}`)
    }
  };
  world.afterEvents.playerSpawn.subscribe(ev => {
    if(!ev.initialSpawn) return;
    const player: Player = ev.player;
    for(const map of maps) {
      data.set(`${map},${player.id}`, 0)
    }
  });
  world.afterEvents.playerLeave.subscribe(ev => {
    const player: string = ev.playerId;
    for(const map of maps) {
      data.delete(`${map},${player}`)
    }
  });
};

export { clearMapdata }
