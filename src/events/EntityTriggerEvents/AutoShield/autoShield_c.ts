import config from '../../../data/config.js';
import { uniqueId } from '../../../util/World.js';
import { EntityEquippableComponent, EquipmentSlot, Player, world } from '@minecraft/server';
import { State } from '../../../util/Toggle.js';
import { flag } from '../../../util/Flag.js';

const autoshield_c = () => {
  const EVENT = world.afterEvents.dataDrivenEntityTriggerEvent.subscribe(ev => {
    const id = ev.id;
    const player = ev.entity as Player;
    if((uniqueId(player)) || id !== 'anticheat:wear_shield') return;
    if(player.hasTag('anticheat:hasGUIopen')) {
      (player.getComponent("equipment_inventory") as EntityEquippableComponent).setEquipment('offhand' as EquipmentSlot);
      flag(player, 'AutoShield/C', config.modules.autoshieldC, [`hasGUIopen=true`])
    }
  });
  if(!State('AUTOSHIELDC', config.modules.autoshieldC.state)) {
    world.afterEvents.dataDrivenEntityTriggerEvent.unsubscribe(EVENT)
  }
};

export { autoshield_c }