import {
	world,
	system,
	GameMode,
	Player,
	Vector3,
	PlayerLeaveAfterEvent,
} from "@minecraft/server";
import {
	flag,
	isAdmin,
	c
} from "../../Assets/Util";
import {
	MinecraftEffectTypes
} from "../../node_modules/@minecraft/vanilla-data/lib/index";
import lang from "../../Data/Languages/lang";

const previousLocations = new Map <string, Vector3>();
let velocityLog: { [key: string]: number } = {};
const lastVelocity = new Map<string, number> ();
const lastFlag = new Map <string, number>();

/**
 * @author jasonlaubb && rami
 * @description This checks if a player velocity is too high.
 */
const includeStair = ({ location: { x: px, y: py, z: pz }, dimension }: Player) => [dimension.getBlock({ x: Math.floor(px),
		y: Math.floor(py),
		z: Math.floor(pz),
	})?.typeId,
	dimension.getBlock({
		x: Math.floor(px),
		y: Math.floor(py) - 1,
		z: Math.floor(pz),
	})?.typeId
].includes("stair");

async function AntiFly(player: Player, now: number) {
	const config = c();
	//constant the infomation
	const {
		id,
		isOnGround
	} = player;

	//get the previous location
	const prevLoc = previousLocations.get(id);

	//get the velocity
	const {
		y: velocity,
		//x,
		//z
	} = player.getVelocity();

	//if player is on ground and velocity is 0, set the previous location
	if (isOnGround && velocity === 0) {
		previousLocations.set(id, player.location);
	}

	const jumpBoost = player.getEffect(MinecraftEffectTypes.JumpBoost);
	const levitation = player.getEffect(MinecraftEffectTypes.Levitation);
	const instair = includeStair(player);

	velocityLog[player.id] ??= 0;

	if (prevLoc === undefined) return;

	if (jumpBoost?.amplifier > 2 || levitation?.amplifier > 2) return;
	if (velocity > config.antiFly.maxVelocity) {
		++velocityLog[player.id];
		lastVelocity.set(id, velocity);
	} else if (velocity > 0 || (player.isOnGround && velocity == 0))
		velocityLog[player.id] = 0;

	// if (velocity> 0.7) player.runCommand(`title @s actionbar xz = ${Math.hypot(x, z)}  | velocity  = ${velocity}  | ground = ${player.isOnGround}`)

	const flyMovement =
		(velocityLog[player.id] > 0 && velocity <= 0) ||
		(velocity < 0.7 && player.fallDistance < -1.5);
	const clientFly =
		velocityLog[player.id] > 1 && player?.lastVelLog == velocityLog[player.id];

	const skip1 = !(player.lastExplosionTime && now - player.lastExplosionTime < 5500) &&
		!(player.threwTridentAt && now - player.threwTridentAt < 5000);
	const skip2 = !player.isFlying && !player.hasTag("matrix:slime") && !player.isGliding;
	const skip3 = !(jumpBoost && jumpBoost?.amplifier > 2) &&
		!(levitation && levitation?.amplifier > 2);

	if (
		!player.isOnGround &&
		clientFly &&
		flyMovement &&
		skip1 &&
		skip2 &&
		skip3 &&
		velocity != 1 &&
		!instair
	) {
		const lastflag = lastFlag.get(id);
		player.teleport(prevLoc);

		if (lastflag && now - lastflag <= 4000 && now - lastflag >= 500)
			flag(
				player,
				"Fly",
				"A",
				config.antiFly.maxVL,
				config.antiFly.punishment,
				[lang(">velocityY") + ":" + +lastVelocity.get(id).toFixed(2)]
			);

		velocityLog[player.id] = 0;
		lastVelocity.set(id, undefined);
		lastFlag.set(id, now);
	}

	player.lastVelLog = velocityLog[player.id];
	/* Disable until fixed
	//fly [B]
	//check for moving while fly hacking (detect some instant movement and more fast to detect movement hacks)
	if (
		velocity != 0 &&
		Math.hypot(x, z) > 0.35 &&
		!player.isOnGround &&
		!instair &&
		!skip1 &&
		!player.hasTag("matrix:knockback")
	) {
		player.teleport(prevLoc);
		flag(player, "Fly", "B", config.antiFly.maxVL, config.antiFly.punishment, [
			lang(">velocityY") + ":" + +lastVelocity.get(id).toFixed(2),
		]);
	}
	/* It's removed from Matrix, it's no longer in use
	//efficiency: high | false postive: unknown
	//fly (C) detect players flying on high distance
	if (player.isOnGround && velocity > 0)
		player.addTag("matrix:runned_velocity");
	if (
		velocity > 0.7 &&
		!player.isOnGround &&
		!player.hasTag("matrix:runned_velocity") &&
		!skip1 &&
		!player.isInWater
	) {
		player.teleport(prevLoc);
		flag(player, "Fly", "C", config.antiFly.maxVL, config.antiFly.punishment, [
			lang(">velocityY") + ":" + +velocity.toFixed(2),
		]);
	}
	if (!player.isOnGround && velocity < 0)
		player.removeTag("matrix:runned_velocity");
        */
}

const antiFly = () => {
	const now = Date.now();
	const players = world.getPlayers({
		excludeGameModes: [GameMode.spectator]
	});
	for (const player of players) {
		if (isAdmin(player)) continue;

		AntiFly(player, now);
	}
};

const playerLeave = ({
	playerId
}: PlayerLeaveAfterEvent) => {
	previousLocations.delete(playerId);
	lastVelocity.delete(playerId);
	lastFlag.delete(playerId);
	delete velocityLog[playerId];
};

let id: number;

export default {
	enable() {
		(id = system.runInterval(antiFly, 1)),
		world.afterEvents.playerLeave.subscribe(playerLeave);
	},
	disable() {
		previousLocations.clear();
		lastVelocity.clear();
		lastFlag.clear();
		velocityLog = {};
		system.clearRun(id);
		world.afterEvents.playerLeave.unsubscribe(playerLeave);
	},
};
