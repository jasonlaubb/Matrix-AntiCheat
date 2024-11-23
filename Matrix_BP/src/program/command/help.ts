import { RawText } from "@minecraft/server";
import { Command } from "../../matrixAPI";
import { fastText, rawtext, rawtextTranslate, tTm } from "../../util/rawtext";

new Command()
	.setName("help")
	.setMinPermissionLevel(1)
	.setAliases("commands")
	.setDescription(rawtextTranslate("command.help.description"))
	.addOption(rawtextTranslate("command.help.command.name"), rawtextTranslate("command.help.command.name.description"), "string", undefined, true)
	.onExecute(async (player, ...args) => {
		const targetCommand = args[0] as string;
		if (targetCommand) {
			const command = Command.searchCommand(targetCommand);
			if (!command) {
				player.sendMessage(rawtextTranslate("command.help.target.notfound", targetCommand));
				return;
			}
			let message = fastText()
				.addText("§bMatrix§a+ 7> §g")
				.endline()
				.addTran("command.help.target.title", targetCommand)
				.endline()
				.addTranRaw("command.help.m.description", tTm(command.description))
				.endline()
				.addRaw(usageGenerator(command))
				.endline()
			command.requiredOption.forEach((option) => {
				message
					.addText("§e- ")
					.addRaw(tTm(option.name))
					.endline()
					.addTranRaw("command.help.target.description", tTm(option.description))
					.endline()
					.addTranRaw("command.help.target.type", rawtextTranslate("command.help.target.type." + option.type))
					.endline()
			})
			command.optionalOption.forEach((option) => {
				message
					.addText("§e- ")
					.addRaw(tTm(option.name))
					.addTran("command.help.target.optional")
					.endline()
					.addTranRaw("command.help.target.description", tTm(option.description))
					.endline()
					.addTranRaw("command.help.target.type", rawtextTranslate("command.help.target.type." + option.type))
					.endline()
			})
			player.sendMessage(message.build());
		} else {
			let message = fastText()
				.addText("§bMatrix§a+ 7> §g")
				.addTran("command.help.title")
				.endline()
			Command.allCommands.forEach((command) => {
				message
					.addText("§g-" + command.availableId[0])
					.space()
					.addRaw(usageGeneratorRaw(command))
					.addText("§b~ ")
					.addRaw(tTm(command.description))
					.endline()
			})
			// Send the help message
			player.sendMessage(message.build());
		}
	})
function usageGenerator (command: Command): RawText {
	const allRequired = command.requiredOption;
	const allOptional = command.optionalOption;
	if (allRequired.length == 0 && allOptional.length == 0) return rawtextTranslate("command.help.m.usage.empty");
	const usage = fastText()
		.addTran("command.help.m.usage")
		.addText("-" + command.availableId[0])
		.space();
	allRequired.forEach((option) => {
		usage
			.addText("<")
			.addRaw(tTm(option.name))
			.addText(">")
			.space();
	});
	allOptional.forEach((option) => {
		usage
			.addText("[")
			.addRaw(tTm(option.name))
			.addText("]")
			.space();
	});
	return usage.build();
}

function usageGeneratorRaw (command: Command): RawText {
	const allRequired = command.requiredOption;
	const allOptional = command.optionalOption;
	if (allRequired.length == 0 && allOptional.length == 0) return rawtext({ text: " " });
	const usage = fastText();
	allRequired.forEach((option) => {
		usage
			.addText("<")
			.addRaw(tTm(option.name))
			.addText(">")
			.space();
	});
	allOptional.forEach((option) => {
		usage
			.addText("[")
			.addRaw(tTm(option.name))
			.addText("]")
			.space();
	});
	return usage.build();
}