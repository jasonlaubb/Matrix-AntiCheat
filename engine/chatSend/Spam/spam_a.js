import { world } from '@minecraft/server';
import config from '../../../data/config.js';
import { uniqueId } from '../../../unti/World.js';

const spam_a = () => {
  const EVENT = world.beforeEvents.chatSend.subscribe(ev => {
    const player = ev.sender;
    if(uniqueId(player)) return;
    if(player.lastMessageSendTime == undefined) player.lastMessageSendTime = Date.now() - config.modules.spamA.minSendDelay;
    const timeleft = Date.now() - player.lastMessageSendTime < config.modules.spamA.minSendDelay ? config.modules.spamA.minSendDelay - (Date.now() - player.lastMessageSendTime) : 0;
    if (timeleft >= 0) {
      ev.cancel = true;
      player.sendMessage(`§4§cN§go§ek§aa§qr§sa§tr§uo§ds §l§f |§r§7Please wait ${(timeleft / 1000).toFixed(1)} seconds to send message`)
    }
  });
  if(!config.modules.spamA.state){
    world.beforeEvents.chatSend.unsubscribe(EVENT)
  }
};

export { spam_a }