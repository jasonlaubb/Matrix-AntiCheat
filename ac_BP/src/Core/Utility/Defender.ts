import { PlayerInteractWithBlockBeforeEvent, PlayerInteractWithEntityBeforeEvent, PlayerLeaveAfterEvent, PlayerSpawnAfterEvent, system, world } from "@minecraft/server";
import { configi, registerModule } from "../Modules";
import { rawstr, isAdmin } from "../../Assets/Util";
import { Action } from "../../Assets/Action";
import { ModalFormData } from "@minecraft/server-ui";
const defenderNotBlockingData: string[] = [];
async function onPlayerSpawn (config: configi, event: PlayerSpawnAfterEvent) {
	if (!event.initialSpawn || isAdmin(event.player)) return;
	const player = event.player;
	// if the player name is repeated... Anti Alt spam protection
	if (player.name.match(/^.{3,16}\s\([0-9]{1,2}\)$/)) {
		const rawName = player.name.replace(/^(.{3,16})\s\([0-9]{1,2}\)$/, '$1');
		const currentServerOnline = world.getAllPlayers();
		Action.tempkick(player);
		if (config.autoPunishment.resultGobalize) world.sendMessage(rawstr.drt("protection.defender", player.id));
		const susPlayer = currentServerOnline.find(({ name }) => {
			return rawName == name;
		})
		if (!susPlayer) return;
		Action.tempkick(susPlayer);
		if (config.autoPunishment.resultGobalize) world.sendMessage(rawstr.drt("protection.defender", susPlayer.id));
		return;
	}
	
	// Defender bot checking
	player.sendMessage(rawstr.drt("defender.checking"));
	player.inputPermissions.movementEnabled = false;
	player.inputPermissions.cameraEnabled = true;
	try {
		player.runCommand("ability @s mute true");
	} catch {
		console.warn("RealmDefender :: Minecraft EDU is required to use defender without bypass!");
		Action.mute(player);
	}
	await system.waitTicks(100);
	player.sendMessage(rawstr.drt("defender.continue"));
	const isCameraMoved = await new Promise<boolean>((resolve) => {
		let lastRotationString = JSON.stringify(player.getRotation());
		let moveDuration = 0;
		const now = Date.now();
		let currentType = 0;
		const interval = system.runInterval(() => {
			try {
				const rotationString = JSON.stringify(player.getRotation());
				if (moveDuration > config.realmDefender.minViewMoveDuration) {
					resolve(true);
					system.clearRun(interval);
				} else if (rotationString != lastRotationString) {
					currentType = 1;
					moveDuration++;
				} else {
					if (currentType == 1) player.sendMessage(rawstr.drt("defender.keepmove", ((config.realmDefender.minViewMoveDuration - moveDuration) * 0.05).toString()));
					currentType = 0;
					if (Date.now() - now > 60000) {
						resolve(false);
						system.clearRun(interval);
					}
				}
			} catch (error) {
				console.error(error);
				resolve(false);
				system.clearRun(interval);
			}
		}, 1);
	});
	if (isCameraMoved === false) {
		Action.tempkick(player);
		if (config.autoPunishment.resultGobalize) world.sendMessage(rawstr.drt("protection.defender", player.id));
		return;
	}
	const now = Date.now();
	let checkValid = true;
	// Main check
	while (now - Date.now() < config.realmDefender.maxAllowanceTime && checkValid) {
		const question1 = ran(6);
		const question2 = ran(6);
		const correctAnswer = question1 + question2;
		const ui = new ModalFormData()
			.title(rawstr.drt("defender.title"))
			.submitButton(rawstr.drt("defender.submit"))
			.slider(
				new rawstr()
					.tra("defender.selectui")
					.str("\n")
					.tra("defender.why")
					.str("\n")
					.tra("defender.question", question1.toString(), question2.toString())
					.str("\n")
					.tra("defender.youranswer")
					.parse()
			, 0, 10, 1, ran(11))
			.toggle(rawstr.drt("defender.notabot"), false)
			//@ts-expect-error
			.show(player);
		let uiNotAnswering = false;
		ui.then((result) => {
			uiNotAnswering = true;
			if (result.canceled) return;
			const playerAns = result.formValues![0] as number;
			const notabot = result.formValues![1] as boolean;
			if (playerAns == correctAnswer && notabot === true) {
				checkValid = false;
			} else {
				player.sendMessage(rawstr.drt("defender.recontinue"));
			}
		});
		await new Promise<void>((resolve) => {
			system.runInterval(async () => {
				if (now - Date.now() < config.realmDefender.maxAllowanceTime) {
					resolve();
				} else if (uiNotAnswering) {
					await system.waitTicks(40);
					resolve();
				}
			}, 5);
		})
	}

	if (!checkValid) {
		player.sendMessage(rawstr.drt("defender.verified"));
		defenderNotBlockingData.push(player.id);
		// Give back the movement permission
		player.inputPermissions.movementEnabled = true;
		try {
			player.runCommand("ability @s mute false");
		} catch {
			Action.unmute(player);
		}
	} else {
		Action.tempkick(player);
		if (config.autoPunishment.resultGobalize) world.sendMessage(rawstr.drt("protection.defender", player.id));
	}
}
function ran (max: number) {
	return Math.floor(Math.random() * max);
}
async function onPlayerLeave (_config: configi, event: PlayerLeaveAfterEvent) {
	const index = defenderNotBlockingData.indexOf(event.playerId);
	if (index == -1) return;
	defenderNotBlockingData.splice(defenderNotBlockingData.indexOf(event.playerId), 1);
}
async function onPlayerInteract (_config: configi, event: PlayerInteractWithBlockBeforeEvent | PlayerInteractWithEntityBeforeEvent) {
	if (isAdmin(event.player) || defenderNotBlockingData.includes(event.player.id)) return;
	event.cancel = true;
}
registerModule("realmDefender", false, [],
	{
		worldSignal: world.afterEvents.playerSpawn,
		then: onPlayerSpawn,
	},
	{
		worldSignal: world.afterEvents.playerLeave,
		then: onPlayerLeave,
	},
	{
		worldSignal: world.beforeEvents.playerInteractWithBlock,
		then: onPlayerInteract,
	},
	{
		worldSignal: world.beforeEvents.playerInteractWithEntity,
		then: onPlayerInteract,
	},
)