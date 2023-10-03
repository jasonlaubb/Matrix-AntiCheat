import { world, system, GameMode, Block, Vector3 } from "@minecraft/server";
import config from '../../../data/config.js';
import { uniqueId } from '../../../util/World.js';
import { State } from '../../../util/Toggle.js';
import { flag } from "../../../util/Flag.js";

const passableBlocks = new Set(config.modules.phaseA.passableBlock);
const lastSafePos = new Map<string, Vector3>();
const playerLastPositions = new Map<string, Vector3>();

const phase_a = () => {
  const EVENT1 = system.runInterval(() => {
    for (const player of world.getPlayers({ excludeGameModes: ['spectator' as GameMode]})) {
      if(uniqueId(player) || player.hasTag('anticheat:riding')) continue;
      const UpperBlock: Block = player.dimension.getBlock({ x: Math.floor(player.location.x), y: Math.floor(player.location.y) + 1, z: Math.floor(player.location.z)});
      const LowerBlock: Block = player.dimension.getBlock({ x: Math.floor(player.location.x), y: Math.floor(player.location.y), z: Math.floor(player.location.z)});
      const soildHead: boolean = UpperBlock?.isSolid && !passableBlocks.has(UpperBlock.typeId.replace('minecraft:',''));
      const soildFeet: boolean = LowerBlock?.isSolid && !passableBlocks.has(LowerBlock.typeId.replace('minecraft:',''));
      if(soildHead && soildFeet) {
        if(playerLastPositions.get(player.id) !== undefined) {
          if(playerLastPositions.get(player.id).x !== Math.floor(player.location.x) || playerLastPositions.get(player.id).z !== Math.floor(player.location.z)) {
            playerLastPositions.delete(player.id);
            player.teleport(lastSafePos.get(player.id));
            player.applyDamage(6);
            flag(player, 'Phase/A', config.modules.phaseA, undefined)
          }
        }
      } else {
        lastSafePos.set(player.id, { x: Math.floor(player.location.x), y: Math.floor(player.location.y), z: Math.floor(player.location.z)})
      }
    }
  });
  const EVENT2 = world.afterEvents.playerLeave.subscribe(ev => {
    playerLastPositions.delete(ev.playerId);
    lastSafePos.delete(ev.playerId);
  });
  if(!State('PHASEA', config.modules.phaseA.state)) {
    system.clearRun(EVENT1);
    world.afterEvents.playerLeave.unsubscribe(EVENT2)
  }
};

export { phase_a }