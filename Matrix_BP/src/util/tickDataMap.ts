import { system, Vector3 } from "@minecraft/server";
import { Module } from "../matrix";
export const tickDataMap = new Map<string, TickDataMap>();
new Module()
	.lockModule()
	.addCategory("system")
	.initPlayer((playerId, player) => {
		tickDataMap.set(playerId, {
			lastLocation: player.location,
			lastOnGroundLocation: player.location,
		})
	})
	.initClear((playerId) => {
		tickDataMap.delete(playerId);
	})
	.onModuleEnable(() => {
		Module.subscribePlayerTickEvent(async (player) => {
			const data = tickDataMap.get(player.id)!;
			if (player.isOnGround) data.lastOnGroundLocation = player.location;
			data.lastLocation = player.location;
			await system.waitTicks(1);
			if (player?.isValid()) tickDataMap.set(player.id, data);
		})
	})
	.register();
interface TickDataMap {
	lastLocation: Vector3;
	lastOnGroundLocation: Vector3;
}