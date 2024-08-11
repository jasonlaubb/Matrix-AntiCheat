import { world, Player, system, GameMode, ItemUseAfterEvent, Vector3, PlayerSpawnAfterEvent } from "@minecraft/server";
import { bypassMovementCheck, flag, getPing } from "../../Assets/Util";
import { MinecraftItemTypes } from "../../node_modules/@minecraft/vanilla-data/lib/index";
import { configi, registerModule } from "../Modules";
import { MatrixUsedTags } from "../../Data/EnumData";

const fallDistances = new Map<string, number[]>();
const lastLocation = new Map<string, Vector3>();

/**
 * @author jasonlaubb
 * @description Check if player change speed with a high range while high speed
 */

async function ElytraFly(player: Player, now: number, config: configi) {
    const data = fallDistances.get(player.id) ?? [];
    const lastPos = lastLocation.get(player.id);
    lastLocation.set(player.id, player.location);
    if (!lastPos) return;
    data.push(player.fallDistance);

    const { y: velocity } = player.getVelocity();

    if (player.isGliding && !bypassMovementCheck(player)) {
        if (data.length > config.antiElytraFly.fallDiscycle) {
            data.shift();
            if (getPing(player) < 4 && !player.hasTag(MatrixUsedTags.stopRiding) && data.every((f) => player.fallDistance == f) && player.fallDistance !== 1 && player.fallDistance <= config.antiElytraFly.maxFallDis && velocity < -0.01) {
                player.teleport(lastPos);
                player.addTag(MatrixUsedTags.stopRiding);
                system.runTimeout(() => player.removeTag(MatrixUsedTags.stopRiding), 10);
                flag(player, "Elytra Fly", "A", config.antiElytraFly.maxVL, config.antiElytraFly.punishment, ["velocityY" + ":" + velocity.toFixed(2)]);
            }
        } else {
            fallDistances.set(player.id, data);
        }

        const ratio = ((player.fallDistance / velocity ** 2) * player.getRotation().x ** 2) / 56000;

        if (
            !player.hasTag(MatrixUsedTags.stopRiding) &&
            ratio > config.antiElytraFly.maxRatio &&
            ratio !== Infinity &&
            player.fallDistance !== 1 &&
            player.lastGliding &&
            now - player.lastGliding > 1000 &&
            !(player.lastGlidingFire && now - player.lastGlidingFire < 7000)
        ) {
            system.run(() => {
                if (player.lastGlidingFire && now - player.lastGlidingFire < 90) return;
                player.teleport(lastPos);
                player.addTag(MatrixUsedTags.stopRiding);
                system.runTimeout(() => player.removeTag(MatrixUsedTags.stopRiding), 10);
                flag(player, "Elytra Fly", "B", config.antiElytraFly.maxVL, config.antiElytraFly.punishment, ["Ratio" + ":" + ratio.toFixed(2)]);
            });
        }
    } else {
        fallDistances.delete(player.id);
        player.lastGliding = now;
    }
}

const playerSpawn = ({ player }: PlayerSpawnAfterEvent) => {
    player.removeTag(MatrixUsedTags.stopRiding);
};

const itemUseAfter = ({ source: player, itemStack: { typeId } }: ItemUseAfterEvent) => player.isGliding && typeId === MinecraftItemTypes.FireworkRocket && (player.lastGlidingFire = Date.now());

registerModule(
    "antiElytraFly",
    false,
    [fallDistances],
    {
        tickInterval: 1,
        tickOption: { excludeGameModes: [GameMode.spectator] },
        intick: async (config, player) => ElytraFly(player, Date.now(), config),
    },
    {
        worldSignal: world.afterEvents.itemUse,
        then: async (_config, event) => itemUseAfter(event) as any,
    },
    {
        worldSignal: world.afterEvents.playerSpawn,
        then: async (_config, event) => playerSpawn(event),
    }
);
