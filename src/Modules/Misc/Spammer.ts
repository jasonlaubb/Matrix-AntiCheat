import { world, Player, system } from "@minecraft/server";
import { flag } from "../../Assets/Util";
import config from "../../Data/Config";
import lang from "../../Data/Languages/lang";

/**
 * @author ravriv
 * @description This check can detect players with spammer clients
 */

async function antiSpammer (player: Player) {
    //check if the player send message while hand swinging
    if (player.hasTag('matrix:attack_time')) {
        flag (player, "Spammer", "A", config.antiSpammer.maxVL, config.antiSpammer.punishment, [lang(">Type")+":"+lang(">AttackTime")])
        if (!config.slient) player.applyDamage(6)
    } else

    //check if the player send message while using item
    if (player.hasTag('matrix:using_item')) {
        flag (player, "Spammer", "B", config.antiSpammer.maxVL, config.antiSpammer.punishment, [lang(">Type")+":"+lang(">UsingItem")])
        if (!config.slient) player.applyDamage(6)
    } else

    //check if the player send message while moving
    if (player.hasTag("matrix:moving") && player.hasTag("matrix:riding") && player.isOnGround && !player.isJumping && !player.isInWater && !player.isGliding) {
        flag (player, "Spammer", "C", config.antiSpammer.maxVL, config.antiSpammer.punishment, [lang(">Type")+":"+lang(">Moving")])
        if (!config.slient) player.applyDamage(6)
    }
    
    //check if the player sned message opening container
    if (player.hasTag("matrix:container")) {
        flag (player, "Spammer", "D", config.antiSpammer.maxVL, config.antiSpammer.punishment, [lang(">Type")+":"+lang(">Container")])
        if (!config.slient) player.applyDamage(6)
    }
}

world.beforeEvents.chatSend.subscribe(({ sender: player }) => {
    const toggle: boolean = (world.getDynamicProperty("antiSpammer") ?? config.antiSpammer.enabled) as boolean;
    if (toggle !== true) return;

    //fake after event for patching chatRank bug
    system.run(() => antiSpammer (player))
})