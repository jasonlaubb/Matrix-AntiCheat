import { world, system, ChatSendAfterEvent } from "@minecraft/server";
import { flag, isAdmin } from "../../Assets/Util";
import { registerModule, configi } from "../Modules.js";
import { MinecraftEntityTypes } from "../../node_modules/@minecraft/vanilla-data/lib/index";

/**
 * @author ravriv
 * @description This check can detect players with spammer clients
 */

const lastFlag: Map<string, number> = new Map<string, number>();

function firstEvent(config: configi, { sender: player }: ChatSendAfterEvent) {
    if (isAdmin(player)) return;
    system.run(() => {
        if (player.hasTag("matrix:attack_time")) {
            //A - false positive: very low, efficiency: mid
            if (Date.now() - lastFlag.get(player.id) < 3000) {
                flag(player, "Spammer", "A", config.antiSpammer.maxVL, config.antiSpammer.punishment, ["Type" + ":" + "AttackTime"]);
                if (!config.slient) player.applyDamage(6);
            }
            lastFlag.set(player.id, Date.now());
        }

        //check if the player send message while using item
        else if (player.hasTag("matrix:using_item")) {
            //B - false positive: mid, efficiency: mid
            if (Date.now() - lastFlag.get(player.id) < 3000) {
                flag(player, "Spammer", "B", config.antiSpammer.maxVL, config.antiSpammer.punishment, ["Type" + ":" + "UsingItem"]);
            }
            lastFlag.set(player.id, Date.now());
            if (!config.slient) player.applyDamage(6);
        } else {
            const { x, z } = player.getVelocity();
            //check if the player send message while moving
            if (
                player.hasTag("matrix:moving") &&
                !player.hasTag("matrix:riding") &&
                player.isOnGround &&
                !player.isJumping &&
                !player.isInWater &&
                !player.isGliding &&
                !player.isFalling &&
                !(player.lastExplosionTime && Date.now() - player.lastExplosionTime < 1000) &&
                !player.isInWater &&
                Math.hypot(x, z) > 0.35
            ) {
                //C - false positive: low, efficiency: high
                if (Date.now() - lastFlag.get(player.id) < 3000) {
                    flag(player, "Spammer", "C", config.antiSpammer.maxVL, config.antiSpammer.punishment, ["Type" + ":" + "Moving"]);
                }
                lastFlag.set(player.id, Date.now());
                if (!config.slient) player.applyDamage(6);
            }
            //check if the player send message opening container
            else if (player.hasTag("matrix:container")) {
                //D - false positive: low, efficiency: mid
                if (Date.now() - lastFlag.get(player.id) < 3000) {
                    flag(player, "Spammer", "D", config.antiSpammer.maxVL, config.antiSpammer.punishment, ["Type" + ":" + "Container"]);
                }
                lastFlag.set(player.id, Date.now());
                if (!config.slient) player.applyDamage(6);
            }
        }
    });
}

registerModule("antiSpammer", false, [lastFlag], {
    worldSignal: world.afterEvents.chatSend,
    playerOption: { entityTypes: [MinecraftEntityTypes.Player] },
    then: async (config, event: ChatSendAfterEvent) => {
        firstEvent(config, event);
    },
});
