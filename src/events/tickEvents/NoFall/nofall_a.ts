import { uniqueId } from '../../../util/World.js';
import config from '../../../data/config.js';
import { world, system } from '@minecraft/server';
import { State } from '../../../util/Toggle.js';
import { flag } from '../../../util/Flag.js';

const lastfallingspeed = new Map<string, number>();
export const nofall_a = () => {
  const EVENT1 = system.runInterval(() => {
    for(const player of world.getPlayers()){
      if(uniqueId(player)) continue;
      if(lastfallingspeed.get(player.id) == undefined) lastfallingspeed.set(player.id, 0);
      if(lastfallingspeed.get(player.id) < 0 && player.getVelocity().y === 0 && !player.isFlying && !player.isOnGround && !player.isClimbing) {
        player.teleport(player.location);
        flag(player, 'NoFall/A', config.modules.nofallA, undefined);
      };
    lastfallingspeed.set(player.id, player.getVelocity().y);
    }
  });
  const EVENT2 = world.afterEvents.playerLeave.subscribe(ev => {
    lastfallingspeed.delete(ev.playerId);
  });
  if(!State('NOFALLA', config.modules.nofallA.state)) {
    system.clearRun(EVENT1);
    world.afterEvents.playerLeave.unsubscribe(EVENT2);
    lastfallingspeed.clear()
  }
}