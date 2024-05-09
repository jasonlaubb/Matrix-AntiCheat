//@ts-nocheck
import * as _server from "@minecraft/server";
import * as _ui from "@minecraft/server-ui";
import send from "../../Assets/Language";

let server = {
	..._server,
	..._ui
};



class DefaultArgumentType {
  constructor(data) {
    this.data = data || {};
  }
}

class LiteralArgumentType {
  constructor(name, description) {
    this.name = name;
  }

  verify = value => value === this.name;
  parse = value => value;
}

class StringArgumentType {
  verify = value => (typeof value === 'string' && value !== "") ? value : undefined;
  parse = value => value;
}

class NumericArgumentType extends DefaultArgumentType {
  constructor(name, range) {
    super(name);
    this.range = range || [];
  }

  _verify = (value, parseFunc, test) => (value && ((this.range.length ? (Number(value) >= this.range[0] && Number(value) <= this.range[1]) : test(value))));

  _parse = (value) => (value ? Number(value) : null);
}

class IntegerArgumentType extends NumericArgumentType {
  verify = value => this._verify(value, parseInt, (arg) => (/^-?\d*\.?\d+$/.test(arg) && !isNaN(parseFloat(arg))));
  parse = value => this._parse(value, parseInt);
}

class FloatArgumentType extends NumericArgumentType {
  verify = value => this._verify(value, parseFloat, (arg) => /^\d+\.\d+$/.test(value) && !isNaN(arg));
  parse = value => this._parse(value, parseFloat);
}


class LocationArgumentType {
  verify = value => /^([~^]?(-\d)?(\d*)?(\.\d+)?)$/.test(value) ? value : undefined;
  parse = value => value;
}

class BooleanArgumentType {
  verify = value => /^(true|false)$/.test(value) ? value === "true" : undefined;
  parse = value => value === "true";
}

class PlayerArgumentType {
  verify = value => fetch(value);
  parse = value => fetch(value);
}

class TargetArgumentType {
  verify = value => /^(@.|"[\s\S]+")$/.test(value) ? value : undefined;
  parse = value => value;
}

class ArrayArgumentType {
  verify = value => Array.isArray(value) ? value : undefined;
  parse = value => value;
}

class DurationArgumentType {
  verify = value => /^(\d+[hdysmw],?)+$/.test(value) ? value : undefined;
  parse = value => value;
}

const OptionTypes = {
  string: StringArgumentType,
  int: IntegerArgumentType,
  float: FloatArgumentType,
  location: LocationArgumentType,
  boolean: BooleanArgumentType,
  player: PlayerArgumentType,
  target: TargetArgumentType,
  array: ArrayArgumentType,
  duration: DurationArgumentType,
};


let COMMANDS = [];

class CommandBuilder {
    constructor(command) {
        this.command = command;
    }

    setName(string) {
        this.command.data.name = string;
        return this;
    }

    description(string) {
        this.command.data.description = string;
        return this;
    }

    requires(func) {
        this.command.data.requires = func;
        return this;
    }
}


export class Command {
    constructor(data, types, parent, root) {
        this.data = {};
        this.callback = null;

        data?.(new CommandBuilder(this));

        this.types = types ?? [new LiteralArgumentType(this.data.name)];
        this.root = root ?? (this.types[0] instanceof LiteralArgumentType ? this : parent);
        this.index = (parent?.index ?? -1) + 1;
        
        if (!this.data.requires)
            this.data.requires = (() => true);

        this._arguments_ = [];
        
        if (!parent)
          COMMANDS.push(this);
    }

    subCommand(data) {
      if (this.root?.callback) throw new Error("[Command::subCommand]: Can not add subcommand to command")
      return this._arguments_[this._arguments_.push(new Command(data, null, this)) - 1];
    }

    
    option(types, data) {
      if (this.callback) throw new Error("[Command::option]: Cannot add option to command.");
       return this._arguments_[this._arguments_.push(new Command(data, Array.isArray(types) ? types.map(type => new OptionTypes[type]) : [new OptionTypes[types]], this, this.types instanceof LiteralArgumentType ? this : this.root)) - 1];
    }

    execute(callback) {
      return (this.types[0] instanceof LiteralArgumentType ? this.callback = callback : this.root.callback = callback, this);
    }
}

const PREFIX = "-";

const command = new Command(data => data
    .setName("hi")
    .description("hi")
    .requires((plr) => true))

const subCommand1 = command.subCommand(data => data.setName("test1"))
  .option(["int", "string"], a => a.setName("int"))
  .option("int", a => a.setName("int"))
  .subCommand(data => data.setName("test2"))
  .option("int", a => a.setName("int"))
  .execute((ev, args) => ev.sender.tell(JSON.stringify(args)))


server.world.beforeEvents.chatSend.subscribe((event) => {
  if (!event.message.startsWith(PREFIX)) return;
  event.cancel = true;
  let args = event.message.slice(PREFIX.length).trim().match(/"[^"]+"|[^\s]+/g).map((arg) => arg.replace(/"(.+)"/, "$1").toString());
  const command = COMMANDS.find((cmd) => cmd.data.name == args[0] || cmd.data?.aliases?.includes(args[0]));
  if (!command || !command?.data?.requires(event.sender)) return event.sender.sendMessage({ rawtext: [{ text: "§c" }, { translate: "commands.generic.unknown", with: [`${args[0]}`] }]});
  args.shift();
  let selectedArgs = [];
  const verifyArgs = (cmd, i) => cmd._arguments_.length > 0 ? ((arg) => !arg || !arg.data?.requires?.(event.sender) ? (event.sender.sendMessage({ rawtext: [{ text: "§c" }, { translate: "commands.generic.syntax", with: [`${`${PREFIX}${command.data.name} ${args.slice(0, i).join(" ")}`.slice(-9)} `, args[i] ?? "", ` ${`${args.slice(i + 1).join(" ")}`.slice(0, 9)}`] }] }), false) : (selectedArgs.push(arg), verifyArgs(arg, i + 1)))(cmd._arguments_.find((a) => a.types.find(e => e.verify(args[i])))) : true;
  if (!verifyArgs(command, 0)) return;
  server.system.run(() => sendCommandCallback(event, command, args, selectedArgs));
})

function sendCommandCallback(event, command, args, selectedArgs) {
  let argsToReturn = [];
  selectedArgs.forEach((arg, i) => {
    if (arg.types[0] instanceof LiteralArgumentType) return
    argsToReturn.push(arg.types.find(a => a.verify(args[i])).parse(args[i]))
  });
  selectedArgs[selectedArgs.length - 1].root?.callback?.(event, argsToReturn)
}

export function blockUsage(player: Player, setting: Cmds) {
    if (setting.enabled !== true) {
        system.run(() => send(player, true, "commandsystem.command_disabled"));
        return true;
    } else if (setting.adminOnly === true && !isAdmin(player)) {
        system.run(() => system.run(() => send(player, true, "commandsystem.command_disabled_reason")));
        return true;
    } else if (setting.requireTag.length > 0 && !player.getTags().some((tag) => setting.requireTag.includes(tag))) {
        system.run(() => send(player, true, "commandsystem.no_permission"));
        return true;
    }
    return false;
}