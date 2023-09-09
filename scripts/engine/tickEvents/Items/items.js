import { world, system } from '@minecraft/server';
import { flag, punish, uniqueId } from '../../../unti/World.js';
import config from '../../../data/config.js';

const items = () => {
  const EVENT = system.runInterval(() => {
    for(const player of world.getPlayers()) {
      if(uniqueId(player)) continue;
      const inv = player.getComponent("inventory").container;
      for(let i = 0; i < inv.size; i++) {
        const item = inv.getItem(i);
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

      }
    }
  })
}