import { world, system } from '@minecraft/server';
import { uniqueId, getGamemode, isAllBlockAir } from '../../../util/World.js';
import config from '../../../data/config.js';
import { State } from '../../../util/Toggle.js';
import { flag } from '../../../util/Flag.js';

const fly_b = () => {
  const EVENT = system.runInterval(() => {
    for(const player of world.getPlayers()) {
      if(uniqueId(player) || player.isFlying) continue
      if(Math.abs(player.getVelocity().y).toFixed(4) == "0.1552" && getGamemode(player) !== 1 && !player.isJumping && !player.isGliding && !player.isFlying && !player.hasTag('anticheat:riding') && !player.hasTag('anticheat:levitating') && player.hasTag('anticheat:moving')) {
        if(!player.isOnGround) {
          const startpos = { x: Math.trunc(player.location.x - 2), y: Math.trunc(player.location.y - 1), z: Math.trunc(player.location.z - 2) };
          const endpos = { x: Math.trunc(player.location.x + 2), y: Math.trunc(player.location.y + 2), z: Math.trunc(player.location.z + 2) };
          const inAirState = isAllBlockAir(player, startpos, endpos);
          if(inAirState) {
            player.applyDamage(6);
            flag(player, 'Fly/B', config.modules.flyB, [`y=0.1552`]);
          }
        }
      }
    };
    if(!State('FLYB', config.modules.flyB.state)) {
      system.clearRun(EVENT)
    }
  })
};

export { fly_b }