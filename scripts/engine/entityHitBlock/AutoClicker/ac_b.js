import { world, system } from '@minecraft/server';
import config from '../../../data/config.js';
import { flag, getScore, addScore, clearScore, uniqueId } from '../../../unti/World.js';

const ac_b = () => {
  const EVENT = world.afterEvents.entityHitBlock.subscribe(ev => {
    const player = ev.damagingEntity;
    if(uniqueId(player) || player.typeId !== "minecraft:player") return;
    addScore(player, 'anticheat:cps');
    if(getScore(player, 'anticheat:cps') > config.modules.autoclickerB.cpsLimit) {
      const vl = getScore(player, 'anticheat:autoclickerBVL');
      clearScore(player, 'anticheat:cps');
      player.kill();
      addScore(player, 'anticheat:autoclickerBVL');
      flag(player, 'AutoClicker/B', vl);
      if(vl >= config.modules.autoclickerB.VL) {
        clearScore(player, 'anticheat:autoclickerBVL');
        punish(player, 'AutoClicker/B', config.modules.autoclickerB.punishment);
      };
    };
    system.runTimeout(() => {
      if(world.getPlayers({id: player.id}) == undefined) return;
      addScore(player, 'anticheat:cps', -1);
    }, 20);
  });
  if(!config.modules.autoclickerB.state) {
    world.afterEvents.entityHitEntity.unsubscribe(EVENT);
  };
};

export { ac_b }