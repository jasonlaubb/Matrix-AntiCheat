import { world, Player, GameMode, Vector3, Block, Entity } from '@minecraft/server';

/*
export function flag (player: Player, modules: string, VL: number, Info?: Array<string>) {
  if(!config.system.notify.onFlag) return;
  if(Info == undefined) {
    world.sendMessage(`§dNokararos §f> §e${player.name} §7has failed §c${modules} §6VL=${VL}`);
  } else {
    world.sendMessage(`§dNokararos §f> §e${player.name} §7has failed §c${modules} §6VL=${VL} §9(${Info.join(', ')})`);
  }
};
*/

export function uniqueId (player: Player) {
  if(player.hasTag('admin')) {
    return true;
  } else return false;
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
//@ts-expect-error
      gameMode: GameMode[gamemode]
//@ts-expect-error
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

export function isAllBlockLiquid(player: Player, startpos: Vector3, endpos: Vector3) {
  for(let ix = 0; ix <= endpos.x - startpos.x; ix++){
    const x = startpos.x + ix;
    for(let iy = 0; iy <= endpos.y - startpos.y; iy++){
      const y = startpos.y + iy;
      for(let iz = 0; iz <= endpos.z - startpos.z; iz++){
        const z = startpos.z + iz;
        if(!player.dimension.getBlock({ x: x, y: y, z: z})?.isLiquid) {
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
};

export function getClosestPlayer(entity: Entity) {
  try {
    if(typeof entity !== "object") throw TypeError
    const nearestPlayer = [...entity.dimension.getPlayers({
      closest: 1,
      location: {x: entity.location.x, y: entity.location.y, z: entity.location.z}
    })][0];
    return nearestPlayer;
  } catch {
    return undefined
  }
};

export function getTimePeriod(ms: number) {
  return {
    days: Math.floor(ms / 86400000),
    hours: Math.floor((ms % 86400000) / 3600000),
    minutes: Math.floor((ms % 3600000) / 60000),
    seconds: Math.floor((ms % 6000) / 1000)
  };
};

export function newRandom(length: number) {
  let index = '';
  const strings = ("0123456789qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM").split('');
  for(let i = 0; i < length; i++) {
    const random = Math.trunc(Math.random() * 62);
    index += strings[random]
  }
  return index
}