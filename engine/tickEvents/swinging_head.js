import { world, system } from '@minecraft/server';

const swinging_head = () => {
  system.runInterval(() => {
    for(const player of world.getPlayers()) {
      if(player.lastrotation.x != player.getRotation().x || player.lastrotation.y != player.getRotation().y) {
        player.addTag(`anticheat:swinging_head`)
      } else player.removeTag('anticheat:swinging_head')
    }
  })
};

export { swinging_head }