import { world, system, Entity } from '@minecraft/server';

const hurt_event = () => {
  world.afterEvents.entityHurt.subscribe(ev => {
    const player: Entity = ev.hurtEntity;
    if(player.typeId !== 'minecraft:player') return;
    const reason = ev.damageSource.cause;
    if(reason !== 'entityAttack' && reason !== 'entityExplosion') return;
    if(!player.hasTag('anticheat:damaged')) {
      player.addTag('anticheat:damaged');
      system.runTimeout(() => {
        player.removeTag('anticheat:damaged')
      }, 10)
    }
  })
};

export { hurt_event }