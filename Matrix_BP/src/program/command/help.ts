import { RawText } from "@minecraft/server";
import { Command } from "../../matrixAPI";
import { fastText, rawtext, rawtextTranslate } from "../../util/rawtext";

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
                .addTranRaw("command.help.m.description", command.description.rawtext![0])
                .endline()
                .addRawText(usageGenerator(command))
                .endline();
            command.requiredOption.forEach((option) => {
                message
                    .addText("§e- ")
                    .addRawText(option.name)
                    .endline()
                    .addTranRaw("command.help.target.description", option.description)
                    .endline()
                    .addTranRaw("command.help.target.type", rawtextTranslate("command.help.target.type." + option.type))
                    .endline();
            });
            command.optionalOption.forEach((option) => {
                message
                    .addText("§e- ")
                    .addRawText(option.name)
                    .addTran("command.help.target.optional")
                    .endline()
                    .addTranRaw("command.help.target.description", option.description)
                    .endline()
                    .addTranRaw("command.help.target.type", rawtextTranslate("command.help.target.type." + option.type))
                    .endline();
            });
            player.sendMessage(message.build());
        } else {
            let message = fastText().addText("§bMatrix§a+ 7> §g").addTran("command.help.title").endline();
            Command.allCommands.forEach((command) => {
                message
                    .addText("§g-" + command.availableId[0])
                    .space()
                    .addRawText(usageGeneratorRaw(command))
                    .addText("§b~ ")
                    .addRawText(command.description)
                    .endline();
            });
            // Send the help message
            player.sendMessage(message.build());
        }
    })
	.register();
function usageGenerator(command: Command): RawText {
    const allRequired = command.requiredOption;
    const allOptional = command.optionalOption;
    if (allRequired.length == 0 && allOptional.length == 0) return rawtextTranslate("command.help.m.usage.empty");
    const usage = fastText()
        .addTran("command.help.m.usage")
        .addText("-" + command.availableId[0])
        .space();
    allRequired.forEach((option) => {
        usage.addText("<").addRawText(option.name).addText(">").space();
    });
    allOptional.forEach((option) => {
        usage.addText("[").addRawText(option.name).addText("]").space();
    });
    return usage.build();
}

function usageGeneratorRaw(command: Command): RawText {
    const allRequired = command.requiredOption;
    const allOptional = command.optionalOption;
    if (allRequired.length == 0 && allOptional.length == 0) return rawtext({ text: " " });
    const usage = fastText();
    allRequired.forEach((option) => {
        usage.addText("<").addRawText(option.name).addText(">").space();
    });
    allOptional.forEach((option) => {
        usage.addText("[").addRawText(option.name).addText("]").space();
    });
    return usage.build();
}
