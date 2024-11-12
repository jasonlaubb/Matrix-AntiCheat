import { Player } from "@minecraft/server";
import { Module } from "../../index";
import { rawtextTranslate } from "../../util/rawtext";
let tickEventId: any;
new Module()
	.setName(rawtextTranslate("module.anti.fly.name"))
	.setDescription(rawtextTranslate("module.anti.fly.description"))
	.setToggleId("antiFly")
	.onModuleEnable(() => {
		tickEventId = Module.subscribePlayerTickEvent(tickEvent, false);
	})
	.onModuleDisable(() => {
		Module.subscribePlayerTickEvent(tickEventId, false);
	})
	.register();

function tickEvent (player: Player) {
	const { x: velocityX, y: verticalVelocity, z: velocityZ } = player.getVelocity();
	const horizontalVelocity = Math.hypot(velocityX, velocityZ);
	// unfinished, this is just a template :3 by jasonlaubb
}
