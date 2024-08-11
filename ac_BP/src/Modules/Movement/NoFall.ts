import { world, GameMode, Player, Vector3, PlayerSpawnAfterEvent } from "@minecraft/server";
import { bypassMovementCheck, flag, getPing } from "../../Assets/Util";
import { MinecraftEffectTypes } from "../../node_modules/@minecraft/vanilla-data/lib/index";
import { configi, registerModule } from "../Modules";
import { AnimationControllerTags } from "../../Data/EnumData";

const lastLocation = new Map<string, Vector3>();
const lastFlag = new Map<string, number>();
const playerVL = new Map<string, number>();

/**
 * @author jasonlaubb
 * @description A simple check for nofall hacking
 */

async function AntiNoFall(player: Player, config: configi, now: number) {
    const { id, isFlying, isClimbing, isOnGround, isInWater, isGliding, threwTridentAt, lastExplosionTime } = player;
    const jumpEffect = player.getEffect(MinecraftEffectTypes.JumpBoost);
    const prevLoc = lastLocation.get(id);
    if (player.isOnGround) lastLocation.set(player.id, player.location);
    if (prevLoc === undefined) return;
    const { x, y, z } = player.getVelocity();
    const xz = Math.hypot(x, z);
    const vl = playerVL.get(id);

    //stop false positive
    if (
        !player.hasTag(AnimationControllerTags.alive) ||
        player.hasTag(AnimationControllerTags.riding) ||
        isOnGround ||
        isFlying ||
        isClimbing ||
        isInWater ||
        isGliding ||
        player.hasTag(AnimationControllerTags.levitating) ||
        player.getEffect(MinecraftEffectTypes.Speed) ||
        (jumpEffect && jumpEffect.amplifier > 2) ||
        (threwTridentAt && now - threwTridentAt < 3000) ||
        (lastExplosionTime && now - lastExplosionTime < 5000)
    ) {
        vl ?? playerVL.set(player.id, 0);
        playerVL.set(player.id, 0);
        return;
    }

    if (y == 0) {
        vl ?? playerVL.set(player.id, 0);
        vl ?? playerVL.set(player.id, vl! + 1);
    } else playerVL.set(player.id, 0);

    //velocityY is 0, flag the player
    if (!bypassMovementCheck(player) && y == 0 && playerVL.get(player.id)! >= config.antiNoFall.float && getPing(player) < 5) {
        if (xz == 0 || xz == 0 || (player.spawnTime && now - player.spawnTime < 12000)) return;
        player.teleport(prevLoc);
        const lastflag = lastFlag.get(player.id);
        playerVL.set(player.id, 0);
        if (lastflag && now - lastflag < 2000 && now - lastflag > 80) {
            flag(player, "NoFall", "A", config.antiNoFall.maxVL, config.antiNoFall.punishment, ["velocityY" + ":" + +y.toFixed(2), "velocityXZ" + ":" + +xz.toFixed(2)]);
        }
        lastFlag.set(player.id, now);
    }
}

const playerSpawn = ({ player, initialSpawn: spawn }: PlayerSpawnAfterEvent) => spawn && (player.spawnTime = Date.now());

registerModule(
    "antiNoFall",
    false,
    [lastLocation, lastFlag, playerVL],
    {
        tickInterval: 1,
        tickOption: { excludeGameModes: [GameMode.spectator, GameMode.creative] },
        intick: async (config, player) => {
            AntiNoFall(player, config, Date.now());
        },
    },
    {
        worldSignal: world.afterEvents.playerSpawn,
        then: async (_config, event: PlayerSpawnAfterEvent) => playerSpawn(event) as any,
    }
);
