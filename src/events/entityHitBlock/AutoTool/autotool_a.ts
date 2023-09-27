import { world, system, Player } from '@minecraft/server';
import config from '../../../data/config.js';
import { flag, getScore, addScore, clearScore, uniqueId, punish } from '../../../util/World.js';
import { State } from '../../../util/Toggle.js';

const autotool_a = () => {
  const EVENT = world.afterEvents.entityHitBlock.subscribe(ev => {
    const player = ev.damagingEntity as Player;
    if(uniqueId(player) || player.typeId !== "minecraft:player") return;
    const lastselectslot = player.selectedSlot;
    system.runTimeout(() => {
      if(player.selectedSlot == lastselectslot) return;
      player.selectedSlot = lastselectslot;
      addScore(player, 'anticheat:autotoolAVl', 1);
      flag(player, 'AutoTool/A', getScore(player, 'anticheat:autotoolAVl'));
      if(getScore(player, 'anticheat:autotoolAVl') > config.modules.autotoolA.VL) {
        clearScore(player, 'anticheat:autotoolAVl');
        punish(player, 'anticheat:autotoolAVl', config.modules.autotoolA.punishment)
      }
    }, 1)
  });
  if(!State('AUTOTOOLA', config.modules.autotoolA.state)) {
    world.afterEvents.entityHitBlock.unsubscribe(EVENT);
  };
};

export { autotool_a }