import { EquipmentSlot, Player, system } from "@minecraft/server";
import { registerModule } from "../Modules";
import { c, isAdmin, isSpawning } from "../../Assets/Util";
import { AnimationControllerTags, MatrixUsedTags } from "../../Data/EnumData";
import flag from "../../Assets/flag";

registerModule("antiOffhand", false, []);

system.afterEvents.scriptEventReceive.subscribe((event) => {
    const config = c();
    if (event.id != "matrix:offhand" || !config.antiOffhand.enabled || !event.sourceEntity || !(event.sourceEntity instanceof Player) || isSpawning(event.sourceEntity) || isAdmin(event.sourceEntity)) return;
    const player = event.sourceEntity as Player;
    let detected = false;
    if (player.hasTag(AnimationControllerTags.moving) && !player.isInWater && !player.isGliding && !player.hasTag(AnimationControllerTags.riding)) {
        detected = true;
        flag(player, config.antiOffhand.modules, "A");
    } else if (player.hasTag(AnimationControllerTags.attackTime)) {
        detected = true;
        flag(player, config.antiOffhand.modules, "B");
    } else if (player.hasTag(MatrixUsedTags.container)) {
        detected = true;
        flag(player, config.antiOffhand.modules, "C");
    } else if (player.hasTag(AnimationControllerTags.usingItem)) {
        detected = true;
        flag(player, config.antiOffhand.modules, "D");
    }
    if (detected && config.antiOffhand.doUnEquip) {
        inactiveTotem(player);
    }
});

function inactiveTotem(player: Player) {
    const e = player.getComponent("minecraft:equippable");
    const q = e?.getEquipment(EquipmentSlot.Offhand);
    if (!q) return;
    e?.setEquipment(EquipmentSlot.Offhand);
    player.getComponent("minecraft:inventory")!.container!.addItem(q);
}
