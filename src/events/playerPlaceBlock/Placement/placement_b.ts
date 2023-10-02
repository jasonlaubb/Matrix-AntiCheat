import { Block, BlockSignComponent, Player, world } from '@minecraft/server';
import config from '../../../data/config.js';
import { uniqueId } from '../../../util/World.js';
import { State } from '../../../util/Toggle.js';
import { flag } from '../../../util/Flag.js';

const placement_b = () => {
  const EVENT = world.beforeEvents.playerPlaceBlock.subscribe(ev => {
    const player: Player = ev.player;
    if(uniqueId(player)) return;
    const block: Block = ev.block;
    if(!block.typeId.endsWith('sign')) return;
    const signstate: boolean = (block.getComponent("minecraft:sign") as BlockSignComponent).getText == undefined ? true : false
    if(signstate) {
      ev.cancel = true;
      flag(player, 'Placement/B', config.modules.placementB, [`signState=true`])
    }
  });
  if(!State('PLACEMENTB', config.modules.placementB.state)) {
    world.beforeEvents.playerPlaceBlock.unsubscribe(EVENT);
  };
};

export { placement_b }