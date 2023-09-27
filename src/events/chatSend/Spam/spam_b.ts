import { Player, world } from '@minecraft/server';
import config from '../../../data/config.js';
import { uniqueId } from '../../../util/World.js';
import { lastmessagesent } from '../../../util/Map.js';
import { State } from '../../../util/Toggle.js';

const spam_b = () => {
  const EVENT = world.beforeEvents.chatSend.subscribe(ev => {
    const player: Player = ev.sender;
    if(uniqueId(player)) return;
    const message: string = ev.message;
    const marks = ('@#$%^&*(){}[]:;"\'|<>,./\\`~ ').split('');
    let newmessage: string = message;
    if(config.modules.spamB.deleteMark) {
      newmessage = newmessage.toLowerCase();
      for(const mark of marks) {
        newmessage = newmessage.replaceAll(mark, '');
      };
    } else newmessage = message;
    if (lastmessagesent.get(player.id) == newmessage) {
      ev.cancel = true;
      player.sendMessage(`§dNokararos §f>§7 Please don't spam message`)
    };
  lastmessagesent.set(player.id, newmessage)
  });
  if(!State('SPAMB', config.modules.spamB.state)){
    world.beforeEvents.chatSend.unsubscribe(EVENT)
  }
};

export { spam_b }