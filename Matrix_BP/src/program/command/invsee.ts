import { Player } from "@minecraft/server";
import * as Inv from "../../assets/inventory";
import { Command } from "../../matrixAPI";
import { fastText, rawtextTranslate } from "../../util/rawtext";
Inv.initializeInventorySync();
new Command()
	.setName("invsee")
	.setMinPermissionLevel(2)
	.setDescription(rawtextTranslate("command.invsee.description"))
	.addOption(rawtextTranslate("command.moderation.target"), rawtextTranslate("command.moderation.target.description"), "player", undefined, false)
	.onExecute(async (player, player2) => {
		const target = player2 as Player;
		if (target.id === player.id) return player.sendMessage(fastText().addText("§bMatrix§a+ §7> §c").addTran("command.invsee.self").build());
		if (!player.hasTag("riding")) Inv.projectPlayerInventory(target, player);
		player.sendMessage(fastText().addText("§bMatrix§a+ §7> §g").addTran("command.invsee.notice").build());
	})
	.register();