import { world, Player, GameMode } from "@minecraft/server";
import { ModuleClass, console } from "../data/class.js";
import config from '../data/config.js';

const GOBAL_VL = new Map<string, number>();
const CLEAR_VL = new Map<string, string[]>();

export default class {
  static flag(player: Player, module: ModuleClass, information: undefined | string) {
    if (!(module instanceof ModuleClass)) return console.warn('(flag system) Module type error');
    if (!(module instanceof Player)) return console.warn(`(flag system) player is not Player type`);

    let flagVL: number = GOBAL_VL.get(`${player.id}+${module.name}`) ?? 0;
    flagVL += 1;
    GOBAL_VL.set(`${player.id}+${module.name}`, flagVL);
    if (!CLEAR_VL.get(player.id).includes(module.name)) {
      const clearvl: Array<string> = CLEAR_VL.get(player.id) ?? [];
      //@ts-expect-error
      CLEAR_VL.set(player.id, clearvl.push(module.name))
    };

    if (config.notify.flagMsg) {
      const showingInformation: string = information === undefined ? '' : ` §9[${information}]`;
      world.sendMessage(`§dNokararos §f> §e${player.name} §7failed §e${module.name}${showingInformation} §7VL=${flagVL}`);
    };
  };
  static flagClear (player: string) {
    const clearvl: Array<string> = CLEAR_VL.get(player);
    if (clearvl.length <= 0) return false;
    clearvl.forEach(m => GOBAL_VL.delete(`${player}+${m}`));
    CLEAR_VL.delete(player);
    return true
  };
  static isAdmin (player: Player) {
    return player.getDynamicProperty('NAC:admin_data') === true ? true : false
  };
  static getGamemode (player: Player) {
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
  }
}