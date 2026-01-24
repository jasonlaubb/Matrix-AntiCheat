import { world } from "@minecraft/server";
import type { Command } from "../main";
import { text } from "../util/text";
export const staffManageAction = ["add", "remove", "list"];
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
        }
    ],
    optionalParameters: [
        {
            type: "player",
            name: "targetPlayer",
        },
        {
            type: "string",
            name: "roleName",
        }
    ],
    execute: (_player, [action, targetPlayer, roleName]) => {
        switch (action) {
            case "add": {
                if (!targetPlayer || !roleName) return {
                    status: 1,
                    message: `§7[§aMatrix§7] §c${text("commandStaffMissingParam1")}`,
                }
                if (world.getDynamicProperty(`role:${roleName}`) === undefined) {
                    return {
                        status: 1,
                        message: `§7[§aMatrix§7] §c${text("commandStaffUnknownRole", roleName, `/staffrole add "${roleName}"`)}`,
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
                if (!targetPlayer) return {
                    status: 1,
                    message: `§7[§aMatrix§7] §c${text("commandStaffMissingParam2")}`,
                }
                if (!targetPlayer.getDynamicProperty("staff")) {
                    return {
                        status: 1,
                        message: `§7[§aMatrix§7] §c${text("commandStaffNoRoleAssigned", targetPlayer.name)}`,
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
            default: {
                return {
                    status: 1,
                    message: `§7[§aMatrix§7] §c${text("commandStaffUnknownAction", action)}`,
                };
            }
        }
    }
} as Command;