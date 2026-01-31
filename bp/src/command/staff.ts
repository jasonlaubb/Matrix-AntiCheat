import { Player, system, world } from "@minecraft/server";
import type { Command } from "../main";
import { text } from "../util/text";
import { staffManageUI } from "../util/ui";
export const staffManageAction = ["add", "remove", "list"];
export const staffRoleManageAction = ["create", "delete", "list", "manage"];
export const rolePreset = ["admin", "moderator", "helper", "builder", "trusted"];
export const bannedMatrixCmds = ["info", "staff", "staffrole", "staffcmd", "setboolean", "setstring", "setnumber", "resetconfig", "discard", "kick", "execute"];
export const staff = {
    name: "staff",
    requireOp: true,
    description: "Set or remove staff role to a player.",
    translationDef: {
        actionName: "commandStaff",
        description: "commandStaffDescription",
        param: ["commandStaffManageAction"],
        optionalParam: ["commandPlayer", "commandStaffRoleName"],
    },
    parameters: [
        {
            type: "enum",
            name: "staffManageAction",
        },
    ],
    optionalParameters: [
        {
            type: "player",
            name: "targetPlayer",
        },
        {
            type: "string",
            name: "roleName",
        },
    ],
    execute: (_player, [action, targetPlayer, roleName]) => {
        switch (action) {
            case "add": {
                if (!targetPlayer || !roleName)
                    return {
                        status: 1,
                        message: `§7[§aMatrix§7] §f${text("commandStaffMissingParam1")}`,
                    };
                if (world.getDynamicProperty(`role:${roleName}`) === undefined) {
                    return {
                        status: 1,
                        message: `§7[§aMatrix§7] §f${text("commandStaffUnknownRole", roleName, `/staffrole add "${roleName}"`)}`,
                    };
                }
                targetPlayer.setDynamicProperty("staff", roleName);
                world.setDynamicProperty("staff:" + targetPlayer.name, roleName); // For easier lookup
                return {
                    status: 0,
                    message: `§7[§aMatrix§7] §f${text("commandStaffAddSuccess", targetPlayer.name, roleName)}`,
                };
            }
            case "remove": {
                if (!targetPlayer)
                    return {
                        status: 1,
                        message: `§7[§aMatrix§7] §f${text("commandStaffMissingParam2")}`,
                    };
                if (!targetPlayer.getDynamicProperty("staff")) {
                    return {
                        status: 1,
                        message: `§7[§aMatrix§7] §f${text("commandStaffNoRoleAssigned", targetPlayer.name)}`,
                    };
                }
                targetPlayer.setDynamicProperty("staff");
                world.setDynamicProperty("staff:" + targetPlayer.name);
                return {
                    status: 0,
                    message: `§7[§aMatrix§7] §f${text("commandStaffRemoveSuccess", targetPlayer.name)}`,
                };
            }
            case "list": {
                const id = world.getDynamicPropertyIds();
                const staffList: string[] = [];
                id.forEach((propId) => {
                    if (propId.startsWith("staff:")) {
                        const playerName = propId.slice(6);
                        const roleName = world.getDynamicProperty(propId);
                        staffList.push(`§a${playerName}§r §4(§f${roleName}§4)`);
                    }
                });
                if (staffList.length === 0) {
                    return {
                        status: 0,
                        message: `§7[§aMatrix§7] §f${text("commandStaffListEmpty")}`,
                    };
                }
                return {
                    status: 0,
                    message: `§7[§aMatrix§7] §f${text("commandStaffListHeader")}\n${staffList.join("\n")}`,
                };
            }
        }
        return;
    },
} as Command;
export const staffrole = {
    name: "staffrole",
    requireOp: true,
    description: "Manage staff roles.",
    translationDef: {
        actionName: "commandStaffRole",
        description: "commandStaffRoleDescription",
        param: ["commandStaffManageAction"],
        optionalParam: ["commandStaffRoleName", "commandStaffRolePreset"],
    },
    parameters: [
        {
            type: "enum",
            name: "staffRoleManageAction",
        },
    ],
    optionalParameters: [
        {
            type: "string",
            name: "roleName",
        },
        {
            type: "enum",
            name: "rolePreset",
        },
    ],
    execute: (player, [action, roleName, rolePreset]) => {
        switch (action) {
            case "create": {
                if (!roleName)
                    return {
                        status: 1,
                        message: `§7[§aMatrix§7] §f${text("commandStaffRoleMissingParam")}`,
                    };
                if (world.getDynamicProperty(`role:${roleName}`) !== undefined) {
                    return {
                        status: 1,
                        message: `§7[§aMatrix§7] §f${text("commandStaffRoleAlreadyExists", roleName)}`,
                    };
                }
                if (roleName.includes(";")) {
                    return {
                        status: 1,
                        message: `§7[§aMatrix§7] §f${text("commandStaffRoleInvalid", roleName)}`,
                    };
                }
                world.setDynamicProperty(`role:${roleName}`, rolePreset ? getRoleCommandsByPreset(rolePreset) : "");
                return {
                    status: 0,
                    message: `§7[§aMatrix§7] §f${text("commandStaffRoleCreateSuccess", roleName)}`,
                };
            }
            case "delete": {
                if (!roleName)
                    return {
                        status: 1,
                        message: `§7[§aMatrix§7] §f${text("commandStaffRoleMissingParam")}`,
                    };
                if (world.getDynamicProperty(`role:${roleName}`) === undefined) {
                    return {
                        status: 1,
                        message: `§7[§aMatrix§7] §f${text("commandStaffUnknownRole", roleName)}`,
                    };
                }
                world.setDynamicProperty(`role:${roleName}`);
                return {
                    status: 0,
                    message: `§7[§aMatrix§7] §f${text("commandStaffRoleDeleteSuccess", roleName)}`,
                };
            }
            case "list": {
                const id = world.getDynamicPropertyIds();
                const roleList: string[] = [];
                id.forEach((propId) => {
                    if (propId.startsWith("role:")) {
                        const roleName = propId.slice(5);
                        roleList.push(`§a- ${roleName}§r`);
                    }
                });
                if (roleList.length === 0) {
                    return {
                        status: 0,
                        message: `§7[§aMatrix§7] §f${text("commandStaffRoleListEmpty")}`,
                    };
                }
                return {
                    status: 0,
                    message: `§7[§aMatrix§7] §f${text("commandStaffRoleListHeader")}\n${roleList.join("\n")}`,
                };
            }
            case "manage": {
                system.run(() => {
                    staffManageUI(player);
                });
                break;
            }
        }
        return;
    },
} as Command;
export const staffcmd = {
    name: "staffcmd",
    requireOp: false,
    description: "Execute a command as a staff member.",
    translationDef: {
        actionName: "commandStaffCmd",
        description: "commandStaffCmdDescription",
        param: ["commandStaffCmdCommand"],
    },
    parameters: [
        {
            type: "string",
            name: "command",
        },
    ],
    execute: (player, [message]) => {
        if (!(player instanceof Player)) return { status: 1, message: "[Matrix] Sorry! Console is not supported for this command." };
        const role = player.getDynamicProperty("staff") as string;
        if (!role) {
            return { status: 1, message: `§7[§aMatrix§7] §f${text("commandStaffCmdNoPerm")}` };
        }
        const roleData = world.getDynamicProperty(`role:${role}`) as string;
        if (!roleData) {
            return { status: 1, message: `§7[§aMatrix§7] §f${text("commandStaffCmdNoPerm")}` };
        }
        const command = (message as string).trim().replace(/^\//, "");
        const selectedCommand = command.split(" ")[0];
        if (selectedCommand === "help") {
            const roleCommands = roleData.split(";").sort();
            return { status: 0, message: `§7[§aMatrix§7] §a${text("commandStaffCmdHelp")}: §f${roleCommands.length > 0 ? roleCommands.join(", ") : "--"}` };
        }
        if (!roleData.split(";").includes(selectedCommand)) {
            return { status: 1, message: `§7[§aMatrix§7] §f${text("commandStaffCmdUnknownCommand", selectedCommand)}` };
        }
        player.lastRunUICommand = true; // Show feedback in command output
        system.run(() => {
            try {
                player.runCommand(command);
            } catch (error) {
                const { name, message } = error as Error;
                player.sendMessage(`§7[§aMatrix§7] §c${name}: ${message}`);
            }
        });
        return { status: 0 };
    },
} as Command;
function getRoleCommandsByPreset(preset: string) {
    switch (preset) {
        case "admin": {
            return "commandlist;ban;banoffline;unban;banlist;deviceinfo;lockdown;mute;unmute;rankadd;rankremove;ranklist;rankclear;warn;watch;watchtp;invsee;invcopy;echestwipe;freecam;fakeleave;gma;gmc;gms;gmsp;flaglog;gamemode;kill;tp;fill;clone;setblock;summon;effect;give;clear;xp;tag;scoreboard";
        }
        case "moderator": {
            return "commandlist;ban;banoffline;unban;banlist;deviceinfo;mute;unmute;rankadd;rankremove;ranklist;rankclear;warn;watch;watchtp;invsee;invcopy;echestwipe;freecam;fakeleave;gma;gmc;gms;gmsp;flaglog;kill;gamemode;tp";
        }
        case "helper": {
            return "gma;gmc;gms;gmsp;give;tp;rankadd;rankremove;ranklist;rankclear";
        }
        case "builder": {
            return "gma;gmc;gms;gmsp;tp;fill;clone;setblock;give";
        }
    }
    return "";
}
