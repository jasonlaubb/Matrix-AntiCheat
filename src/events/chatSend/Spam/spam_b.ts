import { Player, world } from '@minecraft/server';
import config from '../../../data/config.js';
import { uniqueId } from '../../../util/World.js';
import { State } from '../../../util/Toggle.js';

const lastmessagesent = new Map<string, string>();

const spam_b = () => {
  const EVENT1 = world.beforeEvents.chatSend.subscribe(ev => {
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
  const EVENT2 = world.afterEvents.playerLeave.subscribe(ev => {
    lastmessagesent.delete(ev.playerId)
  })
  if(!State('SPAMB', config.modules.spamB.state)){
    world.beforeEvents.chatSend.unsubscribe(EVENT1);
    world.afterEvents.playerLeave.unsubscribe(EVENT2);
    lastmessagesent.clear();
  }
};

export { spam_b }