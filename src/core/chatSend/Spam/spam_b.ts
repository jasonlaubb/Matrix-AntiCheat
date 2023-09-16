import { Player, world } from '@minecraft/server';
import config from '../../../data/config.js';
import { uniqueId } from '../../../util/World.js';

const spam_b = () => {
  const EVENT = world.beforeEvents.chatSend.subscribe(ev => {
    const player: Player = ev.sender;
    if(uniqueId(player)) return;
    const message: String = ev.message;
//@ts-ignore
    const marks = ('@#$%^&*(){}[]:;"\'|<>,./\\`~ ').split();
    let newmessage: String = message;
    if(config.modules.spamB.deleteMark) {
      newmessage = newmessage.toLowerCase();
      for(const mark of marks) {
        newmessage = newmessage.replaceAll(mark, '');
      };
    } else newmessage = message;
//@ts-ignore
    if (player.lastmessagesent == newmessage) {
      ev.cancel = true;
      player.sendMessage(`§4§cN§go§ek§aa§qr§sa§tr§uo§ds§l§f |§r§7 Please don't spam message`)
    };
//@ts-ignore
    player.lastmessagesent = newmessage
  });
  if(!config.modules.spamB.state){
    world.beforeEvents.chatSend.unsubscribe(EVENT)
  }
};

export { spam_b }