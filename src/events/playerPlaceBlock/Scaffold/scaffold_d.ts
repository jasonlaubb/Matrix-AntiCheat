import { world, system, Player, Block } from "@minecraft/server";
import config from "../../../data/config.js";
import { addScore, clearScore, flag, getGamemode, getScore, punish, uniqueId } from "../../../util/World.js";

const lastBlockPlace = new Map<string, number>();

const scaffold_d = () => {
  const EVENT1 = world.beforeEvents.playerPlaceBlock.subscribe(ev => {
    const player: Player = ev.player;
    if(uniqueId(player) || player.getEffect('speed') || player.getEffect('jump_boost') || getGamemode(player) == 1) return;
    const blockUnder: Block = player.dimension.getBlock({ x: player.location.x, y: player.location.y - 1, z: player.location.z });
    const block: Block = ev.block;
    if(blockUnder !== block) return;
    if(lastBlockPlace.get(player.id) < 0 || Date.now() - lastBlockPlace.get(player.id) > 1) {
      clearScore(player, 'anticheat:scaffoldDblockPlaced');
      lastBlockPlace.set(player.id, Date.now() - lastBlockPlace.get(player.id));
      return
    };
    addScore(player, 'anticheat:scaffoldDblockPlaced', 1);
    system.runTimeout(() => {
      addScore(player, 'anticheat:scaffoldDblockPlaced', -1);
    }, 20);
    if(getScore(player, 'anticheat:scaffoldDblockPlaced') > config.modules.scaffoldD.maxBlockBreakPerSecond) {
      addScore(player, 'anticheat:scaffoldDVl', 1);
      flag(player, 'Scaffold/A', getScore(player, 'anticheat:scaffoldDVl'));
      player.teleport(player.location);
      if(getScore(player, 'anticheat:scaffoldDVl') > config.modules.scaffoldD.VL) {
        clearScore(player, 'anticheat:scaffoldDVl');
        punish(player, 'Scaffold/A', config.modules.scaffoldD.punishment);
      }
    }
  });
  if(!config.modules.scaffoldD.state) {
    world.beforeEvents.playerPlaceBlock.unsubscribe(EVENT1);
    lastBlockPlace.clear()
  }
};

export { scaffold_d }