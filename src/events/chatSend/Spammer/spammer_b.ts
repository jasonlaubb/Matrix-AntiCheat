import { Player, world } from '@minecraft/server';
import config from '../../../data/config.js';
import { uniqueId } from '../../../util/World.js';
import { State } from '../../../util/Toggle.js';
import { flag } from '../../../util/Flag.js';

const spammer_b = () => {
  const EVENT = world.beforeEvents.chatSend.subscribe(ev => {
    const player: Player = ev.sender;
    if(uniqueId(player)) return;
    if(player.hasTag('anticheat:hasGuiOpen')) {
      ev.cancel = true;
      flag(player, 'Spammer/B', config.modules.spammerB, ['hasGuiOpen=true'])
    }
  });
  if(!State('SPAMMERB', config.modules.spammerB.state)){
    world.beforeEvents.chatSend.unsubscribe(EVENT)
  }
};

export { spammer_b }