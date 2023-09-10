import { world, system } from '@minecraft/server';
import { flag, punish, uniqueId } from '../../../unti/World.js';
import config from '../../../data/config.js';

const items = () => {
  const EVENT = system.runInterval(() => {
    for(const player of world.getPlayers()) {
      if(uniqueId(player)) continue;

      if(config.modules.items.illegalItemF.state && !config.modules.items.illegalItemF.includes(item.typeId)) {
        const equipment = player.getComponent("equipment_inventory");
        const offhand = equipment.getEquipment('offhand');
        const head = equipment.getEquipment('head');
        const chest = equipment.getEquipment('chest');
        const legs = equipment.getEquipment('legs');
        const feet = equipment.getEquipment('feet');
        if(offhand && !config.modules.items.illegalItemF.whiteList.offhand.includes(offhand.typeId)) {
          equipment.setEquipment('offhand');
          flag(player, 'illegalItem/F', 0);
          punish(player, 'illegalItem/F', config.modules.items.illegalItemF.punishment);
        };
        if(head && !config.modules.items.illegalItemF.whiteList.offhand.includes(head.typeId) && !head.typeId.endsWith('_helmet')) {
          equipment.setEquipment('head');
          flag(player, 'illegalItem/F', 0);
          punish(player, 'illegalItem/F', config.modules.items.illegalItemF.punishment);
        };
        if(head && !config.modules.items.illegalItemF.whiteList.chest.includes(chest.typeId) && !chest.typeId.endsWith('_chestplate')) {
          equipment.setEquipment('chest');
          flag(player, 'illegalItem/F', 0);
          punish(player, 'illegalItem/F', config.modules.items.illegalItemF.punishment);
        };
        if(legs && !config.modules.items.illegalItemF.whiteList.legs.includes(legs.typeId) && !legs.typeId.endsWith('_leggings')) {
          equipment.setEquipment('legs');
          flag(player, 'illegalItem/F', 0);
          punish(player, 'illegalItem/F', config.modules.items.illegalItemF.punishment);
        };
        if(feet && !config.modules.items.illegalItemF.whiteList.feet.includes(feet.typeId) && !feet.typeId.endsWith('_bootst')) {
          equipment.setEquipment('legs');
          flag(player, 'illegalItem/F', 0);
          punish(player, 'illegalItem/F', config.modules.items.illegalItemF.punishment);
        }
      };

      const inv = player.getComponent("inventory").container;
      for(let i = 0; i < inv.size; i++) {
        const item = inv.getItem(i);
        if(!item) continue;
        if(config.modules.items.illegalItemA.state && config.modules.items.illegalItemA.illegal.includes(item.typeId)) {
          inv.setItem(i);
          flag(player, 'illegalItem/A', 0);
          punish(player, 'illegalItem/A', config.modules.items.illegalItemA.punishment);
          continue
        };
        if(config.modules.items.illegalItemB.state) {
          if(item.typeId.endsWith('_bucket') && !config.modules.items.illegalItemB.includes(item.typeId) && !config.modules.items.illegalItemB.allowbucket) {
            inv.setItem(i);
            flag(player, 'illegalItem/B', 0);
            punish(player, 'illegalItem/B', config.modules.items.illegalItemB.punishment);
            continue
          };
          if(item.typeId == 'minecraft:beehive' || item.typeId == 'minecraft:bee_nest') {
            if(!config.modules.items.illegalItemB.allowbee) {
              inv.setItem(i);
              flag(player, 'illegalItem/B', 0);
              punish(player, 'illegalItem/B', config.modules.items.illegalItemB.punishment);
              continue
            }
          }
        };
        if(config.modules.items.illegalItemC.state) {
          if(item.typeId.endsWith('spawn_egg') && !config.modules.items.illegalItemC.whiteList.includes(item.typeId)) {
            inv.setItem(i);
            flag(player, 'illegalItem/C', 0);
            punish(player, 'illegalItem/C', config.modules.items.illegalItemC.punishment);
            continue
          }
        };
        if(config.modules.items.illegalItemD.state && item.getLore().length > config.modules.items.illegalItemD.maxLoreLength) {
          inv.setItem(i);
          flag(player, 'illegalItem/D', 0);
          punish(player, 'illegalItem/D', config.modules.items.illegalItemD.punishment);
          continue
        };
        if(config.modules.items.illegalItemE.state && item.keepOnDeath) {
          if(config.modules.items.illegalItemE.removetag) { item.keepOnDeath = false } else { inv.setItem(i) };
          flag(player, 'illegalItem/E', 0);
          punish(player, 'illegalItem/E', config.modules.items.illegalItemE.punishment);
          continue
        };
        if(config.modules.items.illegalItemG.state && item.nameTag && item.nameTag.length > config.modules.items.illegalItemG) {
          if(config.modules.items.illegalItemG.deleteName) { item.nameTag = undefined } else { inv.setItem(i) };
          flag(player, 'illegalItem/G', 0);
          punish(player, 'illegalItem/G', config.modules.items.illegalItemF.punishment);
          continue
        };
        if(config.modules.items.illegalItemH.state) {
          if(!config.modules.items.illegalItemH.allowCanBreak && item.getCanDestroy().length > config.modules.items.illegalItemH.blockType) {
            if(config.modules.items.illegalItemH.removetag) { item.setCanDestroy(undefined) } else { inv.setItem(i) };
            flag(player, 'illegalItem/H', 0);
            punish(player, 'illegalItem/H', config.modules.items.illegalItemF.punishment);
            continue
          };
          if(!config.modules.items.illegalItemH.allowCanPlace && item.getCanPlaceOn().length > config.modules.items.illegalItemH.blockType) {
            if(config.modules.items.illegalItemH.removetag) { item.setCanPlaceOn(undefined) } else { inv.setItem(i) };
            flag(player, 'illegalItem/H', 0);
            punish(player, 'illegalItem/H', config.modules.items.illegalItemF.punishment);
            continue
          }
        };
        if(config.modules.items.illegalItemI.state && item.typeId.startsWith('element_')) {
          inv.setItem(i);
          flag(player, 'illegalItem/I', 0);
          punish(player, 'illegalItem/I', config.modules.items.illegalItemI.punishment);
          continue
        };
        if(config.modules.items.illegalItemJ.state && item.amount > item.maxAmount) {
          inv.setItem(i);
          flag(player, 'illegalItem/I', 0);
          punish(player, 'illegalItem/I', config.modules.items.illegalItemI.punishment);
          continue
        };
        
        const enchantments = item.getComponent("enchantments").enchantments;
        if(enchantments !== undefined) {
          if(config.modules.items.BadEnchantA.state) {
            let flagplayer = false;
            for(const enchantment of enchantments) {
              if(enchantment.level > enchantment.type.maxLevel || enchantment.level <= 0) {
                if(!flagplayer) flagplayer = true;
                if(!config.modules.items.BadEnchantA.clearitem) {
                  item.removeEnchantment(enchantment.type)
                } else {
                  inv.setItem(i);
                  break
                }
              }
            };
            if(flagplayer) {
              flag(player, 'BadEnchant/A', 0);
              punish(player, 'BadEnchant/A', config.modules.items.illegalItemI.punishment);
              continue
            }
          };
          if(config.modules.items.BadEnchantB.state && !config.modules.items.BadEnchantB.writeList.endsWith(item.typeId)) {
            inv.setItem(i);
            flag(player, 'BadEnchant/B', 0);
            punish(player, 'BadEnchant/B', config.modules.items.illegalItemI.punishment);
            continue
          }
        }
      }
    }
  });
  if(!config.modules.items.overallState) {
    system.clearRun(EVENT)
  }
};

export { items }