import { Player } from "@minecraft/server";
import { Module } from "../../matrix";
import { rawtextTranslate } from "../../util/rawtext";
let tickEventId: Module.SystemEvent;
new Module()
    .setName(rawtextTranslate("module.anti.fly.name"))
    .setDescription(rawtextTranslate("module.anti.fly.description"))
    .setToggleId("antiFly")
    .addCategory("detection")
    .onModuleEnable(() => {
        tickEventId = Module.subscribePlayerTickEvent(tickEvent, false);
    })
    .onModuleDisable(() => {
        Module.clearPlayerTickEvent(tickEventId);
    })
    .register();

function tickEvent(player: Player) {
    const { x: velocityX, y: verticalVelocity, z: velocityZ } = player.getVelocity();
    const horizontalVelocity = Math.hypot(velocityX, velocityZ);
    // unfinished, this is just a template :3 by jasonlaubb
}
