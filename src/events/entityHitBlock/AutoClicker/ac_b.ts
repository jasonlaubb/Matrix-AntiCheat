import { world, Player, system } from '@minecraft/server';
import { addScore, flag, getScore, punish } from '../../../util/World.js';
import config from '../../../data/config.js';

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
            if (averageCPS > config.modules.autoclickerA.cpsLimit && !player.hasTag('anticheat:pvp-off')) {
                playerClickData.set(player.id, { lastClickTime: currentTime, cpsHistory: [] });
                player.addTag('anticheat:autoclicker-off');
                system.runTimeout(() => { player.removeTag('anticheat:autoclicker-off') }, 8)
                addScore(player, 'anticheat:autoclickerAVL', 1)
                flag(player, 'AutoClicker/A', getScore(player, 'anticheat:autoclickerAVL'), [`CPS=${averageCPS.toFixed(2)}`]);
                if(getScore(player, 'anticheat:autoclickerAVL') > config.modules.autoclickerA.VL) {
                  punish(player, 'AutoClicker/A', config.modules.autoclickerA.punishment)
                }
            }
        }
    }
    playerClickData.set(player.id, { lastClickTime: currentTime, cpsHistory });
};

const ac_b = () => {
  const EVENT = world.afterEvents.entityHitBlock.subscribe(({ damagingEntity }) => {
    if (!(damagingEntity instanceof Player) || damagingEntity.hasTag("admin")) return;
    detectAutoClicker(damagingEntity);
  });
  if(!config.modules.autoclickerA.state) {
    playerClickData.clear();
    world.afterEvents.entityHitBlock.unsubscribe(EVENT)
  }
};

export { ac_b }