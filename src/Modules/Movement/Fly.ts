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
	c,
	getPing
} from "../../Assets/Util";
import {
	MinecraftEffectTypes
} from "../../node_modules/@minecraft/vanilla-data/lib/index";
import lang from "../../Data/Languages/lang";
import { tps } from "../../Assets/Public";

const previousLocations = new Map <string, Vector3>();
let velocityLog: { [key: string]: number } = {};
const lastVelocity = new Map<string, number> ();
const lastFlag = new Map <string, number>();
const lastFlag2 = new Map<string, number>()

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


async function AntiFly(player: Player, now: number, Tps: number) {
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
		x,
		z
	} = player.getVelocity();

	//if player is on ground and velocity is 0, set the previous location
	if (isOnGround && velocity == 0 && x == 0 && z == 0) {
		previousLocations.set(id, player.location);
	}

	const jumpBoost = player.getEffect(MinecraftEffectTypes.JumpBoost);
	const levitation = player.getEffect(MinecraftEffectTypes.Levitation);
	const instair = includeStair(player);

	velocityLog[player.id] ??= 0;

	if (prevLoc === undefined) return;

	const skip1 = !(player.lastExplosionTime && now - player.lastExplosionTime < 5500) &&
	!(player.threwTridentAt && now - player.threwTridentAt < 5000) && !player.hasTag("matrix:knockback");
    const skip2 = !player.isFlying && !player.isGliding;
    const skip3 = !(jumpBoost && jumpBoost?.amplifier > 2) &&
	!(levitation && levitation?.amplifier > 2);

	if (velocity > config.antiFly.maxVelocity && skip1) {
	    velocityLog[player.id] += 1;
	    lastVelocity.set(id, velocity);
    } else if (velocity > 0 || velocity == 0 && player.isOnGround || !skip1)
	    velocityLog[player.id] = 0

	if (jumpBoost?.amplifier > 2 || levitation?.amplifier > 2) return;
	//if (velocity> 0.7) player.runCommand(`title @s actionbar xz = ${Math.hypot(x, z)}  | velocity  = ${velocity}  | ground = ${player.isOnGround} | log = ${velocityLog[player.id]}`)

	const flyMovement =
		(velocityLog[player.id] > 1 && velocity <= 0) ||
		(velocity < config.antiFly.maxVelocity && player.fallDistance < -1.5)
	const clientFly =
		velocityLog[player.id] > 0 && player?.lastVelLog == velocityLog[player.id];

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

		if (lastflag && now - lastflag <= 5000 && now - lastflag >= 500)
			flag(player, "Fly", "A", config.antiFly.maxVL, config.antiFly.punishment, [lang(">velocityY") + ":" + lastVelocity.get(id).toFixed(2)]);
		velocityLog[player.id] = 0;
		lastVelocity.set(id, undefined);
		lastFlag.set(id, now);
	}

	player.lastVelLog = velocityLog[player.id];

	if (getPing(player) < 4 && Tps > 12 && player.lastVelocity && velocityLog[player.id] == 1 && velocity < 0 && player.lastVelocity > config.antiFly.maxVelocity && skip1 && skip2 && !instair) {
		player.teleport(prevLoc);
		const lastflag = lastFlag2.get(id)
		if (lastflag && now - lastflag <= 4500 && now - lastflag > 120) {
		    flag(player, "Fly", "B", config.antiFly.maxVL, config.antiFly.punishment, [lang(">velocityY") + ":" + velocity.toFixed(4)]);
		}
		lastFlag2.set(id, now)
	}

    player.lastVelocity = velocity
}

const antiFly = () => {
	const now = Date.now();
	const players = world.getPlayers({
		excludeGameModes: [GameMode.spectator]
	});
	const Tps = tps.getTps()
	for (const player of players) {
		if (isAdmin(player)) continue;

		AntiFly(player, now, Tps);
	}
};

const playerLeave = ({
	playerId
}: PlayerLeaveAfterEvent) => {
	previousLocations.delete(playerId);
	lastVelocity.delete(playerId);
	lastFlag.delete(playerId);
	lastFlag2.delete(playerId);
	delete velocityLog[playerId];
};

let id: number;

export default {
	enable() {
		id = system.runInterval(antiFly, 1);
		world.afterEvents.playerLeave.subscribe(playerLeave);
	},
	disable() {
		previousLocations.clear();
		lastVelocity.clear();
		lastFlag.clear();
		lastFlag2.clear()
		velocityLog = {};
		system.clearRun(id);
		world.afterEvents.playerLeave.unsubscribe(playerLeave);
	},
};