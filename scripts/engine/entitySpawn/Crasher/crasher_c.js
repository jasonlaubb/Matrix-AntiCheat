import { world, system } from '@minecraft/server';
import config from '../../../data/config.js';

const crasher_c = () => {
  const EVENT1 = world.afterEvents.entitySpawn.subscribe(ev => {
    const entity = ev.entity;
    if(config.modules.crasherC.writeList.includes(entity.typeId) || config.modules.crasherC.safeCause.includes(ev.cause)) return;
    world.scoreboard.getObjective('anticheat:crasherEntityList').addScore(entity.typeId, 1);
    if(world.scoreboard.getObjective('anticheat:crasherEntityList').getScore(entity.typeId) > config.modules.crasherC.maxSummonLimitInTick) {
      const kills = world.getDimension('minecraft:overworld').getEntities({typeId: entity.typeId});
      for(const kill of kills) {
        kill.kill()
      };
      world.scoreboard.getObjective('anticheat:crasherEntityList').removeParticipant(entity.typeId);
      world.sendMessage(`§4§cN§go§ek§aa§qr§sa§tr§uo§ds §l§f|§r §eWorld §7stopped §ecrasher/C §7and killed all §e${entity.typeId}`)
    }
  });
  const EVENT2 = system.runInterval(() => {
    if(world.scoreboard.getObjective('anticheat:crasherEntityList') == undefined) world.scoreboard.addObjective('anticheat:crasherEntityList','crasherEntityList');
    const hi = world.scoreboard.getObjective('anticheat:crasherEntityList').getParticipants();
    if(hi.length > 0) {
      for(const e of hi) {
        world.scoreboard.removeParticipant(hi)
      }
    }
  });
  if(!config.modules.crasherC.state) {
    world.afterEvents.entitySpawn.unsubscribe(EVENT1);
    system.clearRun(EVENT2)
  }
};

export { crasher_c }