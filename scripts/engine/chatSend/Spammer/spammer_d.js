import { world } from '@minecraft/server';
import config from '../../../data/config.js';
import { uniqueId, addScore, clearScore, getScore, flag, punish } from '../../../unti/World.js';

const spammer_d = () => {
  const EVENT = world.beforeEvents.chatSend.subscribe(ev => {
    const player = ev.sender;
    if(uniqueId(player)) return;
    if(player.hasTag('anticheat:usingItem')) {
      ev.cancel = true;
      addScore(player, 'anticheat:spammerDVl', 1);
      flag(player, 'spammer/D', getScore(player, 'anticheat:spammerDVl'));
      if(getScore(player, 'anticheat:spammerDVl') > config.modules.spammerD.VL) {
        clearScore(player, 'anticheat:spammerDVl');
        punish(player, 'spammer/D', getScore(player, 'anticheat:spammerDVl'))
      }
    }
  });
  if(!config.modules.spammerD.state){
    world.beforeEvents.chatSend.unsubscribe(EVENT)
  }
};

export { spammer_d }