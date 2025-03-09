import { system } from "@minecraft/server";
import { Command, Config } from "../../matrixAPI";
import { fastText, rawtextTranslate } from "../../util/rawtext";
import { ModalFormData } from "@minecraft/server-ui";
const MATCH_REG = /#[(a-zA-Z)|/]+\,[^#,]+#/g
const TEST_REG = /^(#[(a-zA-Z)|/]+\,[^#,]+#)+$/
new Command()
	.setDescription(rawtextTranslate("command.mset.description"))
	.setName("mset")
	.setMinPermissionLevel(3)
	.setAliases("multiset", "fastset", "fset", "import")
	.onExecute(async (player) => {
		new ModalFormData()
			.title(rawtextTranslate("command.mset.title"))
			.textField(rawtextTranslate("command.mset.input"), "<key here>")
			.submitButton("Press to input")
			//@ts-expect-error
			.show(player)
			.then((data) => {
				if (data.canceled) return;
				const key = data.formValues![0] as string;
				const match = key.match(MATCH_REG);
				if (match === null || TEST_REG.test(key) === false) {
					player.sendMessage(fastText().addText("§bMatrix§a+ §7> §c").addTran("command.mset.error").build());
					return;
				}
				match.forEach((value) => {
					const [key, ...nv] = value.slice(1, -1).split(",");
					player.runChatCommand(`set ${key} "${nv.join(",")}"`)
				});
				player.sendMessage(rawtextTranslate("command.mset.success", match.length.toString()));
			})
	})
	.register();
new Command()
	.setDescription(rawtextTranslate("command.export.description"))
	.setName("export")
	.setMinPermissionLevel(1)
	.setAliases("exportconfig", "eset", "exportsetting", "exportsettings")
	.onExecute(async (player) => {
		const config = Config.getChanges();
		let outputkey = "";
		config.forEach(({ key, value }) => {
			const strkey = key.join("/");
			const type = typeof value;
			const strvalue = type === "boolean" ? (value ? "true" : "false") : value.toString();
			outputkey += `#${strkey},${strvalue}#`;
		})
		player.sendMessage(fastText().addText("§bMatrix§a+ §7> §c").addTran("command.export.title").build());
		system.runTimeout(() => {
			player.sendMessage(outputkey.length > 0 ? outputkey : rawtextTranslate("command.export.empty"));
		})
	})
	.register();