import { GameMode, PlayerPlaceBlockAfterEvent, Vector3, VectorXZ, world } from "@minecraft/server";
import { Module } from "../../matrixAPI";
import { rawtextTranslate } from "../../util/rawtext";
import { calculateAngleFromView, calculateDistance } from "../../util/fastmath";
import { floorLocation, getAngleLimit, getBlockCenterLocation } from "../../util/util";

const ABSOLUTE_DISTANCE = 1.75;
const HIGH_DISTANCE_THRESHOLD = 3.5;
const FLAT_ROTATION_THRESHOLD = 69.5;
const HIGH_ROTATION_THRESHOLD = 79;
const NO_EXTENDER_ROTATION_THRESHOLD = 20;
const GOD_BRIDGE_AMOUNT_LIMIT = 3;
const LOG_CLEAR_TIME = 750;
interface ScaffoldDataMap {
	blockLogs: number[];
	lastPlaceTimeStamp: number;
	lastLocation: Vector3;
	lastDiag: VectorXZ;
	lastExtender: number;
	lastRotX: number;
	potentialDiagFlags: number;
}
const scaffoldDataMap = new Map<string, ScaffoldDataMap>();
const scaffold = new Module()
	.addCategory("detection")
	.setName(rawtextTranslate("module.scaffold.name"))
	.setDescription(rawtextTranslate("module.scaffold.description"))
	.setToggleId("antiScaffold")
	.setPunishment("ban")
	.initPlayer((playerId) => {
		scaffoldDataMap.set(playerId, {
			blockLogs: [],
			lastPlaceTimeStamp: 0,
			lastLocation: { x: 0, y: 0, z: 0 },
			lastDiag: { x: 0, z: 0 },
			lastExtender: 0,
			lastRotX: 0,
			potentialDiagFlags: 0,
		});
	})
	.initClear((playerId) => {
		scaffoldDataMap.delete(playerId);
	})
	.onModuleEnable(() => {
		world.afterEvents.playerPlaceBlock.subscribe(onBlockPlace);
	})
	.onModuleDisable(() => {
		world.afterEvents.playerPlaceBlock.unsubscribe(onBlockPlace);
		scaffoldDataMap.clear();
	});
scaffold.register();
function onBlockPlace (event: PlayerPlaceBlockAfterEvent) {
	const block = event.block;
	const player = event.player;
	if (player.getGameMode() == GameMode.creative || player.isAdmin()) return;
	if (!block?.isValid()) {
		player.flag(scaffold);
		return;
	}
	const { x: rotX, y: rotY } = player.getRotation();
	if (Math.abs(rotX) != 90 && (rotX % 5 == 0 || Number.isInteger(rotX))) {
		player.flag(scaffold);
		return;
	}
	const headLocation = event.player.getHeadLocation();
	const blockCenterLocation = getBlockCenterLocation(block.location);
	const distance = calculateDistance(headLocation, blockCenterLocation);
	if (distance > ABSOLUTE_DISTANCE && Math.abs(rotX) < FLAT_ROTATION_THRESHOLD) {
		const angle = calculateAngleFromView(headLocation, blockCenterLocation, rotY);
		const angleLimit = getAngleLimit(player.clientSystemInfo.platformType);
		if (angle > angleLimit) {
			player.flag(scaffold);
			return;
		}
	}
	if (distance > HIGH_DISTANCE_THRESHOLD && Math.abs(rotX) > HIGH_ROTATION_THRESHOLD) {
		player.flag(scaffold);
		return;
	}
	const floorPlayerLocation = floorLocation(player.location);
	if (player.isJumping) floorPlayerLocation.y--;
	const lowExtenderScaffold = isLowExtenderScaffolding(floorPlayerLocation, blockCenterLocation);
	const data = scaffoldDataMap.get(player.id)!;
	const now = Date.now();
	data.blockLogs.push(now);
	data.blockLogs = data.blockLogs.filter((time) => now - time < LOG_CLEAR_TIME);
	if (lowExtenderScaffold) {
		if (data.blockLogs.length >= GOD_BRIDGE_AMOUNT_LIMIT) {
			player.flag(scaffold);
		} else if (rotX < NO_EXTENDER_ROTATION_THRESHOLD) {
			player.flag(scaffold);
		}
	}
	const fairHeight = block.location.y - player.location.y;
	const isScaffoldHeight = fairHeight > -2.1 && fairHeight <= -1;
	const maxDiagSpeed = calculateDiagSpeedLimit(distance, player.isOnGround, fairHeight, rotX, data.lastRotX);
	const diag = getDiagXZ(block.location, data.lastLocation);
	const { extender, absoluteDistanceX, absoluteDistanceZ } = getDiagLocationData(block.location, player.location);
	const diagScaffold = isDiagScaffold(data.lastDiag, diag);
	if (!player.isFlying && isScaffoldHeight && now - data.lastPlaceTimeStamp < maxDiagSpeed && diagScaffold && (extender - data.lastExtender > 0 || extender < 1)) {
		data.potentialDiagFlags++;
		if (data.potentialDiagFlags >= 3) {
			data.potentialDiagFlags = 0;
			player.flag(scaffold);
		}
	}
	const scaffoldState = !player.isFlying && isScaffolding(extender, data.lastExtender) && isScaffoldHeight;
	if (scaffoldState) {
		if (!diagScaffold || now - data.lastPlaceTimeStamp > 500) data.potentialDiagFlags = 0;
		// unfinished
	}
	// Update data value.
	data.lastPlaceTimeStamp = now;
	data.lastDiag = diag;
	data.lastLocation = block.location;
	data.lastExtender = extender;
	data.lastRotX = rotX;
	scaffoldDataMap.set(player.id, data);
}

function isLowExtenderScaffolding ({ x: x1, y: y1, z: z1 }: Vector3, { x: x2, y: y2, z: z2 }: Vector3): boolean {
	const absDistance = Math.hypot(x2 - x1, z2 - z1);
	const height = y1 - y2;
	return height == 1 && absDistance <= Math.SQRT2;
}

function calculateDiagSpeedLimit (distance: number, isOnGround: boolean, extender: number, rotationX: number, lastRotX: number) {
	const commonScaffold = distance > 0 && distance < 0.3 && isOnGround && extender < 1;
	let diagSpeedLimit = 500;
	if (commonScaffold && lastRotX == rotationX) diagSpeedLimit = 150;
	if ((distance > 0.1 && !isOnGround) || extender >= 1 || distance > 0.5 || rotationX >= 80) diagSpeedLimit = 500;
	if (commonScaffold && lastRotX != rotationX) diagSpeedLimit = 50;
	return diagSpeedLimit;
}

function getDiagLocationData ({ x: blockX, z: blockZ }: Vector3, { x: playerX, z: playerZ }: Vector3) {
	const absoluteDistanceX = Math.abs(blockX - playerX) - 0.2;
	const absoluteDistanceZ = Math.abs(blockZ - playerZ) - 0.2;
	const simulatedDistanceX = Math.abs(blockX + absoluteDistanceX * 2 - playerX);
	const simulatedDistanceZ = Math.abs(blockZ + absoluteDistanceZ * 2 - playerZ);
	let actualDistanceX = absoluteDistanceX;
	let actualDistanceZ = absoluteDistanceZ;
	if (simulatedDistanceX > absoluteDistanceX) actualDistanceX++;
	if (simulatedDistanceZ > absoluteDistanceZ) actualDistanceZ++;
	const extender = Math.hypot(actualDistanceX, actualDistanceZ);
	return { extender, absoluteDistanceX, absoluteDistanceZ };
}

function getDiagXZ ({ x: currentX, z: currentZ }: Vector3, { x: lastX, z: lastZ }: Vector3) {
	return { x: currentX - lastX, z: currentZ - lastZ } as VectorXZ;
}

function isDiagScaffold (lastDiag: VectorXZ, diag: VectorXZ) {
	return (lastDiag.x == 1 && diag.x == 0 && lastDiag.z == 0 && diag.z == 1) || (lastDiag.x == 0 && diag.x == 1 && lastDiag.z == 1 && diag.z == 0);
}

function isScaffolding (extender: number, lastExtender: number) {
	return extender - lastExtender <= 0.1 || extender < 1;
}