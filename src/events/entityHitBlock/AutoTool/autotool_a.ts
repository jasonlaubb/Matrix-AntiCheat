import { world, system, Player } from '@minecraft/server';
import config from '../../../data/config.js';
import { uniqueId } from '../../../util/World.js';
import { State } from '../../../util/Toggle.js';
import { flag } from '../../../util/Flag.js';

const autotool_a = () => {
  const EVENT = world.afterEvents.entityHitBlock.subscribe(ev => {
    const player = ev.damagingEntity as Player;
    if(uniqueId(player) || player.typeId !== "minecraft:player") return;
    const lastselectslot = player.selectedSlot;
    system.runTimeout(() => {
      if(player.selectedSlot == lastselectslot) return;
      player.selectedSlot = lastselectslot;
      flag(player, 'AutoTool/A', config.modules.autotoolA, [`SelectSlotDiff=${Math.abs(lastselectslot - player.selectedSlot)}`])
    }, 1)
  });
  if(!State('AUTOTOOLA', config.modules.autotoolA.state)) {
    world.afterEvents.entityHitBlock.unsubscribe(EVENT);
  };
};

export { autotool_a }