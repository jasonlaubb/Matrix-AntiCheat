import { world, system } from '@minecraft/server';
import config from '../../../data/config.js';
import { flag, getScore, addScore, clearScore, uniqueId, punish } from '../../../unti/World.js';

const aura_a = () => {
  const EVENT = world.afterEvents.playerPlaceBlock.subscribe(ev => {
    const player = ev.player;
    if(uniqueId(player)) return;
    if(ev.block.typeId !== 'minecraft:obsidian') return;
    system.runTimeOut(() => {
      const container = player.getComponent("inventory").container;
      if(container.getItem(player.selectSlot).typeId == 'minecraft:ender_crystal') {
        container.setItem(player.selectSlot);
        addScore(player, 'anticheat:auraAVl');
        flag(player, 'aura/A', getScore(player, 'anticheat:auraAVl'));
        if(getScore(player, 'anticheat:auraAVl') > config.modules.auraA.VL) {
          clearScore(player, 'anticheat:auraAVl');
          punish(player, 'aura/A', config.modules.auraA.punishment)
        }
      }
    }, 1)
  });
  if(!config.modules.auraA.state) {
    world.afterEvents.playerPlaceBlock.unsubscribe(EVENT);
  }
};

export { aura_a }