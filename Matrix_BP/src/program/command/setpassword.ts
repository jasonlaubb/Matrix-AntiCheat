import { SHA256 } from "../../node_modules/crypto-es/lib/sha256";
import { Config, Command, Module } from "../../matrixAPI";
import { fastText, rawtextTranslate } from "../../util/rawtext";
const MIN_PASSWORD_LENGTH = 8;
const HIGHER_STRENGTH = true;
new Command()
	.setName("setpassword")
	.setAliases("passwords", "newpassword", "changepassword")
	.setMinPermissionLevel(4)
	.setDescription(rawtextTranslate("command.setpassword.description"))
	.addOption(rawtextTranslate("command.setpassword.password"), rawtextTranslate("command.setpassword.password.description"), "string", {
		lowerLimit: MIN_PASSWORD_LENGTH,
		upperLimit: 18,
	})
	.onExecute(async (player, passwordStr) => {
		const password = passwordStr as string;
		if (HIGHER_STRENGTH && (!caseCheck(password) || !numberCheck(password) || !specialCheck(password))) return player.sendMessage(fastText().addText("§bMatrix§a+ §7> §c").addTran("command.setpassword.strength").build());
		Config.set(["security", "passwordHash"], SHA256(password).toString());
		if (!Module.config.security.containsPassword) {
			Config.set(["security", "containsPassword"], true);
		}
		player.sendMessage(fastText().addText("§bMatrix§a+ §7> §g").addTran("command.setpassword.success").build());
	})
	.register();
new Command()
	.setName("clearpassword")
	.setAliases("deletepassword", "removepassword", "resetpassword")
	.setDescription(rawtextTranslate("command.clearpassword.description"))
	.setMinPermissionLevel(4)
	.onExecute(async (player) => {
		if (!Module.config.security.containsPassword) {
			player.sendMessage(fastText().addText("§bMatrix§a+ §7> §c").addTran("command.clearpassword.already").build());
			return;
		}
		Config.set(["security", "containsPassword"], false);
		player.sendMessage(fastText().addText("§bMatrix§a+ §7> §g").addTran("command.clearpassword.success").build());
	})
	.register();
function caseCheck (password: string) {
	return password !== password.toLowerCase() && password !== password.toUpperCase();
}
function numberCheck (password: string) {
	return password.search(/[0-9]/) !== -1;
}
function specialCheck (password: string) {
	return password.search(/[^a-zA-Z0-9]/) !== -1;
}