import { world, system, Player } from '@minecraft/server';

const join_event = () => {
  for(const player of world.getAllPlayers()) {
    player.addTag('anticheat:joining');
    system.runTimeout(() => {
      player.removeTag('anticheat:joining')
    }, 2)
  };
  world.afterEvents.playerSpawn.subscribe(ev => {
    const player: Player = ev.player;
    if(!ev.initialSpawn) return;
    player.addTag('anticheat:joining');
    system.runTimeout(() => {
      player.removeTag('anticheat:joining')
    }, 2)
  })
};

export { join_event }