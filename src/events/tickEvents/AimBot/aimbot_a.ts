import { uniqueId } from '../../../util/World.js';
import config from '../../../data/config.js';
import { world, system, Vector2 } from '@minecraft/server';
import { State } from '../../../util/Toggle.js';
import { flag } from '../../../util/Flag.js';

const lr = new Map<string, Vector2>();
const aimbot_a = () => {
  const EVENT1 = system.runInterval(() => {
    for(const player of world.getPlayers()){
      if(uniqueId(player)) continue;
      const lastRotationDeff = lr.get(player.id)
      if(lastRotationDeff !== undefined) {
        const locationdeff: Vector2 = { x: Math.abs(player.getRotation().x - lastRotationDeff.x), y: player.getRotation().y - lastRotationDeff.y}
        if(locationdeff.x == lastRotationDeff.x && locationdeff.x !== 0 && locationdeff.y == lastRotationDeff.y) {
          player.setRotation({ x: lastRotationDeff.x, y: lastRotationDeff.y });
          flag(player, 'AimBot/A', config.modules.aimbotA, undefined)
        }
      } else {
        lr.set(player.id, { x: 0, y: 0 })
      };
      lr.set(player.id, { x: player.getRotation().x, y: player.getRotation().y })
    }
  });
  const EVENT2 = world.afterEvents.playerLeave.subscribe(ev => {
    lr.delete(ev.playerId)
  });
  if(!State('AIMBOTA', config.modules.aimbotA.state)) {
    system.clearRun(EVENT1);
    world.afterEvents.playerLeave.unsubscribe(EVENT2);
    lr.clear()
  }
};

export { aimbot_a }