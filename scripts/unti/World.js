import { world, system, GameMode } from '@minecraft/server';

export function flag (player, modules, VL, punishment) {
  world.sendMessage(`§e${player.name} §7has failed to use §c${modules} §6VL=${VL}`);
};

export function punish (player, modules, punishment) {
  system.run(() => {
    world.sendMessage(`§e${player.name} §7get §c${punishment} §7as he reached the VL limit`)
  })
};

export function uniqueId (player) {
  if(player.isOp()) {
    return true;
  } else return false;
};

function scoreboardDeBug(player) {
  if(world.scoreboard.getObjective(scoreboard) == undefined){
    world.scoreboard.addObjective(scoreboard, scoreboard);
  };
  if(player !== null && !world.scoreboard.getObjective(scoreboard).hasParticipant(player)){
    world.scoreboard.getObjective(scoreboard).setScore(player, 0);
  };
};

export function getScore (player, scoreboard) {
  scoreboardDeBug(player);
  return world.scoreboard.getObjective(scoreboard).getScore(player);
};

export function addScore (player, scoreboard, value) {
  scoreboardDeBug(player);
  const score = world.scoreboard.getObjective(scoreboard).getScore(player);
  world.scoreboard.getObjective(scoreboard).setScore(player, score + value);
};

export function clearScore (player, scoreboard) {
  scoreboardDeBug(player);
  world.scoreboard.getObjective(scoreboard).setScore(player, 0);
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