import { system, Player, world } from "@minecraft/server";
import { ActionFormData, ModalFormData } from "@minecraft/server-ui";
import { inputCommand } from "../chatModel/CommandSystem"
import { isAdmin } from "../../Assets/Util";
import l from "../../Data/Languages/lang";

export const adminUI = (player: Player) => system.run(() => menu(player))
function menu (player: Player) {
    if (!isAdmin(player)) {
        //prevent no admin open ui mistakenly
        player.sendMessage(`§bMatrix §7> §cError: Access denied!`)
        return
    }

    new ActionFormData()
        .title(l(".UI.i"))
        .button(l(".UI.i.a"), "textures/ui/FriendsDiversity.png")
        .button(l(".UI.i.b"), "textures/ui/gear.png")
        .button(l(".UI.exit"), "textures/ui/redX1.png")
        .show(player).then(res => {
            if (res.canceled) return;
            // player: The admin which using the ui
            switch (res.selection) {
                case 0: {
                    // target: The player which selected as a target
                    selectPlayer(player).then(target => {
                        // Checks if player selected a valid target
                        if (target !== null) {
                            if (isAdmin(target)) {
                                // No, Just ignore this
                            } else {
                                moderatePlayer (player, target)
                            }
                        }
                    })
                    break
                }
                case 1: {
                    // If player wants to set the amticheat
                    break
                }
            }
        })
}

async function selectPlayer (player: Player) {
    const pointAllPlayer = world.getAllPlayers()
    const selectMenu = new ActionFormData()
        .title("Select online player")
    for (const target of pointAllPlayer) {
        let des = ""
        if (player.name == target.name) {
            des = "\n§c§lYou"
        } else if (isAdmin(player)) {
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
        .button("Ban player §7(ban)")
        .button("Freeze player §7(freeze)") 
        .button("Unfreeze player §7(unfreeze)") 
        .button("Mute player §7(mute)") 
        .button("Unmute player §7(unmute)") 
        .button("Invcopy player §7(invcopy)") 
        .button("Invsee player §7(invsee)") 
        .button("Echestwipe player §7(echestwipe)") 
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
