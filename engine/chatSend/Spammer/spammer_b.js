import { world } from '@minecraft/server';
import config from '../../../data/config.js';
import { uniqueId, addScore, clearScore, getScore, flag, punish } from '../../../unti/World.js';

const spammer_b = () => {
  const EVENT = world.beforeEvents.chatSend.subscribe(ev => {
    const player = ev.sender;
    if(uniqueId(player)) return;
    if(player.hasTag('anticheat:hasGuiOpen')) {
      ev.cancel = true;
      addScore(player, 'anticheat:spammerBVl', 1);
      flag(player, 'spammer/B', getScore(player, 'anticheat:spammerBVl'));
      if(getScore(player, 'anticheat:spammerBVl') > config.modules.spammerB.VL) {
        clearScore(player, 'anticheat:spammerBVl');
        punish(player, 'spammer/B', getScore(player, 'anticheat:spammerBVl'))
      }
    }
  });
  if(!config.modules.spammerB.state){
    world.beforeEvents.chatSend.unsubscribe(EVENT)
  }
};

export { spammer_b }