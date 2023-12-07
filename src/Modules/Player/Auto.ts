import { world, Player, DataDrivenEntityTriggerAfterEvent, EntityDataDrivenTriggerEventOptions } from "@minecraft/server";
import { flag, isAdmin, c } from "../../Assets/Util";
import lang from "../../Data/Languages/lang";
import { MinecraftEntityTypes } from "../../node_modules/@minecraft/vanilla-data/lib/index";

/**
 * @author jasonlaubb
 * @description A simpe auto totem and auto shield detector,
 * which can detect some hackers that use auto totem and auto shield to cheat
 */

//A - false positive: low, efficiency: high
//B - false positive: low, efficiency: low
//C - false positive: low, efficiency: mid

async function AntiAutoTotem (player: Player) {
    const config = c()
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

async function AntiAutoShield (player: Player) {
    const config = c()
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

const antiAuto = (({ eventId: id, entity: player }: DataDrivenEntityTriggerAfterEvent) => {
    if (isAdmin (player as Player)) return;
    if (id === "matrix:totem") {
        AntiAutoTotem (player as Player);
    } else AntiAutoShield (player as Player);
})
const data = { eventTypes: ["matrix:totem","matrix:shield"], entityTypes: [MinecraftEntityTypes.Player] } as EntityDataDrivenTriggerEventOptions

export default {
    enable () {
        world.afterEvents.dataDrivenEntityTriggerEvent.subscribe(antiAuto, data)
    },
    disable () {
        world.afterEvents.dataDrivenEntityTriggerEvent.unsubscribe(antiAuto)
    }
}
