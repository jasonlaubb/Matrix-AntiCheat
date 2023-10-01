import { world } from '@minecraft/server';
import config from '../../../data/config.js';
import { uniqueId, getGamemode } from '../../../util/World.js';
import { State } from '../../../util/Toggle.js';
import { flag } from '../../../util/Flag.js';

const blockBreakList = new Map<string, Array<number>>();
const nuker_a = () => {
  const EVENT = world.beforeEvents.playerBreakBlock.subscribe(ev => {
    const player = ev.player;
    if (getGamemode(player) == 1 || uniqueId(player)) return;
    const bl = blockBreakList.get(player.id);
    //@ts-expect-error
    blockBreakList.set(player.id, bl.push(Date.now()));
    blockBreakList.set(player.id, bl.filter(time => time >= Date.now() - config.modules.nukerA.validTime));
    const BreakInTick = blockBreakList.get(player.id).length;
    if (BreakInTick > config.modules.nukerA.maxBreakInTick) {
      flag(player, 'Nuker/A', config.modules.nukerA as ModuleClass, undefined);
      ev.cancel = true;
    }
  });
  if(!State('NUKERA', config.modules.nukerA.state)) {
    world.beforeEvents.playerBreakBlock.unsubscribe(EVENT);
  };
};

export { nuker_a }