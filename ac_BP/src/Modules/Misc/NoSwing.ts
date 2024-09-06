/**1
 * @author jasonlaubb
 * @description Checks if player placed block or fighting without hand swing.
 */

import { EntityHitEntityAfterEvent, Player, PlayerPlaceBlockAfterEvent, system, world } from "@minecraft/server";
import { AnimationControllerTags, DisableTags } from "../../Data/EnumData";
import { configi, registerModule } from "../Modules";
import { flag, isAdmin } from "../../Assets/Util";
import { sendErr } from "../../Functions/chatModel/CommandHandler";
const isCheckingStatus = new Map<string, boolean>();
async function onAction (config: configi, player: Player) {
    if (isAdmin(player) || isCheckingStatus.get(player.id) || player.hasTag(DisableTags.pvp)) return;
    const isSwing = await isSwinging(player, config.antiNoSwing.faultToleranceTicks).finally(() => {
        isCheckingStatus.delete(player.id);
    }).catch(sendErr);

    // Check if player is not swinging
    if (!isSwing) {
        flag(player, "No Swing", "A", config.antiNoSwing.maxVL, config.antiNoSwing.punishment, ["ToleranceTicks:" + config.antiNoSwing.faultToleranceTicks]);
        const playerHasPvpDisable = player.hasTag(DisableTags.pvp);
        const playerHasPlaceDisable = player.hasTag(DisableTags.place);
        if (playerHasPvpDisable && playerHasPlaceDisable) return;
        if (!playerHasPvpDisable) player.addTag(DisableTags.pvp);
        if (!playerHasPlaceDisable) player.addTag(DisableTags.place);
        system.runTimeout(() => {
            if (!playerHasPvpDisable) player.removeTag(DisableTags.pvp);
            if (!playerHasPlaceDisable) player.removeTag(DisableTags.place);
        }, config.antiNoSwing.timeout);
    }
}

async function isSwinging (player: Player, faultToleranceTicks: number): Promise<boolean> {
    let i = 0;
    isCheckingStatus.set(player.id, true);
    return new Promise<boolean>((resolve) => {
        const intervalId = system.runInterval(() => {
            i++;
            if (player.hasTag(AnimationControllerTags.alive) && player.hasTag(AnimationControllerTags.attackTime)) {
                system.clearRun(intervalId);
                resolve(true);
            } else if (i >= faultToleranceTicks) {
                system.clearRun(intervalId);
                resolve(false);
            }
        }, 1)
    });
}

registerModule(
    "antiNoSwing",
    false,
    [isCheckingStatus],
    {
        worldSignal: world.afterEvents.entityHitEntity,
        then: async (config, event: EntityHitEntityAfterEvent) => onAction(config, event.damagingEntity as Player).catch(sendErr),
        playerOption: { entityTypes: ["minecraft:player"] },
    },
    {
        worldSignal: world.afterEvents.playerPlaceBlock,
        then: async (config, event: PlayerPlaceBlockAfterEvent) => onAction(config, event.player).catch(sendErr),
    }
)