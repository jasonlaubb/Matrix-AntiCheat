import { CustomCommand, CustomCommandParamType, Entity, Player, CustomCommandOrigin, CustomCommandParameter, CommandPermissionLevel, CustomCommandResult, CustomCommandStatus } from "@minecraft/server";
interface CommandOption {
    type: CustomCommandParamType;
    name: string;
    desc: string;
    conditional: (input: string | number | Entity | Player, arg: number) => true | Rejection;
}
type RejectReason = "noPerm" | "missingPara" | "typeInvalid" | "outOfRange" | "conditionOfPlayer" | "targetAdmin";
interface Rejection {
    reason: RejectReason;
    arg: number;
    data: string;
}
interface HelpInfo {

}
type FinalRegistry = [CustomCommand, CustomCommandOrigin];
export function reject (reason: RejectReason, arg: number = 0) {
    return {
        reason,
        arg,
    } as Rejection;
}
export class Command {
    public static readonly commands: Command[] = [];
    public static readonly registry: FinalRegistry[] = [];
    public static readonly requireEnum: [string, string[]][];
    public id: string;
    public desc: string;
    public readonly option: CommandOption[] = [];
    public readonly subCommands: Command[] = [];
    public subCommandParaLength: number = 0;
    public constructor (id: string, desc: string) {
        this.id = id;
        this.desc = desc;
    }
    public helpInfo: HelpInfo = {} as HelpInfo;
    public becomeOptional?: number;
    public setOptional () {
        this.becomeOptional = this.option.length;
        return this;
    }
    public permissionLevel: CommandPermissionLevel = 0;
    public setPermissionLevel (level: CommandPermissionLevel) {
        this.permissionLevel = level;
        return this;
    }
    public addVanillaOption (id: string, desc: string, type: CustomCommandParamType) {
        const option: CommandOption = {
            type,
            name: id,
            desc,
            conditional: (_input, _arg) => {
                return true;
            }
        };
        this.option.push(option);
        return this;
    }
    public addStringRange (id: string, desc: string, choices: string[]) {
        const option: CommandOption = {
            type: CustomCommandParamType.String,
            name: id,
            desc,
            conditional: (input, arg) => {
                return choices.includes(input as string) ? true : reject("outOfRange", arg);
            }
        }
        this.option.push(option);
        return this;
    }
    public addIntRange (id: string, desc: string, min: number, max: number, float: boolean = false) {
        const option: CommandOption = {
            type: float ? CustomCommandParamType.Float : CustomCommandParamType.Integer,
            name: id,
            desc,
            conditional: (input, arg) => {
                return input as number >= min && input as number <= max ? true : reject("outOfRange", arg);
            }
        }
        this.option.push(option);
        return this;
    }
    public addModTarget (id: string, desc: string) {
        const option: CommandOption = {
            type: CustomCommandParamType.PlayerSelector,
            name: id,
            desc,
            conditional: (input, arg) => {
                return (input as Player).isAdmin() ? reject("targetAdmin", arg) : true;
            }
        }
        this.option.push(option);
        return this;
    }
    public addSubCommand (id: string, desc: string, subCommandBuilder: (commandBuilder: Command) => Command) {
        const subCommand = subCommandBuilder(new Command(id, desc));
        if (subCommand.option.length > this.subCommandParaLength) {
            this.subCommandParaLength = subCommand.option.length;
        }
        this.subCommands.push(subCommand);
        return this;
    }
    public registerWithSubCommand () {
        const id = this.id;
        const subCommandName = id + "SubCommandEnum";
        const subCommandId = this.subCommands.map(({ id }) => id);
        Command.requireEnum.push([subCommandName, subCommandId]);
        const customCommand: CustomCommand = {
            description: this.desc,
            name: this.id,
            mandatoryParameters: [{
                name: subCommandName,
                type: CustomCommandParamType.Enum,
            }],
            optionalParameters: new Array(this.subCommandParaLength + 1)
                .fill({ name: "parameter ", type: CustomCommandParamType.String } as CustomCommandParameter)
                .map((para, i) => {
                    para.name += i
                    return para;
                }),
            permissionLevel: this.permissionLevel,
        }
        const callback = function (origin: CustomCommandOrigin, ...args: (string | number | Entity | Player)[]): CustomCommandResult | undefined {
            const subCommand = Command.commands.find((command) => command.id === args[0] as string);
            // Prevent error
            if (!subCommand) return { status: CustomCommandStatus.Failure };
            const inputVariables: any[] = [];
            for (let i = 0; i < subCommand.option.length; i++) {
                const option = subCommand.option[i];
                let input = args[i + 1];
                if (!input && subCommand?.becomeOptional && subCommand.becomeOptional <= i) return handleReject(origin, id, args, reject("missingPara", i + 1));
                switch (option.type) {

                }
                const result = option.conditional(input, i + 1);
                if (result === true) {
                    inputVariables.push(input);
                } else {
                    return handleReject(origin, id, args, result);
                }
            }
            return { status: CustomCommandStatus.Success };
        }
    }
}
function handleReject (origin: CustomCommandOrigin, cmd: string, args: any[], reject: Rejection) {
    return { status: CustomCommandStatus.Failure };
}