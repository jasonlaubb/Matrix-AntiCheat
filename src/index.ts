import {
  Player,
  DynamicPropertiesDefinition,
  Block,
  world,
  system,
  Entity,
  Vector2,
  Vector3,
  EntityDamageCause
} from '@minecraft/server';

import {
  ModuleClass,
  Console
} from './data/class.js';

/* Gobal ban list*/
import gA from './data/GobalBan/Paradox_AntiCheat.js';
import gB from './data/GobalBan/Scythe_AntiCheat.js';
import gC from './data/GobalBan/MBS_DataBase.js';

const ParadoxBanned: Set<string> = new Set(gA);
const ScytheBanned: Set<string> = new Set(gB);
const MbsBanned: Set<string> = new Set(gC);

import Util from './util/Util.js';
import config from './data/config.js';
import CommandHandler from './util/CommandHandler.js';
import PunishmentController from './util/PunishmentController.js';

export const canTempkickList: Map<string, boolean> = new Map<string, boolean>();
const hitList: Map<string, any> = new Map<string, any>();
const LocationLastTick: Map<string, Vector3> = new Map<string, Vector3>();
//const VelocityLastTick: Map<string, Vector3> = new Map<string, Vector3>();
const breakRecord: Map<string, number[]> = new Map<string, number[]>();

/* DataBase */
world.afterEvents.worldInitialize.subscribe(ev => {
  /* Admin Data */
  const ADMIN_DATA = new DynamicPropertiesDefinition().defineBoolean('NAC:admin_data');
  ev.propertyRegistry.registerEntityTypeDynamicProperties(ADMIN_DATA, 'minecraft:player');
});

const definedTempTag = [
  'NAC:flyAstop',
  'NAC:nofallAstop',
  'NAC:stopNukerFlag'
];

/* player Spawn */
world.afterEvents.playerSpawn.subscribe(ev => {
  const player = ev.player;
  if (ev.initialSpawn) {
    /* GobalBan */
    if (config.modules.gobalBan.class.state) {
      let needKick: true | false = false;
      if (config.modules.gobalBan.setting.paradox && ParadoxBanned.has(player.name)) {
        if (config.notify.flagMsg)  world.sendMessage(`§dMatrix §f> §e${player.name} §7is gobalbanned §9[data=Paradox]`);
        needKick = true;
      };
      if (config.modules.gobalBan.setting.scythe && ScytheBanned.has(player.name)) {
        if (config.notify.flagMsg) world.sendMessage(`§dMatrix §f> §e${player.name} §7is gobalbanned §9[data=Scythe]`);
        needKick = true;
      };
      if (config.modules.gobalBan.setting.mbs && MbsBanned.has(player.name)) {
        if (config.notify.flagMsg) world.sendMessage(`§dMatrix §f> §e${player.name} §7is gobalbanned §9[data=MBS]`);
        needKick = true;
      };
      if (needKick) {
        PunishmentController.kick(player);
        Console.log(`(GobalBan) kicked ${player.name}`);
        return
      }
    };

    /* Remove the temp tag for player*/
    definedTempTag.forEach(tag => {
      if (player.hasTag(tag)) {
        player.removeTag(tag)
      }
    })
  }
});

/* dataDrivenEntityTriggerEvent BeforeEvents */
world.beforeEvents.dataDrivenEntityTriggerEvent.subscribe(ev => {
  const player: Player = ev.entity as Player;
  if (player.typeId !== 'minecraft:player') return;
  if (ev.id === 'NAC:tempkick') {
    if (isAdmin(player) || !(canTempkickList.get(player.id) === true)) {
      ev.cancel = true;
      Console.log(`(TempKick) stopped tempkick trigger on ${player.name}`)
    }
  }
});

/* dataDrivenEntityTriggerEvent AfterEvents */
world.afterEvents.dataDrivenEntityTriggerEvent.subscribe(ev => {
  const player: Player = ev.entity as Player;
  if (player.typeId !== 'minecraft:player') return;
  if (ev.id === 'NAC:tempkick') {
    canTempkickList.delete(player.id)
  }
});

/* PlayerLeave */
world.afterEvents.playerLeave.subscribe(ev => {
  /* clear leave player VL */
  const player: string = ev.playerId;
  Util.flagClear(player);
  hitList.delete(player);
  LocationLastTick.delete(player);
  breakRecord.delete(player)
});

/* Util thing */
const flag: (player: Player, module: ModuleClass, information: string) => void = Util.flag;
const isAdmin: (player: Player) => boolean = Util.isAdmin;
const getGamemode: (player: Player) => number = Util.getGamemode;

/* system Event */
system.runInterval(() => {
  for (const player of world.getAllPlayers()) {
    if (isAdmin(player)) continue;
    const lastLocation: Vector3 = LocationLastTick.get(player.id) ?? player.location;
    const velocity: Vector3 = player.getVelocity();
    //const lastVelocity: Vector3 = VelocityLastTick.get(player.id) ?? velocity;

    /* Fly Checks */
    if (config.moduleTypes.flyChecks) {
      /* FlyA - checks if player flying with incorrect gamemode */
      if (config.modules.flyA.class.state && !player.hasTag('NAC:flyAstop') && player.isFlying && (getGamemode(player) !== 1 && getGamemode(player) !== 3) && !player.hasTag('NAC:canfly')) {
        player.teleport(lastLocation);
        player.applyDamage(6);
        player.addTag('NAC:flyAstop');
        system.runTimeout(() => player.removeTag('NAC:flyAstop'), 40);
        flag(player, config.modules.flyA.class, `GameMode=${getGamemode(player)}`)
      };

      /* FlyB - checks for negative fall distance, Credit to Scythe AntiCheat */
      if (config.modules.flyB.class.state && player.fallDistance < -1 && !player.isFlying && !player.isClimbing && !player.isSwimming && !player.isJumping && !player.hasTag('NAC:trident')) {
        flag(player, config.modules.flyB.class, `fallDistance=${player.fallDistance}`);
        player.teleport(lastLocation);
        player.applyDamage(6);
      }
    };

    /* movement checks */
    if (config.moduleTypes.movement) {
      /* NoFallA - checks for player y-velocity */
      if (config.modules.nofallA.class.state && velocity.y === 0 && !player.hasTag('NAC:nofallAstop') && !player.hasTag('NAC:levitating') && Util.isPlayerOnAir(player.location, player.dimension) && !player.isFlying && !player.hasTag('NAC:riding')) {
        player.teleport(lastLocation);
        player.addTag('NAC:nofallAstop');
        system.runTimeout(() => player.removeTag('NAC:nofallAstop'), 60);
        flag(player, config.modules.nofallA.class, 'undefined')
      }
    };

    LocationLastTick.set(player.id, player.location)
  }
}, 0);

/* ChatSend BeforeEvent */
world.beforeEvents.chatSend.subscribe(ev => {
  const message: string = ev.message;
  const player: Player = ev.sender;
  if (message.startsWith(config.commands.setting.prefix)) {
    system.run(() => CommandHandler.Select(message, isAdmin(player), player));
    ev.cancel = true;
    return
  }
});

/* BlockBreak BeforeEvent */
world.beforeEvents.playerBreakBlock.subscribe(ev => {
  const player: Player = ev.player;
  if (isAdmin(player)) return;

  /* nukerA - checks if player break too many block in a tick */
  if (config.modules.nukerA.class.state) {
    if (player.hasTag('NAC:stopNukerFlag')) {
      ev.cancel = true;
      return
    };

    const blockBreak: number[] = breakRecord.get(player.id)! ?? [];
    breakRecord.set(player.id, [...blockBreak, Date.now()].filter(index => Date.now() - index > config.modules.nukerA.setting.validTime));

    if (breakRecord.get(player.id)!.length > config.modules.nukerA.setting.maxBreakInTick) {
      breakRecord.delete(player.id);
      player.addTag('NAC:stopNukerFlag');
      system.runTimeout(() => player.removeTag('NAC:stopNukerFlag'), 100);
      system.run(() => flag(player, config.modules.nukerA.class, 'undefined'))
    }
  }
});

/* BlockPlace AfterEvent */
world.afterEvents.playerPlaceBlock.subscribe(ev => {
  const player: Player = ev.player;
  if (isAdmin(player)) return;
  const block: Block = ev.block;
  const roatation: Vector2 = player.getRotation();
  const veloctiy: Vector3 = player.getVelocity();

  const playerSpeed: number = Math.sqrt(veloctiy.x ** 2 + veloctiy.z ** 2);
  const walkingSpeed: number = 0.10000000149011612;

  /* scaffold checks */
  const blockBelow: Block = player.dimension.getBlock({x: Math.floor(player.location.x), y: Math.floor(player.location.y) - 1, z: Math.floor(player.location.z)})!;
  if (config.moduleTypes.scaffold) {
    const isBlockUnder: boolean = (blockBelow.x === block.x && blockBelow.y === block.y && blockBelow.z === block.z)
    /* scaffoldA - checks if player place block without view */
    if (config.modules.scaffoldA.class.state && isBlockUnder) {
      const blockView: Block = player.getBlockFromViewDirection()?.block!;
      if (block.location.x !== blockView.location.x || block.location.y !== blockView.location.y || block.location.z !== blockView.location.z) {
        flag(player, config.modules.scaffoldA.class, 'undefined');
      }
    };

    /* scaffoldB - checks for bypass */
    if (config.modules.scaffoldB.class.state && isBlockUnder && roatation.x === 60) {
      flag(player, config.modules.scaffoldB.class, `roatation=${roatation.x}`)
    };

    /* scaffoldC - checks for player rotation, Credit to Isolate AntiCheat */
    if (config.modules.scaffoldC.class.state && isBlockUnder && roatation.x <= 45 && playerSpeed >= walkingSpeed) {
      flag(player, config.modules.scaffoldC.class, `rotation=${roatation.x}`)
    };

    /* scaffoldD - checks for cubecraft bypass */
    if (config.modules.scaffoldD.class.state && Util.getVector2Distance(player.location, block.location) > config.modules.scaffoldD.setting.distance) {
      const Angle: number = Util.getAngleWithRotation(player, player.location, block.location);
      if (Angle > config.modules.scaffoldD.setting.maxPlaceAngle) {
        flag(player, config.modules.scaffoldD.class, `angle=${Angle}`);
      }
    }
  };
});

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
      const HittedEntity: any[] = hitList.get(player.id) ?? [];
      const HitListNow: any[] = HittedEntity.filter(f => Date.now() - f.time < config.modules.killauraB.setting.validTime);
      if (HitListNow.filter(f => f.id === hitEntity.id).length === 0) {
        hitList.set(player.id, [...HitListNow, { id: hitEntity.id, time: Date.now() }]);
      };
      if (hitList.get(player.id)?.length > config.modules.killauraB.setting.maxAttackInTick) {
        hitList.delete(player.id);
        flag(player, config.modules.killauraB.class, 'undefined');
      }
    }
  };
});

/* EntityHurt Event */
world.afterEvents.entityHurt.subscribe(ev => {
  const player: Player = ev.hurtEntity as Player;
  if (player.typeId !== 'minecraft:player' || isAdmin(player)) return;
  /* fallDamageA - Checks if player apply illegal fall damage */
  if (config.modules.fallDamageA.class.state && ev.damageSource.cause === EntityDamageCause.fall && Util.isPlayerOnAir(player.location, player.dimension)) {
    flag(player, config.modules.fallDamageA.class, 'undefined')
  }
})

Console.log('(NAC) scripts loaded')