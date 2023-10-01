import { world, Player, system } from '@minecraft/server';
import { ActiveTempkick } from './action/tempkick.js';
import { Activekick } from './action/kick.js';
import { doBanOn } from './action/ban.js';
import config from '../data/default-config.js';

const OVERALL_FLAG_DATA = new Map<string, number>();
const OVERALL_MODULES_LIST = new Map<string, string>();

export const flagSystem = () => {
  world.afterEvents.playerLeave.subscribe(ev => {
    const ONE_MODULES_LIST = OVERALL_MODULES_LIST.get(ev.playerId) || null;
    if (ONE_MODULES_LIST === null) return;
    OVERALL_MODULES_LIST.forEach(module => OVERALL_FLAG_DATA.delete(`${module}||${ev.playerId}`))
  })
};

export function flag (player: Player, module: string, Class: ModuleClass, Input: Array<string>) {
system.run(() => {
  let flagging = '§dNokararos §f> ';
  flagging += `§e${player.name} §7failed §c(${module})`;
  if (Input !== undefined) flagging += ` §9(${Input.join(', ')})`;

  let doPunishment = false;
  if (Class.VL !== undefined) {
    const flagnumber = OVERALL_FLAG_DATA.get(player.id) || 0;
    if (flagnumber === 0) {
      const newlist = OVERALL_MODULES_LIST.get(player.id).includes(module) ? OVERALL_MODULES_LIST.get(player.id) : Array<string>(OVERALL_MODULES_LIST.get(player.id).split('|').push(module)).join('|');
      OVERALL_MODULES_LIST.set(player.id, newlist);
    };
    OVERALL_FLAG_DATA.set(`${module}||${player.id}`, flagnumber + 1);
    flagging += ` §6(VL=${OVERALL_FLAG_DATA.get(`${module}||${player.id}`)}`;
    if (OVERALL_FLAG_DATA.get(`${module}||${player.id}`) > Number(Class.VL as unknown)) {
      doPunishment = true
    }
  } else {
    doPunishment = true;
  };

  let punishment = Class.punishment;
  if (doPunishment === true && punishment !== 'none' as Punishment) {
    switch (punishment as string) {
      case "tempkick": {
        ActiveTempkick(player);
        break
      };
      case "kick": {
        Activekick(player);
        break
      };
      case "ban": {
        doBanOn(player, config.system.punishment.ban.defaultTime, config.system.punishment.ban.Reason, config.system.punishment.ban.BanBy);
        break
      };
      default: {
        console.error(`Invalid punishment type: ${punishment} on ${module}`);
        punishment = 'INVALID' as Punishment
      }
    }
  };

  if (config.system.notify.onFlag) world.sendMessage(flagging);
  if (doPunishment === true && punishment !== 'none' as Punishment) world.sendMessage(`§g>> §fPunishment: §e${punishment}`);
  if (punishment !== 'none' as Punishment) {
    OVERALL_FLAG_DATA.delete(`${module}||${player.id}`)
  }
})
}