import { world, system } from '@minecraft/server';
import config from '../../../data/config.js';
import { flag, getScore, addScore, clearScore, uniqueId, punish } from '../../../unti/World.js';

const aura_b = () => {
  const EVENT = world.afterEvents.playerPlaceBlock.subscribe(ev => {
    const player = ev.player;
    if(uniqueId(player)) return;
    if(ev.block.typeId !== 'minecraft:tnt') return;
    system.runTimeOut(() => {
      const container = player.getComponent("inventory").container;
      if(container.getItem(player.selectSlot).typeId == 'minecraft:flint_and_steel') {
        container.setItem(player.selectSlot);
        addScore(player, 'anticheat:auraBVl' , 1);
        flag(player, 'aura/B', getScore(player, 'anticheat:auraBVl'));
        if(getScore(player, 'anticheat:auraBVl') > config.modules.auraB.VL) {
          clearScore(player, 'anticheat:auraBVl');
          punish(player, 'aura/B', config.modules.auraB.punishment)
        }
      }
    }, 1)
  });
  if(!config.modules.auraB.state) {
    world.afterEvents.playerPlaceBlock.unsubscribe(EVENT);
  }
};

export { aura_b }