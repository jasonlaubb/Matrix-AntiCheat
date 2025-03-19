import { BlockVolume, Dimension, Player, system, Vector3 } from "@minecraft/server";
import { Module, IntegratedSystemEvent } from "../../matrixAPI";
import { rawtextTranslate } from "../../util/rawtext";
import { TickData } from "../import";
import { fastMax, fastMin } from "../../util/fastmath";
import oreData from "../../data/oreData";
const entries = Object.entries(oreData.ore).concat(Object.entries(oreData.nore));
let eventId: IntegratedSystemEvent;
new Module()
	.setName(rawtextTranslate("module.xray.name"))
	.setDescription(rawtextTranslate("module.xray.description"))
	.addCategory("prevention")
	.setToggleId("antiXray")
	.onModuleEnable(() => {
		eventId = Module.subscribePlayerTickEvent(onPlayerTick);
	})
	.onModuleDisable(() => {
		Module.clearTickEvent(eventId);
	})
	.initPlayer((tickData, _playerId, player) => {
		tickData.xray = {
			lastGenerate: 0,
			lastGenerateLocation: player.location,
			lastGenerateRotArea: getRotArea(player.getRotation().x),
		};
		return tickData;
	})
	.register();
function onPlayerTick(tickData: TickData, player: Player) {
	return tickData;
}
const LOWEST_Y = -64;
const HIGHEST_Y = 255;
function replaceArea(dimension: Dimension, location: Vector3, upHeight: number, downHeight: number, horizontal: number) {
	const minLocation = { x: location.x - horizontal, y: fastMin(HIGHEST_Y, fastMax(LOWEST_Y, location.y - downHeight)), z: location.z - horizontal };
	const maxLocation = { x: location.x + horizontal, y: fastMax(LOWEST_Y, fastMin(HIGHEST_Y, location.y + upHeight)), z: location.z + horizontal };
	function* replaceArea (): Generator<void, void, void> {
		for (const [replaceId, withId] of entries) {
			const fill = dimension.fillBlocks(new BlockVolume(minLocation, maxLocation), withId, {
				blockFilter: {
					includeTypes: [replaceId]
				},
				ignoreChunkBoundErrors: true,
			});
			if (fill.getCapacity() > 0) {
				yield;
			}
		}
	}
	system.runJob(replaceArea());
}

function getRotArea(rotX: number) {
	const config = Module.config.antiXray.middleView;
	return rotX > config ? 0 : (rotX < -config ? 2 : 1);
}