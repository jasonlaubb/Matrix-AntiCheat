import { world, system, EntityEquipmentInventoryComponent, EquipmentSlot, EntityInventoryComponent, Container, ItemEnchantsComponent, EnchantmentList } from '@minecraft/server';
import { flag, punish, uniqueId } from '../../../util/World.js';
import config from '../../../data/config.js';

const items = () => {
  const EVENT = system.runInterval(() => {
    for(const player of world.getPlayers()) {
      if(uniqueId(player)) continue;

      if(config.modules.items.illegalItemF.state) {
        const equipment = player.getComponent("equipment_inventory") as EntityEquipmentInventoryComponent;
        const offhand = equipment.getEquipment('offhand' as EquipmentSlot);
        const head = equipment.getEquipment('head' as EquipmentSlot);
        const chest = equipment.getEquipment('chest' as EquipmentSlot);
        const legs = equipment.getEquipment('legs' as EquipmentSlot);
        const feet = equipment.getEquipment('feet' as EquipmentSlot);
        if(offhand && !config.modules.items.illegalItemF.whiteList.offhand.includes(offhand.typeId)) {
          equipment.setEquipment('offhand' as EquipmentSlot);
          flag(player, 'illegalItem/F', 0);
          punish(player, 'illegalItem/F', config.modules.items.illegalItemF.punishment);
        };
        if(head && !config.modules.items.illegalItemF.whiteList.offhand.includes(head.typeId) && !head.typeId.endsWith('_helmet')) {
          equipment.setEquipment('head' as EquipmentSlot);
          flag(player, 'illegalItem/F', 0);
          punish(player, 'illegalItem/F', config.modules.items.illegalItemF.punishment);
        };
        if(head && !config.modules.items.illegalItemF.whiteList.chest.includes(chest.typeId) && !chest.typeId.endsWith('_chestplate')) {
          equipment.setEquipment('chest' as EquipmentSlot);
          flag(player, 'illegalItem/F', 0);
          punish(player, 'illegalItem/F', config.modules.items.illegalItemF.punishment);
        };
        if(legs && !config.modules.items.illegalItemF.whiteList.legs.includes(legs.typeId) && !legs.typeId.endsWith('_leggings')) {
          equipment.setEquipment('legs' as EquipmentSlot);
          flag(player, 'illegalItem/F', 0);
          punish(player, 'illegalItem/F', config.modules.items.illegalItemF.punishment);
        };
        if(feet && !config.modules.items.illegalItemF.whiteList.feet.includes(feet.typeId) && !feet.typeId.endsWith('_bootst')) {
          equipment.setEquipment('legs' as EquipmentSlot);
          flag(player, 'illegalItem/F', 0);
          punish(player, 'illegalItem/F', config.modules.items.illegalItemF.punishment);
        }
      };

      const inv: Container = (player.getComponent("inventory") as EntityInventoryComponent).container;
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
          if(item.typeId.endsWith('_bucket') && !config.modules.items.illegalItemB.bucketWhiteList.includes(item.typeId) && !config.modules.items.illegalItemB.allowbucket) {
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
        if(config.modules.items.illegalItemG.state && item.nameTag && item.nameTag.length > config.modules.items.illegalItemG.maxNameLength) {
          if(config.modules.items.illegalItemG.deleteName) { item.nameTag = undefined } else { inv.setItem(i) };
          flag(player, 'illegalItem/G', 0);
          punish(player, 'illegalItem/G', config.modules.items.illegalItemF.punishment);
          continue
        };
        if(config.modules.items.illegalItemH.state) {
          try {
//@ts-expect-error
            if(!config.modules.items.illegalItemH.allowCanBreak && item.getCanDestroy().length > config.modules.items.illegalItemH.blockType) {
              if(config.modules.items.illegalItemH.cleartag) { item.setCanDestroy(undefined) } else { inv.setItem(i) };
              flag(player, 'illegalItem/H', 0);
              punish(player, 'illegalItem/H', config.modules.items.illegalItemF.punishment);
              continue
            };
//@ts-expect-error
            if(!config.modules.items.illegalItemH.allowCanPlace && item.getCanPlaceOn().length > config.modules.items.illegalItemH.blockType) {
              if(config.modules.items.illegalItemH.cleartag) { item.setCanPlaceOn(undefined) } else { inv.setItem(i) };
              flag(player, 'illegalItem/H', 0);
              punish(player, 'illegalItem/H', config.modules.items.illegalItemF.punishment);
              continue
            }
          } catch { }
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
        
        const enchantments: EnchantmentList = (item.getComponent("enchantments") as ItemEnchantsComponent).enchantments;
        if(enchantments !== undefined) {
          if(config.modules.items.BadEnchantA.state) {
            let flagplayer = false;
            for(const enchantment of enchantments) {
              if(enchantment.level > enchantment.type.maxLevel || enchantment.level <= 0) {
                if(!flagplayer) flagplayer = true;
                if(!config.modules.items.BadEnchantA.clearitem) {
                  enchantments.removeEnchantment(enchantment.type)
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
          if(config.modules.items.BadEnchantB.state) {
            let inWriteList: boolean = false;
            for(const e of config.modules.items.BadEnchantB.writeList) {
              if(e.endsWith(item.typeId)) {
                inWriteList = true;
                break
              }
            };
            if(!inWriteList) {
              inv.setItem(i);
              flag(player, 'BadEnchant/B', 0);
              punish(player, 'BadEnchant/B', config.modules.items.illegalItemI.punishment);
              continue
            }
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