import { world, system, EntityInventoryComponent, Container, Block, Player, BlockType } from '@minecraft/server';
import config from '../../../data/config.js';
import { flag, getScore, addScore, clearScore, uniqueId, punish } from '../../../util/World.js';

const aura_b = () => {
  const EVENT = world.afterEvents.blockPlace.subscribe(ev => {
    const player: Player = ev.player;
    if(uniqueId(player)) return;
    const block: Block = ev.block;
    if(block.typeId !== 'minecraft:tnt') return;
    system.runTimeout(() => {
      const container: Container = (player.getComponent("inventory") as EntityInventoryComponent).container;
      if(container.getItem(player.selectedSlot).typeId == 'minecraft:flint_and_steel') {
        block.setType({id: 'minecraft:air'} as BlockType);
        container.setItem(player.selectedSlot);
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
    world.afterEvents.blockPlace.unsubscribe(EVENT);
  }
};

export { aura_b }