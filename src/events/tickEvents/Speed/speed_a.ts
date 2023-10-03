import { world, system, GameMode } from "@minecraft/server";
import config from "../../../data/config.js";
import { uniqueId } from "../../../util/World.js";
import { State } from '../../../util/Toggle.js';
import { flag } from "../../../util/Flag.js";

const speedData = new Map<string, any>();

const speed_a = () => {
  const EVENT1 = system.runInterval(() => {
    for (const player of world.getPlayers({ excludeGameModes: ['creative' as GameMode, 'spectator' as GameMode] })) {
      if (uniqueId(player) || player.hasTag('anticheat:damaged')) continue;
      if (player.isGliding || player.getEffect("speed") || player.hasTag("three") || player.hasTag("four")) {
        speedData.set(player.id, { initialLocation: player.location });
        continue;
      }
      const { x, z } = player.getVelocity();
      const playerSpeedMph: number = Math.sqrt(x ** 2 + z ** 2) * 72000 / 1609.34;
      if (playerSpeedMph === 0) {
        speedData.set(player.id, { initialLocation: player.location});
      } else if (playerSpeedMph > config.modules.speedA.maxSpeed && speedData.has(player.id)) {
        const playerInfo: any = speedData.get(player.id);
      if (!playerInfo.highestSpeed) {
        player.teleport(playerInfo, { dimension: player.dimension, rotation: { x: -180, y: 0 } });
        playerInfo.highestSpeed = playerSpeedMph;
        flag(player, 'Speed/A', config.modules.speedA ,[`SpeedMph=${playerSpeedMph.toFixed(3)}`])
      }
      } else if (playerSpeedMph <= config.modules.speedA.maxSpeed && speedData.has(player.id)) {
        const playerInfo = speedData.get(player.id);
        playerInfo.highestSpeed = 0;
      }
    }
  });
  const EVENT2 = world.afterEvents.playerLeave.subscribe(ev => {
    speedData.delete(ev.playerId);
  });

  if(!State('SPEEDA', config.modules.speedA.state)) {
    speedData.clear();
    system.clearRun(EVENT1);
    world.afterEvents.playerLeave.unsubscribe(EVENT2)
  }
};

export { speed_a }