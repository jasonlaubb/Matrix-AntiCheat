import { world } from '@minecraft/server';
import config from '../../../data/config.js';
import { uniqueId, addScore, clearScore, getScore, flag, punish } from '../../../unti/World.js';

const spammer_a = () => {
  const EVENT = world.beforeEvents.chatSend.subscribe(ev => {
    const player = ev.sender;
    if(uniqueId(player)) return;
    if(player.hasTag('anticheat:moving')) {
      ev.cancel = true;
      addScore(player, 'anticheat:spammerAVl', 1);
      flag(player, 'spammer/A', getScore(player, 'anticheat:spammerAVl'));
      if(getScore(player, 'anticheat:spammerAVl') > config.modules.spammerA.VL) {
        clearScore(player, 'anticheat:spammerAVl');
        punish(player, 'spammer/A', getScore(player, 'anticheat:spammerAVl'))
      }
    }
  });
  if(!config.modules.spammerB.state){
    world.beforeEvents.chatSend.unsubscribe(EVENT)
  }
};

export { spammer_a }