import * as Minecraft from '@minecraft/server';

export function flag (player, modules, VL, punishment) {
  Minecraft.world.sendMessage(`§e${player.name} §7has failed to use §c${modules} §6VL=${VL}`);
};

export function punish (player, modules, punishment) {
  Minecraft.system.run(() => {
    Minecraft.world.sendMessage(`§e${player.name} §7get §c${punishment} §7as he reached the VL limit`)
  })
};

export function uniqueId (player) {
  if(player.isOp()) {
    return true;
  } else return false;
};

function scoreboardDeBug(player) {
  if(Minecraft.world.scoreboard.getObjective(scoreboard) == undefined){
    Minecraft.world.scoreboard.addObjective(scoreboard, scoreboard);
  };
  if(player !== null && !world.scoreboard.getObjective(scoreboard).hasParticipant(player)){
    Minecraft.world.scoreboard.getObjective(scoreboard).setScore(player, 0);
  };
};

export function getScore (player, scoreboard) {
  scoreboardDeBug(player);
  return Minecraft.world.scoreboard.getObjective(scoreboard).getScore(player);
};

export function addScore (player, scoreboard, value) {
  scoreboardDeBug(player);
  const score = world.scoreboard.getObjective(scoreboard).getScore(player);
  Minecraft.world.scoreboard.getObjective(scoreboard).setScore(player, score + value);
};

export function clearScore (player, scoreboard) {
  scoreboardDeBug(player);
  Minecraft.world.scoreboard.getObjective(scoreboard).setScore(player, 0);
};

export function getGamemode(player) {
  const gamemodes = {
    survival: 0,
    creative: 1,
    adventure: 2,
    spectator: 3
  };
  
  for (const gamemode in GameMode) {
    if ([...world.getPlayers({
      name: player.name,
      gameMode: GameMode[gamemode]
    })].length > 0) return gamemodes[GameMode[gamemode]]
  }
};

export function isAllBlockAir(player, startpos, endpos) {
  let blocks = [];
  for(let ix = 0; ix <= endpos.x - startpos.x; ix++){
    const x = startpos.x + iy;
    for(let iy = 0; iy <= endpos.y - startpos.y; iy++){
      const y = startpos.y + iy;
      for(let iz = 0; iz <= endpos.z - startpos.z; iz++){
        const z = startpos.z + iz;
        if(player.dimension.getBlock({ x: x, y: y, z: z}).typeId !== "minecraft:air") {
          return false
        }
      }
    }
  };
  return true
}