import { Player } from "@minecraft/server";
import { IntegratedSystemEvent, Module } from "../../matrixAPI";
import { rawtextTranslate } from "../../util/rawtext";
import { fastAbs, fastFloor } from "../../util/fastmath";
import { getAbsoluteGcd, arrayToList, getAverageDifference } from "../../util/assets";
const EMPTY_ARRAY = new Array(100).fill(0);
interface AimData {
	buffer: number[];
	initialize: {
		i: number,
		state: boolean,
	},
	previousYaw: number[];
	previousPitch: number[];
	previousDeltaYaw: number[];
	previousDeltaPitch: number[];
	lastFlagTimestamp: number;
}
let eventId: IntegratedSystemEvent;
const aimData = new Map<string, AimData>();
const aim = new Module()
	.addCategory("detection")
	.setName(rawtextTranslate("module.aim.name"))
	.setDescription(rawtextTranslate("module.aim.description"))
	.setToggleId("aimCheck")
	.setPunishment("tempKick")
	.onModuleEnable(() => {
		eventId = Module.subscribePlayerTickEvent(tickEvent, false);
	})
	.onModuleDisable(() => {
		Module.clearPlayerTickEvent(eventId);
	})
	.initPlayer((playerId) => {
		aimData.set(playerId, {
			buffer: EMPTY_BUFFER,
			initialize: {
				i: 0,
				state: false,
			},
			previousYaw: EMPTY_ARRAY,
			previousPitch: EMPTY_ARRAY,
			previousDeltaYaw: EMPTY_ARRAY,
			previousDeltaPitch: EMPTY_ARRAY,
			lastFlagTimestamp: 0,
		})
	})
	.initClear((playerId) => {
		aimData.delete(playerId);
	});
aim.register();
function tickEvent (player: Player) {
	let data = aimData.get(player.id)!;
	const { x: yaw, y: pitch } = player.getRotation();
	const deltaYaw = fastAbs(yaw - data.previousYaw[0]);
	const deltaPitch = fastAbs(pitch - data.previousPitch[0]);
	if (data.initialize.state) {
		data = aimModule (player, data, deltaYaw, deltaPitch);
	} else {
		data.initialize.i++;
		if (data.initialize.i > 100) {
			data.initialize.state = true;
			data.initialize.i = 0;
		}
	}
	// Update the data :skull:
	data.previousDeltaPitch.unshift(deltaPitch);
	data.previousDeltaYaw.unshift(deltaYaw);
	data.previousPitch.unshift(yaw);
	data.previousYaw.unshift(pitch);
	data.previousPitch.pop();
	data.previousYaw.pop();
	data.previousDeltaPitch.pop();
	data.previousDeltaYaw.pop();
	aimData.set(player.id, data);
}
const FLAG_VALID_TIMESTAMP = 7000;
const EXTREME_YAW_ACCELERATION = 0.01;
const EXTREME_DELTA_BUFFER = 10;
const DELTA_CHECK_BUFFER = 5;
const AMOUNT_CHECK_BUFFER = 18;
const EMPTY_BUFFER = [0, 0, 0]
/**
 * @author 4urxa
 * @link https://github.com/Dream23322
 * @license GPLv3
 * @description The aim checks from Isolate Anticheat that is made by 4urxa.
 * @link https://github.com/Dream23322/Isolate-Anticheat/tree/2b01e79241f03fbaec9f2e36ec82fbf739fd1434/scripts/checks/combat/aim
 * @credit A big redit to 4urxa. He allowed me to use his code.
 * @recode jasonlaubb
 */
function aimModule (player: Player, tickData: AimData, deltaYaw: number, deltaPitch: number) {
	const data = tickData;
	const deltaPitch2 = data.previousDeltaPitch[0];
	const deltaYaw2 = data.previousDeltaYaw[0];
	const yawAccel = fastAbs(deltaYaw - deltaYaw2);
	const isAttacking = player.hasTag("attackTime");
	const now = Date.now();
	if(deltaYaw > 35 && yawAccel < EXTREME_YAW_ACCELERATION && isAttacking) {
		data.buffer[0]++;
		data.lastFlagTimestamp = now;
		if (data.buffer[0] > EXTREME_DELTA_BUFFER) {
			player.flag(aim);
		}
	}
	if ((deltaPitch % 1 == 0 || deltaYaw % 360 % 1 == 0) && deltaPitch != 0 && deltaYaw != 0) {
		data.buffer[1]++;
		data.lastFlagTimestamp = now;
		if (data.buffer[1] > DELTA_CHECK_BUFFER) {
			player.flag(aim);
		}
	}
	const constantYaw = getAbsoluteGcd(deltaYaw, deltaYaw2);
	const constantPitch = getAbsoluteGcd(deltaPitch, deltaPitch2);
	const divisorX = deltaYaw % constantYaw;
	const divisorY = deltaPitch % constantPitch;
	if ((deltaYaw > 0 && !Number.isFinite(divisorX)) || (deltaPitch > 0 && !Number.isFinite(divisorY))) {
		data.buffer[1]++;
		data.lastFlagTimestamp = now;
		if (data.buffer[1] > DELTA_CHECK_BUFFER) {
			player.flag(aim);
		}
	}
	const currentYaw = deltaYaw / constantYaw;
	const currentPitch = deltaPitch / constantPitch;
	const floorYaw = fastFloor(currentYaw);
	const floorPitch = fastFloor(currentPitch);
	const moduloX = fastAbs(currentYaw - floorYaw);
	const moduloY = fastAbs(currentPitch - floorPitch);
	if ((moduloX > 0.5 && !Number.isFinite(moduloX)) || (moduloY > 0.5 && !Number.isFinite(moduloY))) {
		data.buffer[1]++;
		if (data.buffer[1] > DELTA_CHECK_BUFFER) {
			data.lastFlagTimestamp = now;
			player.flag(aim);
		}
	}
	const previousY = deltaYaw2 / constantYaw;
	const previousX = deltaPitch2 / constantPitch;
	if (deltaYaw > 0 && deltaPitch > 0 && deltaYaw < 20 && deltaPitch < 20) {
		const moduloY = currentYaw % previousY;
		const moduloX = currentPitch % previousX;
		const floorModuloY = fastAbs(fastFloor(moduloY) - moduloY);
		const floorModuloX = fastAbs(fastFloor(moduloX) - moduloX);
		const invalid1 = moduloY > 90 && floorModuloY > 0.1;
		const invalid2 = moduloX > 90 && floorModuloX > 0.1;

		if(invalid1 && invalid2 && isAttacking) {
			data.lastFlagTimestamp = now;
			data.buffer[1]++;
			if (data.buffer[1] > DELTA_CHECK_BUFFER) {
				player.flag(aim);
			}
		}
	}
	const deltaPitchAmount = amountDeltaPitch(5, data.previousDeltaPitch);
	const deltaYawAmount = amountDeltaPitch(5, data.previousDeltaYaw);
	if (deltaPitchAmount && deltaYawAmount) {
		const pitchMagnitude = fastAbs(getAverageDifference(data.previousDeltaPitch));
		const yawMagnitude = fastAbs(getAverageDifference(data.previousDeltaYaw));
		if (pitchMagnitude < 0.3 && yawMagnitude > 5) {
			data.buffer[2]++;
			data.lastFlagTimestamp = now;
			if (data.buffer[2] > AMOUNT_CHECK_BUFFER) {
				player.flag(aim);
			}
		}
	}
	if (now - data.lastFlagTimestamp > FLAG_VALID_TIMESTAMP) {
		data.buffer = EMPTY_BUFFER;
	}
	return data;
}

function amountDeltaPitch (amt: number, previousDeltaList: number[]) {
    const pitchList = arrayToList(previousDeltaList);
    const amount = amt + 1;
    let counter = 0;
    const returnList = [];
    for (const value of pitchList) {
        if(counter < amount) {
            returnList.push(value);
            counter++;
        } else {
            return returnList;
        }
    }
	return undefined;
}