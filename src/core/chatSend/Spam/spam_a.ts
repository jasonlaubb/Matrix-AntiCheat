import { Player, world } from '@minecraft/server';
import config from '../../../data/config.js';
import { uniqueId } from '../../../util/World.js';
import { lastMessageSendTime } from '../../../util/Map.js';

const spam_a = () => {
  const EVENT = world.beforeEvents.chatSend.subscribe(ev => {
    const player: Player = ev.sender;
    if(uniqueId(player)) return;
    if(lastMessageSendTime.get(player.id) == undefined) lastMessageSendTime.set(player.id, Date.now() - config.modules.spamA.minSendDelay);
    const timeleft: number = Date.now() - lastMessageSendTime.get(player.id) < config.modules.spamA.minSendDelay ? config.modules.spamA.minSendDelay - (Date.now() - lastMessageSendTime.get(player.id)) : 0;
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