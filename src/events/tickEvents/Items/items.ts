import { world, system, EntityEquippableComponent, EquipmentSlot, EntityInventoryComponent, Container, ItemEnchantsComponent, EnchantmentList } from '@minecraft/server';
import { uniqueId } from '../../../util/World.js';
import config from '../../../data/config.js';
import { State } from '../../../util/Toggle.js';
import { flag } from '../../../util/Flag.js';

const items = () => {
  const EVENT = system.runInterval(() => {
    for(const player of world.getPlayers()) {
      if(uniqueId(player)) continue;
      if(State('ILLEGALITEMF', config.modules.items.illegalItemF.state)) {
        const equipment = player.getComponent("equipment_inventory") as EntityEquippableComponent;
        const offhand = equipment.getEquipment('offhand' as EquipmentSlot);
        const head = equipment.getEquipment('head' as EquipmentSlot);
        const chest = equipment.getEquipment('chest' as EquipmentSlot);
        const legs = equipment.getEquipment('legs' as EquipmentSlot);
        const feet = equipment.getEquipment('feet' as EquipmentSlot);
        if(offhand && !config.modules.items.illegalItemF.whiteList.offhand.includes(offhand.typeId)) {
          equipment.setEquipment('offhand' as EquipmentSlot);
          flag(player, 'illegalItem/F', config.modules.illegalItemF, [`typeId=${offhand.typeId}`]);
        };
        if(head && !config.modules.items.illegalItemF.whiteList.offhand.includes(head.typeId) && !head.typeId.endsWith('_helmet')) {
          equipment.setEquipment('head' as EquipmentSlot);
          flag(player, 'illegalItem/F', config.modules.illegalItemF, [`typeId=${head.typeId}`]);
        };
        if(head && !config.modules.items.illegalItemF.whiteList.chest.includes(chest.typeId) && !chest.typeId.endsWith('_chestplate')) {
          equipment.setEquipment('chest' as EquipmentSlot);
          flag(player, 'illegalItem/F', config.modules.illegalItemF, [`typeId=${chest.typeId}`]);
        };
        if(legs && !config.modules.items.illegalItemF.whiteList.legs.includes(legs.typeId) && !legs.typeId.endsWith('_leggings')) {
          equipment.setEquipment('legs' as EquipmentSlot);
          flag(player, 'illegalItem/F', config.modules.illegalItemF, [`typeId=${legs.typeId}`]);
        };
        if(feet && !config.modules.items.illegalItemF.whiteList.feet.includes(feet.typeId) && !feet.typeId.endsWith('_bootst')) {
          equipment.setEquipment('legs' as EquipmentSlot);
          flag(player, 'illegalItem/F', config.modules.illegalItemF, [`typeId=${feet.typeId}`]);
        }
      };

      const inv: Container = (player.getComponent("inventory") as EntityInventoryComponent).container;
      for(let i = 0; i < inv.size; i++) {
        const item = inv.getItem(i);
        if(!item) continue;
        if(State('ILLEGALITEMA', config.modules.items.illegalItemA.state && config.modules.items.illegalItemA.illegal.includes(item.typeId))) {
          inv.setItem(i);
          flag(player, 'illegalItem/B', config.modules.illegalItemB, [`typeId=${item.typeId}`]);
          continue
        };
        if(State('ILLEGALITEMB', config.modules.items.illegalItemB.state)) {
          if(item.typeId.endsWith('_bucket') && !config.modules.items.illegalItemB.bucketWhiteList.includes(item.typeId) && !config.modules.items.illegalItemB.allowbucket) {
            inv.setItem(i);
            flag(player, 'illegalItem/B', config.modules.illegalItemB, [`typeId=${item.typeId}`]);
            continue
          };
          if(item.typeId == 'minecraft:beehive' || item.typeId == 'minecraft:bee_nest') {
            if(!config.modules.items.illegalItemB.allowbee) {
              inv.setItem(i);
              flag(player, 'illegalItem/B', config.modules.illegalItemB, [`typeId=${item.typeId}`]);
              continue
            }
          }
        };
        if(State('ILLEGALITEMC', config.modules.items.illegalItemC.state)) {
          if(item.typeId.endsWith('spawn_egg') && !config.modules.items.illegalItemC.whiteList.includes(item.typeId)) {
            inv.setItem(i);
            flag(player, 'illegalItem/C', config.modules.illegalItemC, [`typeId=${item.typeId}`]);
            continue
          }
        };
        if(State('ILLEGALITEMD', config.modules.items.illegalItemD.state) && item.getLore().length > config.modules.items.illegalItemD.maxLoreLength) {
          inv.setItem(i);
          flag(player, 'illegalItem/D', config.modules.illegalItemD, [`LoreLength=${item.getLore.length}`]);
          continue
        };
        if(State('ILLEGALITEME', config.modules.items.illegalItemE.state) && item.keepOnDeath) {
          if(config.modules.items.illegalItemE.removetag) { item.keepOnDeath = false } else { inv.setItem(i) };
          flag(player, 'illegalItem/E', config.modules.illegalItemE, [`KeepOnDeath=true`]);
          continue
        };
        if(State('ILLEGALITEMG', config.modules.items.illegalItemG.state) && item.nameTag && item.nameTag.length > config.modules.items.illegalItemG.maxNameLength) {
          if(config.modules.items.illegalItemG.deleteName) { item.nameTag = undefined } else { inv.setItem(i) };
          flag(player, 'illegalItem/G', config.modules.illegalItemG, [`nameLength=${item.nameTag.length}`]);
          continue
        };
        if(State('ILLEGALITEMH', config.modules.items.illegalItemH.state)) {
          try {
            if(!config.modules.items.illegalItemH.allowCanBreak && item.getCanDestroy().length > config.modules.items.illegalItemH.blockType) {
              if(config.modules.items.illegalItemH.cleartag) { item.setCanDestroy(undefined) } else { inv.setItem(i) };
              flag(player, 'illegalItem/H', config.modules.illegalItemH, [`CanDestroyLength=${item.getCanDestroy().length}`]);
              continue
            };
            if(!config.modules.items.illegalItemH.allowCanPlace && item.getCanPlaceOn().length > config.modules.items.illegalItemH.blockType) {
              if(config.modules.items.illegalItemH.cleartag) { item.setCanPlaceOn(undefined) } else { inv.setItem(i) };
              flag(player, 'illegalItem/H', config.modules.illegalItemH, [`CanPlaceOnLength=${item.getCanDestroy().length}`]);
              continue
            }
          } catch { }
        };
        if(State('ILLEGALITEMI', config.modules.items.illegalItemI.state && item.typeId.startsWith('element_'))) {
          inv.setItem(i);
          flag(player, 'illegalItem/I', config.modules.illegalItemI, [`typeId=${item.typeId}`]);
          continue
        };
        if(State('ILLEGALITEMJ', config.modules.items.illegalItemJ.state && item.amount > item.maxAmount)) {
          inv.setItem(i);
          flag(player, 'illegalItem/J', config.modules.illegalItemJ, [`typeId=${item.typeId}`]);
          continue
        };
        
        const enchantments: EnchantmentList = (item.getComponent("enchantments") as ItemEnchantsComponent).enchantments;
        if(enchantments !== undefined) {
          if(State('BADENCHANTA', config.modules.items.BadEnchantA.state)) {
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
              flag(player, 'BadEnchant/A', config.modules.BadEnchantA, undefined);
              continue
            }
          };
          if(State('BADENCHANTB', config.modules.items.BadEnchantB.state)) {
            let inWriteList: boolean = false;
            for(const e of config.modules.items.BadEnchantB.writeList) {
              if(e.endsWith(item.typeId)) {
                inWriteList = true;
                break
              }
            };
            if(!inWriteList) {
              inv.setItem(i);
              flag(player, 'BadEnchant/B', config.modules.illegalItemC, [`typeId=${item.typeId}`]);
              continue
            }
          }
        }
      }
    }
  });
  if(!State('ITEMS', config.modules.items.overallState)) {
    system.clearRun(EVENT)
  }
};

export { items }