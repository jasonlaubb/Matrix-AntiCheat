import { CustomCommandResult, CustomCommandParamType, Player, system } from "@minecraft/server";
// §7[§aMatrix§7]§7 §f
Player.prototype.isOp = function() {
    return this.commandPermissionLevel >= 2;
}
interface Option {
    name: string;
    type: "string" | "integer" | "float" | "boolean" | "enum" | "player" | "playerTarget" | "normalPlayerTarget";
    max?: number;
    min?: number;
}
export interface Command {
    name: string;
    description: string;
    requireOp: boolean;
    optionalParameters?: Option[];
    parameters?: Option[];
    /** @warning Early execution, please add system.run if you want to do edit to world */
    execute: (args: string[], player: Player) => CustomCommandResult;
}
system.beforeEvents.startup.subscribe((event) => {
    const commands = [] as Command[];
    function convertType(type: string): CustomCommandParamType {
        switch (type) {
            case "string":
                return CustomCommandParamType.String;
            case "integer":
                return CustomCommandParamType.Integer;
            case "float":
                return CustomCommandParamType.Float;
            case "boolean":
                return CustomCommandParamType.Boolean;
            case "enum":
                return CustomCommandParamType.Enum;
            case "normalPlayerTarget":
            case "playerTarget":
            case "player":
                return CustomCommandParamType.PlayerSelector;
            default:
                return CustomCommandParamType.String;
        }
    }
    commands.forEach(({ name, description, requireOp, optionalParameters, parameters, execute }) => {
        event.customCommandRegistry.registerCommand({
            name: "matrix:" + name,
            description,
            permissionLevel: requireOp ? 2 : 0,
            optionalParameters: optionalParameters?.map(({ name, type }) => {
                return {
                    name: type === "enum" ? "matrix:" + name : name,
                    type: convertType(type)
                };  
            }),
            mandatoryParameters: parameters?.map(({ name, type }) => {
                return {
                    name: type === "enum" ? "matrix:" + name : name,
                    type: convertType(type)
                };
            }),
            cheatsRequired: false,
        }, (origin, ...args) => {
            const player = origin.sourceEntity;
            if (!player || !(player instanceof Player) || requireOp && !player.isOp()) {
                return { status: 1, message: "Executor is not a player or command permission is invalid" };
            }
            for (let i = 0; i < args.length; i++) {
                const input = args[i];
                const param = parameters![i] ?? optionalParameters![i - parameters!.length];
                switch (param.type) {
                    case "float":
                    case "integer": {
                        const tooLarge = param?.max && input > param.max;
                        const tooSmall = param?.min && input < param.min;
                        if (tooLarge || tooSmall) {
                            if (param?.max && param.min) return { status: 1, message: `§7[§aMatrix§7]§7 §fParameter ${param.name} is out of range. Range: ${param.min} - ${param.max}` };
                            if (tooLarge) return { status: 1, message: `§7[§aMatrix§7]§7 §fParameter ${param.name} is too large. Max value: ${param.max}` };
                            if (tooSmall) return { status: 1, message: `§7[§aMatrix§7]§7 §fParameter ${param.name} is too small. Min value: ${param.min}` };
                        }
                        break;
                    }
                    case "player":
                    case "playerTarget":
                    case "normalPlayerTarget": {
                        if (input.length === 0) return { status: 1, message: "§7[§aMatrix§7]§7 §fNo match target" };
                        if (input.length > 1) return { status: 1, message: "§7[§aMatrix§7]§7 §fMultiple targets found. Command failed." };
                        if (param.type !== "player") {
                            if (input[0].id === player.id) return { status: 1, message: "§7[§aMatrix§7]§7 §fYou cannot target yourself with this command." };
                            if (param.type === "playerTarget" && input[0].commandPermissionLevel >= player.commandPermissionLevel) {
                                return { status: 1, message: "§7[§aMatrix§7]§7 §fYou cannot target a player with higher or equal command permission level." };
                            }
                        }
                        break;
                    }
                    case "string": {
                        if (param?.max && input.length > param.max) {
                            return { status: 1, message: `§7[§aMatrix§7]§7 §fParameter ${param.name} is too long. Max length: ${param.max}` };
                        }
                    }
                }
            }
            try {
                return execute(args, player);
            } catch (error) {
                return { status: 1, message: `§7[§aMatrix§7]§7 §fAn unexpected error occurred while executing the command. Please report this bug to the developer:§e\n${(error as Error).name}: ${(error as Error).message}\n${(error as Error).stack ?? "-- Stack is undefined --"}` };
            }
        });
    });
    const helpMessage = "§7[§aMatrix§7]§7 Showing all the slash commands of Matrix anticheat:\n" + commands.toSorted(({ name: a }, { name: b }) => a.localeCompare(b)).map(({ name, description, optionalParameters, parameters }) => {
        let text = `§f/${name}`;
        parameters?.forEach(({ name, type }) => {
            text += ` <${name}: ${type.includes("player") ? "player" : type}>`;
        });
        optionalParameters?.forEach(({ name, type }) => {
            text += ` [${name}: ${type.includes("player") ? "player" : type}]`;
        });
        return text + `§a ~ §f${description}`;
    }).join("\n");
    event.customCommandRegistry.registerCommand({
        name: "matrix:commandlist",
        description: "Show all the slash commands of Matrix anticheat",
        permissionLevel: 2,
        cheatsRequired: false,
    }, (origin) => {
        const player = origin.sourceEntity;
        if (!player || !(player instanceof Player)) {
            return { status: 1, message: "Executor is not a player" };
        }
        return { status: 0, message: helpMessage };
    });
});