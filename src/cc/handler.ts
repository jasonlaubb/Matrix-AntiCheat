import * as _server from "@minecraft/server";
import * as _ui from "@minecraft/server-ui";
import config from "../data/config";

let server = {
	..._server,
	..._ui
};

class DefaultArgumentType {
    protected data: any
  constructor(data: any) {
    this.data = data || {};
  }
}

class LiteralArgumentType {
  private name: string
  protected description: string
  constructor(name: string, description?: string) {
    this.name = name;
    this.description = description
  }

  verify = (value: any) => value === this.name;
  parse = (value: any) => value;
}

class StringArgumentType {
  verify = (value: any) => (typeof value === 'string' && value !== "") ? value : undefined;
  parse = (value: any) => value;
}

class NumericArgumentType extends DefaultArgumentType {
private range: any
  constructor(name: string, range: [number, number]) {
    super(name);
    this.range = range || [];
  }

  _verify = (value: any, parseFunc: Function, test: any) => (value && ((this.range.length ? (Number(value) >= this.range[0] && parseFunc(value) <= this.range[1]) : test(value))));

  _parse = (value: any, parseFunc: Function) => (value ? parseFunc(value) : null);
}

class IntegerArgumentType extends NumericArgumentType {
  verify = (value: any) => this._verify(value, parseInt, (arg: any) => (/^-?\d*\.?\d+$/.test(arg) && !isNaN(parseFloat(arg))));
  parse = (value: any) => this._parse(value, parseInt);
}

class FloatArgumentType extends NumericArgumentType {
  verify = (value: any) => this._verify(value, parseFloat, (arg: any) => /^\d+\.\d+$/.test(value) && !isNaN(arg));
  parse = (value: any) => this._parse(value, parseFloat);
}


class LocationArgumentType {
  verify = (value: any) => /^([~^]?(-\d)?(\d*)?(\.\d+)?)$/.test(value) ? value : undefined;
  parse = (value: any) => value;
}

class BooleanArgumentType {
  verify = (value: any) => /^(true|false)$/.test(value) ? value === "true" : undefined;
  parse = (value: any) => value === "true";
}

class PlayerArgumentType {
  verify = (value: any) => fetch(value);
  parse = (value: any) => fetch(value);
}

class TargetArgumentType {
  verify = (value: any) => /^(@.|"[\s\S]+")$/.test(value) ? value : undefined;
  parse = (value: any) => value;
}

class ArrayArgumentType {
  verify = (value: any) => Array.isArray(value) ? value : undefined;
  parse = (value: any) => value;
}

class DurationArgumentType {
  verify = (value: any) => /^(\d+[hdysmw],?)+$/.test(value) ? value : undefined;
  parse = (value: any) => value;
}

const OptionTypes: { [key: string]: any } = {
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


let COMMANDS: Command[] = [];

class CommandBuilder {
    private command: Command
    constructor(command: Command) {
      //@ts-expect-error
      this.command.data = {}
      this.command = command;
    }

    setName(string: string) {
        this.command.data.name = string;
        return this;
    }

    setDescription(string: string) {
        this.command.data.description = string;
        return this;
    }

    setUsage(...string: string[]) {
        this.command.data.usage = string
        return this
    }

    setRequires(func: (player?: _server.Player) => boolean) {
        this.command.data.requires = func;
        return this;
    }
}

interface CommandData {
  name: string;
  description: string;
  requires: (player?: _server.Player) => boolean;
  usage: string[]
  aliases: string[];
}

export class Command {
    public data: CommandData
    private callback: Function
    private types: string[] | LiteralArgumentType[]
    private root: any
    private index: any
    private _arguments_: any
    constructor(data: (data: CommandBuilder) => CommandBuilder, types?: string[], parent?: Command, root?: Command) {
        this.callback = null;

        data (new CommandBuilder(this))
        this.types = types ?? [new LiteralArgumentType(this.data.name)];
        this.root = root ?? (this.types[0] instanceof LiteralArgumentType ? this : parent);
        this.index = (parent?.index ?? -1) + 1;
        
        if (!this.data.requires)
            this.data.requires = (() => true);

        this._arguments_ = [];
    }

    subCommand(data: (data: CommandBuilder) => CommandBuilder) {
      if (this.root?.callback) throw new Error("[Command::subCommand]: Can not add subcommand to command")
      return this._arguments_[this._arguments_.push(new Command(data, null, this)) - 1];
    }

    
    option(types: string[], data: (data: CommandBuilder) => CommandBuilder) {
      if (this.callback) throw new Error("[Command::option]: Cannot add option to command.");
       return this._arguments_[this._arguments_.push(new Command(data, Array.isArray(types) ? types.map(type => new OptionTypes[type]) : [new OptionTypes[types]], this, this.types instanceof LiteralArgumentType ? this : this.root)) - 1];
    }

    execute(callback: (ev: _server.ChatSendBeforeEvent, args?: any[]) => void) {
      return (this.types[0] instanceof LiteralArgumentType ? this.callback = callback : this.root.callback = callback, this);
    }

    static subscribe (command: Command) {
      if (parent || COMMANDS.includes(command)) throw new Error("[Command::subsribe]: Cannot subscribe the command")
      COMMANDS.push(command);
    }

    static getCommands (): Command[] {
      return COMMANDS
    }
}

const PREFIX = config.commandOptions.prefix

/*
const command = new Command(data => data
    .setName("hi")
    .description("hi")
    .requires((plr) => true))

const subCommand1 = command.subCommand(data => data.setName("test1"))
  .option(["int", "string"], a => a.setName("int"))
  .option("int", a => a.setName("int"))
  .subCommand(data => data.setName("test2"))
  .option("int", a => a.setName("int"))
  .execute((ev, args) => ev.sender.tell(JSON.stringify(args)))*/


export function chatSendBeforeEvent (event: _server.ChatSendBeforeEvent) {
    if (!event.message.startsWith(PREFIX)) return;
    event.cancel = true;
    let args = event.message.slice(PREFIX.length).trim().match(/"[^"]+"|[^\s]+/g).map((arg) => arg.replace(/"(.+)"/, "$1").toString());
    const command = COMMANDS.find((cmd) => cmd.data.name == args[0] || cmd.data?.aliases?.includes(args[0]));
    if (!command || !command?.data?.requires(event.sender)) return event.sender.sendMessage({ rawtext: [{ text: "§c" }, { translate: "commands.generic.unknown", with: [`${args[0]}`] }]});
    args.shift();
    let selectedArgs: any[] = [];
    const verifyArgs: any = (cmd: any, i: any) => cmd._arguments_.length > 0 ? ((arg) => !arg || !arg.data?.requires?.(event.sender) ? (event.sender.sendMessage({ rawtext: [{ text: "§c" }, { translate: "commands.generic.syntax", with: [`${`${PREFIX}${command.data.name} ${args.slice(0, i).join(" ")}`.slice(-9)} `, args[i] ?? "", ` ${`${args.slice(i + 1).join(" ")}`.slice(0, 9)}`] }] }), false) : (selectedArgs.push(arg), verifyArgs(arg, i + 1)))(cmd._arguments_.find((a: any) => a.types.find((e: any) => e.verify(args[i])))) : true;
    if (!verifyArgs(command, 0)) return;
    server.system.run(() => sendCommandCallback(event, command, args, selectedArgs));
}

function sendCommandCallback (event: _server.ChatSendBeforeEvent, command: Command, args: string[], selectedArgs: any[]) {
    command
  let argsToReturn: string[] = [];
  selectedArgs.forEach((arg, i) => {
    if (arg.types[0] instanceof LiteralArgumentType) return
    argsToReturn.push(arg.types.find((a: any) => a.verify(args[i])).parse(args[i]))
  });
  selectedArgs[selectedArgs.length - 1].root?.callback?.(event, argsToReturn)
}