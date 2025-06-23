import { fastText, rawtextTranslate } from "../../util/rawtext";
import { banHandler, matrixKick, crashPlayer, muteHandler } from "../system/moderation";
import { CustomCommandParamType, Player, system, world } from "@minecraft/server";
import { useRealmsPlus } from "../../util/realmsplus";
import type { cmd } from "../../assets/cmd";
export default [
    {
        cc: {
            name: "m:ban",
            description: "Bans a player from the server.",
            permissionLevel: 2,
            mandatoryParameters: [
                {
                    name: "target",
                    type: CustomCommandParamType.PlayerSelector,
                },
            ],
            optionalParameters: [
                {
                    name: "reason",
                    type: CustomCommandParamType.String,
                },
                {
                    name: "minute",
                    type: CustomCommandParamType.Integer,
                }
            ]
        },
        cb(player, target, reason, duration) {
            if (target.length !== 1) {
                system.run(() => player.sendMessage(rawtextTranslate("command.playerSelector.invalid")));
                return { status: 1 };
            }
            if (target[0].isOperator()) return system.run(() => player.sendMessage(rawtextTranslate("command.playerSelector.admin")));
            system.run(() => {
            const banDuration = duration ? (duration as number) * 60000 : undefined;
            banHandler.ban(target[0], player.name, !banDuration, banDuration, reason as string);
            world.sendMessage(rawtextTranslate("command.ban.finish", target[0].name, player.name));
            });
            return { status: 0 };
        }
    },
    {
        cc: {
            name: "m:unban",
            description: "Unbans a player from the server.",
            permissionLevel: 2,
            mandatoryParameters: [
                {
                    name: "target",
                    type: CustomCommandParamType.String,
                }
            ]
        },
        cb(player, target) {
            const targetPlayer = target as string;
            system.run(() => {
            if (!banHandler.unban(targetPlayer)) {
                if (useRealmsPlus()) {
                    player.sendMessage(rawtextTranslate("command.unban.realmsplus", targetPlayer));
                } else {
                    player.sendMessage(rawtextTranslate("command.unban.notfound", targetPlayer));
                }
            }
            });
            world.sendMessage(rawtextTranslate("command.unban.finish", targetPlayer, player.name));
            return { status: 0 };
        }
    },
    {
        cc: {
            name: "m:banlist",
            description: "Lists all banned players.",
            permissionLevel: 2,
        },
        cb(player) {
            system.run(() => {
            const bannedPlayer = banHandler.bannedList();
            if (bannedPlayer.length === 0) {
                player.sendMessage(fastText().addText("§bMatrix§a+ §7> §g").addTran("command.banlist.empty").build());
            }
            player.sendMessage(fastText().addText("§bMatrix§a+ §7> §g").addTran("command.banlist.banned", bannedPlayer.join(", "), bannedPlayer.length.toString()).build());
            });
            return { status: 0 };
        }
    },
    {
        cc: {
            name: "m:crash",
            description: "Crashes a player [Beta Feature]",
            permissionLevel: 2,
            mandatoryParameters: [
                {
                    name: "target",
                    type: CustomCommandParamType.PlayerSelector,
                }
            ]
        },
        cb(player, target) {
            if (target.length !== 1) {
                system.run(() => player.sendMessage(rawtextTranslate("command.playerSelector.invalid")));
                return { status: 1 };
            }
            if (target[0].isOperator()) {
                system.run(() => player.sendMessage(rawtextTranslate("command.playerSelector.admin")));
                return { status: 1 };
            }
            system.run(() => {
                crashPlayer(target[0] as Player);
                world.sendMessage(rawtextTranslate("command.crash.finish", target[0].name, player.name));
            });
            return { status: 0 };
        }
    },
    {
        cc: {
            name: "m:kick2",
            description: "Kicks a player from the server.",
            permissionLevel: 2,
            mandatoryParameters: [
                {
                    name: "target",
                    type: CustomCommandParamType.PlayerSelector,
                }
            ]
        },
        cb(player, target) {
            if (target.length !== 1) {
                system.run(() => player.sendMessage(rawtextTranslate("command.playerSelector.invalid")));
                return { status: 1 };
            }
            if (target[0].isOperator()) {
                system.run(() => player.sendMessage(rawtextTranslate("command.playerSelector.admin")));
                return { status: 1 };
            }
            system.run(() => {
                matrixKick(target[0] as Player, undefined, player.name);
                world.sendMessage(rawtextTranslate("command.kick.finish", target[0].name, player.name));
            });
            return { status: 0 };
        }
    },
    {
        cc: {
            name: "m:mute",
            description: "Mutes a player for a certain time.",
            permissionLevel: 2,
            mandatoryParameters: [
                {
                    name: "target",
                    type: CustomCommandParamType.PlayerSelector,
                },
                {
                    name: "minute",
                    type: CustomCommandParamType.Integer,
                }
            ],
        },
        cb(player, target, time) {
            if (target.length !== 1) {
                system.run(() => player.sendMessage(rawtextTranslate("command.playerSelector.invalid")));
                return { status: 1 };
            }
            if (target[0].isOperator()) {
                system.run(() => player.sendMessage(rawtextTranslate("command.playerSelector.admin")));
                return { status: 1 };
            }
            const muteTime = (time as number) * 60000;
            if (muteTime <= 0) {
                system.run(() => player.sendMessage(rawtextTranslate("command.number.positive")));
                return { status: 1 };
            }
            muteHandler.mute(target[0] as Player, muteTime);
            world.sendMessage(rawtextTranslate("command.mute.finish", target[0].name, player.name));
            return { status: 0 };
        }
    },
    {
        cc: {
            name: "m:unmute",
            description: "Unmutes a player.",
            permissionLevel: 2,
            mandatoryParameters: [
                {
                    name: "target",
                    type: CustomCommandParamType.PlayerSelector,
                }
            ]
        },
        cb(player, target) {
            if (target.length !== 1) {
                system.run(() => player.sendMessage(rawtextTranslate("command.playerSelector.invalid")));
                return { status: 1 };
            }
            if (target[0].isOperator()) {
                system.run(() => player.sendMessage(rawtextTranslate("command.playerSelector.admin")));
                return { status: 1 };
            }
            const targetPlayer = target[0] as Player;
            if (!muteHandler.isMuted(targetPlayer)) {
                system.run(() => player.sendMessage(rawtextTranslate("command.unmute.notfound", targetPlayer.name)));
                return { status: 1 };
            }
            muteHandler.unmute(targetPlayer);
            world.sendMessage(rawtextTranslate("command.unmute.finish", targetPlayer.name, player.name));
            return { status: 0 };
        }
    }
] as cmd[];