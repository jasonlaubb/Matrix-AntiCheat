import { world, system } from '@minecraft/server';
import config from '../../../data/config.js';
import { flag, getScore, addScore, clearScore, uniqueId, punish } from '../../../unti/World.js';

const autotool_a = () => {
  const EVENT = world.afterEvents.entityHitBlock.subscribe(ev => {
    const player = ev.damagingEntity;
    if(uniqueId(player) || player.typeId !== "minecraft:player") return;
    const lastselectslot = player.selectSlot;
    system.runTimeOut(() => {
      if(player.selectSlot == lastselectslot) return;
      player.selectSlot = lastselectslot;
      addScore('anticheat:autotoolAVl', 1);
      flag(player, 'AutoTool/A', getScore(player, 'anticheat:autotoolAVl'));
      if(getScore(player, 'anticheat:autotoolAVl') > config.modules.autotoolA.VL) {
        clearScore(player, 'anticheat:autotoolAVl');
        punish(player, 'anticheat:autotoolAVl', config.modules.autotoolA.punishment)
      }
    })
  });
  if(!config.modules.autotoolA.state) {
    world.afterEvents.entityHitBlock.unsubscribe(EVENT);
  };
};

export { autotool_a }