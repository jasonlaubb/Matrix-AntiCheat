import config from '../../../data/config.js';
import { uniqueId } from '../../../util/World.js';
import { world, EntityEquippableComponent, EquipmentSlot, Player } from '@minecraft/server';
import { State } from '../../../util/Toggle.js';
import { flag } from '../../../util/Flag.js';

const autototem_b = () => {
  const EVENT = world.afterEvents.dataDrivenEntityTriggerEvent.subscribe(ev => {
    const id = ev.id;
    const player = ev.entity as Player;
    if((uniqueId(player)) || id !== 'anticheat:wear_totem') return;
    if(player.hasTag('anticheat:swinging_head')) {
      (player.getComponent("equipment_inventory") as EntityEquippableComponent).setEquipment('offhand' as EquipmentSlot);
      flag(player, 'AutoTotem/B', config.modules.autototemB, [`swingHead=true`])
    }
  });
  if(!State('AUTOTOTEMB', config.modules.autototemB.state)) {
    world.afterEvents.dataDrivenEntityTriggerEvent.unsubscribe(EVENT)
  }
};

export { autototem_b }