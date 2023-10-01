import { world, Player, system } from '@minecraft/server';
import config from '../../../data/config.js';
import { State } from '../../../util/Toggle.js';
import { flag } from '../../../util/Flag.js';
import { uniqueId } from '../../../util/World.js';

const playerClickData = new Map<string, any>();

const detectAutoClicker = (player: Player) => {
    if (uniqueId(player)) return;
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
                flag(player, 'AutoClicker/B', config.modules.AutoClicker, [`cps=${averageCPS.toFixed(2)}`])
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
  if(!State('ACB', config.modules.autoclickerA.state)) {
    playerClickData.clear();
    world.afterEvents.entityHitBlock.unsubscribe(EVENT)
  }
};

export { ac_b }