import { world, system, Player } from '@minecraft/server';
import config from '../../../data/config.js';
import { flag, getScore, addScore, clearScore, uniqueId, punish } from '../../../util/World.js';

const ac_b = () => {
  const EVENT = world.afterEvents.entityHitBlock.subscribe(ev => {
    const player = ev.damagingEntity as Player;
    if(uniqueId(player) || player.typeId !== "minecraft:player") return;
    addScore(player, 'anticheat:cps', 1);
    if(getScore(player, 'anticheat:cps') > config.modules.autoclickerB.cpsLimit) {
      const vl = getScore(player, 'anticheat:autoclickerBVL');
      clearScore(player, 'anticheat:cps');
      player.kill();
      addScore(player, 'anticheat:autoclickerBVL', 1);
      flag(player, 'AutoClicker/B', vl);
      if(vl >= config.modules.autoclickerB.VL) {
        clearScore(player, 'anticheat:autoclickerBVL');
        punish(player, 'AutoClicker/B', config.modules.autoclickerB.punishment);
      };
    };
    system.runTimeout(() => {
      if(world.getPlayers({name: player.name}) == undefined) return;
      addScore(player, 'anticheat:cps', -1);
    }, 20);
  });
  if(!config.modules.autoclickerB.state) {
    world.afterEvents.entityHitBlock.unsubscribe(EVENT);
  };
};

export { ac_b }