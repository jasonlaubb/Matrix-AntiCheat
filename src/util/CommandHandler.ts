import { Player, world } from "@minecraft/server";
import config from "../data/config";
import { CommandClass, Console } from "../data/class";

export default class {
  static Turn (input: string) {
    const regex: RegExp = /(["'])(.*?)\1|\S+/g;
    const matches: RegExpMatchArray = input.match(regex)!;
    const command: string = matches!.shift()!.slice(config.commands.setting.prefix.length)
    const args: string[] = matches!.map(arg => arg.replace(/^[@"]/g, '').replace(/"$/, ''));
    return [command, ...args];
  };

  static Accept (player: Player, CommandClass: CommandClass, Admin: boolean) {
    let Accept = true;
    /* did player has tag */
    if (!(CommandClass.needTag === null)) {
      let hasTag = true;
      CommandClass.needTag.forEach(tag => {
        if (player.hasTag(tag)) hasTag = true;
      });
      if (!hasTag) Accept = false
    };

    /* did player is admin of NAC */
    if (CommandClass.needAdmin === true && !Admin) {
      Accept = false
    };

    /* did player has op*/
    if (CommandClass.needOp === true && !player.isOp()) {
      Accept = false
    };
    if (Accept === false) {
      player.sendMessage("§dNokararos §f> §cYou don't have enough permisson to use this command!")
    };
    return Accept
  };

  static Help (isHelp: boolean, command: CommandClass, player: Player, Admin: boolean) {
    if (!isHelp || Admin) return;
    player.sendMessage(`§dNokararos §f> §b-- command help --`);
    player.sendMessage(`§gDescription: §f${command.description ?? 'No description found'}`);
    if (command.usage !== undefined) {
      player.sendMessage(`§gUsage: §f${command.usage.join(`\n${config.commands.setting.prefix}`)}`)
    } else {
      player.sendMessage(`§gUsage: §fNo usage found`)
    };
  };

  static Select (command: string, Admin: boolean, player: Player) {
    const regex: string[] = this.Turn(command);
    const isHelp: boolean = regex[1] === '--help'
    switch (regex[0]) {
      case "OWO": {
        this.Help(isHelp, config.commands.class.OWO, player, Admin);
        if (isHelp || !this.Accept(player, config.commands.class.OWO, Admin)) return;

        player.sendMessage('§dNokararos §f> §7OWO! you got me!');
        break
      };

      case "OWO2": {
        this.Help(isHelp, config.commands.class.OWO2, player, Admin);
        if (isHelp || !this.Accept(player, config.commands.class.OWO2, Admin)) return;

        player.sendMessage('§dNokararos §f> §7OWO! you got me twice!!');
        break
      };

      case "op": {
        this.Help(isHelp, config.commands.class.op, player, Admin);
        if (isHelp || !this.Accept(player, config.commands.class.op, Admin)) return;
        if (Admin) return player.sendMessage('§dNokararos §f> §cYou are admin!');

        let sucess: boolean = false;

        if (!(config.encryption.password === undefined)) {
          if (config.encryption.password === regex[1]) {
            player.sendMessage('§dNokararos §f> §cIncorrect password');
          } else {
            sucess = true
          }
        } else {
          sucess = true
        };

        if (sucess) {
          world.sendMessage(`§dNokararos §f> §e${player.name} §7is NAC-admin now!`);
          Console.log(`(Admin) New admin: ${player.name}`);
          player.setDynamicProperty('NAC:admin_data', true);
        };

        break
      };

      case "deop": {
        this.Help(isHelp, config.commands.class.deop, player, Admin);
        if (isHelp || !this.Accept(player, config.commands.class.deop, Admin)) return;

        if (!Admin) return player.sendMessage('§dNokararos §f> §cYou are not admin!');
        world.sendMessage(`§dNokararos §f> §e${player.name} §7is no longer been NAC-admin`);
        Console.log(`(Admin) Removed admin: ${player.name}`);
        player.removeDynamicProperty('NAC:admin_data');

        break
      };

      case "setop": {
        this.Help(isHelp, config.commands.class.setop, player, Admin);
        if (isHelp || !this.Accept(player, config.commands.class.setop, Admin)) return;

        const target: Player = world.getPlayers({ name: regex[1] })[0];
        if (!target) return player.sendMessage('§dNokararos §f> §cPlayer is not online or player is invalid');
        if (target.id === player.id) return player.sendMessage(`§dNokararos §f> §cYou cannot use this command to yourself`);
        if (target.getDynamicProperty('NAC:admin_data') === true) return player.sendMessage(`§dNokararos §f> §c${target.name} is admin!`);
        if (config.encryption.TwoFA && !regex[2]) return player.sendMessage(`§dNokararos §f> §c2FA-mode enabled, please enter password`);

        let sucess: boolean = false;
        if (config.encryption.TwoFA) {
          if (regex[2] === config.encryption.password) {
            sucess = true
          } else {
            return player.sendMessage(`§dNokararos §f> §cIncorrect password!`);
          }
        } else sucess = true;

        if (sucess) {
          world.sendMessage(`§dNokararos §f> §e${target.name} is setted to NAC-admin by ${player.name}`);
          Console.log(`(Admin) New admin: ${target.name} | Setted by ${player.name}`);
          player.setDynamicProperty('NAC:admin_data', true);
        };

        break
      };

      case "setdeop": {
        this.Help(isHelp, config.commands.class.setdeop, player, Admin);
        if (isHelp || !this.Accept(player, config.commands.class.setdeop, Admin)) return;

        const target: Player = world.getPlayers({ name: regex[1] })[0];
        if (!target) return player.sendMessage('§dNokararos §f> §cPlayer is not online or player is invalid');
        if (target.id === player.id) return player.sendMessage(`§dNokararos §f> §cYou cannot use this command to yourself`);
        if (!(target.getDynamicProperty('NAC:admin_data') === true)) return player.sendMessage(`§dNokararos §f> §c${target.name} is not admin!`);
        if (config.encryption.TwoFA && !regex[2]) return player.sendMessage(`§dNokararos §f> §c2FA-mode enabled, please enter password`);

        let sucess: boolean = false;
        if (config.encryption.TwoFA) {
          if (regex[2] === config.encryption.password) {
            sucess = true
          } else {
            return player.sendMessage(`§dNokararos §f> §cIncorrect password!`);
          }
        } else sucess = true;

        if (sucess) {
          world.sendMessage(`§dNokararos §f> §e${target.name} is removed NAC-admin by ${player.name}`);
          Console.log(`(Admin) Removed admin: ${target.name} | Removed by ${player.name}`);
          player.removeDynamicProperty('NAC:admin_data');
        };

        break
      };

      default: {
        player.sendMessage(`§dNokararos §f> §ccommand not found: ${regex}`)
      }
    };
  }
}