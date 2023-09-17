import { world, system } from '@minecraft/server';
import config from '../../../data/config.js';
import { stop } from '../../../util/World.js';

const crasher_c = () => {
  const EVENT1 = world.afterEvents.entitySpawn.subscribe(ev => {
    const entity = ev.entity;
    if(config.modules.crasherC.writeList.includes(entity.typeId)) return;
    //if(config.modules.crasherC.safeCause.includes(ev.cause)) return;
    world.scoreboard.getObjective('anticheat:crasherEntityList').setScore(entity.typeId, 1 + world.scoreboard.getObjective('anticheat:crasherEntityList').getScore(entity.typeId));
    if(world.scoreboard.getObjective('anticheat:crasherEntityList').getScore(entity.typeId) > config.modules.crasherC.maxSummonLimitInTick) {
      const kills = world.getDimension('minecraft:overworld').getEntities({type: entity.typeId});
      for(const kill of kills) {
        kill.kill()
      };
      world.scoreboard.getObjective('anticheat:crasherEntityList').removeParticipant(entity.typeId);
      stop('Crasher/C', 'typeId', entity.typeId)
    }
  });
  const EVENT2 = system.runInterval(() => {
    if(world.scoreboard.getObjective('anticheat:crasherEntityList') == undefined) world.scoreboard.addObjective('anticheat:crasherEntityList','crasherEntityList');
    const hi = world.scoreboard.getObjective('anticheat:crasherEntityList').getParticipants();
    if(hi.length > 0) {
      for(const e of hi) {
        world.scoreboard.getObjective('anticheat:crasherEntityList').removeParticipant(e)
      }
    }
  });
  if(!config.modules.crasherC.state) {
    world.afterEvents.entitySpawn.unsubscribe(EVENT1);
    system.clearRun(EVENT2)
  }
};

export { crasher_c }