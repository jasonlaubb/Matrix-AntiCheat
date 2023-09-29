import config from "../../../data/config.js";
import { world, system, Vector2 } from '@minecraft/server';
import { addScore, clearScore, getScore, punish, uniqueId } from "../../../util/World";
import { flag } from "../../../util/World";

const PrevLocation = new Map<string, Vector2>();
const oldDeff = new Map<string, number>();
const Buffer = new Map<string, number>();

const aimbot_b = () => {
  const EVENT1 = system.runInterval(() => {
    for(const player of world.getAllPlayers()) {
      if(uniqueId(player)) continue;
      const lastLocation: Vector2 = PrevLocation.get(player.id) || { x: 0, y: 0 };
      const LocationDeff: Vector2 = { x: player.getRotation().x - lastLocation.x, y: player.getRotation().y - lastLocation.y };
      const currentDeff: number = Math.sqrt(LocationDeff.x ** 2 + LocationDeff.y ** 2);
      const OldDeff = oldDeff.get(player.id) || 0;
      if ((LocationDeff.x > 2 || LocationDeff.y > 2) && Math.abs(currentDeff - OldDeff) <= 0.06 && Math.abs(currentDeff - OldDeff) >= 0) {
        const buffer = Buffer.get(player.id) || 0;
        Buffer.set(player.id, buffer + 1);
        if (Buffer.get(player.id) > config.modules.aimbotB.buffer) {
          Buffer.delete(player.id);
          addScore(player, 'anticheat:aimbotBVl', 1);
          flag(player, 'AimBot/B', getScore(player, 'anticheat:aimbotBVl'), [`deff=${Math.abs(currentDeff - OldDeff)}`]);
          if(getScore(player, 'anticheat:aimbotBVl') > config.modules.aimbotB.VL) {
            clearScore(player, 'anticheat:aimbotBVl');
            punish(player, 'AimBot/B', config.modules.aimbotB.punishment)
          }
        }
      };
      PrevLocation.set(player.id, { x: player.getRotation().x, y: player.getRotation().y });
      oldDeff.set(player.id, currentDeff)
    }
  });
  const EVENT2 = world.afterEvents.playerLeave.subscribe(ev => {
    PrevLocation.delete(ev.playerId);
    Buffer.delete(ev.playerId);
    oldDeff.delete(ev.playerId)
  });
  if(!config.modules.aimbotB.state) {
    system.clearRun(EVENT1);
    world.afterEvents.playerLeave.unsubscribe(EVENT2);
    PrevLocation.clear();
    oldDeff.clear();
    Buffer.clear()
  }
};

export { aimbot_b }