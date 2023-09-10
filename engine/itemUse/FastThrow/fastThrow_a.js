import { world } from '@minecraft/server';
import { addScore, getScore, punish, uniqueId } from '../../../unti/World.js';
import config from '../../../data/config.js';

const fastThrow_a = () => {
  const EVENT = world.afterEvents.itemUse.subscribe(ev => {
    const player = ev.source;
    if(uniqueId(player)) return;
    if(player.lastThrowTime == undefined) player.lastThrowTime = Date.now() - config.modules.fastThrowA.minThrowTime;
    if(Date.now() - player.lastThrowTime < config.modules.fastThrowA.minThrowTime) {
      const container = player.getComponent("inventory").container;
      container.setItem(player.selectSlot);
      addScore(player, 'anticheat:fastThrowAVl', 1);
      flag(player, 'fastThrow/A', getScore(player, 'anticheat:fastThrowAVl'));
      if(getScore(player, 'fastThrow') > config.modules.fastThrowA.VL) {
        punish(player, 'fastThrow/A', config.modules.fastThrowA.punishment)
      }
    } else player.lastThrowTime = Date.now()
  });
  if(!config.modules.fastThrowA.state) {
    world.afterEvents.itemUse.unsubscribe(EVENT)
  }
}