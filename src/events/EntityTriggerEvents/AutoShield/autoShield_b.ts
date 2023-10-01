import config from '../../../data/config.js';
import { uniqueId } from '../../../util/World.js';
import { world, Player, EntityEquippableComponent, EquipmentSlot } from '@minecraft/server';
import { State } from '../../../util/Toggle.js';
import { flag } from '../../../util/Flag.js';

const autoshield_b = () => {
  const EVENT = world.afterEvents.dataDrivenEntityTriggerEvent.subscribe(ev => {
    const id = ev.id;
    const player = ev.entity as Player;
    if((uniqueId(player)) || id !== 'anticheat:wear_shield') return;
    if(player.hasTag('anticheat:swinging_head')) {
      (player.getComponent("equipment_inventory") as EntityEquippableComponent).setEquipment('offhand' as EquipmentSlot);
      flag(player, 'AutoSield/B', config.modules.autoshieldB, [`swingHead=true`])
    }
  });
  if(!State('AUTOSHIELDB', config.modules.autoshieldB.state)) {
    world.afterEvents.dataDrivenEntityTriggerEvent.unsubscribe(EVENT)
  }
};

export { autoshield_b }