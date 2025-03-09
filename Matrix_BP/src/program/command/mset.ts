import { Command } from "../../matrixAPI";
import { rawtextTranslate } from "../../util/rawtext";
import { ModalFormData } from "@minecraft/server-ui";
new Command()
	.setDescription(rawtextTranslate("command.mset.description"))
	.setName("mset")
	.setMinPermissionLevel(3)
	.setAliases("multiset", "fastset", "fset")
	.onExecute(async (player) => {
		new ModalFormData()
			.title("Input settings (This cannot be undo)")
			.textField("Input key", "<key here>")
			.submitButton("Press to input")
			//@ts-expect-error
			.show(player)
			.then((data) => {
				if (data.canceled) return;
				const key = data.formValues![0] as string;
				const match = key.match(/#[(a-zA-Z)|/]+\,[^#,]+#/g);
				if (match === null) {
					player.sendMessage(rawtextTranslate("command.mset.error"));
					return;
				}
			})
	})