import { Player, world } from "@minecraft/server";
import { Command } from "../../matrixAPI";
import { fastText, rawtextTranslate } from "../../util/rawtext";
// Import all moderation functions (Quite a lot lol)
import { tempKick, ban, mute, softBan, strengthenKick, freeze, warn, unBan, unMute, unSoftBan, unFreeze, clearWarn, isBanned, isSoftBanned, isMuted, isFrozen, isUnBanned, isWarned, getWarns } from "../system/moderation";
function minuteToMilliseconds(minute: number): number {
    return minute * 60000;
}
new Command()
    .setName("tempkick")
    .setDescription(rawtextTranslate("command.tempkick.description"))
    .setMinPermissionLevel(2)
    .addOption(rawtextTranslate("command.moderation.target"), rawtextTranslate("command.moderation.target.description"), "target", undefined, false)
    .onExecute(async (player, target) => {
        const targetPlayer = target as Player;
        // Finish the action
        tempKick(targetPlayer);
        world.sendMessage(fastText().addText("§bMatrix§a+ §7> §g").addTranRawText("command.moderation.success", fastText().addText(targetPlayer.name).addText(player.name).addTran("command.moderation.tempkick").build()).build());
    })
    .register();
new Command()
    .setName("kick")
    .setDescription(rawtextTranslate("command.kick.description"))
    .setMinPermissionLevel(2)
    .addOption(rawtextTranslate("command.moderation.target"), rawtextTranslate("command.moderation.target.description"), "target", undefined, false)
    .onExecute(async (player, target) => {
        const targetPlayer = target as Player;
        // Finish the action
        strengthenKick(targetPlayer);
        world.sendMessage(fastText().addText("§bMatrix§a+ §7> §g").addTranRawText("command.moderation.success", fastText().addText(targetPlayer.name).addText(player.name).addTran("command.moderation.kick").build()).build());
    })
    .register();
new Command()
    .setName("ban")
    .setDescription(rawtextTranslate("command.ban.description"))
    .setMinPermissionLevel(2)
    .addOption(rawtextTranslate("command.moderation.target"), rawtextTranslate("command.moderation.target.description"), "target", undefined, false)
    .addOption(
        rawtextTranslate("command.moderation.duration"),
        rawtextTranslate("command.moderation.duration.description"),
        "integer",
        {
            lowerLimit: 0,
            upperLimit: 525600,
        },
        true
    )
    .onExecute(async (player, target, duration) => {
        const targetPlayer = target as Player;
        // Finish the action
        const msDuration = minuteToMilliseconds(duration as number);
        if (isBanned(targetPlayer.name)) return player.sendMessage(fastText().addText("§bMatrix§a+ §7> §c").addTran("command.moderation.removal.failed").build());
        ban(targetPlayer, msDuration);
        world.sendMessage(fastText().addText("§bMatrix§a+ §7> §g").addTranRawText("command.moderation.success", fastText().addText(targetPlayer.name).addText(player.name).addTran("command.moderation.ban").build()).build());
    })
    .register();
new Command()
    .setName("softban")
    .setDescription(rawtextTranslate("command.softban.description"))
    .setMinPermissionLevel(2)
    .addOption(rawtextTranslate("command.moderation.target"), rawtextTranslate("command.moderation.target.description"), "target", undefined, false)
    .addOption(
        rawtextTranslate("command.moderation.duration"),
        rawtextTranslate("command.moderation.duration.description"),
        "integer",
        {
            lowerLimit: 0,
            upperLimit: 525600,
        },
        true
    )
    .onExecute(async (player, target, duration) => {
        const targetPlayer = target as Player;
        // Finish the action
        const msDuration = minuteToMilliseconds(duration as number);
        if (isSoftBanned(targetPlayer)) return player.sendMessage(fastText().addText("§bMatrix§a+ §7> §c").addTran("command.moderation.removal.failed").build());
        softBan(targetPlayer, msDuration);
        world.sendMessage(fastText().addText("§bMatrix§a+ §7> §g").addTranRawText("command.moderation.success", fastText().addText(targetPlayer.name).addText(player.name).addTran("command.moderation.softban").build()).build());
    })
    .register();
new Command()
    .setName("mute")
    .setDescription(rawtextTranslate("command.mute.description"))
    .setMinPermissionLevel(2)
    .addOption(rawtextTranslate("command.moderation.target"), rawtextTranslate("command.moderation.target.description"), "target", undefined, false)
    .addOption(
        rawtextTranslate("command.moderation.duration"),
        rawtextTranslate("command.moderation.duration.description"),
        "integer",
        {
            lowerLimit: 0,
            upperLimit: 525600,
        },
        true
    )
    .onExecute(async (player, target, duration) => {
        const targetPlayer = target as Player;
        // Finish the action
        const msDuration = minuteToMilliseconds(duration as number);
        if (isMuted(targetPlayer)) return player.sendMessage(fastText().addText("§bMatrix§a+ §7> §c").addTran("command.moderation.removal.failed").build());
        mute(targetPlayer, msDuration);
        world.sendMessage(fastText().addText("§bMatrix§a+ §7> §g").addTranRawText("command.moderation.success", fastText().addText(targetPlayer.name).addText(player.name).addTran("command.moderation.mute").build()).build());
    })
    .register();
new Command()
    .setName("freeze")
    .setDescription(rawtextTranslate("command.freeze.description"))
    .setMinPermissionLevel(2)
    .addOption(rawtextTranslate("command.moderation.target"), rawtextTranslate("command.moderation.target.description"), "target", undefined, false)
    .addOption(
        rawtextTranslate("command.moderation.duration"),
        rawtextTranslate("command.moderation.duration.description"),
        "integer",
        {
            lowerLimit: 0,
            upperLimit: 525600,
        },
        true
    )
    .onExecute(async (player, target, duration) => {
        const targetPlayer = target as Player;
        // Finish the action
        const msDuration = minuteToMilliseconds(duration as number);
        if (isFrozen(targetPlayer)) return player.sendMessage(fastText().addText("§bMatrix§a+ §7> §c").addTran("command.moderation.removal.failed").build());
        freeze(targetPlayer, msDuration);
    })
    .register();
new Command()
    .setName("unban")
    .setDescription(rawtextTranslate("command.unban.description"))
    .setMinPermissionLevel(2)
    .addOption(rawtextTranslate("command.moderation.target"), rawtextTranslate("command.moderation.target.description"), "string", undefined, false)
    .onExecute(async (player, target) => {
        const targetPlayer = target as string;
        if (!isBanned(targetPlayer) || isUnBanned(targetPlayer)) return player.sendMessage(fastText().addText("§bMatrix§a+ §7> §c").addTran("command.moderation.removal.failed").build());
        unBan(targetPlayer);
        world.sendMessage(fastText().addText("§bMatrix§a+ §7> §g").addTranRawText("command.moderation.success", fastText().addText(targetPlayer).addText(player.name).addTran("command.moderation.unban").build()).build());
    })
    .register();
new Command()
    .setName("unmute")
    .setDescription(rawtextTranslate("command.unmute.description"))
    .setMinPermissionLevel(2)
    .addOption(rawtextTranslate("command.moderation.target"), rawtextTranslate("command.moderation.target.description"), "string", undefined, false)
    .onExecute(async (player, target) => {
        const targetPlayer = target as Player;
        if (!isMuted(targetPlayer)) return player.sendMessage(fastText().addText("§bMatrix§a+ §7> §c").addTran("command.moderation.removal.failed").build());
        unMute(targetPlayer);
        world.sendMessage(fastText().addText("§bMatrix§a+ §7> §g").addTranRawText("command.moderation.success", fastText().addText(targetPlayer.name).addText(player.name).addTran("command.moderation.unmute").build()).build());
    })
    .register();
new Command()
    .setName("unfreeze")
    .setDescription(rawtextTranslate("command.unfreeze.description"))
    .setMinPermissionLevel(2)
    .addOption(rawtextTranslate("command.moderation.target"), rawtextTranslate("command.moderation.target.description"), "string", undefined, false)
    .onExecute(async (player, target) => {
        const targetPlayer = target as Player;
        if (!isFrozen(targetPlayer)) return player.sendMessage(fastText().addText("§bMatrix§a+ §7> §c").addTran("command.moderation.removal.failed").build());
        unFreeze(targetPlayer);
        world.sendMessage(fastText().addText("§bMatrix§a+ §7> §g").addTranRawText("command.moderation.success", fastText().addText(targetPlayer.name).addText(player.name).addTran("command.moderation.unfreeze").build()).build());
    })
    .register();
new Command()
    .setName("unsoftban")
    .setDescription(rawtextTranslate("command.unsoftban.description"))
    .setMinPermissionLevel(2)
    .addOption(rawtextTranslate("command.moderation.target"), rawtextTranslate("command.moderation.target.description"), "string", undefined, false)
    .onExecute(async (player, target) => {
        const targetPlayer = target as Player;
        if (!isSoftBanned(targetPlayer)) return player.sendMessage(fastText().addText("§bMatrix§a+ §7> §c").addTran("command.moderation.removal.failed").build());
        unSoftBan(targetPlayer);
        world.sendMessage(fastText().addText("§bMatrix§a+ §7> §g").addTranRawText("command.moderation.success", fastText().addText(targetPlayer.name).addText(player.name).addTran("command.moderation.unsoftban").build()).build());
    })
    .register();
new Command()
    .setName("warn")
    .setDescription(rawtextTranslate("command.warn.description"))
    .setMinPermissionLevel(2)
    .addOption(rawtextTranslate("command.moderation.target"), rawtextTranslate("command.moderation.target.description"), "target", undefined, false)
    .onExecute(async (player, target) => {
        const targetPlayer = target as Player;
        // Finish the action
        warn(targetPlayer);
        world.sendMessage(
            fastText()
                .addText("§bMatrix§a+ §7> §g")
                .addTranRawText(
                    "command.moderation.success",
                    fastText()
                        .addText(targetPlayer.name)
                        .addText(player.name)
                        .addTran("command.moderation.warn", targetPlayer.name)
                        .build()
                )
                .endline()
                .addTran("command.warn.amount", getWarns(targetPlayer)?.toString() ?? "0")
                .build()
        );
    })
    .register();
new Command()
    .setName("clearwarn")
    .setDescription(rawtextTranslate("command.clearwarn.description"))
    .setMinPermissionLevel(2)
    .addOption(rawtextTranslate("command.moderation.target"), rawtextTranslate("command.moderation.target.description"), "target", undefined, false)
    .onExecute(async (player, target) => {
        const targetPlayer = target as Player;
        // Finish the action
        if (!isWarned(targetPlayer)) return player.sendMessage(fastText().addText("§bMatrix§a+ §7> §c").addTran("command.moderation.clearwarn.failed").build());
        clearWarn(targetPlayer);
        world.sendMessage(fastText().addText("§bMatrix§a+ §7> §g").addTranRawText("command.moderation.success", fastText().addText(targetPlayer.name).addText(player.name).addTran("command.moderation.clearwarn").build()).build());
    })
    .register();
