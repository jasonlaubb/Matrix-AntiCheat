import { world } from '@minecraft/server';
import config from '../../../data/config.js';
import { uniqueId } from '../../../util/World.js';
import { State } from '../../../util/Toggle.js';
import { flag } from '../../../util/Flag.js';

const spammer_c = () => {
  const EVENT = world.beforeEvents.chatSend.subscribe(ev => {
    const player = ev.sender;
    if(uniqueId(player)) return;
    if(player.hasTag('anticheat:swinging_head')) {
      ev.cancel = true;
      flag(player, 'Spammer/C', config.modules.spammerC, ['swingingHead=true'])
    }
  });
  if(!State('SPAMMERC', config.modules.spammerC.state)){
    world.beforeEvents.chatSend.unsubscribe(EVENT)
  }
};

export { spammer_c }