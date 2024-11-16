import { Player, Vector3 } from "@minecraft/server";
import { IntegratedSystemEvent, Module } from "../../matrixAPI";
import { rawtextTranslate } from "../../util/rawtext";
let eventId: IntegratedSystemEvent;
interface PhaseDataMap {
	lastLocation: Vector3;
	last2Location: Vector3;
	last3Location: Vector3;
	lastSpeed: number;
	last2Speed: number;
	last3Speed: number;
}
const phaseDataMap = new Map<string, PhaseDataMap>();
const antiPhase = new Module()
	.addCategory("detection")
	.setName(rawtextTranslate("module.phase.name"))
	.setDescription(rawtextTranslate("module.phase.description"))
	.setToggleId("antiPhase")
	.setPunishment("ban")
	.initPlayer((playerId, player) => {
		phaseDataMap.set(playerId, {
			lastLocation: player.location,
			last2Location: player.location,
			last3Location: player.location,
			lastSpeed: 0,
			last2Speed: 0,
			last3Speed: 0,
		})
	})
	.initClear((playerId) => {
		phaseDataMap.delete(playerId);
	})
	.onModuleEnable(() => {
		eventId = Module.subscribePlayerTickEvent(tickEvent);
	})
	.onModuleDisable(() => {
		Module.clearPlayerTickEvent(eventId);
		phaseDataMap.clear();
	})
antiPhase.register();
/**
 * @author jasonlaubb
 * @description The horizontal phase detection system, used the property of bds prediction to have the accurate flag.
 */
function tickEvent (player: Player) {
	const data = phaseDataMap.get(player.id)!;
	const { x, y, z } = player.getVelocity();
	const currentSpeed = Math.hypot(x, z);
	let clipStartLocation: Vector3 | undefined = undefined;
	if (data.last2Speed < 0.25 && data.lastSpeed > 0.7 && currentSpeed < 0.25 && data.last2Speed == currentSpeed) {
		clipStartLocation = data.last2Location;
	} else if (data.last3Speed < 0.25 && data.last2Speed > 0.7 && data.lastSpeed == data.last2Speed && currentSpeed < 0.25) {
		clipStartLocation = data.last3Location;
	}
	if (clipStartLocation && Math.abs(y) < 0.7) {
		const chunks = straightLocations(clipStartLocation, player.location);
		if (chunks.some((block) => {
			try {
				return player.dimension.getBlock(block)?.isSolid;
			} catch {
				return false;
			}
		})) {
			player.teleport(clipStartLocation);
			player.flag(antiPhase);
		}
	}
	// Update data value.
	data.last3Location = data.last2Location;
	data.last2Location = data.lastLocation;
	data.lastLocation = player.location;
	data.last3Speed = data.last2Speed;
	data.last2Speed = data.lastSpeed;
	data.lastSpeed = currentSpeed;
	phaseDataMap.set(player.id, data);
}
function straightLocations (start: Vector3, end: Vector3): Vector3[] {
    const chunks: Vector3[] = [];
    const { x: startX, z: startZ } = start;
    const { x: endX, y, z: endZ } = end;

    const dx = endX - startX;
    const dz = endZ - startZ;

    const stepsX = Math.abs(dx);
    const stepsZ = Math.abs(dz);

    const steps = Math.max(stepsX, stepsZ);

    const xIncrement = stepsX === 0 ? 0 : dx / steps;
    const zIncrement = stepsZ === 0 ? 0 : dz / steps;

    for (let i = 1; i < steps; i++) {
        chunks.push({
            x: Math.floor(startX + xIncrement * i),
            z: Math.floor(startZ + zIncrement * i),
            y: y,
        });
    }

    return chunks;
}