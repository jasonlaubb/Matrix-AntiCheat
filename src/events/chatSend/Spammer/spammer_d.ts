import { Player, world } from '@minecraft/server';
import config from '../../../data/config.js';
import { uniqueId } from '../../../util/World.js';
import { State } from '../../../util/Toggle.js';
import { flag } from '../../../util/Flag.js';

const spammer_d = () => {
  const EVENT = world.beforeEvents.chatSend.subscribe(ev => {
    const player: Player = ev.sender;
    if(uniqueId(player)) return;
    if(player.hasTag('anticheat:usingItem')) {
      ev.cancel = true;
      flag(player, 'Spammer/D', config.modules.spammerD, ['usingItem=true'])
    }
  });
  if(!State('SPAMMERD', config.modules.spammerD.state)){
    world.beforeEvents.chatSend.unsubscribe(EVENT)
  }
};

export { spammer_d }