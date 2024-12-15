import { Player, system } from "@minecraft/server";
import { MinecraftEffectTypes } from "../../node_modules/@minecraft/vanilla-data/lib/index";
import { IntegratedSystemEvent, Module } from "../../matrixAPI";
import { rawtextTranslate } from "../../util/rawtext";
let runId: IntegratedSystemEvent;
const invalidSprint = new Module()
	.setName(rawtextTranslate("module.invalidSprint.name"))
	.setDescription(rawtextTranslate("module.invalidSprint.description"))
	.setToggleId("antiInvalidSprint")
	.setPunishment("ban")
	.addCategory("detection")
	.onModuleEnable(() => {
		Module.subscribePlayerTickEvent(tickEvent);
	})
	.onModuleDisable(() => {
		Module.clearPlayerTickEvent(runId);
	});
invalidSprint.register();
function isMovementKeyPressed (player: Player) {
	const { x, y } = player.inputInfo.getMovementVector();
	return x !== 0 || y !== 0;
}
function tickEvent (player: Player) {
	if (!player.isSprinting) return;
	if (player.isSneaking || !isMovementKeyPressed(player)) {
		player.flag(invalidSprint);
	} else if (player.getEffect(MinecraftEffectTypes.Blindness)) {
		system.run(() => {
			const stillEffect = player.getEffect(MinecraftEffectTypes.Blindness);
			if (stillEffect && player.isSprinting) {
				player.flag(invalidSprint);
			}
		})
	}
}