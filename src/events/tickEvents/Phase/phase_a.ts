import { world, system, Vector, Vector3, Dimension, Player, Block } from "@minecraft/server";
import config from '../../../data/config.js';
import { addScore, clearScore, flag, getGamemode, getScore, punish, uniqueId } from '../../../util/World.js';
import { playerLastPositions } from '../../../util/Map.js';

const passableBlocks = new Set(config.modules.phaseA.passableBlock);

function isSolid(position: Vector3, dimension: Dimension) {
  const block = dimension.getBlock(position);
  return block?.isSolid && !passableBlocks.has(block.typeId.replace("minecraft:", "")) && !block.type.canBeWaterlogged || false;
};

function isTopJumpable(position: Vector3, dimension: Dimension) {
  try {
    const block = dimension.getBlock({ x: position.x, y: position.y + 2, z: position.y});
    if(block.typeId == 'minecraft:air') return true;
    if(block?.isSolid && block.type.canBeWaterlogged) return true;
    if(block?.isLiquid) return true;
    return false
  } catch {
    return true
  }
};

function checkTrajectory(from: Vector3, to: Vector3, dimension: Dimension, steps = 2.5) {
  const stepVector = Vector.divide(Vector.subtract(to, from), steps);
  let currentPosition = from;

  for (let i = 0; i <= steps; i++) {
    if (isSolid(currentPosition, dimension)) {
      return true;
    }
    currentPosition = Vector.add(currentPosition, stepVector);
  }

  return false;
};

const phase_a = () => {
  const EVENT1 = world.afterEvents.playerPlaceBlock.subscribe(ev => {
    const player: Player = ev.player;
    const block: Block = ev.block;
    if(uniqueId(player) || getGamemode(player) == 1 || getGamemode(player) == 3) return;
    if(player.dimension.getBlock({ x: player.location.x, y: player.location.y - 1, z: player.location.z}) == block && !player.hasTag('anticheat:placeBlock')) {
      player.addTag('anticheat:placeBlock');
      system.runTimeout(() => {
        player.removeTag('anticheat:placeBlock')
      }, 2)
    }
  });
  const EVENT2 = system.runInterval(() => {
    for (const player of world.getAllPlayers()) {
      if(uniqueId(player) || getGamemode(player) == 1 || getGamemode(player) == 3) continue;
      const currentPosition: Vector3 = player.location;
      const lastPosition: Vector3 = playerLastPositions.get(player.id) || currentPosition;
      const previousPosition: Vector3 = Vector.subtract(currentPosition, player.getVelocity());

      const isSolidHead: boolean = isSolid(Vector.add(currentPosition, Vector.up), player.dimension);
      const isSolidFeet: boolean = isSolid(currentPosition, player.dimension);
      const isSolidTrajectory: boolean = checkTrajectory(previousPosition, currentPosition, player.dimension);

      if (!player.hasTag('anticheat:placeBlock') && (isSolidHead || isSolidFeet || isSolidTrajectory) && !player.isSwimming && !(player.isSprinting && player.hasTag('anticheat:jump') && isTopJumpable(player.location, player.dimension))) {
        player.teleport(lastPosition);
        addScore(player, 'anticheat:phaseAVl', 1);
        flag(player, 'Phase/A', getScore(player, 'anticheat:phaseAVl'));
        if(getScore(player, 'anticheat:phaseAVl') > config.modules.phaseA.VL) {
          clearScore(player, 'anticheat:phaseAVl');
          punish(player, 'Phase/A', config.modules.phaseA.punishment)
        }
      } else {
        playerLastPositions.set(player.id, currentPosition);
      }
    }
  });
  if(!config.modules.phaseA.state) {
    world.afterEvents.playerPlaceBlock.unsubscribe(EVENT1);
    system.clearRun(EVENT2)
  }
};

export { phase_a }