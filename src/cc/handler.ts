/**
 * @author notthinghere
 * @description A unique command handler system
 * Code improved by jasonlaubb
 */

import { world, Player, ChatSendBeforeEvent, system } from "@minecraft/server";
import config from "../data/config";
import { CommandBuildOption, BuilderCallBack, Common, StringTypeKey } from "../data/interface"

function findSelectedPlayer(name: string) {
  return [...world.getAllPlayers()].find((player) => player.name == name);
}

class DefaultArgumentType {
  protected data: any
  public constructor (data: any) {
    this.data = data || {};
  }
}

class LiteralArgumentType {
  public name: string
  public description: string
  public constructor (name: string, description?: string) {
    this.name = name;
    this.description = description;
  }

  readonly verify = (value: string) => value === this.name;
  readonly parse = (value: any) => value;
}

class StringArgumentType {
  readonly verify = (value: string) => (typeof value === "string" && value !== "") ? value : null;
  readonly parse = (value: any) => value;
}

class NumericArgumentType extends DefaultArgumentType {
  private range: [number, number] | []
  public constructor (name: string, range: [number, number]) {
    super(name);
    this.range = range || [];
  }

  readonly _verify = (value: number, parseFunc: Function, test: Function) => (value && ((this.range.length ? (Number(value) >= this.range[0] && parseFunc(value) <= this.range[1]) : test(value))));
  readonly _parse = (value: any, parseFunc: Function) => (value ? parseFunc(value) : null);
}

class IntegerArgumentType extends NumericArgumentType {
  readonly verify = (value: number) => this._verify(value, parseInt, (arg: string) => (/^-?\d*\.?\d+$/.test(arg) && !isNaN(parseFloat(arg))));
  readonly parse = (value: any) => this._parse(value, parseInt);
}

class FloatArgumentType extends NumericArgumentType {
  readonly verify = (value: string) => this._verify(value as any, parseFloat, (arg: number) => /^\d+\.\d+$/.test(value) && !isNaN(arg));
  readonly parse = (value: any) => this._parse(value, parseFloat);
}

class LocationArgumentType {
  readonly verify = (value: string) => /^([~^]?(-\d)?(\d*)?(\.\d+)?)$/.test(value) ? value : null;
  readonly parse = (value: any) => value;
}

class BooleanArgumentType {
  readonly verify = (value: boolean) => typeof value === "boolean" || /^(true|false)$/.test(value);
  readonly parse = (value: any) => value;
}

class PlayerArgumentType {
  readonly verify = (value: string) => /^(@.|"[\s\S]+")$/.test(value) && findSelectedPlayer(value.substring(1));
  readonly parse = (value: any) => findSelectedPlayer(value);
}

class ArrayArgumentType {
  readonly readonlyverify = (value: any[]) => Array.isArray(value) ? value : null;
  readonly parse = (value: any) => value;
}

class DurationArgumentType {
  readonly verify = (value: string) => /^(\d+[hdysmw],?)+$/.test(value) ? value : null;
  readonly parse = (value: any) => value;
}

const OptionTypes: { [key: string]: any } = {
  string: StringArgumentType,
  int: IntegerArgumentType,
  float: FloatArgumentType,
  location: LocationArgumentType,
  boolean: BooleanArgumentType,
  player: PlayerArgumentType,
  array: ArrayArgumentType,
  duration: DurationArgumentType,
};

let COMMANDS: Command[] = [];

export class CommandBuilder {
  private command: Command
  public constructor (command: Command) {
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

  setUsage(...items: string[]) {
    this.command.data.usage = items;
    return this;
  }

  setAliases(...items: string[]) {
    this.command.data.aliases = items;
    return this;
  }

  setRequires(func: (player?: Player) => boolean) {
    this.command.data.requires = func;
    return this;
  }
}

export class Command {
  public data: CommandBuildOption
  private types: string[] | [LiteralArgumentType]
  private callback: Function
  public parent: Command
  private root: Command
  public index: number
  public _arguments_: any[]
  public constructor (data: BuilderCallBack, types?: string[] | [LiteralArgumentType], parent?: Command, root?: Command) {
    this.callback = null;
    data(new CommandBuilder(this));
    this.types = types ?? [new LiteralArgumentType(this.data.name)];
    this.root = root ?? (this.types[0] instanceof LiteralArgumentType ? this : parent);
    this.index = (parent?.index ?? -1) + 1;
    if (!this.data.requires)
      this.data.requires = (() => true);
    this._arguments_ = [];
  }

  public subCommand(data: BuilderCallBack) {
    if (this.root?.callback) throw new Error("[Command::subCommand]: Can not add subcommand to command");
    return this._arguments_[this._arguments_.push(new Command(data, null, this)) - 1];
  }

  public option(types: StringTypeKey | StringTypeKey[], data: BuilderCallBack): Command {
    if (this.callback) throw new Error("[Command::option]: Cannot add option to command.");
    return (this._arguments_[this._arguments_.push(new Command(data, Array.isArray(types) ? types.map(type => new OptionTypes[type]) : [new OptionTypes[types]], this, this.types instanceof LiteralArgumentType ? this : this.root)) - 1]);
  }

  public execute(callback: (event: ChatSendBeforeEvent, regax: Common[]) => void) {
    return (this.types[0] instanceof LiteralArgumentType ? this.callback = callback : this.root.callback = callback, this);
  }

  static subscribe(command: Command) {
    if (parent || COMMANDS.includes(command)) throw new Error("[Command::subsribe]: Cannot subscribe the command");
    COMMANDS.push(command);
  }

  static getCommands() {
    return COMMANDS;
  }
}

const PREFIX = config.commandOptions.prefix;

export function chatSendBeforeEvent(event: ChatSendBeforeEvent) {
  if (!event.message.startsWith(PREFIX)) return;
  event.cancel = true;
  let args: any[] = event.message.slice(PREFIX.length).trim().match(/"[^"]+"|[^\s]+/g).map((arg: string) => arg.replace(/"(.+)"/, "$1").toString());
  const command = COMMANDS.find((cmd) => cmd.data.name == args[0] || cmd.data?.aliases?.includes(args[0]));
  if (!command || !command?.data?.requires(event.sender)) return event.sender.warn({ rawtext: [{ translate: "commands.generic.unknown", with: [`${args[0]}`] }]})
  args.shift();
  let selectedArgs: any[] = [];
  const verifyArgs = (cmd: Command, i: number): boolean => {
    if (cmd._arguments_.length === 0) return true;

    const arg = cmd._arguments_.find(a => a.types.some((e: any) => e.verify(args[i])));
    if (!arg) return true;

    const { data } = arg;
    if (!data || !data.requires || !data.requires(event.sender)) {
      event.sender.warn({
        rawtext: [{
          translate: "commands.generic.syntax",
          with: [
            `${`${PREFIX}${command.data.name} ${args.slice(0, i).join(" ")}`.slice(-9)} `,
            args[i] ?? "",
            ` ${`${args.slice(i + 1).join(" ")}`.slice(0, 9)}`
          ]
        }]
      });
      return false;
    }

    selectedArgs.push(arg);
    return verifyArgs(cmd, ++i)
  }

  if (!verifyArgs(command, 0)) return;
  system.run(() => sendCommandCallback(event, args, selectedArgs));
}

function sendCommandCallback(event: ChatSendBeforeEvent, args: any[], selectedArgs: any[]) {
  let argsToReturn: any[] = [];
  selectedArgs.forEach((arg: any, i: number) => {
    if (arg.types[0] instanceof LiteralArgumentType) return;
    argsToReturn.push(arg.types.find((a: any) => a.verify(args[i])).parse(args[i]));
  });
  selectedArgs[selectedArgs.length - 1].root?.callback?.(event, argsToReturn);
}