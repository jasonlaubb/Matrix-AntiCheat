import { EquipmentSlot, Player, system } from "@minecraft/server";
import { registerModule } from "../Modules";
import { c, flag, isAdmin } from "../../Assets/Util";
import { AnimationControllerTags, MatrixUsedTags } from "../../Data/EnumData";

registerModule("antiOffhand", false, [])

system.afterEvents.scriptEventReceive.subscribe((event) => {
    const config = c();
    if (event.id != "matrix:offhand" || !config.antiOffhand.enabled || !event.sourceEntity || !(event.sourceEntity instanceof Player) || isAdmin(event.sourceEntity)) return;
    const player = event.sourceEntity as Player;
    let detected = false;
    if (player.hasTag(AnimationControllerTags.moving) && !player.isInWater && !player.isGliding && !player.hasTag(AnimationControllerTags.riding)) {
        detected = true;
        flag(player, "OffHand", "A", config.antiOffhand.maxVL, config.antiOffhand.punishment, undefined);
    } else if (player.hasTag(AnimationControllerTags.attackTime)) {
        detected = true;
        flag(player, "OffHand", "B", config.antiOffhand.maxVL, config.antiOffhand.punishment, undefined);
    } else if (player.hasTag(MatrixUsedTags.container)) {
        detected = true;
        flag(player, "OffHand", "C", config.antiOffhand.maxVL, config.antiOffhand.punishment, undefined);
    } else if (player.hasTag(AnimationControllerTags.usingItem)) {
        detected = true;
        flag(player, "OffHand", "D", config.antiOffhand.maxVL, config.antiOffhand.punishment, undefined);
    }
    if (detected && config.antiOffhand.doUnEquip) {
        inactiveTotem(player);
    }
})

function inactiveTotem (player: Player) {
    const e = player.getComponent('minecraft:equippable')
    const q = e?.getEquipment(EquipmentSlot.Offhand);
    if (!q) return;
    e?.setEquipment(EquipmentSlot.Offhand);
    player.getComponent('minecraft:inventory')!.container!.addItem(q);
}