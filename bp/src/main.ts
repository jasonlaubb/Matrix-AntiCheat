import { CustomCommandResult, CustomCommandParamType, Player, system, world, EquipmentSlot } from "@minecraft/server";
import info from "./command/info";
import { detect, detectionlist, detectionList, initModules } from "./command/module";
import { setBoolean, setNumber, setString, resetConfig, clearProperty, getProperty } from "./command/set";
import { rankadd, rankclear, ranklist, rankremove, rankset } from "./command/rank";
import { get } from "./util/database";
import { tick } from "./util/tick";
import property from "./data/property";
import { classifyProperty, getPropertyType } from "./util/propertyClassifier";
import { getPlayerRank } from "./util/util";
import { checkPunish } from "./util/punishment";
import { openGeneralUI } from "./util/ui";
import "./xray/antiXray";
// §7[§aMatrix§7] §f
Player.prototype.isOp = function () {
    return this.commandPermissionLevel >= 2;
};
Player.prototype.flag = function (id: string, type: string, category: string, data?: { [key: string]: string | number }) {
    const flagMessage = `§7[§aMatrix§7] §e${this.name}§r§f has been detected for unfair adventage §7<${category}> §c[${id}/${type}]${data ? ` §9(${Object.entries(data).map(([k, v]) => `${k}=${v}§r§9`)})` : ""}`;
    const flagType = get("flagMessageTarget");
    let flagTarget: Player[] = [];
    switch (flagType) {
        case "any":
        case "all": {
            flagTarget = world.getAllPlayers();
            break;
        }
        case "operator":
        case "admin": {
            flagTarget = world.getAllPlayers().filter((player) => player.isOp());
            break;
        }
        case "exclude":
        case "bypass": {
            flagTarget = world.getPlayers({
                excludeNames: [this.name],
            });
            break;
        }
        case "tag": {
            const notifyTag = get("notifyTag");
            flagTarget = world.getPlayers({ tags: [notifyTag] });
            break;
        }
    }
    if (flagTarget.length > 0) {
        flagTarget.forEach((player) => player.sendMessage(flagMessage));
    }
};
Player.prototype.kick = function (reason: string) {
    this.runCommand(`kick @s ${reason}`);
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
    execute: (player: Player, args: any[]) => CustomCommandResult;
}
classifyProperty();
system.beforeEvents.startup.subscribe((event) => {
    const commands = [info, setBoolean, setNumber, setString, resetConfig, clearProperty, getProperty, detect, detectionlist, rankadd, rankclear, ranklist, rankremove, rankset] as Command[];
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
    const { stringValue, booleanValue, numberValue } = getPropertyType();
    event.customCommandRegistry.registerEnum("matrix:stringProperty", stringValue);
    event.customCommandRegistry.registerEnum("matrix:numberProperty", numberValue);
    event.customCommandRegistry.registerEnum("matrix:booleanProperty", booleanValue);
    event.customCommandRegistry.registerEnum("matrix:property", Object.keys(property));
    event.customCommandRegistry.registerEnum("matrix:detectionName", Object.keys(detectionList));
    commands.forEach(({ name, description, requireOp, optionalParameters, parameters, execute }) => {
        event.customCommandRegistry.registerCommand(
            {
                name: "matrix:" + name,
                description,
                permissionLevel: requireOp ? 2 : 0,
                optionalParameters: optionalParameters?.map(({ name, type }) => {
                    return {
                        name: type === "enum" ? "matrix:" + name : name,
                        type: convertType(type),
                    };
                }),
                mandatoryParameters: parameters?.map(({ name, type }) => {
                    return {
                        name: type === "enum" ? "matrix:" + name : name,
                        type: convertType(type),
                    };
                }),
                cheatsRequired: false,
            },
            (origin, ...args) => {
                const player = origin.sourceEntity;
                if (!player || !(player instanceof Player) || (requireOp && !player.isOp())) {
                    return {
                        status: 1,
                        message: "Executor is not a player or command permission is invalid",
                    };
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
                                if (param?.max && param.min)
                                    return {
                                        status: 1,
                                        message: `§7[§aMatrix§7] §fParameter ${param.name} is out of range. Range: ${param.min} - ${param.max}`,
                                    };
                                if (tooLarge)
                                    return {
                                        status: 1,
                                        message: `§7[§aMatrix§7] §fParameter ${param.name} is too large. Max value: ${param.max}`,
                                    };
                                if (tooSmall)
                                    return {
                                        status: 1,
                                        message: `§7[§aMatrix§7] §fParameter ${param.name} is too small. Min value: ${param.min}`,
                                    };
                            }
                            break;
                        }
                        case "player":
                        case "playerTarget":
                        case "normalPlayerTarget": {
                            if (input.length === 0)
                                return {
                                    status: 1,
                                    message: "§7[§aMatrix§7] §fNo match target",
                                };
                            if (input.length > 1)
                                return {
                                    status: 1,
                                    message: "§7[§aMatrix§7] §fMultiple targets found. Command failed.",
                                };
                            if (param.type !== "player") {
                                if (input[0].id === player.id)
                                    return {
                                        status: 1,
                                        message: "§7[§aMatrix§7] §fYou cannot target yourself with this command.",
                                    };
                                if (param.type === "playerTarget" && input[0].commandPermissionLevel >= player.commandPermissionLevel) {
                                    return {
                                        status: 1,
                                        message: "§7[§aMatrix§7] §fYou cannot target a player with higher or equal command permission level.",
                                    };
                                }
                            }
                            break;
                        }
                        case "string": {
                            if (param?.max && input.length > param.max) {
                                return {
                                    status: 1,
                                    message: `§7[§aMatrix§7] §fParameter ${param.name} is too long. Max length: ${param.max}`,
                                };
                            }
                        }
                    }
                }
                try {
                    return execute(player, args);
                } catch (error) {
                    return {
                        status: 1,
                        message: `§7[§aMatrix§7] §fAn unexpected error occurred while executing the command. Please report this bug to the developer:§e\n${(error as Error).name}: ${(error as Error).message}\n${(error as Error).stack ?? "-- Stack is undefined --"}`,
                    };
                }
            }
        );
    });
    const helpMessage =
        "§7[§aMatrix§7] Showing all the slash commands of Matrix anticheat:\n" +
        commands
            .toSorted(({ name: a }, { name: b }) => a.localeCompare(b))
            .map(({ name, description, optionalParameters, parameters }) => {
                let text = `§f/${name}`;
                parameters?.forEach(({ name, type }) => {
                    text += ` <${name}: ${type.includes("player") ? "player" : type}>`;
                });
                optionalParameters?.forEach(({ name, type }) => {
                    text += ` [${name}: ${type.includes("player") ? "player" : type}]`;
                });
                return text + `§a ~ §f${description}`;
            })
            .join("\n");
    event.customCommandRegistry.registerCommand(
        {
            name: "matrix:commandlist",
            description: "Show all the slash commands of Matrix anticheat",
            permissionLevel: 2,
            cheatsRequired: false,
        },
        (origin) => {
            const player = origin.sourceEntity;
            if (!player || !(player instanceof Player)) {
                return { status: 1, message: "Executor is not a player" };
            }
            return { status: 0, message: helpMessage };
        }
    );
    event.itemComponentRegistry.registerCustomComponent("matrix:execute_ui", {
        onUse: ({ source }) => {
            if (source.isOp()) {
                openGeneralUI(source);
            } else {
                source.sendMessage("§7[§aMatrix§7] §fNice try... but the item is overpowered and you aren't an operator to stop it from escaping!");
                source.getComponent("equippable")!.getEquipmentSlot(EquipmentSlot.Mainhand)!.setItem();
            }
        }
    })
});

world.afterEvents.worldLoad.subscribe(() => {
    system.runInterval(tick);
    initModules();
});
world.beforeEvents.chatSend.subscribe((event) => {
    const { x, y } = event.sender.inputInfo.getMovementVector();
    if (x !== 0 || y !== 0) {
        event.cancel = true;
        system.run(() => event.sender.sendMessage("§7[§aMatrix§7] §fPlease do not chat while you're moving!"));
        return;
    }
    if (get("chatRankEnable")) {
        const { message, sender: player } = event;
        const playerRank = getPlayerRank(player);
        const format = get("chatRankMessageFormat");
        system.run(() => {
            world.sendMessage(format.replace("{rank}", playerRank).replace("{player}", player.name).replace("{message}", message));
        });
        event.cancel = true;
        return;
    }
});
world.afterEvents.playerSpawn.subscribe(({ player, initialSpawn }) => {
    if (!initialSpawn) return;
    checkPunish(player);
    if (get("chatRankDisplayOnNameTag")) {
        const playerRank = getPlayerRank(player);
        const format = get("chatRankNameTagFormat");
        player.nameTag = format.replace("{rank}", playerRank).replace("{player}", player.name);
    }
});