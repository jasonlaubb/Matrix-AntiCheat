import { system, Player, world } from "@minecraft/server";
import { ActionFormData, FormCancelationReason, ModalFormData } from "@minecraft/server-ui";
import { triggerCommand } from "../chatModel/CommandHandler";
import { c, isAdmin, rawstr } from "../../Assets/Util";
import { getModulesIds } from "../../Modules/Modules";

export const adminUI = (player: Player) => system.run(() => menu(player));
function menu(player: Player) {
    if (!isAdmin(player)) {
        //prevent no admin open ui mistakenly
        player.sendMessage(`§bMatrix §7> §l§cAccess denied! §7No admin permission`);
        return;
    }

    new ActionFormData()
        .title(rawstr.drt("ui.title"))
        .button(rawstr.drt("ui.moderateplayer"), "textures/ui/FriendsDiversity.png")
        .button(rawstr.drt("ui.setting"), "textures/ui/gear.png")
        .button(rawstr.drt("ui.exit"), "textures/ui/redX1.png")
        .show(player)
        .then((res) => {
            if (res.canceled) {
                if (res.cancelationReason == FormCancelationReason.UserBusy) system.run(() => adminUI(player));
                return;
            }
            // player: The admin which using the ui
            switch (res.selection) {
                case 0: {
                    // target: The player which selected as a target
                    selectPlayer(player).then((target) => {
                        // Checks if player selected a valid target
                        if (target !== null) {
                            openForIt(player, target);
                        }
                    });
                    break;
                }
                case 1: {
                    // If player wants to set the amticheat
                    moduleUI(player);
                    break;
                }
            }
        });
}

function openForIt(player: Player, target: Player) {
    if (isAdmin(target)) {
        player.sendMessage(`§bMatrix §7> §c§lAccess denied! §r§7Moderate players with admin permission`);
    } else {
        moderatePlayer(player, target);
    }
}

async function selectPlayer(player: Player): Promise<Player> {
    const pointAllPlayer = world.getAllPlayers();
    const selectMenu = new ActionFormData().title("Select online player");
    for (const target of pointAllPlayer) {
        let des = "";
        if (player.name == target.name) {
            des = "\n§c§lYou";
        } else if (isAdmin(target)) {
            des = "\n§c§lAdmin";
        }
        selectMenu.button(target.name + des);
    }
    const result = await selectMenu.show(player);
    if (result.canceled) return null;
    return pointAllPlayer[result.selection] ?? null;
}

interface AbcSelection {
    a: string;
    b?: string;
    c?: string;
}

const groupAbc = ([a, b, c]: any[]): AbcSelection => ({ a, b, c });

async function cpu(form: ModalFormData, player: Player, to: string): Promise<AbcSelection> {
    const data = await form.show(player);
    if (data.canceled) return null;
    return groupAbc([to, ...data.formValues]);
}

// For state that how to form a command
const moderateAction: { [key: number]: (arg: AbcSelection) => string } = {
    0: ({ a, b, c }) => `ban "${a}" "${b}" "${c}"`,
    1: ({ a }) => `freeze "${a}"`,
    2: ({ a }) => `unfreeze "${a}"`,
    3: ({ a }) => `mute "${a}"`,
    4: ({ a }) => `unmute "${a}"`,
    5: ({ a }) => `invcopy "${a}"`,
    6: ({ a }) => `invsee "${a}"`,
    7: ({ a }) => `echestwipe "${a}"`,
};

// Match the ui
const moderateUI: { [key: number]: (player: Player, target: string) => Promise<AbcSelection> } = {
    0: (p, t) => cpu(banForm, p, t),
};

async function moderatePlayer(player: Player, target: Player) {
    const action = await new ActionFormData()
        .title("Moderate " + target.name)
        .button(rawstr.drt("ui.ban.button"))
        .button(rawstr.drt("ui.freeze.button"))
        .button(rawstr.drt("ui.unfreeze.button"))
        .button(rawstr.drt("ui.mute.button"))
        .button(rawstr.drt("ui.unmute.button"))
        .button(rawstr.drt("ui.invcopy.button"))
        .button(rawstr.drt("ui.invsee.button"))
        .button(rawstr.drt("ui.echestwipe.button"))
        .button(rawstr.drt("ui.exit"), "textures/ui/redX1.png")
        .show(player);
    if (action.canceled) return;
    const actionData = moderateUI[action.selection];
    let abcSelection: AbcSelection = { a: target.name };
    if (actionData) {
        // get the selection of player
        abcSelection = await actionData(player, target.name);
        if (abcSelection === null) return;
    } else if (action.selection >= Object.keys(moderateAction).length) return;
    // Run an chat command for the player
    triggerCommand(player, moderateAction[action.selection](abcSelection));
}
const banForm = new ModalFormData().title(rawstr.drt("ui.banplayer")).textField(rawstr.drt("ui.ban.reason"), rawstr.drt("ui.ban.placeholder")).textField(rawstr.drt("ui.ban.length"), "1d2h3m4s", "forever");
async function moduleUI(player: Player) {
    const moduleForm = new ActionFormData();
    moduleForm.title("Module UI");
    const ids = getModulesIds();
    const config = c() as { [key: string]: any };
    for (const moduleId of ids) {
        const state = (config[moduleId]?.enabled);
        const buttontext = new rawstr().str(`§8${moduleId} §8[§r`).tra(state ? "ui.toggle.enabled" : "ui.toggle.disabled").str("§r§8]§r");
        moduleForm.button(buttontext.parse());
    }
    moduleForm.show(player).then((data) => {
        if (data.canceled) return;
        const moduleData = ids[data.selection];
        if (moduleData) {
            toggleUI(player, moduleData);
        }
    });
}
async function toggleUI(player: Player, moduleData: string) {
    let state = (c() as { [key: string]: any })[moduleData]?.enabled;
    if (state == true) state = "§aEnabled";
    else state = "§cDisabled";
    const moduleForm = new ActionFormData();
    moduleForm.title("toggle module");
    moduleForm.body("module: §8" + moduleData + "\n§rstatus: §8" + state);
    moduleForm.button(rawstr.drt("ui.toggle.enable"));
    moduleForm.button(rawstr.drt("ui.toggle.disable"));
    moduleForm.show(player).then((data) => {
        if (data.canceled) return;
        // use the command for the user.
        triggerCommand(player, `toggle ${moduleData} ${data.selection == 0 ? "enable" : "disable"}`);
    });
}
