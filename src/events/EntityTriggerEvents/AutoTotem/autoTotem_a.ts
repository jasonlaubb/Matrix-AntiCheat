import config from '../../../data/config.js';
import { uniqueId } from '../../../util/World.js';
import { world, Player, EntityEquippableComponent, EquipmentSlot } from '@minecraft/server';
import { State } from '../../../util/Toggle.js';
import { flag } from '../../../util/Flag.js';

const autototem_a = () => {
  const EVENT = world.afterEvents.dataDrivenEntityTriggerEvent.subscribe(ev => {
    const id = ev.id;
    const player = ev.entity as Player;
    if((uniqueId(player)) || id !== 'anticheat:wear_totem') return;
    if(player.hasTag('anticheat:moving')) {
      (player.getComponent("equipment_inventory") as EntityEquippableComponent).setEquipment('offhand' as EquipmentSlot);
      flag(player, 'AutoTotem/A', config.modules.autototemA, [`isMoving=true`])
    }
  });
  if(!State('AUTOTOTEMA', config.modules.autototemA.state)) {
    world.afterEvents.dataDrivenEntityTriggerEvent.unsubscribe(EVENT)
  }
};

export { autototem_a }