import { world, system, Player, GameMode, Vector3, Block, Entity } from '@minecraft/server';

export function flag (player: Player, modules: string, VL: number) {
  world.sendMessage(`§e${player.name} §7has failed to use §c${modules} §6VL=${VL}`);
};

export function punish (player: Player, modules: string, punishment: string) {
  system.run(() => {
    world.sendMessage(`§e${player.name} §7punished by §c${modules} §7 since reached VL limit`)
  })
};

export function stop (modules: string, type: string, value: String) {
  world.sendMessage(`§eWorld §7has stopped §c${modules} §8(${type}=${value})`)
};

export function uniqueId (player: Player) {
  if(player.isOp()) {
    return true;
  } else return false;
};

function scoreboardDeBug(player: Player, scoreboard: string) {
  if(world.scoreboard.getObjective(scoreboard) == undefined){
    world.scoreboard.addObjective(scoreboard, scoreboard);
  };
  if(player !== null && !world.scoreboard.getObjective(scoreboard).hasParticipant(player)){
    world.scoreboard.getObjective(scoreboard).setScore(player, 0);
  };
};

export function getScore (player: Player, scoreboard: string) {
  scoreboardDeBug(player, scoreboard);
  return world.scoreboard.getObjective(scoreboard).getScore(player);
};

export function addScore (player: Player, scoreboard: string, value: number) {
  scoreboardDeBug(player, scoreboard);
  const score = world.scoreboard.getObjective(scoreboard).getScore(player);
  world.scoreboard.getObjective(scoreboard).setScore(player, score + value);
};

export function clearScore (player: Player, scoreboard: string) {
  scoreboardDeBug(player, scoreboard);
  world.scoreboard.getObjective(scoreboard).setScore(player, 0);
};

export function getGamemode(player: Player) {
  const gamemodes = {
    survival: 0,
    creative: 1,
    adventure: 2,
    spectator: 3
  };
  
  for (const gamemode in GameMode) {
    if ([...world.getPlayers({
      name: player.name,
//@ts-ignore
      gameMode: GameMode[gamemode]
//@ts-ignore
    })].length > 0) return Number(gamemodes[GameMode[gamemode]])
  };
  return 0
};

export function isAllBlockAir(player: Player, startpos: Vector3, endpos: Vector3) {
  for(let ix = 0; ix <= endpos.x - startpos.x; ix++){
    const x = startpos.x + ix;
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
};

export function revertBlock(block: Block) {
  const items: Entity[] = world.getDimension(String(block.dimension)).getEntities({
    location: block.location,
    type: 'minecraft:item',
    minDistance: 0,
    maxDistance: 2
  });
  for(const item of items){
    item.kill()
  };
  block.setPermutation(block.permutation.clone());
}