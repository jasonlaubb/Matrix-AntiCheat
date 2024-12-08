import { Player } from "@minecraft/server";
import { Command } from "../../matrixAPI";
import { rawtextTranslate } from "../../util/rawtext";
new Command()
    .setName("setrank")
    .setDescription(rawtextTranslate("command.setrank.description"))
    .addOption(rawtextTranslate("command.moderation.target"), rawtextTranslate("command.moderation.target.description"), "player", undefined, false)
    .addOption(rawtextTranslate("command.setrank.rank"), rawtextTranslate("command.setrank.rank.description"), "string", undefined, false)
    .setMinPermissionLevel(2)
    .onExecute(async (player, targetPlayer, rankTarget) => {
        const recivier = targetPlayer as Player;
        const rankString = rankTarget as string;
        const ranks = rankString.split(",").join("//");
        recivier
            .getTags()
            .filter((x) => x.startsWith("matrix:rankTag::"))
            .forEach((x) => recivier.removeTag(x));
        player.addTag("matrix:rankTag::" + ranks);
    })
    .register();
