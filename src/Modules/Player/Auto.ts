import { world, Player } from "@minecraft/server";
import { flag, isAdmin } from "../../Assets/Util";
import config from "../../Data/Config";
import lang from "../../Data/Languages/lang";

/**
 * @author jasonlaubb
 * @description A simpe auto totem and auto shield detector,
 * which can detect some hackers that use auto totem and auto shield to cheat
 */

async function antiAuto (player: Player) {
    if (player.hasTag("matrix:moving") && player.isOnGround && !player.isJumping && !player.isGliding && !player.hasTag("matrix:riding")) {
        flag (player, "Auto Totem", "A",config.antiAuto.maxVL, config.antiAuto.punishment, [lang(">Type") + ":" + lang(">Moving")])
    } else

    if (player.hasTag("matrix:usingItem")) {
        flag (player, "Auto Totem", "B", config.antiAuto.maxVL, config.antiAuto.punishment, [lang(">Type") + ":" + lang(">UsingItem")])
    } else

    if (player.hasTag("matrix:container")) {
        flag (player, "Auto Totem", "C", config.antiAuto.maxVL, config.antiAuto.punishment, [lang(">Type") + ":" + lang(">Container")])
    }
}

async function antiAutoShield (player: Player) {
    if (player.hasTag("matrix:moving") && player.isOnGround && !player.isJumping && !player.isGliding && !player.hasTag("matrix:riding")) {
        flag (player, "Auto Shield", "A", config.antiAuto.maxVL, config.antiAuto.punishment, [lang(">Type") + ":" + lang(">Moving")])
    } else

    if (player.hasTag("matrix:usingItem")) {
        flag (player, "Auto Shield", "B", config.antiAuto.maxVL, config.antiAuto.punishment, [lang(">Type") + ":" + lang(">UsingItem")])
    } else

    if (player.hasTag("matrix:container")) {
        flag (player, "Auto Shield", "C", config.antiAuto.maxVL, config.antiAuto.punishment, [lang(">Type") + ":" + lang(">Container")])
    }
}

world.afterEvents.dataDrivenEntityTriggerEvent.subscribe(({ id, entity: player }) => {
    if (!(player instanceof Player) || isAdmin (player)) return;
    if (id === "matrix:totem") {
        const toggle: boolean = world.getDynamicProperty("matrix:antiAuto") as boolean ?? config.antiAuto.enabled;
        if (!toggle) return;

        antiAuto(player);
    } else
    
    if (id === "matrix:shield") {
        const toggle: boolean = world.getDynamicProperty("matrix:antiAutoShield") as boolean ?? config.antiAuto.enabled;
        if (!toggle) return;

        antiAutoShield(player);
    }
})