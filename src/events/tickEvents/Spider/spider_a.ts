import { world, system, GameMode } from "@minecraft/server";
import config from "../../../data/config.js";
import { uniqueId } from "../../../util/World.js";
import { State } from '../../../util/Toggle.js';
import { flag } from "../../../util/Flag.js";

const LocationData = new Map();
const DeffData = new Map();

const spider_a = () => {
  const EVENT1 = system.runInterval(() => {
    for (const player of world.getPlayers({ excludeGameModes: ['creative' as GameMode, 'spectator' as GameMode] })) {
      if (uniqueId(player) || player.hasTag('anticheat:riding') || player.isClimbing || player.isFlying || player.hasTag('anticheat:levitating')) {
        continue;
      }
      const isBlockUnderAir = player.dimension.getBlock({ x: Math.floor(player.location.x), y: Math.floor(player.location.y) - 1, z: Math.floor(player.location.z) })?.isAir && player.dimension.getBlock({ x: Math.floor(player.location.x), y: Math.floor(player.location.y) - 2, z: Math.floor(player.location.z) })?.isAir;
      if (player.getVelocity().y > 0 && isBlockUnderAir && player.isJumping) {
        if (LocationData.get(player.id) !== undefined) {
          const yDeff = player.location.y - LocationData.get(player.id);
          if (DeffData.get(player.id) === undefined) {
            DeffData.set(player.id, 0);
          }
          if (yDeff === DeffData.get(player.id)) {
            player.teleport({ x: player.location.x, y: player.location.y - 2, z: player.location.z });
            player.applyDamage(6);
            flag(player, 'Spider/A', config.modules.spiderA, [`Deff=${DeffData.get(player.id)}`])
          }
        }
      }
    }
  });
  const EVENT2 = world.afterEvents.playerLeave.subscribe(ev => {
    LocationData.delete(ev.playerId);
  });

  if (!State('SPIDERA', config.modules.spiderA.state)) {
    LocationData.clear();
    DeffData.clear();
    system.clearRun(EVENT1);
    world.afterEvents.playerLeave.unsubscribe(EVENT2);
  }
};

export { spider_a }