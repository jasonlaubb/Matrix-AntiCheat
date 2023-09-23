import { world, system, GameMode } from "@minecraft/server";
import config from "../../../data/config.js";
import { uniqueId } from "../../../util/World.js";

//Anti Speed from Obsian Anti Cheat

const speedData = new Map<string, any>();

const speed_a = () => {
  const EVENT1 = system.runInterval(() => {
    for (const player of world.getPlayers({ excludeGameModes: ['creative' as GameMode, 'spectator' as GameMode] })) {
      if (uniqueId(player)) return;
      if (player.isGliding || player.getEffect("speed") || player.hasTag("three") || player.hasTag("four")) {
        speedData.set(player.id, { initialLocation: player.location });
            continue;
      }
      const { x, z } = player.getVelocity();
      const playerSpeedMph = Math.sqrt(x ** 2 + z ** 2) * 72000 / 1609.34;
      if (playerSpeedMph === 0) {
        speedData.set(player.id, { initialLocation: player.location});
      } else if (playerSpeedMph > config.modules.speedA.maxSpeed && speedData.has(player.id)) {
        const playerInfo = speedData.get(player.id);
      if (!playerInfo.highestSpeed) {
        player.teleport(playerInfo, { dimension: player.dimension, rotation: { x: -180, y: 0 } });
        world.sendMessage(`§u§l§¶OAC >§4 ${player.name}§c has been detected with Speed\n§r§l§¶${playerSpeedMph.toFixed(2)} mph`);
        player.applyDamage(6);
        playerInfo.highestSpeed = playerSpeedMph;
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
  if(!config.modules.speedA.state) {
    speedData.clear();
    system.clearRun(EVENT1);
    world.afterEvents.playerLeave.unsubscribe(EVENT2)
  }
};

export { speed_a }