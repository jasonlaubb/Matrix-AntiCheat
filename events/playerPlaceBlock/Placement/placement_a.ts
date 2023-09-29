import { Block, BlockInventoryComponent, Container, Player, world } from '@minecraft/server';
import config from '../../../data/config.js';
import { flag, uniqueId, punish } from '../../../util/World.js';
import { State } from '../../../util/Toggle.js';

const placement_a = () => {
  const EVENT = world.beforeEvents.playerPlaceBlock.subscribe(ev => {
    const player: Player = ev.player;
    if(uniqueId(player)) return;
    const block: Block = ev.block;
    if(!config.modules.placementA.containerblock.includes(block.typeId)) return;
    const inv: Container = (block.getComponent("inventory") as BlockInventoryComponent).container;
    let getItem: boolean = false;
    for(let i = 0; i < inv.size; i++) {
      if(inv.getItem(i)) {
        getItem = true;
        break
      }
    };
    if(getItem) {
      ev.cancel = true;
      flag(player, 'Placement/A', 0);
      punish(player, 'Placement/A', config.modules.placementA.punishment)
    }
  });
  if(!State('PLACEMENTA', config.modules.placementA.state)) {
    world.beforeEvents.playerPlaceBlock.unsubscribe(EVENT);
  };
};

export { placement_a }