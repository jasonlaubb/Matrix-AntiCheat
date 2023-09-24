import { world, system, GameMode, Vector3 } from "@minecraft/server";
import config from "../../../data/config.js";
import { addScore, clearScore, flag, getScore, punish, uniqueId, isAllBlockLiquid } from "../../../util/World.js";

const LocationData = new Map<string, Vector3>();

const jesus_a = () => {
  const EVENT1 = system.runInterval(() => {
    for (const player of world.getPlayers({ excludeGameModes: ['creative' as GameMode, 'spectator' as GameMode] })) {
      if (uniqueId(player) || player.hasTag('anticheat:riding') || player.isClimbing || player.isFlying || player.getEffect('slow_falling') || player.hasTag('anticheat:levitating')) {
        continue;
      };
      const pos1: Vector3 = { x: Math.floor(player.location.x) - 1, y: Math.floor(player.location.y) - 1, z: Math.floor(player.location.z) - 1 };
      const pos2: Vector3 = { x: Math.floor(player.location.x) + 1, y: Math.floor(player.location.y) - 1, z: Math.floor(player.location.z) + 1 };
      const StandOnWater: boolean = player.dimension.getBlock(player.location)?.isAir && isAllBlockLiquid(player, pos1, pos2);
      if(StandOnWater) {
        addScore(player, 'anticheat:jesusATimeLength', 1);
        if(getScore(player, 'anticheat:jesusATimeLength') > config.modules.jesusA.maxTimeLength) {
          clearScore(player, 'anticheat:jesusATimeLength');
          player.teleport(LocationData.get(player.id));
          player.applyDamage(6);
          addScore(player, 'anticheat:jesusAVl', 1)
          flag(player, 'Jesus/A', getScore(player, 'anticheat:jesusAVl'));
          if(getScore(player, 'anticheat:jesusAVl') > config.modules.jesusA.VL) {
            clearScore(player, 'anticheat:jesusAVl');
            punish(player, 'Jesus/A', config.modules.jesusA.punishment)
          }
        }
      } else {
        clearScore(player, 'anticheat:jesusATimeLength');
        LocationData.set(player.id, player.location)
      }
    }
  });
  const EVENT2 = world.afterEvents.playerLeave.subscribe(ev => {
    LocationData.delete(ev.playerId);
  });

  if (!config.modules.jesusA.state) {
    LocationData.clear();
    system.clearRun(EVENT1);
    world.afterEvents.playerLeave.unsubscribe(EVENT2);
  }
};

export { jesus_a }