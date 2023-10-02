import { Block, Player, world } from '@minecraft/server';
import config from '../../../data/config.js';
import { uniqueId, getGamemode } from '../../../util/World.js';
import { State } from '../../../util/Toggle.js';
import { flag } from '../../../util/Flag.js';

const tower_a = () => {
  const EVENT = world.beforeEvents.playerPlaceBlock.subscribe(ev => {
    const player: Player = ev.player;
    if(uniqueId(player)) return;
    const block: Block | undefined = player.dimension.getBlock({x: Math.floor(player.location.x), y: Math.floor(player.location.y) - 1, z: Math.floor(player.location.z)});
    const realblock: Block = ev.block;
    if(player.isJumping && !player.isFlying && !player.getEffect("jump_boost") && getGamemode(player) !== 1 && block === realblock) {
      const locationDeff = player.location.y - Math.floor(Math.abs(player.location.y));
      if(locationDeff > config.modules.towerA.maxLocationDeff) {
        ev.cancel = true;
        flag(player, 'Tower/A', config.modules.towerA, [`LocationDeff=${locationDeff}`])
      }
    }
  });
  if(!State('TOWERA', config.modules.towerA.state)) {
    world.beforeEvents.playerPlaceBlock.unsubscribe(EVENT);
  };
};

export { tower_a }