import { world } from '@minecraft/server';
import config from '../../../data/config.js';
import { uniqueId, addScore, clearScore, getScore, flag, punish } from '../../../util/World.js';

const spammer_c = () => {
  const EVENT = world.beforeEvents.chatSend.subscribe(ev => {
    const player = ev.sender;
    if(uniqueId(player)) return;
    if(player.hasTag('anticheat:swinging_head')) {
      ev.cancel = true;
      addScore(player, 'anticheat:spammerCVl', 1);
      flag(player, 'spammer/C', getScore(player, 'anticheat:spammerCVl'));
      if(getScore(player, 'anticheat:spammerCVl') > config.modules.spammerC.VL) {
        clearScore(player, 'anticheat:spammerCVl');
        punish(player, 'spammer/C', config.modules.spammerC.punishment)
      }
    }
  });
  if(!config.modules.spammerC.state){
    world.beforeEvents.chatSend.unsubscribe(EVENT)
  }
};

export { spammer_c }