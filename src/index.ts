import {
  Player,
  DynamicPropertiesDefinition,
  Block,
  world,
  system,
  Entity
} from '@minecraft/server';

import Util from './util/Util.js';
import { ModuleClass } from './data/class.js';
import config from './data/config.js';

const hitList = new Map<string, any>();

/* DataBase */
world.afterEvents.worldInitialize.subscribe(ev => {
  /* Admin Data */
  const ADMIN_DATA = new DynamicPropertiesDefinition().defineBoolean('NAC:admin_data');
  ev.propertyRegistry.registerEntityTypeDynamicProperties(ADMIN_DATA, 'minecraft:player');
});

const definedTempTag = [
  'NAC:flyAstop'
];

/* player Spawn */
world.afterEvents.playerSpawn.subscribe(ev => {
  const player = ev.player;
  if (ev.initialSpawn) {
    definedTempTag.forEach(tag => {
      if (player.hasTag(tag)) {
        player.removeTag(tag)
      }
    })
  }
});

/* PlayerLeave */
world.afterEvents.playerLeave.subscribe(ev => {
  /* clear leave player VL */
  const player: string = ev.playerId;
  Util.flagClear(player);
  hitList.delete(player)
});

/* Util thing */
const flag: (player: Player, module: ModuleClass, information: string) => void = Util.flag;
const isAdmin: (player: Player) => boolean = Util.isAdmin;
const getGamemode: (player: Player) => number = Util.getGamemode;

/* system Event */
system.runInterval(() => {
  for (const player of world.getAllPlayers()) {
    if (isAdmin(player)) continue;

    /* Fly Checks */
    if (config.moduleTypes.flyChecks) {
      /* FlyA - checks if player flying with incorrect gamemode */
      if (config.modules.flyA.class.state && !player.hasTag('NAC:flyAstop') && player.isFlying && (getGamemode(player) !== 1 && getGamemode(player) !== 3) && !player.hasTag('NAC:canfly')) {
        player.clearVelocity();
        player.applyDamage(6);
        player.addTag('NAC:flyAstop');
        system.runTimeout(() => player.removeTag('NAC:flyAstop'), 10);
        flag(player, config.modules.flyA.class, `GameMode=${getGamemode(player)}`)
      };

      /* FlyB - checks for negative fall distance, Credit to Scythe AntiCheat */
      if (config.modules.flyB.class.state && player.fallDistance < -1 && !player.isFlying && !player.isClimbing && !player.isSwimming && !player.isJumping && !player.hasTag('NAC:trident')) {
        player.clearVelocity();
        player.applyDamage(6);
        flag(player, config.modules.flyB.class, `fallDistance=${player.fallDistance}`)
      }
    }
  }
}, 0);

/* BlockPlace AfterEvent */
world.afterEvents.playerPlaceBlock.subscribe(ev => {
  const player: Player = ev.player;
  if (isAdmin(player)) return;
  const block: Block = ev.block;
  const roatation = player.getRotation();

  /* scaffold checks */
  if (config.moduleTypes.scaffold && player.dimension.getBlock({ x: Math.floor(player.location.x), y: Math.floor(player.location.y) - 1, z: Math.floor(player.location.z)}) === block) {
    /* scaffoldA - checks if player place block without looking at it */
    if (config.modules.scaffoldA.class.state && !(player.getBlockFromViewDirection()?.block === block)) {
      flag(player, config.modules.scaffoldA.class, 'undefined');
    };

    /* scaffoldB - checks for bypass-like placement, Credit to Isolate AntiCheat */
    if (config.modules.scaffoldB.class.state && roatation.x === 60) {
      flag(player, config.modules.scaffoldB.class, `roatation=${roatation.x}`)
    };

    /* scaffoldC - checks for player rotation, Credit to Isolate AntiCheat */
    if (config.modules.scaffoldC.class.state && roatation.x <= 45) {
      flag(player, config.modules.scaffoldC.class, `rotation=${roatation.x}`)
    };

    /* scaffoldD - checks for non-human briging action */
    if (config.modules.scaffoldD.class.state && player.isSprinting && Util.getAngleWithRotation(player, player.location, block.location) > 120) {
      flag(player, config.modules.scaffoldD.class, `rotation=${roatation.y}`)
    }
  }
});

class hitListType {
  id: string;
  time: number
};

/* entityHitEntiy Event */
world.afterEvents.entityHitEntity.subscribe(ev => {
  const player: Player = ev.damagingEntity as Player;
  if (player.typeId !== 'minecraft:player' || isAdmin(player)) return;
  const hitEntity: Entity = ev.hitEntity;

  /* KillAura Checks */
  if (config.moduleTypes.killaura) {
    /* killauraA - Checks if player attack an entity out of their view */
    if (config.modules.killauraA.class.state && Util.getAngleWithRotation(player, player.location, hitEntity.location) > config.modules.killauraA.setting.maxAttackAngle && Util.getVector2Distance(player.location, hitEntity.location) > 2) {
      flag(player, config.modules.killauraA.class, `AttackAngle=${Util.getAngleWithRotation(player, player.location, hitEntity.location)}`);
    };

    /* killauraB - Checks for multi aura */
    if (config.modules.killauraB.class.state) {
      const HittedEntity: Array<hitListType> = hitList.get(player.id) ?? [];
      const HitListNow: Array<hitListType> = HittedEntity.filter(f => Date.now() - f.time < config.modules.killauraB.setting.validTime);
      //@ts-expect-error
      if (HitListNow.filter(f => f.id === hitEntity.id).length === 0) hitList.set(player.id, hitList.get(HitListNow).push([{id: hitEntity.id, time: Date.now()}]));
      if (hitList.get(player.id).length > config.modules.killauraB.setting.maxAttackInTick) {
        hitList.delete(player.id);
        flag(player, config.modules.killauraB.class, 'undefined')
      }
    }
  }
})