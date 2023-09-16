import { Player, world } from '@minecraft/server';
import config from '../../../data/config.js';
import { uniqueId } from '../../../util/World.js';

const spam_c = () => {
  const EVENT = world.beforeEvents.chatSend.subscribe(ev => {
    const player: Player = ev.sender;
    if(uniqueId(player)) return;
    const message: String = ev.message;
    if (message.length > config.modules.spamC.maxLength) {
      ev.cancel = true;
      player.sendMessage(`§4§cN§go§ek§aa§qr§sa§tr§uo§ds§l§f |§r§7 Your message are longer than ${config.modules.spamC.maxLength} character!`)
    };
  });
  if(!config.modules.spamC.state){
    world.beforeEvents.chatSend.unsubscribe(EVENT)
  }
};

export { spam_c }