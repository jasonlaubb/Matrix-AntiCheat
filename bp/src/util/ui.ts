import { CommandError, Player, system, world } from "@minecraft/server";
import { ActionFormData, FormCancelationReason, MessageFormData, ModalFormData } from "@minecraft/server-ui";
import { detectionList } from "../command/detection";
import { get, isReadonly } from "./database";
import property from "../data/config";
import { getPropertyType } from "./propertyClassifier";
import type { OptionType } from "../main";
import { commands, enumRegistry } from "../data/commands";
import { languageSelectUI, text, updateLanguage } from "./text";
import { bannedMatrixCmds } from "../command/staff";
export function openGeneralUI(player: Player) {
    new ActionFormData()
        .title(text("uiAdminGUI"))
        .button(text("uiToggleDetection"), "textures/items/diamond_sword.png")
        .button(text("uiChangeConfig"), "textures/ui/gear.png")
        .button(text("uiAction"), "textures/ui/FriendsDiversity.png")
        .button(text("uiLanguage"), "textures/gui/newgui/Language16.png")
        .button(text("uiEditStaffRole"), "textures/items/book_writable.png")
        .button(text("commandLog"), "textures/items/book_written.png")
        .show(player)
        .then((res) => {
            if (res.canceled) return;
            switch (res.selection) {
                case 0: {
                    const ui = new ActionFormData().title(text("uiAntiCheatSettings"));
                    const enableList = Object.entries(detectionList).map(([name, detection]) => {
                        const enabled = get(detection.property as keyof typeof property);
                        ui.button(`${enabled ? "§2" : "§4"}${name}\n§8${enabled ? text("uiChooseToDisable") : text("uiChooseToEnable")}`);
                        return enabled;
                    });
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
                        .title(text("uiManageProperties"))
                        .body(text("uiPropertyUIBody"))
                        .button(text("uiBoolean"))
                        .button(text("uiString"))
                        .button(text("uiNumber"))
                        .show(player)
                        .then((res) => {
                            if (res.canceled) return;
                            const { booleanValue, stringValue, numberValue } = getPropertyType();
                            const selectedProperty = [booleanValue, stringValue, numberValue][res.selection!].sort();
                            if (selectedProperty.length === 0) {
                                console.warn("ui(57) :: Unexpected no selected property");
                                return;
                            }
                            const ui = new ActionFormData().title(text("uiSelectProperty")).body(text("uiSelectPropertyBody"));
                            selectedProperty.forEach((value) => {
                                ui.button("§9" + value + "\n§1" + get(value as keyof typeof property));
                            });
                            ui.show(player).then((res) => {
                                if (res.canceled) return;
                                const selection = res.selection!;
                                const selectedId = selectedProperty[selection];
                                const { type, value } = property[selectedId as keyof typeof property];
                                const dynamicValue = world.getDynamicProperty("database:" + selectedId) ?? "--";
                                const ui = new ActionFormData().title(text("uiProperty") + ": " + selectedId).body(`§g${text("uiType")}: §e${type}\n§g${text("uiStaticData")}: §e${value}§r\n§g${text("uiDynamicProperty")}: §e${dynamicValue}`);
                                if (isReadonly(selectedId)) {
                                    ui.button("/")
                                        .button("/") // Value is readonly, then cannot be changed. (execept you reset the config)
                                        .show(player);
                                } else {
                                    ui.button(text("uiModifyValue"))
                                        .button(text("uiDiscardEdit"))
                                        .show(player)
                                        .then((res) => {
                                            if (res.canceled) return;
                                            if (res.selection === 0) {
                                                const ui = new ModalFormData().title("Editing: " + selectedId);
                                                const newValueText = text("uiNewValue");
                                                (type === "boolean" ? ui.toggle(text("uiNewBooleanState"), { defaultValue: true }) : ui.textField(`${newValueText} (${type})`, newValueText)).show(player).then((res) => {
                                                    if (res.canceled) return;
                                                    const value = res.formValues![0] as string;
                                                    if (!value) return player.sendMessage("§7[§aMatrix§7] §f" + text("uiValueEmptyDisallow", "/discard"));
                                                    switch (type) {
                                                        case "string": {
                                                            world.setDynamicProperty("database:" + selectedId, value);
                                                            break;
                                                        }
                                                        case "number": {
                                                            const number = parseFloat(value);
                                                            if (isNaN(number)) return player.sendMessage("§7[§aMatrix§7] §f" + text("uiNotANumber"));
                                                            world.setDynamicProperty("database:" + selectedId, value);
                                                            break;
                                                        }
                                                        case "boolean": {
                                                            const boolean = res.formValues![0] as boolean;
                                                            world.setDynamicProperty("database:" + selectedId, boolean);
                                                            break;
                                                        }
                                                    }
                                                    player.sendMessage("§7[§aMatrix§7] §f" + text("uiChanged"));
                                                });
                                            } else {
                                                if (world.getDynamicProperty("database:" + selectedId)) {
                                                    world.setDynamicProperty("database:" + selectedId);
                                                    player.sendMessage("§7[§aMatrix§7] §f" + text("uiPropertyReset"));
                                                } else player.sendMessage("§7[§aMatrix§7] §f" + text("uiNotChanged"));
                                            }
                                        });
                                }
                            });
                        });
                    break;
                }
                case 2: {
                    const commandList = commands.sort((a, b) => a.name.localeCompare(b.name));
                    const ui = new ActionFormData().title(text("uiAction"));
                    commandList.forEach(({ name, translationDef }) => ui.button(`§9/${name}\n§8${text(translationDef.actionName)}`));
                    ui.show(player).then((res) => {
                        if (res.canceled) return;
                        const selectedCommand = commandList[res.selection!];
                        if ((selectedCommand.parameters?.length ?? 0) === 0 && (selectedCommand.optionalParameters?.length ?? 0) === 0) {
                            try {
                                player.runCommand("matrix:" + selectedCommand.name.toLowerCase());
                            } catch (error) {
                                const { name, message } = error as Error;
                                if (error instanceof CommandError) {
                                    player.sendMessage(`§7[§aMatrix§7] §f${message.split(":").slice(1).join(":").trim()}`);
                                } else player.sendMessage(`§7[§aMatrix §cERROR§7] §f${name}: ${message}`);
                            }
                            return;
                        }
                        const players = world.getAllPlayers().map(({ name }) => name);
                        const ui = new ModalFormData()
                            .title(text("uiActionOption") + " | " + text(selectedCommand.translationDef.actionName))
                            .submitButton(text("uiExecute"))
                            .label(text(selectedCommand.translationDef.description));
                        selectedCommand.parameters?.forEach(({ name, type, max, min }, i) => {
                            addOption(ui, text(selectedCommand.translationDef.param![i]!), type, players, [min, max], false, name);
                        });
                        selectedCommand.optionalParameters?.forEach(({ name, type, max, min }, i) => {
                            addOption(ui, text(selectedCommand.translationDef.optionalParam![i]!), type, players, [min, max], true, name);
                        });
                        ui.show(player).then((res) => {
                            if (res.canceled) return;
                            const formValues = res.formValues!.slice(1);
                            const input: string[] = [];
                            for (let i = 0; i < formValues.length; i++) {
                                const isRequired = selectedCommand.parameters?.[i];
                                const option = isRequired ?? selectedCommand.optionalParameters?.[i - (selectedCommand.parameters?.length ?? 0)];
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
                            const command = "matrix:" + selectedCommand.name.toLowerCase() + " " + input.join(" ");
                            try {
                                player.runCommand(command);
                            } catch (error) {
                                const { name, message } = error as Error;
                                if (error instanceof CommandError) {
                                    player.sendMessage(`§7[§aMatrix§7] §f${message.split(":").slice(1).join(":").trim()}`);
                                } else player.sendMessage(`§7[§aMatrix§7] §f${name}: ${message}`);
                            }
                        });
                    });
                    break;
                }
                case 3: {
                    languageSelectUI(player);
                    break;
                }
                case 4: {
                    staffManageUI(player);
                    break;
                }
                case 5: {
                    logUI(player);
                    break;
                }
            }
        });
}
function addOption(ui: ModalFormData, name: string, type: OptionType, players: string[], range: [undefined | number, undefined | number] = [undefined, undefined], optional: boolean, enumRegistryName: string) {
    const label = optional ? name + ` (${text("uiOptional")})` : name;
    switch (type) {
        case "boolean": {
            if (optional) {
                ui.dropdown(label, ["§4" + text("uiUndefined"), text("uiTrue"), text("uiFalse")]);
            } else {
                ui.dropdown(label, [text("uiTrue"), text("uiFalse")]);
            }
            break;
        }
        case "enum": {
            const value = enumRegistry[enumRegistryName];
            if (optional) {
                ui.dropdown(label, ["§4" + text("uiUndefined"), ...value]);
            } else {
                ui.dropdown(label, value);
            }
            break;
        }
        case "float":
        case "integer": {
            let placeholder = type === "float" ? text("uiFloat") : text("uiInteger");
            if (range[0] && range[1]) {
                placeholder = `${placeholder} (${range[0]} - ${range[1]})`;
            } else if (range[0]) {
                placeholder = `${placeholder} ≥ ${range[0]}`;
            } else if (range[1]) {
                placeholder = `${placeholder} ≤ ${range[1]}`;
            }
            ui.textField(label, placeholder);
            break;
        }
        case "item":
        case "string": {
            ui.textField(label, type === "item" ? text("uiItemID") : text("uiAnyString"));
            break;
        }
        case "normalPlayerTarget":
        case "playerTarget":
        case "player": {
            if (optional) {
                ui.dropdown(label, ["§4" + text("uiUndefined"), ...players]);
            } else {
                ui.dropdown(label, players);
            }
            break;
        }
    }
}
export async function setupHelper(player: Player) {
    if (get("setup")) {
        new ActionFormData()
            .title(text("uiSetupHelper"))
            .body("§a" + text("uiSetupAlreadyBody"))
            .button(text("uiOpenAdminGUI") + " §9(/ui)", "textures/ui/gear.png")
            .button(text("uiGetUIItem") + " §9(/itemui)", "textures/items/compass_item.png")
            .button(text("uiCommandList") + " §9(/commandlist)", "textures/items/banner_pattern.png")
            .show(player)
            .then((res) => {
                if (res.canceled) return;
                const selection = res.selection!;
                switch (selection) {
                    case 0: {
                        openGeneralUI(player);
                        break;
                    }
                    case 1: {
                        player.runCommand("matrix:itemui");
                        break;
                    }
                    case 2: {
                        player.runCommand("matrix:commandlist");
                        break;
                    }
                }
            });
    } else {
        if (get("systemLanguage") === "NOT_SET") {
            const res = await languageSelectUI(player);
            if (!res) return;
            const res2 = await new MessageFormData()
                .title(text("commandAntiXrayAreYouSure"))
                .body(text("uiConfirmLanguage"))
                .button1("§l§2" + text("commandAntiXrayYes"))
                .button2("§l§4" + text("commandAntiXrayNo"))
                .show(player);
            if (res2.canceled || res2.selection === 1) {
                world.setDynamicProperty("database:systemLanguage");
                system.run(() => {
                    updateLanguage();
                    if (!player.isValid) return;
                    if (res2.cancelationReason === FormCancelationReason.UserClosed || res2.selection === 1) {
                        setupHelper(player);
                    }
                });
                return;
            }
        }
        if (get("flagPunishmentType") === "NOT_SET" || get("flagMessageTarget") === "NOT_SET") {
            const res = await new ModalFormData()
                .title(text("uiSetupHelper"))
                .label(text("uiFlagLabel"))
                .dropdown(text("uiFlagAction"), [text("uiNone"), text("uiKick"), text("uiBan"), text("uiTempkick")], { defaultValueIndex: 1, tooltip: text("uiFlagPunishment") })
                .dropdown(text("uiFlagMessageTarget"), [text("uiOperatorOnly"), text("uiAll"), text("uiExclude"), text("uiNobody")], { tooltip: text("uiFlagMessageTips") })
                .show(player);
            if (res.canceled) return;
            const [punishment, flagmsgtarget] = res.formValues!.slice(1) as number[];
            world.setDynamicProperties({
                "database:flagMessageTarget": ["operator", "all", "exclude", "none"][flagmsgtarget],
                "database:flagPunishmentType": ["none", "kick", "ban", "tempkick"][punishment],
            });
        }
        world.setDynamicProperty("database:setup", true);
        system.run(() => setupHelper(player));
    }
}
export function staffManageUI(player: Player) {
    const ui = new ActionFormData().title(text("uiStaffManagement")).button(text("uiAddStaffRole"), "textures/ui/color_plus.png");
    if (world.getDynamicPropertyIds().some((prop) => prop.startsWith("role:"))) {
        // Only show them when role are found!
        ui.button(text("uiRemoveStaffRole"), "textures/ui/book_trash_default.png").button(text("uiEditStaffRole"), "textures/items/book_writable.png");
    }
    ui.show(player).then((res) => {
        if (res.canceled) return;
        switch (res.selection) {
            case 0: {
                new ModalFormData()
                    .title(text("uiAddStaffRole"))
                    .textField(text("commandStaffRoleName"), text("uiStaffRoleNamePlaceholder"))
                    .dropdown(text("commandStaffRolePreset"), [text("uiAdmin"), text("uiModerator"), text("uiHelper"), text("uiBuilder"), text("uiTrusted")], { defaultValueIndex: 4 })
                    .show(player)
                    .then((res2) => {
                        if (res2.canceled) return;
                        const roleName = res2.formValues![0] as string;
                        player.runCommand(`matrix:staffrole create "${roleName}" ${["admin", "moderator", "helper", "builder", "trusted"][res2.formValues![1] as number]}`);
                    });
                break;
            }
            case 1: {
                const ui = new ActionFormData().title(text("uiRemoveStaffRole"));
                const roleList: string[] = [];
                world.getDynamicPropertyIds().forEach((prop) => {
                    if (prop.startsWith("role:")) {
                        const roleName = prop.slice(5);
                        roleList.push(roleName);
                        ui.button(roleName);
                    }
                });
                ui.show(player).then((res2) => {
                    if (res2.canceled) return;
                    const selection = res2.selection!;
                    const roleName = roleList[selection];
                    player.runCommand(`matrix:staffrole delete "${roleName}"`);
                });
                break;
            }
            case 2: {
                const ui = new ActionFormData().title(text("uiEditStaffRole"));
                const roleList: string[] = [];
                world.getDynamicPropertyIds().forEach((prop) => {
                    if (prop.startsWith("role:")) {
                        const roleName = prop.slice(5);
                        roleList.push(roleName);
                        ui.button(roleName);
                    }
                });
                ui.show(player).then((res2) => {
                    if (res2.canceled) return;
                    const selection = res2.selection!;
                    const roleName = roleList[selection];
                    let roleData = (world.getDynamicProperty(`role:${roleName}`) as string).split(";").sort();
                    const ui = new ActionFormData()
                        .title(text("uiEditStaffRole") + ": " + roleName)
                        .button(text("uiModifyCmdOfMatrix"), "textures/items/book_writable.png")
                        .button(text("uiAddCommand"), "textures/ui/color_plus.png");
                    if (roleData.length > 0) ui.button(text("uiRemoveCommand"), "textures/ui/book_trash_default.png");
                    ui.show(player).then((res3) => {
                        if (res3.canceled) return;
                        switch (res3.selection) {
                            case 0: {
                                const commandList = commands
                                    .map(({ name }) => name)
                                    .filter((name) => !bannedMatrixCmds.includes(name))
                                    .sort((a, b) => a.localeCompare(b));
                                const ui = new ModalFormData().title(text("uiModifyCmdOfMatrix") + ": " + roleName);
                                commandList.forEach((cmd) => {
                                    ui.toggle(`/${cmd}`, { defaultValue: roleData.includes(cmd) });
                                });
                                ui.show(player).then((res4) => {
                                    if (res4.canceled) return;
                                    commandList.forEach((cmd, i) => {
                                        const enabled = res4.formValues![i] as boolean;
                                        if (enabled && !roleData.includes(cmd)) {
                                            roleData.push(cmd);
                                        } else if (!enabled && roleData.includes(cmd)) {
                                            roleData = roleData.filter((c) => c !== cmd);
                                        }
                                    });
                                    world.setDynamicProperty(`role:${roleName}`, roleData.join(";"));
                                    player.sendMessage("§7[§aMatrix§7] §f" + text("uiCommandChanged"));
                                });
                                break;
                            }
                            case 1: {
                                const ui = new ModalFormData().title(text("uiAddCommand") + ": " + roleName);
                                const roleDataMessage = roleData.length === 0 ? "" : roleData.map((cmd) => `✔ /${cmd}`).join("\n") + "\n";
                                ui.textField(roleDataMessage + text("uiCommandName"), text("uiCommandNamePlaceholder"));
                                ui.show(player).then((res5) => {
                                    if (res5.canceled) return;
                                    const cmdName = res5.formValues![0] as string;
                                    if (bannedMatrixCmds.includes(cmdName)) {
                                        player.sendMessage("§7[§aMatrix§7] §f" + text("uiCommandNotAllowed", cmdName));
                                        return;
                                    }
                                    if (roleData.includes(cmdName)) {
                                        player.sendMessage("§7[§aMatrix§7] §f" + text("uiCommandAlreadyExists", cmdName));
                                        return;
                                    }
                                    roleData.push(cmdName);
                                    world.setDynamicProperty(`role:${roleName}`, roleData.join(";"));
                                    player.sendMessage("§7[§aMatrix§7] §f" + text("uiCommandAdded", cmdName));
                                });
                                break;
                            }
                            case 2: {
                                const ui = new ActionFormData().title(text("uiRemoveCommand") + ": " + roleName);
                                roleData.forEach((cmd) => {
                                    ui.button(`/${cmd}`);
                                });
                                ui.show(player).then((res4) => {
                                    if (res4.canceled) return;
                                    const selection = res4.selection!;
                                    const cmdName = roleData[selection];
                                    roleData = roleData.filter((c) => c !== cmdName);
                                    world.setDynamicProperty(`role:${roleName}`, roleData.join(";"));
                                    player.sendMessage("§7[§aMatrix§7] §f" + text("uiCommandRemoved", cmdName));
                                });
                                break;
                            }
                        }
                    });
                });
                break;
            }
        }
    });
}
export async function logUI(player: Player) {
    if (get("timezoneAdjustUI")) {
        const currentTimezone: number = get("timezoneOffset");
        const res = await new ModalFormData()
            .title(text("uiTimezoneAdjust"))
            .slider(text("uiTimezoneAdjustDesc"), -12, 14, {
                defaultValue: currentTimezone,
                valueStep: 1,
            })
            .toggle(text("uiNeverShowUTCUI"), { defaultValue: false })
            .show(player);
        if (res.canceled) return;
        const [offset, neverShow] = res.formValues! as [number, boolean];
        if (offset !== currentTimezone) world.setDynamicProperty("database:timezoneOffset", offset);
        if (neverShow) world.setDynamicProperty("database:timezoneAdjustUI", false);
    }
    const res1 = await new ActionFormData()
        .title(text("uiLogMenu"))
        .button(text("uiViewFlagLogs"), "textures/items/diamond_sword.png")
        .button(text("uiViewGateLogs"), "textures/ui/NetherPortal.png")
        .button(text("uiViewCommandLogs"), "textures/blocks/command_block.png")
        .button(text("uiViewCommandBlockLogs"), "textures/ui/hammer_l.png")
        .show(player);
    if (res1.canceled) return;
    const logType = ["flag", "gate", "cmd", "cmdbk"][res1.selection!];
    const allLogs = world
        .getDynamicPropertyIds()
        .filter((id) => id.startsWith(`log:${logType}:`))
        .sort()
        .reverse();

    const pageSize = 20;
    let currentPage = 0;
    const currentTimezoneOffset = get("timezoneOffset") * 3600000;
    while (true) {
        const start = currentPage * pageSize;
        const pagedLogs = allLogs.slice(start, start + pageSize);

        if (pagedLogs.length === 0) {
            player.sendMessage("§7[§aMatrix§7] §f" + text("uiNoMoreLogs"));
            return;
        }

        // Build one-line-per-log body with timestamp
        const logBody: string[] = pagedLogs.map((logId) => {
            // Extract timestamp from id: "log:<type>:<timestamp>"
            const parts = logId.split(":");
            const ts = Number(parts[2]) || 0;
            const timeStr = formatTimestamp(ts + currentTimezoneOffset);

            const logData = (world.getDynamicProperty(logId) as string).split(";");
            let msg = "";

            switch (logType) {
                case "flag": {
                    const [playerName, detection, type] = logData;
                    msg = `§7[${timeStr}] §e${playerName} §7| §c${detection} §7| §9${type}`;
                    break;
                }
                case "gate": {
                    const [join, playerName] = logData;
                    msg = `§7[${timeStr}] §e${playerName} §7| ${join === "true" ? "§a" + text("uiJoined") : "§c" + text("uiLeft")}`;
                    break;
                }
                case "cmd": {
                    const [playerName, command] = logData;
                    // keep command short: show leading slash and first part if very long
                    const shortCmd = command.length > 40 ? command.slice(0, 37) + "..." : command;
                    msg = `§7[${timeStr}] §e${playerName} §7| §9/${shortCmd}`;
                    break;
                }
                case "cmdbk": {
                    // New storage: place; x,y,z; dimension; player
                    // Backwards-compatible with older variants (space-separated coords or separate x,y,z tokens)
                    const [place, ...rest] = logData;
                    let x = "",
                        y = "",
                        z = "",
                        dimension = "",
                        playerName = "";

                    if (rest.length === 3) {
                        // Expected: [coordsString, dimension, player]
                        const coordsStr = rest[0] || "";
                        const coords = coordsStr.includes(",") ? coordsStr.split(",") : coordsStr.split(" ");
                        [x = "", y = "", z = ""] = coords;
                        dimension = rest[1] || "";
                        playerName = rest[2] || "";
                    } else if (rest.length >= 4) {
                        // Possible older format: [x, y, z, dimension, player]
                        [x = "", y = "", z = "", dimension = "", playerName = ""] = rest as any;
                    } else {
                        // Fallback: try to salvage whatever we have
                        const joined = rest.join(";");
                        // try to extract last two tokens as dimension and player
                        const maybeParts = joined.split(";");
                        playerName = maybeParts.pop() || "";
                        dimension = maybeParts.pop() || "";
                        const coordsPart = maybeParts.join(";") || "";
                        const coords = coordsPart.includes(",") ? coordsPart.split(",") : coordsPart.split(" ");
                        [x = "", y = "", z = ""] = coords;
                    }

                    const action = place === "true" ? "§a" + text("uiPlaced") : "§c" + text("uiDestroyed");
                    // Ensure single-line and compact coordinates
                    msg = `§7[${timeStr}] §e${playerName} §7| ${action} §7| §9${x},${y},${z} §7| §e${dimension.replace("minecraft:", "")}`;
                    break;
                }
                case "ore": {
                    const [playerName, action, details] = logData;
                    msg = `§7[${timeStr}] §e${playerName} §7| ${action} §7| ${details}`;
                    break;
                }
            }

            // Ensure single-line (remove newlines) and trim to reasonable length for PE UI
            return msg.replace(/\r?\n/g, " ").slice(0, 120);
        });

        // Determine navigation availability
        const hasPrev = currentPage > 0;
        const hasNext = (currentPage + 1) * pageSize < allLogs.length;

        // Build UI: title + body + conditional buttons
        const ui = new ActionFormData().title(text("uiLogs")).body(logBody.join("\n"));

        if (hasPrev) ui.button(text("uiPreviousPage"), "textures/ui/arrow_right_white.png");
        if (hasNext) ui.button(text("uiNextPage"), "textures/ui/arrow_left_white.png");
        if (!hasPrev && !hasNext) ui.button("§c" + text("uiGoBack"), "textures/ui/crossout.png");

        const res2 = await ui.show(player);
        if (res2.canceled) return;

        // Map selection index to action depending on which buttons were added
        let prevIndex = -1;
        let nextIndex = -1;
        if (hasPrev && hasNext) {
            prevIndex = 0;
            nextIndex = 1;
        } else if (hasPrev && !hasNext) {
            prevIndex = 0;
        } else if (!hasPrev && hasNext) {
            nextIndex = 0;
        } else {
            // only Close button -> exit
            return;
        }

        if (res2.selection === prevIndex) {
            // Previous page
            currentPage--;
        } else if (res2.selection === nextIndex) {
            // Next page
            if ((currentPage + 1) * pageSize < allLogs.length) currentPage++;
        } else {
            // Unexpected selection (safety): exit
            return;
        }
    }
}
function pad(n: number) {
    return String(n).padStart(2, "0");
}
function formatTimestamp(ms: number) {
    const d = new Date(ms);
    const m = pad(d.getMonth() + 1);
    const day = pad(d.getDate());
    const hh = pad(d.getHours());
    const mm = pad(d.getMinutes());
    // Compact but readable: "MM-DD HH:MM"
    return `${m}-${day} ${hh}:${mm}`;
}
