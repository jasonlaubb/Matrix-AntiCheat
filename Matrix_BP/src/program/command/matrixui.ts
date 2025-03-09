import { world, Player, EquipmentSlot } from "@minecraft/server";
import { Command, DirectPanel } from "../../matrixAPI";
import { rawtextTranslate } from "../../util/rawtext";
import { ModPanel } from "../../util/modPanel";

new Command()
    .setName("matrixui")
    .setAliases("ui", "openui", "uipanel", "panel", "openpanel")
    .setMinPermissionLevel(1)
    .setDescription(rawtextTranslate("command.matrixui.description"))
    .onExecute(async (player) => {
        player.sendMessage(rawtextTranslate("ui.closechat"));
        DirectPanel.open(player);
    })
    .register();

world.afterEvents.itemUse.subscribe((event) => {
    if (event?.itemStack?.typeId === "matrix:itemui") {
        // Run that command.
        event.source.runChatCommand("matrixui");
    } else if (event.source.isAdmin() && event?.itemStack?.typeId === "matrix:mod_hammer") {
        ModPanel.open(event.source);
    }
});
world.afterEvents.entityHitEntity.subscribe((event) => {
    if (event.damagingEntity instanceof Player && event.hitEntity instanceof Player && event.damagingEntity.isAdmin() && event.damagingEntity.getComponent("equippable")?.getEquipment(EquipmentSlot.Mainhand)?.typeId === "matrix:mod_hammer") {
        ModPanel.open(event.damagingEntity, event.hitEntity);
    }
});
