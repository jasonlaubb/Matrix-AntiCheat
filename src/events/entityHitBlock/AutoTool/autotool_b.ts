import { world, system, Player } from '@minecraft/server';
import config from '../../../data/config.js';
import { flag, getScore, addScore, clearScore, uniqueId, punish } from '../../../util/World.js';
import { State } from '../../../util/Toggle.js';

const Buff = new Map<string, number>();

const autotool_b = () => {
  const EVENT1 = world.afterEvents.playerBreakBlock.subscribe(ev => {
    const player: Player = ev.player;
    if(uniqueId(player) || player.typeId !== "minecraft:player") return;
    const lastselectslot = player.selectedSlot;
    system.runTimeout(() => {
      if(player.selectedSlot == lastselectslot){
        Buff.set(player.id, 0)
        return;
      };
      player.selectedSlot = lastselectslot;
      if ((Buff.get(player.id) || 0) < config.module.autotooB.minBuffer) {
        Buff.set(player.id, (Buff.get(player.id) || 0) + 1);
        return
      };
      Buff.delete(player.id)
      addScore(player, 'anticheat:autotoolBVl', 1);
      flag(player, 'AutoTool/B', getScore(player, 'anticheat:autotoolBVl'));
      if(getScore(player, 'anticheat:autotoolBVl') > config.modules.autotoolB.VL) {
        clearScore(player, 'anticheat:autotoolBVl');
        punish(player, 'anticheat:autotoolBVl', config.modules.autotoolB.punishment)
      }
    }, 1)
  });
  const EVENT2 = world.afterEvents.playerLeave.subscribe(ev => {
    Buff.delete(ev.playerId)
  });
  if(!State('AUTOTOOLB', config.modules.autotoolB.state)) {
    world.afterEvents.playerBreakBlock.unsubscribe(EVENT1);
    world.afterEvents.playerLeave.unsubscribe(EVENT2);
    Buff.clear()
  };
};

export { autotool_b }