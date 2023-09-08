import { world } from '@minecraft/server';
import config from '../../../data/config.js';
import { uniqueId } from '../../../unti/World.js';

const spam_b = () => {
  const EVENT = world.beforeEvents.chatSend.subscribe(ev => {
    const player = ev.sender;
    if(uniqueId(player)) return;
    const message = ev.message;
    const marks = ('@#$%^&*(){}[]:;"\'|<>,./\\`~ ').split();
    let newmessage = message;
    if(config.modules.spamB.deleteMark) {
      let newmessage = newmessage.toLowerCase();
      for(const mark of marks) {
        newmessage = newmessage.replaceAll(mark, '');
      };
    } else newmessage = message;
    if (player.lastmessagesent == newmessage) {
      ev.cancel = true;
      player.sendMessage(`§4§cN§go§ek§aa§qr§sa§tr§uo§ds§l§f |§r§7 Please don't spam message`)
    };
    player.lastmessagesent = newmessage
  });
  if(!config.modules.spamB.state){
    world.beforeEvents.chatSend.unsubscribe(EVENT)
  }
};

export { spam_b }