import { system, Player, world } from "@minecraft/server";
import { ActionFormData, FormCancelationReason } from "@minecraft/server-ui";
import { isAdmin, rawstr } from "../../Assets/Util";
import { configUI } from "./configui";
import { moderatePlayer } from "./modui";
import { moduleUI } from "./toggleui";
import { triggerCommand } from "../chatModel/CommandHandler";
export const adminUI = (player: Player) => system.run(() => menu(player));
export async function menu(player: Player) {
    if (!isAdmin(player)) return;
    new ActionFormData()
        .title(rawstr.drt("ui.title"))
        .button(rawstr.drt("ui.itemui"), "textures/items/itemui")
        .button(rawstr.drt("ui.moderateplayer"), "textures/ui/FriendsDiversity")
        .button(rawstr.drt("ui.setting"), "textures/ui/gear")
        .button(rawstr.drt("ui.exit"), "textures/ui/redX1")
        //@ts-expect-error
        .show(player)
        .then((res) => {
            if (res.canceled) {
                if (res.cancelationReason == FormCancelationReason.UserBusy) system.run(() => adminUI(player));
                return;
            }
            // player: The admin which using the ui
            switch (res.selection) {
                case 0: {
                    triggerCommand(player, "itemui");
                    break;
                }
                case 1: {
                    // target: The player which selected as a target
                    selectPlayer(player).then((target) => {
                        // Checks if player selected a valid target
                        if (target !== null) {
                            openForIt(player, target);
                        }
                    });
                    break;
                }
                case 2: {
                    // If player wants to set the amticheat
                    settingUI(player);
                    break;
                }
            }
        });
}

function openForIt(player: Player, target: Player) {
    if (isAdmin(target)) {
        player.sendMessage(new rawstr(true, "c").tra("ui.nogaoadmin").parse());
    } else {
        moderatePlayer(player, target);
    }
}

async function selectPlayer(player: Player): Promise<Player | null> {
    const pointAllPlayer = world.getAllPlayers();
    const selectMenu = new ActionFormData().title(rawstr.drt("ui.selectonline"));
    for (const target of pointAllPlayer) {
        const buttonName = new rawstr().str(target.name);
        if (player.name == target.name) {
            buttonName.str("\n§c§l").tra("ui.you");
        } else if (isAdmin(target)) {
            buttonName.str("\n§c§l").tra("ui.admin");
        }
        selectMenu.button(buttonName.parse());
    }
    //@ts-expect-error
    const result = await selectMenu.show(player);
    if (result.canceled) return null;
    return pointAllPlayer[result.selection!] ?? null;
}

function settingUI(player: Player) {
    new ActionFormData()
        .title(rawstr.drt("ui.setting"))
        .button(rawstr.drt("ui.config.button"), "textures/ui/gear")
        .button(rawstr.drt("ui.toggle.button"), "textures/items/compass_item")
        .button(rawstr.drt("ui.exit"), "textures/ui/redX1")
        //@ts-expect-error
        .show(player)
        .then((res) => {
            if (res.canceled) return;
            switch (res.selection) {
                case 0: {
                    configUI(player);
                    break;
                }
                case 1: {
                    moduleUI(player);
                    break;
                }
            }
        });
}
