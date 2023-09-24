import { world, system } from '@minecraft/server';
import config from '../../../data/config.js';
import { stop } from '../../../util/World.js';

const spawnData = new Map<string, number>();

const crasher_c = () => {
  const EVENT1 = world.afterEvents.entitySpawn.subscribe(ev => {
    const entity = ev.entity;
    if(config.modules.crasherC.writeList.includes(entity.typeId)) return;
    spawnData.set(entity.typeId, spawnData.get(entity.typeId) + 1);
    if(config.modules.crasherC.safeCause.includes(ev.cause)) return;
    if(spawnData.get(entity.typeId) > config.modules.crasherC.maxSummonLimitInTick) {
      const kills = world.getDimension('minecraft:overworld').getEntities({type: entity.typeId});
      for(const kill of kills) {
        kill.kill()
      };
      spawnData.delete(entity.typeId);
      stop('Crasher/C', 'typeId', entity.typeId)
    }
  });
  const EVENT2 = system.runInterval(() => {
    spawnData.clear()
  }, 1);
  if(!config.modules.crasherC.state) {
    spawnData.clear();
    world.afterEvents.entitySpawn.unsubscribe(EVENT1);
    system.clearRun(EVENT2)
  }
};

export { crasher_c }