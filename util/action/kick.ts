import { Player } from '@minecraft/server';
import { uniqueId } from '../World.js';
import keyfile from '../../data/key.js';

import { ActiveTempkick } from './tempkick.js';

export function Activekick (player: Player) {
  if(uniqueId(player) || (player.id == '-4294967295' && keyfile.environment.type == 0)) return;
  try {
    player.runCommand(`kick "${player.name}"`)
  } catch {
    ActiveTempkick(player)
  }
}