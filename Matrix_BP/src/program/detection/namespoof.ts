import { PlayerSpawnAfterEvent, world } from "@minecraft/server";
import { Module } from "../../matrixAPI";
import { rawtextTranslate } from "../../util/rawtext";
const namespoof = new Module()
	.addCategory("detection")
	.setName(rawtextTranslate("module.namespoof.name"))
	.setDescription(rawtextTranslate("module.namespoof.description"))
	.setToggleId("antiNamespoof")
	.setPunishment("ban")
	.onModuleEnable(() => {
		world.afterEvents.playerSpawn.subscribe(playerSpawn);
	})
	.onModuleDisable(() => {
		world.afterEvents.playerSpawn.unsubscribe(playerSpawn);
	})
namespoof.register();
/**
 * @author jasonlaubb
 * @description Anti namespoof... just as same as the module name "Anti namespoof".
 */
function playerSpawn ({ player, initialSpawn } : PlayerSpawnAfterEvent) {
	if (!initialSpawn || player.isAdmin()) return;
	const name = player.name;
	if (name.length < 3 || name.length > 16) {
		player.flag(namespoof);
		return;
	}
	const isXboxName = (/^[\u0041-\u005A\u0061-\u007A\u00C0-\u017F\u0180-\u024F\uAC00-\uD7A3\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF\u0900-\u097F\u0980-\u09FF\u0400-\u04FF\u0370-\u03FF\u0E00-\u0E7F\s\_]{3,16}$/).test(name);
	if (!isXboxName) {
		player.flag(namespoof);
	}
}