import { EquipmentSlot, Player } from "@minecraft/server";
import { IntegratedSystemEvent, Module } from "../../matrixAPI";
import { TickData } from "../import";
import { MinecraftItemTypes } from "../../node_modules/@minecraft/vanilla-data/lib/index";
import { rawtextTranslate } from "../../util/rawtext";
let eventId: IntegratedSystemEvent;
const disabler = new Module()
    .setName(rawtextTranslate("module.disabler.name"))
    .setTag(0)
    .setDescription(rawtextTranslate("module.disabler.description"))
    .setToggleId("antiDisabler")
    .setPunishment("ban")
    .initPlayer((tickData) => {
        tickData.disabler = {
            gliding: false,
            lastFlagTimestamp: 0,
        };
        return tickData;
    })
    .onModuleEnable(() => {
        eventId = Module.subscribePlayerTickEvent(tickEvent, false);
    })
    .onModuleDisable(() => {
        Module.clearPlayerTickEvent(eventId);
    });
disabler.register();
function tickEvent(data: TickData, player: Player) {
    const now = Date.now();
    if (player.isGliding && data.disabler.gliding && now - data.disabler.lastFlagTimestamp > Module.config.sensitivity.antiDisabler.flagCooldown) {
        const item = player.getComponent("equippable")!.getEquipment(EquipmentSlot.Chest);
        if (!item || item.typeId !== MinecraftItemTypes.Elytra) {
            player.teleport(data.global.lastLocation);
            player.flag(disabler);
        }
    }
    data.disabler.gliding = player.isGliding;
    return data;
}
