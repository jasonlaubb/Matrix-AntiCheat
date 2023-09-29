import { Player, world } from '@minecraft/server';
import { uniqueId } from '../World.js';
import keyfile from '../../data/key.js';

export const KickablePlayer = new Map<string, boolean>();

export function tempkick () {
  world.beforeEvents.dataDrivenEntityTriggerEvent.subscribe(ev => {
    const player = ev.entity as Player;
    if(uniqueId(player) || (player.id == '-4294967295' && keyfile.environment.type == 0) || KickablePlayer.get(player.id) == undefined || !(KickablePlayer.get(player.id) === true)) {
      ev.cancel = true;
      console.warn(`cancelled a tempkick action on ${player.name}`);
      return
    };
    KickablePlayer.set(player.id, undefined)
  })
};

export function ActiveTempkick (player: Player) {
  KickablePlayer.set(player.id, true);
  player.triggerEvent('anticheat:tempkick')
}