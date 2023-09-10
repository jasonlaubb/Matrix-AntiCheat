import { world, system } from '@minecraft/server';
import config from '../../../data/config.js';
import { flag, getScore, addScore, clearScore, uniqueId } from '../../../unti/World.js';

const ac_a = () => {
  const EVENT = world.afterEvents.entityHitEntity.subscribe(ev => {
    const player = ev.damagingEntity;
    if(uniqueId(player) || player.typeId !== "minecraft:player") return;
    addScore(player, 'anticheat:cps');
    if(getScore(player, 'anticheat:cps') > config.modules.autoclickerA.cpsLimit) {
      const vl = getScore(player, 'anticheat:autoclickerAVL');
      clearScore(player, 'anticheat:cps');
      player.kill();
      addScore(player, 'anticheat:autoclickerAVL');
      flag(player, 'AutoClicker/A', vl);
      if(vl >= config.modules.autoclickerA.VL) {
        clearScore(player, 'anticheat:autoclickerAVL');
        punish(player, 'AutoClicker/A', config.modules.autoclickerA.punishment);
      };
    };
    system.runTimeout(() => {
      if(world.getPlayers({id: player.id}) == undefined) return;
      addScore(player, 'anticheat:cps', -1);
    }, 20);
  });
  if(!config.modules.autoclickerA.state) {
    world.afterEvents.entityHitEntity.unsubscribe(EVENT);
  };
};

export { ac_a }