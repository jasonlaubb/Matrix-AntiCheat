import { Container, EntityInventoryComponent, Player, world } from '@minecraft/server';
import { uniqueId } from '../../../util/World.js';
import config from '../../../data/config.js';
import { State } from '../../../util/Toggle.js';
import { flag } from '../../../util/Flag.js';

const lastThrowTime = new Map<string, number>();
const fastThrow_a = () => {
  const EVENT1 = world.afterEvents.itemUse.subscribe(ev => {
    const player = ev.source as Player;
    if(uniqueId(player)) return;
    if(Date.now() - lastThrowTime.get(player.id) || Date.now() - config.modules.fastThrowA.minThrowTime < config.modules.fastThrowA.minThrowTime) {
      const container: Container = (player.getComponent("inventory") as EntityInventoryComponent).container
      container.setItem(player.selectedSlot);
      flag(player, 'FastThrow/A', config.modules.fastUse, [`delay=`])
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