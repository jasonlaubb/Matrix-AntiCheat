import { data } from '../nokararos.js';
import { Player, world } from '@minecraft/server';
import maps from '../data/maplist.js';

const clearMapdata = () => {
  world.afterEvents.playerSpawn.subscribe(ev => {
    if(!ev.initialSpawn) return;
    const player: Player = ev.player;
    for(const map of maps) {
      if(maps.join().includes(String(map))) {
        data.delete(`${map},${player}`);
      };
      data.set(`${map},${player.id}`, 0)
    }
  });
  world.afterEvents.playerLeave.subscribe(ev => {
    const player: string = ev.playerId;
    for(const map of maps) {
      data.delete(`${map},${player}`)
    }
  });
  try {
    for(const player of world.getAllPlayers()) {
      for(const map of maps) {
        if(data.get(`${map},${player}` == undefined)) continue;
        data.delete(`${map},${player}`)
      }
    }
  } catch { }
};

export { clearMapdata }
