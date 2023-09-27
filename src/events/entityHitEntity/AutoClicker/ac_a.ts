import { world, Player, system } from '@minecraft/server';
import { addScore, flag, getScore, punish } from '../../../util/World.js';
import config from '../../../data/config.js';
import { State } from '../../../util/Toggle.js';

const playerClickData = new Map<string, any>();

const detectAutoClicker = (player: Player) => {
    const currentTime = Date.now();
    const { lastClickTime = 0, cpsHistory = [] } = playerClickData.get(player.id) ?? {};

    if (lastClickTime && currentTime - lastClickTime > 0) {
        const timeBetweenClicks = currentTime - lastClickTime;
        const cps = 1000 / timeBetweenClicks;

        if (isFinite(cps)) {
            cpsHistory.push(cps);

            if (cpsHistory.length > 10) {
                cpsHistory.shift();
            }

            const averageCPS = cpsHistory.reduce((acc: number, val: number) => acc + val, 0) / cpsHistory.length;
            if (averageCPS > config.modules.autoclickerB.cpsLimit && !player.hasTag('anticheat:pvp-off')) {
                playerClickData.set(player.id, { lastClickTime: currentTime, cpsHistory: [] });
                player.addTag('anticheat:autoclicker-off');
                system.runTimeout(() => { player.removeTag('anticheat:autoclicker-off') }, 8)
                addScore(player, 'anticheat:autoclickerBVL', 1)
                flag(player, 'AutoClicker/B', getScore(player, 'anticheat:autoclickerBVL'), [`CPS=${averageCPS.toFixed(2)}`]);
                if(getScore(player, 'anticheat:autoclickerBVL') > config.modules.autoclickerB.VL) {
                  punish(player, 'AutoClicker/B', config.modules.autoclickerB.punishment)
                }
            }
        }
    }
    playerClickData.set(player.id, { lastClickTime: currentTime, cpsHistory });
};

const ac_a = () => {
  const EVENT = world.afterEvents.entityHitEntity.subscribe(({ damagingEntity }) => {
    if (!(damagingEntity instanceof Player) || damagingEntity.hasTag("admin")) return;
    detectAutoClicker(damagingEntity);
  });
  if(!State('ACA', config.modules.autoclickerA.state)) {
    playerClickData.clear();
    world.afterEvents.entityHitEntity.unsubscribe(EVENT)
  }
};

export { ac_a }