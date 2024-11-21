import { Player, system, Vector3 } from "@minecraft/server";
import { IntegratedSystemEvent, Module } from "../../matrixAPI";
import { calculateDistance, fastHypot, fastAbs } from "../../util/fastmath";
import { MinecraftEffectTypes } from "../../node_modules/@minecraft/vanilla-data/lib/index";
import { rawtextTranslate } from "../../util/rawtext";
const MAX_DEVIATION = 3;
interface TimerData {
	lastLocation: Vector3;
	totalDistance: number;
	totalVelocity: number;
	isTickIgnored: boolean;
	lastNoSpeedLocation: Vector3;
	lastFlagTimestamp: number;
	flagAmount: number;
}
let lastTime: number;
let runId: number;
let eventId: IntegratedSystemEvent;
const timerData = new Map<string, TimerData>();
const timer = new Module()
	.addCategory("detection")
	.setName(rawtextTranslate("module.timer.name"))
	.setDescription(rawtextTranslate("module.timer.description"))
	.setToggleId("antiTimer")
	.setPunishment("ban")
	.initPlayer((playerId, player) => {
		timerData.set(playerId, {
			lastLocation: player.location,
			totalDistance: 0,
			totalVelocity: 0,
			isTickIgnored: false,
			lastNoSpeedLocation: player.location,
			lastFlagTimestamp: 0,
			flagAmount: 0,
		});
	})
	.initClear((playerId) => {
		timerData.delete(playerId);
	})
	.onModuleEnable(() => {
		runId = system.runInterval(checkTimer);
		eventId = Module.subscribePlayerTickEvent(playerTickEvent);
	})
	.onModuleDisable(() => {
		Module.clearPlayerTickEvent(eventId);
		system.clearRun(runId);
		timerData.clear();
	});
timer.register();
/**
 * @author jasonlaubb, RamiGamerDev
 * @description The better timer check recoded from the previous one.
 * @credit Orange cat - helped about preventing false positive
 */
function checkTimer () {
	const now = Date.now();
	lastTime ??= now;
	const maxDeviation = 1.2 - ((now - lastTime) * 0.001);
	lastTime = now;
	const players = Module.allNonAdminPlayers;
	for (const player of players) {
		const data = timerData.get(player.id)!;
		if (data.isTickIgnored || data.totalDistance === 0) {
			data.isTickIgnored = false;
			data.totalDistance = 0;
			data.totalVelocity = 0;
			timerData.set(player.id, data);
			continue;
		}
		const actualDistance = data.totalDistance;
		const velocityDistance = data.totalVelocity;
		const actualDeviation = actualDistance - velocityDistance;
		if ((fastAbs(actualDeviation) > MAX_DEVIATION || actualDeviation > maxDeviation)) {
			if (now - data.lastFlagTimestamp > 4000) {
				data.flagAmount = 0;
			}
			data.flagAmount++;
			data.lastFlagTimestamp = now;
			if (data.flagAmount >= 3) {
				player.teleport(data.lastNoSpeedLocation);
				player.flag(timer);
			}
		}
		timerData.set(player.id, data);
	}
}
function playerTickEvent (player: Player) {
	if (player.isAdmin()) return;
	const data = timerData.get(player.id)!;
	const now = Date.now();
	const isTickIgnored = data.isTickIgnored;
	if (isTickIgnored || player.isGliding || player.isFlying || player.getEffect(MinecraftEffectTypes.Speed) || now - player.timeStamp.knockBack < 2500 || now - player.timeStamp.riptide < 5000) {
		if (isTickIgnored) return;
		data.isTickIgnored = true;
		timerData.set(player.id, data);
		return;
	}
	const distance = calculateDistance(player.location, data.lastLocation);
	data.totalDistance += distance;
	const { x, z } = player.getVelocity();
	if (x == 0 && z == 0) data.lastNoSpeedLocation = player.location;
	data.totalVelocity += fastHypot(x, z);
	data.lastLocation = player.location;
	timerData.set(player.id, data);
}