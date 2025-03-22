import { BlockVolume, Dimension, GameMode, ItemStack, Player, PlayerBreakBlockAfterEvent, Vector3, world } from "@minecraft/server";
import { Module, IntegratedSystemEvent } from "../../matrixAPI";
import { fastText, rawtextTranslate } from "../../util/rawtext";
import { TickData } from "../import";
import { fastMax, fastMin, distance3d } from "../../util/fastmath";
import oreData from "../../data/oreData";
import { MinecraftDimensionTypes } from "../../node_modules/@minecraft/vanilla-data/lib/index";
import map, { oreBlocks } from "../../data/oreData";
import { invertObject } from "../../util/util";
const mapList = invertObject(map.ore);
const entries = Object.entries(oreData.ore).concat(Object.entries(oreData.nore));
let eventId: IntegratedSystemEvent;
new Module()
	.setName(rawtextTranslate("module.xray.name"))
	.setDescription(rawtextTranslate("module.xray.description"))
	.addCategory("prevention")
	.setToggleId("antiXray")
	.onModuleEnable(() => {
		eventId = Module.subscribePlayerTickEvent(onPlayerTick, true);
		world.afterEvents.playerBreakBlock.subscribe(playerBreakBlock);
	})
	.onModuleDisable(() => {
		Module.clearTickEvent(eventId);
		world.afterEvents.playerBreakBlock.unsubscribe(playerBreakBlock);
	})
	.initPlayer((tickData, _playerId, player) => {
		tickData.xray = {
			lastGenerate: 0,
			lastGenerateLocation: player.location,
			lastGenerateRotArea: getRotArea(player.getRotation().x),
			timeStamp: 0,
		};
		return tickData;
	})
	.register();
function onPlayerTick(tickData: TickData, player: Player) {
	const now = Date.now();
	const config = Module.config.antiXray;
	if (now - tickData.xray.timeStamp >= 1000) {
		const inventory = player.getComponent("inventory")!.container!;
		for (let i = 0; i < inventory.size; i++) {
			const item = inventory.getItem(i);
			if (!item || !item.typeId.startsWith("matrix:")) continue;
			const index: string | undefined = mapList[item.typeId];
			if (index) {
				inventory.setItem(i);
				inventory.addItem(new ItemStack(index, item.amount));
			}
		}
	}
	if (player.dimension.id === MinecraftDimensionTypes.TheEnd || now - tickData.xray.lastGenerate <= config.checkInterval) return tickData;
	const view = getRotArea(tickData.instant.rotation.x);
	let gen = false;
	if (view !== tickData.xray.lastGenerateRotArea) {
		switch (view) {
			case 0: {
				replaceArea(player.dimension, player.location, 0, config.hideVertical.y, config.hideVertical.x);
				break;
			}
			case 1: {
				replaceArea(player.dimension, player.location, config.hideHorizontal.y, config.hideHorizontal.y, config.hideHorizontal.x);
				break;
			}
			case 2: {
				replaceArea(player.dimension, player.location, config.hideVertical.y, 0, config.hideVertical.x);
				break;
			}
		}
		gen = true;
	} else if (distance3d(player.location, tickData.xray.lastGenerateLocation) > config.maxDistance) {
		switch (view) {
			case 0: {
				replaceArea(player.dimension, player.location, 0, config.hideVertical.y, config.hideVertical.x);
				break;
			}
			case 1: {
				replaceArea(player.dimension, player.location, config.hideHorizontal.y, config.hideHorizontal.y, config.hideHorizontal.x);
				break;
			}
			case 2: {
				replaceArea(player.dimension, player.location, config.hideVertical.y, 0, config.hideVertical.x);
				break;
			}
		}
		gen = true;
	}
	if (gen) {
		tickData.xray.lastGenerate = now;
		tickData.xray.lastGenerateLocation = player.location;
		tickData.xray.lastGenerateRotArea = view;
	}
	return tickData;
}
function playerBreakBlock ({ player, brokenBlockPermutation: { type: { id } } }: PlayerBreakBlockAfterEvent) {
	if (player.getGameMode() !== GameMode.creative && Date.now() - (player.xrayLastWarned ?? 0) <= Module.config.antiXray.warnInterval && oreBlocks.includes(id)) {
		player.xrayLastWarned = Date.now();
		player.sendMessage(fastText().addText("§bMatrix§a+ §7> §a").addTran("module.xray.warning").build());
	}
}
const LOWEST_Y = -64;
const HIGHEST_Y = 255;
function replaceArea(dimension: Dimension, location: Vector3, upHeight: number, downHeight: number, horizontal: number) {
	const minLocation = { x: location.x - horizontal, y: fastMin(HIGHEST_Y, fastMax(LOWEST_Y, location.y - downHeight)), z: location.z - horizontal };
	const maxLocation = { x: location.x + horizontal, y: fastMax(LOWEST_Y, fastMin(HIGHEST_Y, location.y + upHeight)), z: location.z + horizontal };
	const volume = new BlockVolume(minLocation, maxLocation);
		for (const [replaceId, withId] of entries) {
			dimension.fillBlocks(volume, withId, {
				blockFilter: {
					includeTypes: [replaceId],
				},
				ignoreChunkBoundErrors: true,
			});
		}
}

function getRotArea(rotX: number) {
	const config = Module.config.antiXray.middleView;
	return rotX > config ? 0 : (rotX < -config ? 2 : 1);
}
