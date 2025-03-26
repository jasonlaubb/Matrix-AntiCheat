import { ActionFormData, ModalFormData } from "@minecraft/server-ui";
import { Player, world } from "@minecraft/server";
import { rawtextTranslate, fastText } from "../util/rawtext";
import { cmdType } from "../data/category";
import { waitShowActionForm } from "../util/util";
import { Command, Module } from "../matrixAPI";
export default async function (player: Player) {
	let allCommands = Command.allCommands;
	if (Module.config.customize.commandCategory) {
		const result = await extraUI(player);
		if (!result) return;
		allCommands = result;
	}
		const ui2 = new ActionFormData().title(rawtextTranslate("directpanel.title")).body(rawtextTranslate("directpanel.body"));
        for (const command of allCommands) {
            const theAction = command.shortDescription ?? command.description;
            const commandId = command.availableId[0];
            ui2.button(fastText().addText("§7．§1").addRawText(theAction).addText("§7．§j").endline().addTran("directpanel.button", commandId).build(), command.buttonIcon);
        }
        // Close the chat and continue... Easy right?
        const result2 = await waitShowActionForm(ui2, player);
        if (!result2 || result2.canceled) return;
        const commandSelected = allCommands[result2.selection!];
        let currentCommand = [commandSelected.availableId[0]];
        for (const requiredOption of commandSelected.requiredOption) {
            const body = fastText()
                .addTranRawText("command.help.target.type", rawtextTranslate(Command.typeTransferKey(requiredOption.type)))
                .endline()
                .addTranRawText("command.help.target.description", requiredOption.description)
                .endline()
                .addTranRawText("command.help.target.name", requiredOption.name)
                .endline()
                .addText("§bMatrix§a+ §7> §g")
                .addTran("directpanel.enter")
                .build();
            const ui3 = new ModalFormData().title(rawtextTranslate("directpanel.build"));
            const playerNameArray = world.getAllPlayers().map(({ name }) => name);
            const notPlayerTarget = requiredOption.type !== "player" && requiredOption.type !== "target";
            const isChoice = requiredOption.type === "choice";
            const isBoolean = requiredOption.type === "boolean";
            if (isChoice) {
                ui3.dropdown(body, requiredOption.typeInfo!.arrayRange!, 0);
            } else if (isBoolean) {
                ui3.dropdown(body, ["True (1)", "False (0)"], 0);
            } else if (notPlayerTarget) {
                ui3.textField(body, "Type here...");
            } else {
                ui3.dropdown(body, playerNameArray, 0);
            }
            //@ts-expect-error
            const result3 = await ui3.show(player);
            if (result3.canceled || (result3.formValues![0] as string).length == 0) return;
            currentCommand.push(isChoice ? requiredOption.typeInfo!.arrayRange![result3.formValues![0] as number] : (isBoolean ? (result3.formValues![0] as number).toString() : (notPlayerTarget ? result3.formValues![0] as string : playerNameArray[result3.formValues![0] as number])));
        }
        for (const optionalOption of commandSelected.optionalOption) {
            const body = fastText()
                .addTranRawText("command.help.target.type", rawtextTranslate(Command.typeTransferKey(optionalOption.type)))
                .endline()
                .addTranRawText("command.help.target.description", optionalOption.description)
                .endline()
                .addTranRawText("command.help.target.name", optionalOption.name)
                .endline()
                .addText("§bMatrix§a+ §7> §g")
                .addTran("directpanel.enter")
                .build();
            const ui = new ModalFormData().title(rawtextTranslate("directpanel.build"));
            const playerNameArray = world.getAllPlayers().map(({ name }) => name);
            const notPlayerTarget = optionalOption.type !== "player" && optionalOption.type !== "target";
            const isChoice = optionalOption.type === "choice";
            const isBoolean = optionalOption.type === "boolean";
            if (isChoice) {
                ui.dropdown(body, optionalOption.typeInfo!.arrayRange!, 0);
            } else if (isBoolean) {
                ui.dropdown(body, ["True (1)", "False (0)"], 0)
            }else if (notPlayerTarget) {
                ui.textField(body, "Keep this empty to skip (optional)");
            } else {
                ui.dropdown(body, playerNameArray, 0);
            }
			//@ts-expect-error
            const result = await ui.show(player);
            if (result.canceled) return;
            if ((result.formValues![0] as string).length == 0) {
                break;
            }
            currentCommand.push(isChoice ? optionalOption.typeInfo!.arrayRange![result.formValues![0] as number] : (isBoolean ? (result.formValues![0] as number).toString() : (notPlayerTarget ? result.formValues![0] as string : playerNameArray[result.formValues![0] as number])));
        }
        // Run the command for it.
        player.runChatCommand(...currentCommand);
    }
async function extraUI (player: Player) {
	const ui = new ActionFormData().title(rawtextTranslate("directpanel.title")).body(rawtextTranslate("directpanel.body"));
	for (const { name, icon } of cmdType) {
		ui.button(name, icon);
	}
	const result = await waitShowActionForm(ui, player);
	if (!result || result.canceled) return undefined;
	const sel = result.selection!;
	const isLastButton = sel === cmdType.length - 1;
	const allCommands = Command.allCommands.filter(({ tag }) => {
		if (!tag) return isLastButton;
		return sel === tag;
	});
	return allCommands;
}