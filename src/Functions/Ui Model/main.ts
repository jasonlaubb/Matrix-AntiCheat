import { system, Player, world } from "@minecraft/server";
import { ActionFormData, FormCancelationReason, ModalFormData } from "@minecraft/server-ui";
import { inputCommand } from "../chatModel/CommandSystem"
import { isAdmin } from "../../Assets/Util";
import l from "../../Data/Languages/lang";

export const adminUI = (player: Player) => system.run(() => menu(player))
function menu (player: Player) {
    if (!isAdmin(player)) {
        //prevent no admin open ui mistakenly
        player.sendMessage(`§bMatrix §7> §l§cAccess denied! §7No admin permission`)
        return
    }

    new ActionFormData()
        .title(l(".UI.i"))
        .button(l(".UI.i.a"), "textures/ui/FriendsDiversity.png")
        .button(l(".UI.i.b") + "\n§cComming soon", "textures/ui/gear.png")
        .button(l(".UI.exit"), "textures/ui/redX1.png")
        .show(player).then(res => {
            if (res.canceled) {
                if (res.cancelationReason == FormCancelationReason.UserBusy) system.run(() => adminUI(player))
                return;
            }
            // player: The admin which using the ui
            switch (res.selection) {
                case 0: {
                    // target: The player which selected as a target
                    selectPlayer(player).then(target => {
                        // Checks if player selected a valid target
                        if (target !== null) {
                            openForIt (player, target)
                        }
                    })
                    break
                }
                case 1: {
                    // If player wants to set the amticheat
                    moduleUI(player) 
                    break
                }
            }
        })
}

function openForIt (player: Player, target: Player) {
    if (isAdmin(target)) {
        player.sendMessage(`§bMatrix §7> §c§lAccess denied! §r§7Moderate players with admin permission`)
    } else {
        moderatePlayer (player, target)
    }
}

async function selectPlayer (player: Player): Promise<Player> {
    const pointAllPlayer = world.getAllPlayers()
    const selectMenu = new ActionFormData()
        .title("Select online player")
    for (const target of pointAllPlayer) {
        let des = ""
        if (player.name == target.name) {
            des = "\n§c§lYou"
        } else if (isAdmin(target)) {
            des = "\n§c§lAdmin"
        }
        selectMenu.button(target.name + des)
    }
    const result = await selectMenu.show(player)
    if (result.canceled) return null
    return pointAllPlayer[result.selection] ?? null
}

interface AbcSelection {
    a: string;
    b?: string;
    c?: string;
}

const groupAbc = ([ a, b, c ]: any[]): AbcSelection => ({ a, b, c })

async function cpu (form: ModalFormData, player: Player, to: string): Promise<AbcSelection> {
    const data = await form.show(player)
    if (data.canceled) return null
    return groupAbc([to, ...data.formValues])
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
    7: ({ a }) => `echestwipe "${a}"`
}

// Match the ui
const moderateUI: { [key: number]: (player: Player, target: string) => Promise<AbcSelection> } = {
    0: (p, t) => cpu(banForm, p, t)
}

async function moderatePlayer (player: Player, target: Player) {
    const action = await new ActionFormData()
        .title("Moderate " + target.name)
        .button("Ban player §8(ban)")
        .button("Freeze player §8(freeze)") 
        .button("Unfreeze player §8(unfreeze)") 
        .button("Mute player §8(mute)") 
        .button("Unmute player §8(unmute)") 
        .button("Invcopy player §8(invcopy)") 
        .button("Invsee player §8(invsee)") 
        .button("Echestwipe player §8(echestwipe)") 
        .button(l(".UI.exit"), "textures/ui/redX1.png")
        .show(player)
    if (action.canceled) return
    const actionData = moderateUI[action.selection]
    let abcSelection: AbcSelection = { a: target.name }
    if (actionData) {
        // get the selection of player
        abcSelection = await actionData(player, target.name)
        if (abcSelection === null) return
    } else if (action.selection >= Object.keys(moderateAction).length) return
    // Run an chat command for the player
    inputCommand(player, moderateAction[action.selection](abcSelection)) 
} 
const banForm = new ModalFormData()
    .title("Ban player")
    .textField("Reason:", "Type your reason here")
    .textField("Ban Length:", "1d2h3m4s", "forever")
async function moduleUI(player){
    const moduleForm = new ActionFormData()
    moduleForm.title("Module UI") 
    for (let i = 0; i < keys.length; i++){
    let state = getModuleState(keys[i])
    if(state == true) state = "§aEnabled" 
    else state = "§cDisabled" 
	moduleForm.button("§8"+keys[i]+" §8[§r"+state+"§8]§r")
	}; 
	moduleForm.show(player).then(data => { 
	if (data.canceled)
        return;
    const moduleData = keys[data.selection] 
    if(moduleData) {
      toggleUI(player, moduleData) 
    } 
  }) 
} 
async function toggleUI(player, moduleData){
	let state = getModuleState(moduleData)
    if(state == true) state = "§aEnabled" 
    else state = "§cDisabled" 
	const moduleForm = new ActionFormData() 
    moduleForm.title("toggle module") 
    moduleForm.body("module: §8"+moduleData+"\n§rstatus: §8"+state) 
    moduleForm.button("§aEnable§r") 
    moduleForm.button("§cDisable§r") 
    moduleForm.show(player).then(data => { 
    if (data.canceled)
        return;
    if(data.selection == 0){
    player.sendMessage(`§bMatrix §7>§g ${l("-toggles.toggleChange").replace("%a", moduleData).replace("%b", "enable")}`);
    antiCheatModules[moduleData].enable();
    world.setDynamicProperty(moduleData, true);
    } else {
    player.sendMessage(`§bMatrix §7>§g ${l("-toggles.toggleChange").replace("%a", moduleData).replace("%b", "disable")}`);
    antiCheatModules[moduleData].disable();
    world.setDynamicProperty(moduleData, false);
    } 
  }) 
} 
