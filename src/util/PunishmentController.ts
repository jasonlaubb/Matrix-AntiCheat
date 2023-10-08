import { Player } from "@minecraft/server";
import { canTempkickList } from "../index.js";
import { Console } from "../data/class";

export default class {
  static kick (player: Player) {
    try {
      player.runCommandAsync(`kick "${player.name}"`);
      Console.log(`(punishment) do kick on ${player.name}`)
    } catch {
      canTempkickList.set(player.id, true);
      player.triggerEvent('NAC:tempkick');
      Console.warn(`(punishment) do tempkick on ${player.name} as failed to kick`)
    }
  };
  static tempkick (player: Player) {
    canTempkickList.set(player.id, true);
    player.triggerEvent('NAC:tempkick');
  }
}