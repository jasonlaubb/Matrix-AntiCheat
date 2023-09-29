import { world, system, EntityInventoryComponent, Container, Block, Player } from '@minecraft/server';
import config from '../../../data/config.js';
import { flag, getScore, addScore, clearScore, uniqueId, punish } from '../../../util/World.js';
import { State } from '../../../util/Toggle.js';

const aura_a = () => {
  const EVENT = world.beforeEvents.playerPlaceBlock.subscribe(ev => {
    const player: Player = ev.player;
    if(uniqueId(player)) return;
    const block: Block = ev.block;
    if(block.typeId !== 'minecraft:obsidian') return;
    system.runTimeout(() => {
      const container: Container = (player.getComponent("inventory") as EntityInventoryComponent).container
      if(container.getItem(player.selectedSlot).typeId == 'minecraft:ender_crystal') {
        ev.cancel = true;
        container.setItem(player.selectedSlot);
        addScore(player, 'anticheat:auraAVl', 1);
        flag(player, 'aura/A', getScore(player, 'anticheat:auraAVl'));
        if(getScore(player, 'anticheat:auraAVl') > config.modules.auraA.VL) {
          clearScore(player, 'anticheat:auraAVl');
          punish(player, 'aura/A', config.modules.auraA.punishment)
        }
      }
    }, 1)
  });
  if(!State('AURAA', config.modules.auraA.state)) {
    world.beforeEvents.playerPlaceBlock.unsubscribe(EVENT);
  }
};

export { aura_a }