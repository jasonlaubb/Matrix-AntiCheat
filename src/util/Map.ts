import { data } from '../nokararos.js';
import { Player, Vector2, Vector3, world } from '@minecraft/server';
import maps from '../data/maplist.js';

export const lastMessageSendTime = new Map<any, number>();    //spam_a.ts
export const lastmessagesent = new Map<any, string>();        //spam_b.ts
export const lastThrowTime = new Map<any, number>();          //fastThrow_a.ts
export const lastRotationDeff = new Map<any, Vector2>();      //aimbot_a.ts
export const lastfallingspeed = new Map<any, number>();       //nofall_a.ts
export const playerLastPositions = new Map<any, Vector3>();   //phase_a.ts
export const lastAttackVector2Angle = new Map<any, Vector2>();//killaura_f.ts
export const lastAttackDelayCombo = new Map<any, number>();  //lastAttackDelayCombo.ts

const clearMapdata = () => {
  world.afterEvents.playerSpawn.subscribe(ev => {
    if(!ev.initialSpawn) return;
    const player: Player = ev.player;
    let i = false;
    for(const map of maps) {
      if(!i) { i = true; continue };
      if(maps.join().includes(String(map))) {
        data.set(`${map},${player}`, undefined);
        continue
      };
      data.set(`${map},${player.id}`, 0)
    }
  });
  world.afterEvents.playerLeave.subscribe(ev => {
    const player: string = ev.playerId;
    for(const map of maps) {
      data.set(`${map},${player}`, undefined)
    }
  });
  try {
    for(const player of world.getAllPlayers()) {
      for(const map of maps) {
        if(data.get(`${map},${player}` == undefined)) continue;
        data.set(`${map},${player}`, undefined)
      }
    }
  } catch { }
};

export { clearMapdata }