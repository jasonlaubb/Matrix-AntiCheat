import { Dimension, EntityDamageCause, EntityHurtAfterEvent, Player, Vector3, world } from "@minecraft/server";
import { IntegratedSystemEvent, Module } from "../../matrixAPI";
import { rawtextTranslate } from "../../util/rawtext";
interface SpeedDataMap {
	attackTimeStamp: number;
}
const speedDataMap = new Map<string, SpeedDataMap>();
const speed = new Module()
	.addCategory("detection")
	.setName(rawtextTranslate("module.speed.name"))
	.setDescription(rawtextTranslate("module.speed.description"))
	.setToggleId("antiSpeed")
	.setPunishment("ban")
	.onModuleEnable(() => {
		eventId = Module.subscribePlayerTickEvent(tickEvent);
		world.afterEvents.entityHurt.subscribe(entityHurt);
	})
	.onModuleDisable(() => {
		Module.clearPlayerTickEvent(eventId);
		world.afterEvents.entityHurt.unsubscribe(entityHurt);
	})
	.initPlayer((playerId, player) => {
		speedDataMap.set(playerId, {
			attackTimeStamp: 0,
		} as SpeedDataMap);
	})
	.initClear((playerId) => {
		speedDataMap.delete(playerId);
	});
speed.register();
let eventId: IntegratedSystemEvent;
function tickEvent (player: Player) {
	const { x: velocityX, z: velocityZ } = player.getVelocity();
	const speed = Math.hypot(velocityX, velocityZ);
	const data = speedDataMap.get(player.id)!;
	const playerInSolid = isPlayerInsideSolidBlock(player.dimension, player.location);

	// unfinished...
}
function entityHurt ({ damageSource: { cause, damagingEntity: player }}: EntityHurtAfterEvent) {
	if (!player || !(player instanceof Player) || cause != EntityDamageCause.entityAttack) return;
	const data = speedDataMap.get(player.id)!;
	data.attackTimeStamp = Date.now();
	speedDataMap.set(player.id, data);
}

function isPlayerInsideSolidBlock (dimension: Dimension, location: Vector3) {
	try {
		return dimension.getBlock(location)?.isSolid;
	} catch {
		return false;
	}
}