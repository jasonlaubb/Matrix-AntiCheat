import { world, system, ChatSendAfterEvent } from "@minecraft/server";
import { flag, c } from "../../Assets/Util";
import lang from "../../Data/Languages/lang";

/**
 * @author ravriv
 * @description This check can detect players with spammer clients
 */

function antiSpammer ({ sender: player }: ChatSendAfterEvent) {
    const config = c()

    system.run(() => {
        //check if the player send message while hand swinging
        /*
        if (player.hasTag('matrix:attack_time')) {
            //A - false positive: very low, efficiency: mid
            flag (player, "Spammer", "A", config.antiSpammer.maxVL, config.antiSpammer.punishment, [lang(">Type")+":"+lang(">AttackTime")])
            if (!config.slient) player.applyDamage(6)
        } else*/

        //check if the player send message while using item
        if (player.hasTag('matrix:using_item')) {
            //B - false positive: mid, efficiency: mid
            flag (player, "Spammer", "B", config.antiSpammer.maxVL, config.antiSpammer.punishment, [lang(">Type")+":"+lang(">UsingItem")])
            if (!config.slient) player.applyDamage(6)
        } else {
            const { x, z } = player.getVelocity()
            //check if the player send message while moving
            if (player.hasTag("matrix:moving") && !player.hasTag("matrix:riding") && player.isOnGround && !player.isJumping && !player.isInWater && !player.isGliding && !player.isFalling && !(player.lastExplosionTime && Date.now() - player.lastExplosionTime < 1000) && !player.isInWater && Math.hypot(x, z) > 0.35) {
                //C - false positive: low, efficiency: high
                flag (player, "Spammer", "C", config.antiSpammer.maxVL, config.antiSpammer.punishment, [lang(">Type")+":"+lang(">Moving")])
                if (!config.slient) player.applyDamage(6)
            } else
            //check if the player send message opening container
            if (player.hasTag("matrix:container")) {
                //D - false positive: low, efficiency: mid
                flag (player, "Spammer", "D", config.antiSpammer.maxVL, config.antiSpammer.punishment, [lang(">Type")+":"+lang(">Container")])
                if (!config.slient) player.applyDamage(6)
            }
        }
    })
}

export default {
    enable () {
        world.beforeEvents.chatSend.subscribe(antiSpammer)
    },
    disable () {
        world.beforeEvents.chatSend.unsubscribe(antiSpammer)
    }
}
