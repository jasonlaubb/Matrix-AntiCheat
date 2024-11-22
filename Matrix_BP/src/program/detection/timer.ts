import { EntityHitEntityAfterEvent, Player, system, Vector3 } from "@minecraft/server";
import { IntegratedSystemEvent, Module } from "../../matrixAPI";
import { calculateDistance, fastHypot, fastAbs } from "../../util/fastmath";
import { MinecraftEffectTypes } from "../../node_modules/@minecraft/vanilla-data/lib/index";
import { rawtextTranslate } from "../../util/rawtext";
import { world } from "@minecraft/server";
const MAX_DEVIATION = 3;
const MAX_FLAG_AMOUNT = 3;
interface TimerData {
	lastLocation: Vector3;
	totalDistance: number;
	totalVelocity: number;
	isTickIgnored: boolean;
	lastNoSpeedLocation: Vector3;
	lastFlagTimestamp: number;
	flagAmount: number;
	lastAttack: number;
	negativeCombo: number;
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
			lastAttack: 0,
			negativeCombo: 0,
		});
	})
	.initClear((playerId) => {
		timerData.delete(playerId);
	})
	.onModuleEnable(() => {
		runId = system.runInterval(checkTimer, 20);
		eventId = Module.subscribePlayerTickEvent(playerTickEvent);
		world.afterEvents.entityHitEntity.subscribe(playerAttack);
	})
	.onModuleDisable(() => {
		Module.clearPlayerTickEvent(eventId);
		system.clearRun(runId);
		world.afterEvents.entityHitEntity.unsubscribe(playerAttack);
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
	const maxDeviation = (now - lastTime) * 0.001;
	lastTime = now;
	const players = Module.allNonAdminPlayers;
	for (const player of players) {
		const data = timerData.get(player.id)!;
		if (data.isTickIgnored || data.totalDistance === 0) {
			data.isTickIgnored = false;
			data.totalDistance = 0;
			data.totalVelocity = 0;
			data.negativeCombo = 0;
			timerData.set(player.id, data);
			continue;
		}
		const actualDistance = data.totalDistance;
		const velocityDistance = data.totalVelocity;
		const actualDeviation = actualDistance - velocityDistance;
		const absDeviation = fastAbs(actualDeviation);
		const highDeviationState = absDeviation > MAX_DEVIATION;
		if (actualDeviation < -0.1) {
			data.negativeCombo++;
		} else data.negativeCombo = 0;
		const overSlow = data.negativeCombo >= 3;
		if (highDeviationState || absDeviation > maxDeviation * 0.31 || overSlow) {
			if (now - data.lastFlagTimestamp > 3000) {
				data.flagAmount = 0;
			}
			// Increase the flag amount
			const ratio = absDeviation / maxDeviation;
			data.flagAmount += overSlow ? 1.5 : ratio < 1 ? ratio : 1;
			data.lastFlagTimestamp = now;
			if (highDeviationState) {
				player.teleport(data.lastNoSpeedLocation);
			}
			if (data.flagAmount >= MAX_FLAG_AMOUNT) {
				player.teleport(data.lastNoSpeedLocation);
				player.flag(timer);
				data.flagAmount = 0;
			}
		}
		data.totalDistance = 0;
		data.totalVelocity = 0;
		timerData.set(player.id, data);
	}
}
function playerTickEvent (player: Player) {
	if (player.isAdmin()) return;
	const data = timerData.get(player.id)!;
	const now = Date.now();
	const isTickIgnored = data.isTickIgnored;
	const { x, z } = player.getVelocity();
	const noVelocity = x === 0 && z === 0;
	const distance = calculateDistance(player.location, data.lastLocation);
	if (isTickIgnored || player.isGliding || player.isFlying || player.getEffect(MinecraftEffectTypes.Speed) || (noVelocity && distance > 0.005) || now - player.timeStamp.knockBack < 2500 || now - player.timeStamp.riptide < 5000) {
		if (data.isTickIgnored) return;
		data.isTickIgnored = true;
		timerData.set(player.id, data);
		return;
	}
	data.totalDistance += distance;
	if (noVelocity) data.lastNoSpeedLocation = player.location;
	data.totalVelocity += fastHypot(x, z);
	data.lastLocation = player.location;
	timerData.set(player.id, data);
}

function playerAttack ({ damagingEntity: player }: EntityHitEntityAfterEvent) {
	if (!(player instanceof Player)) return;
	const data = timerData.get(player.id)!;
	data.lastAttack = Date.now();
	timerData.set(player.id, data);
}