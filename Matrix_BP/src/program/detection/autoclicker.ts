import { EntityHitEntityAfterEvent, Player, system, world } from "@minecraft/server";
import { Module } from "../../matrixAPI";
import { rawtextTranslate } from "../../util/rawtext";
let playerCPS: { [key: string]: number[] } = {};
const CLICK_DURATION = 1500;
let runId: number;
new Module()
	.setName(rawtextTranslate("module.autoclicker.name"))
	.setDescription(rawtextTranslate("module.autoclicker.description"))
	.setToggleId("antiAutoClicker")
	.setPunishment("kick")
	.onModuleEnable(() => {
		runId = system.runInterval(tickEvent, 20);
		world.afterEvents.entityHitEntity.subscribe(entityHit);
	})
	.onModuleDisable(() => {
		system.clearRun(runId);
		world.afterEvents.entityHitEntity.unsubscribe(entityHit);
	})
	.initPlayer((playerId) => {
		playerCPS[playerId] = [];
	})
	.initClear((playerId) => {
		delete playerCPS[playerId];
	})
	.register();
	function tickEvent () {
	const allPlayers = Module.allNonAdminPlayers;
	const maxCps = Module.config.antiAutoClicker.maxCps;
	for (const player of allPlayers) {
		playerCPS[player.id] = playerCPS[player.id].filter((arr) => Date.now() - arr < CLICK_DURATION);
		const cps = playerCPS[player.id].length;
		if (cps > maxCps) {
			player.sendMessage(rawtextTranslate("module.autoclicker.reach", maxCps.toString(), cps.toString()));
			player.addTag("matrix:cps-limited");
			player.addTag("matrix:pvp-disabled");

		} else if (player.hasTag("matrix:cps-limited")) {
			player.removeTag("matrix:cps-limited");
			player.removeTag("matrix:pvp-disabled");
		}
	}
}
function entityHit ({ damagingEntity: player }: EntityHitEntityAfterEvent) {
	if (!(player instanceof Player) || player.isAdmin()) return;
	playerCPS[player.id].push(Date.now());
}