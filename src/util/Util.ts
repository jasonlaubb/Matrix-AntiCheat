import config from '../data/config.js';
import {
  Player,
  world,
  Vector3,
  GameMode, 
  Dimension,
  Vector} from '@minecraft/server';
import { Console, ModuleClass } from '../data/class.js';
import PunishmentController from './PunishmentController.js';

const GOBAL_VL = new Map<string, number>();
const CLEAR_VL = new Map<string, string[]>();

export default class {
  static flag(player: Player, module: ModuleClass, information: string) {
    let flagVL: number = GOBAL_VL.get(`${player.id}+${module.name}`) ?? 0;
    flagVL += 1;
    GOBAL_VL.set(`${player.id}+${module.name}`, flagVL);
    const clearvl: string[] = CLEAR_VL.get(player.id) ?? [];
    if (clearvl.includes(module.name)) {
      const clearvl: Array<string> = CLEAR_VL.get(player.id) ?? [];
      CLEAR_VL.set(player.id, [...clearvl, module.name])
    };

    if (config.notify.flagMsg) {
      const showingInformation: string = information === "undefined" ? '' : ` §9[${information}]`;
      world.sendMessage(`§dNokararos §f> §e${player.name} §7failed §e${module.name}${showingInformation} §7VL=${flagVL}`);
    };

    if (flagVL >= module.minVL) {
      switch (module.punishment == 'default' ? config.settings.defaultPunishment : module.punishment) {
        case "none": { };
        case "kick": {
          PunishmentController.kick(player);
        };
        case "tempkick": {
          PunishmentController.tempkick(player);
        };
        default: {
          Console.log('(Flag) invalid punishment')
        }
      }
    }
  };

  static flagClear (player: string) {
    const clearvl: Array<string> = CLEAR_VL.get(player) ?? [];
    if (clearvl.length <= 0) return false;
    clearvl.forEach(m => GOBAL_VL.delete(`${player}+${m}`));
    CLEAR_VL.delete(player);
    return true
  };

  static isAdmin (player: Player) {
    try {
      return player.getDynamicProperty('NAC:admin_data') === true ? true : false
    } catch {
      return false
    }
  };

  static getGamemode(player: Player) {
    const gamemodes: { [key: string]: number } = {
      survival: 0,
      creative: 1,
      adventure: 2,
      spectator: 3
    };
  
    for (const gamemode in GameMode) {
      if (
        [...world.getPlayers({
          name: player.name,
          gameMode: GameMode[gamemode as GameMode]
        })].length > 0
      ) {
        return Number(gamemodes[GameMode[gamemode as GameMode]]);
      }
    }
    return 0;
  };

  static getAngleWithRotation (player: Player, pos1: Vector3, pos2: Vector3) {
    let angle: number = Math.atan2((pos2.z - pos1.z), (pos2.x - pos1.x)) * 180 / Math.PI - player.getRotation().y - 90;
    if (angle <= -180) angle += 360;
    angle = Math.abs(angle);
    return angle
  };

  static getVector2Distance (pos1: Vector3, pos2: Vector3) {
    return Vector.distance({ x: pos1.x, y: 0, z: pos1.z},{ x: pos2.x, y: 0, z: pos2.z })
  };

  static isPlayerOnAir(pos: Vector3, dimension: Dimension) {
    let playerOnAir = true;
  
    [-1, 0, 1].forEach(x => {
      [-2, -1, 0, 1, 2].forEach(y => {
        [-1, 0, 1].forEach(z => {
          if (!dimension.getBlock({
            x: pos.x + x,
            y: pos.y + y,
            z: pos.z + z
          })?.isAir) {
            playerOnAir = false;
          }
        });
      });
    });
  
    return playerOnAir;
  };

  static showText (player: Player, message: string[]) {
    player.sendMessage(message.join('\n'))
  }
};