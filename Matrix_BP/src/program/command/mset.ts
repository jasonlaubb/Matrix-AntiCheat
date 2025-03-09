import { system } from "@minecraft/server";
import { Command, Config } from "../../matrixAPI";
import { fastText, rawtextTranslate } from "../../util/rawtext";
import { ModalFormData } from "@minecraft/server-ui";
import { waitShowModalForm } from "../../util/util";
const MATCH_REG = /#[(a-zA-Z)|/]+\,[^#,]+#/g
const TEST_REG = /^(#[(a-zA-Z)|/]+\,[^#,]+#)+$/
let part: { [key: string]: number } = {};
new Command()
	.setDescription(rawtextTranslate("command.mset.description"))
	.setName("mset")
	.setMinPermissionLevel(3)
	.setAliases("multiset", "fastset", "fset", "import")
	.onExecute(async (player) => {
		await loop(player);
	})
	.register();
async function loop (player: Player, i = 1) {
	const data = await waitShowModalForm(new ModalFormData()
		.title(rawtextTranslate("command.mset.title"))
		.textField(rawtextTranslate("command.mset.input"), "<key here>")
		.submitButton("Import part " + i), player);
	if (data === null || data.canceled) return;
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
	player.sendMessage(fastText().addText("§bMatrix§a+ §7> §g").addTran("command.mset.success", match.length.toString()).build());
	loop(player, i + 1);
}
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
		player.sendMessage(fastText().addText("§bMatrix§a+ §7> §g").addTran("command.export.title").build());
		system.runTimeout(() => {
			player.sendMessage(outputkey.length > 0 ? outputkey : rawtextTranslate("command.export.empty"));
		})
	})
	.register();