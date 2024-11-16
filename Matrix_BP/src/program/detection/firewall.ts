import { PlatformType, PlayerSpawnAfterEvent, world } from "@minecraft/server";
import { Module } from "../../matrixAPI";
import { rawtextTranslate } from "../../util/rawtext";
import { returnTierNumber } from "../../util/util";
new Module()
	.addCategory("detection")
	.setName(rawtextTranslate("module.firewall.name"))
	.setDescription(rawtextTranslate("module.firewall.description"))
	.setToggleId("firewall")
	.onModuleEnable(() => {
		world.afterEvents.playerSpawn.subscribe(playerSpawnAfterEvent);
	})
	.onModuleDisable(() => {
		
	});
/**
 * @author jasonlaubb
 * @description Checks for the render distance.
 * @link Render distances of different console devices - https://www.reddit.com/r/NintendoSwitch/comments/67blwn/render_distance_in_minecraft_switch_changes/
 * @link Common max and min render distance - https://minecraftbedrock-archive.fandom.com/wiki/Render_Distance
 */
function playerSpawnAfterEvent (event: PlayerSpawnAfterEvent) {
	const player = event.player;
	if (!event.initialSpawn || player.isAdmin()) return;
	const systemInfo = player.clientSystemInfo;
	const playerRenderDistanceLimit = systemInfo.maxRenderDistance;
	const playerMemoryTier = systemInfo.memoryTier;
	const platformType = systemInfo.platformType;
	let limitThreshold = 96;
	let minThreshold = 6;
	const tierNumber = returnTierNumber(playerMemoryTier);
	switch (platformType) {
		// 8 GB Mobile
		case PlatformType.Mobile: {
			if (tierNumber <= 3) {
				limitThreshold = 22; // Actually this is my 8GB RAM android, any error just tell me.
			} else if (tierNumber == 4) {
				// This is the soft limit of the mobile. So no one will use above 32 [24 GB mobile only].
				limitThreshold = 32;
			}
			break;
		}
		// 8 GB Desktop
		case PlatformType.Desktop: {
			if (tierNumber <= 3) {
				limitThreshold = 50; // Actually this is my 8GB RAM laptop, any error just tell me.
			}
			break;
		}
		// 8 GB Console
		case PlatformType.Console: {
			if (tierNumber <= 2) {
				// Minecraft Switch (included docked)
				limitThreshold = 12;
				minThreshold = 7;
			} else if (tierNumber <= 3) {
				// PS4 or Xbox One
				limitThreshold = 18;
				minThreshold = 12;
			} else {
				// PS5
				limitThreshold = 32;
				minThreshold = 18;
			}
			break;
		}
	}
	if (playerRenderDistanceLimit > limitThreshold || playerRenderDistanceLimit < minThreshold) {
		// Should be replaced by a regular flag method lol
		player.triggerEvent("matrix:tempkick");
	}
}