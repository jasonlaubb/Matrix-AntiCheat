import { Player } from "@minecraft/server";
import config from "../data/config";

export default class {
  static commandHandler (input: string) {
    const regex: RegExp = /(["'])(.*?)\1|\S+/g;
    const matches: RegExpMatchArray | null = input.match(regex);
    const command: string = matches!.shift()!.replace(/^-/, '');
    const args: string[] = matches!.map(arg => arg.replace(/^[@"]/g, '').replace(/"$/, ''));
    return [command, ...args];
  };

  static Accept (player: Player, CommandClass: any, Admin: boolean) {
    let Accept = true;
    /* did player has tag */
    if (!(CommandClass.needTag === null)) {
      let hasTag = true;
      //@ts-expect-error
      CommandClass.needTag.forEach(tag => {
        if (player.hasTag(tag)) hasTag = true;
      });
      if (!hasTag) Accept = false
    };

    /* did player is admin of NAC */
    if (CommandClass.needAdmin === true && !Admin) {
      Accept = false
    };
    return Accept
  };

  static commandSelector (regex: string[], Admin: boolean, player: Player) {
    switch (regex[0]) {
      case "OWO": {
        if (!this.Accept(player, config.commands.class.OWO, Admin)) return;
        player.sendMessage(`§dNokararos §f> §7OWO! you got me!`);
        break //Test command
      };
      case "OWO2": {
        if (!this.Accept(player, config.commands.class.OWO2, Admin)) return;
        player.sendMessage(`§dNokararos §f> §7OWO! you got me twice!!`)
      };
      default: {
        player.sendMessage(`§dNokararos §f> §ccommand not found: ${regex}`)
      }
    }
  }
}