import { Player } from "@minecraft/server";
import { Module, Command } from "../../matrix";
import { fastText } from "../../util/rawtext";

new Command()
	.setName("about")
	.setAliases("info", "version", "ver", "information", "uwu")
	.setMinPermissionLevel(0)
	.onExecute(async (player: Player) => {
		const aboutMessage = fastText()
			.addTran("command.about.title")
			.endline()
			.addTran("command.about.author")
			.endline()
			.addTran("command.about.github", "https://github.com/jasonlaubb/Matrix-AntiCheat/")
			.endline()
			.addTran("command.about.version", Module.version.join("."))
			.endline()
			.addTran("command.about.joindc", "CqZGXeRKPJ")
			.build();
		player.sendMessage(aboutMessage);

	})
	.register();