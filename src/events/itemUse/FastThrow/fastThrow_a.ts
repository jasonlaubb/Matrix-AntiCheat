import { Container, EntityInventoryComponent, Player, world } from '@minecraft/server';
import { addScore, getScore, punish, uniqueId, flag } from '../../../util/World.js';
import config from '../../../data/config.js';
import { State } from '../../../util/Toggle.js';

const lastThrowTime = new Map<string, number>();
const fastThrow_a = () => {
  const EVENT1 = world.afterEvents.itemUse.subscribe(ev => {
    const player = ev.source as Player;
    if(uniqueId(player)) return;
    if(lastThrowTime.get(player.id) == undefined) lastThrowTime.set(player.id, Date.now() - config.modules.fastThrowA.minThrowTime)
    if(Date.now() - lastThrowTime.get(player.id) < config.modules.fastThrowA.minThrowTime) {
      const container: Container = (player.getComponent("inventory") as EntityInventoryComponent).container
      container.setItem(player.selectedSlot);
      addScore(player, 'anticheat:fastThrowAVl', 1);
      flag(player, 'fastThrow/A', getScore(player, 'anticheat:fastThrowAVl'));
      if(getScore(player, 'anticheat:fastThrowAVl') > config.modules.fastThrowA.VL) {
        punish(player, 'fastThrow/A', config.modules.fastThrowA.punishment)
      }
    } else lastThrowTime.set(player.id, Date.now())
  });
  const EVENT2 = world.afterEvents.playerLeave.subscribe(ev => {
    lastThrowTime.delete(ev.playerId)
  });
  if(!State('FastThrow', config.modules.fastThrowA.state)) {
    world.afterEvents.itemUse.unsubscribe(EVENT1);
    world.afterEvents.playerLeave.unsubscribe(EVENT2);
    lastThrowTime.clear();
  }
};

export { fastThrow_a }