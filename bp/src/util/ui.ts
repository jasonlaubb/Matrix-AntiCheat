import { Player, world } from "@minecraft/server";
import { ActionFormData, ModalFormData } from "@minecraft/server-ui";
import { detectionList } from "../command/detection";
import { get } from "./database";
import property from "../data/property";
import { getPropertyType } from "./propertyClassifier";
import { OptionType } from "../main";
import { commands, enumRegistry } from "../data/commands";
export function openGeneralUI(player: Player) {
    new ActionFormData()
        .title("General Settings")
        .button("Enable/Disable detection")
        .button("Change configuration")
        .button("Action")
        //@ts-expect-error
        .show(player)
        .then((res) => {
            if (res.canceled) return;
            switch (res.selection) {
                case 0: {
                    const ui = new ActionFormData().title("AntiCheat Settings");
                    const enableList = Object.entries(detectionList).map(([name, detection]) => {
                        const enabled = get(detection.property as keyof typeof property);
                        ui.button(`${enabled ? "§a" : "§c"}${name}\n§8${enabled ? "Choose to disable" : "Choose to enable"}`);
                        return enabled;
                    });
                    //@ts-expect-error
                    ui.show(player).then((res) => {
                        if (res.canceled) return;
                        const selection = res.selection!;
                        const toggle = Object.values(detectionList)[selection];
                        if (enableList[selection]) {
                            world.setDynamicProperty("database:" + toggle.property, false);
                            toggle.enable();
                        } else {
                            toggle.disable();
                            world.setDynamicProperty("database:" + toggle.property, true);
                        }
                    });
                    break;
                }
                case 1: {
                    new ActionFormData()
                        .title("Manage properties")
                        .body("Select data type you want to change:")
                        .button("Boolean")
                        .button("String")
                        .button("Number")
                        //@ts-expect-error
                        .show(player)
                        .then((res) => {
                            if (res.canceled) return;
                            const { booleanValue, stringValue, numberValue } = getPropertyType();
                            const selectedProperty = [booleanValue, stringValue, numberValue][res.selection!].sort();
                            if (selectedProperty.length === 0) {
                                player.sendMessage("§7[§aMatrix§7] §fSorry, there hasn't been any valid property for that type yet!");
                                return;
                            }
                            new ModalFormData()
                                .title("Select property")
                                .dropdown("Select the property you want to view or change", selectedProperty, { defaultValueIndex: 0 })
                                //@ts-expect-error
                                .show(player)
                                .then((res) => {
                                    if (res.canceled) return;
                                    const selection = res.formValues![0] as number;
                                    const selectedId = selectedProperty[selection];
                                    const { type, value } = property[selectedId as keyof typeof property];
                                    const dynamicValue = world.getDynamicProperty("database:" + selectedId) ?? "--";
                                    new ActionFormData()
                                        .title("Property: " + selectedId)
                                        .body(`§gType: §e${type}\n§gStatic data: §e${value}§r\n§gDynamic property: §e${dynamicValue}`)
                                        .button("Modify value")
                                        .button("Discard edit")
                                        //@ts-expect-error
                                        .show(player)
                                        .then((res) => {
                                            if (res.canceled) return;
                                            if (res.selection! === 0) {
                                                const ui = new ModalFormData().title("Editing: " + selectedId);
                                                (type === "boolean" ? ui.toggle("New boolean state", { defaultValue: true }) : ui.textField(`New value (${type})`, "New value"))
                                                    //@ts-expect-error
                                                    .show(player)
                                                    .then((res) => {
                                                        if (res.canceled) return;
                                                        const value = res.formValues![0] as string;
                                                        if (!value) return player.sendMessage("§7[§aMatrix§7] §fNew value cannot be empty. Please use /discard to reset a value.");
                                                        switch (type) {
                                                            case "string": {
                                                                world.setDynamicProperty("database:" + selectedId, value);
                                                                break;
                                                            }
                                                            case "number": {
                                                                const number = parseFloat(value);
                                                                if (isNaN(number)) return player.sendMessage("§7[§aMatrix§7] §fNot a number!");
                                                                world.setDynamicProperty("database:" + selectedId, value);
                                                                break;
                                                            }
                                                            case "boolean": {
                                                                const boolean = res.formValues![0] as boolean;
                                                                world.setDynamicProperty("database:" + selectedId, boolean);
                                                                break;
                                                            }
                                                        }
                                                        player.sendMessage("§7[§aMatrix§7] §fSuccessfully changed selected property.");
                                                    });
                                            } else {
                                                if (world.getDynamicProperty("database:" + selectedId)) {
                                                    world.setDynamicProperty("database:" + selectedId);
                                                    player.sendMessage("§7[§aMatrix§7] §fSuccessfully reset selected property.");
                                                } else player.sendMessage("§7[§aMatrix§7] §fTarget property has not been changed.");
                                            }
                                        });
                                });
                        });
                    break;
                }
                case 2: {
                    const commandList = commands.sort((a, b) => a.name.localeCompare(b.name));
                    const ui = new ActionFormData().title("Action");
                    commandList.forEach(({ name }) => ui.button(`§9${upperCaseFirstChar(name)}`));
                    ui
                        //@ts-expect-error
                        .show(player)
                        .then((res) => {
                            if (res.canceled) return;
                            const selectedCommand = commandList[res.selection!];
                            if ((selectedCommand.parameters?.length ?? 0) === 0 && (selectedCommand.parameters?.length ?? 0) === 0) {
                                player.lastRunUICommand = true;
                                try {
                                    player.runCommand(selectedCommand.name.toLowerCase());
                                } catch (error) {
                                    const { name, message } = error as Error;
                                    player.sendMessage(`§7[§aMatrix§7] §f${name}: ${message}`);
                                }
                                return;
                            }
                            const players = world.getAllPlayers().map(({ name }) => name);
                            const ui = new ModalFormData().title("Action's option | " + upperCaseFirstChar(selectedCommand.name)).submitButton("Execute");
                            selectedCommand.parameters?.forEach(({ name, type, max, min }) => {
                                addOption(ui, name, type, players, [min, max]);
                            });
                            selectedCommand.optionalParameters?.forEach(({ name, type, max, min }) => {
                                addOption(ui, name, type, players, [min, max], true);
                            });
                            ui
                                //@ts-expect-error
                                .show(player)
                                .then((res) => {
                                    if (res.canceled) return;
                                    const formValues = res.formValues!;
                                    const input: string[] = [];
                                    for (let i = 0; i < formValues.length; i++) {
                                        const isRequired = selectedCommand.parameters?.[i];
                                        const option = isRequired ?? selectedCommand.optionalParameters?.[(selectedCommand.parameters?.length ?? 0) + i];
                                        let breaks = false;
                                        const value = formValues[i];
                                        switch (option?.type) {
                                            case "boolean": {
                                                if (!isRequired && value === 0) {
                                                    breaks = true;
                                                    break;
                                                }
                                                input.push(["true", "false"][isRequired ? (value as number) : (value as number) - 1]);
                                                break;
                                            }
                                            case "enum": {
                                                if (!isRequired && value === 0) {
                                                    breaks = true;
                                                    break;
                                                }
                                                input.push(enumRegistry[option.name][isRequired ? (value as number) : (value as number) - 1]);
                                                break;
                                            }
                                            case "float":
                                            case "integer":
                                            case "string":
                                            case "item": {
                                                if (value === undefined) {
                                                    breaks = true;
                                                    break;
                                                }
                                                input.push((value as string).includes(" ") ? `"${value}"` : (value as string));
                                                break;
                                            }
                                            case "player":
                                            case "normalPlayerTarget":
                                            case "playerTarget": {
                                                if (!isRequired && value === 0) {
                                                    breaks = true;
                                                    break;
                                                }
                                                const targetPlayerName = players[isRequired ? (value as number) : (value as number) - 1];
                                                input.push(targetPlayerName.includes(" ") ? `"${targetPlayerName}"` : targetPlayerName);
                                                break;
                                            }
                                        }
                                        if (breaks) break;
                                    }
                                    const command = selectedCommand.name.toLowerCase() + " " + input.join(" ");
                                    try {
                                        player.runCommand(command);
                                    } catch (error) {
                                        const { name, message } = error as Error;
                                        player.sendMessage(`§7[§aMatrix§7] §f${name}: ${message}`);
                                    }
                                });
                        });
                }
            }
        });
}
function addOption(ui: ModalFormData, name: string, type: OptionType, players: string[], range: [undefined | number, undefined | number] = [undefined, undefined], optional = false) {
    const label = optional ? name + " (Optional)" : name;
    switch (type) {
        case "boolean": {
            if (optional) {
                ui.dropdown(label, ["§4undefined", "true", "false"]);
            } else {
                ui.dropdown(label, ["true", "false"]);
            }
            break;
        }
        case "enum": {
            const value = enumRegistry[name];
            if (optional) {
                ui.dropdown(label, ["§4undefined", ...value]);
            } else {
                ui.dropdown(label, value);
            }
            break;
        }
        case "float":
        case "integer": {
            let placeholder = `any ${type}`;
            if (range[0] && range[1]) {
                placeholder = `${type} between ${range[0]} and ${range[1]}`;
            } else if (range[0]) {
                placeholder = `${type} at least ${range[0]}`;
            } else if (range[1]) {
                placeholder = `${type} at most ${range[1]}`;
            }
            ui.textField(label, placeholder);
            break;
        }
        case "item":
        case "string": {
            ui.textField(label, type === "item" ? "item ID" : "any string");
            break;
        }
        case "normalPlayerTarget":
        case "playerTarget":
        case "player": {
            if (optional) {
                ui.dropdown(label, ["§4undefined", ...players]);
            } else {
                ui.dropdown(label, players);
            }
            break;
        }
    }
}
function upperCaseFirstChar(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
