import { Player, world } from '@minecraft/server';
import config from '../../../data/config.js';
import { uniqueId } from '../../../util/World.js';
import { State } from '../../../util/Toggle.js';

const lastMessageSendTime = new Map<string, number>();
const spam_a = () => {
  const EVENT1 = world.beforeEvents.chatSend.subscribe(ev => {
    const player: Player = ev.sender;
    if(uniqueId(player)) return;
    if(lastMessageSendTime.get(player.id) == undefined) lastMessageSendTime.set(player.id, Date.now() - config.modules.spamA.minSendDelay);
    const timeleft: number = Date.now() - lastMessageSendTime.get(player.id) < config.modules.spamA.minSendDelay ? config.modules.spamA.minSendDelay - (Date.now() - lastMessageSendTime.get(player.id)) : 0;
    if (timeleft >= 0) {
      ev.cancel = true;
      player.sendMessage(`§dNokararos §f> §7Please wait §e${(timeleft / 1000).toFixed(1)}§7 seconds to send message`)
    }
  });
  const EVENT2 = world.afterEvents.playerLeave.subscribe(ev => {
    lastMessageSendTime.delete(ev.playerId)
  });
  if(!State('SPAMA',config.modules.spamA.state)){
    world.beforeEvents.chatSend.unsubscribe(EVENT1);
    world.afterEvents.playerLeave.unsubscribe(EVENT2)
  }
};

export { spam_a }