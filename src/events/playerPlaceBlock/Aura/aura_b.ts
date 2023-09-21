import { world, system, EntityInventoryComponent, Container, Block, Player } from '@minecraft/server';
import config from '../../../data/config.js';
import { flag, getScore, addScore, clearScore, uniqueId, punish } from '../../../util/World.js';

const aura_b = () => {
  const EVENT = world.beforeEvents.playerPlaceBlock.subscribe(ev => {
    const player: Player = ev.player;
    if(uniqueId(player)) return;
    const block: Block = ev.block;
    if(block.typeId !== 'minecraft:tnt') return;
    system.runTimeout(() => {
      const container: Container = (player.getComponent("inventory") as EntityInventoryComponent).container;
      if(container.getItem(player.selectedSlot).typeId == 'minecraft:flint_and_steel') {
        ev.cancel = true;
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
    world.beforeEvents.playerPlaceBlock.unsubscribe(EVENT);
  }
};

export { aura_b }