import { system, Player, world } from "@minecraft/server";
import { ActionFormData } from "@minecraft/server-ui";
import { inputCommand } from "../chatModel/CommandSystem"
import { isAdmin } from "../../Assets/Util";

export const adminUI = (player: Player) => system.run(() => menu(player))
function menu (player: Player) {
    if (!isAdmin(player)) {
        //prevent no admin open ui mistakenly
        player.sendMessage(`§bMatrix §7> §cError: Access denied!`)
        return
    }

    new ActionFormData()
        .title("Admin GUI")
        .button("Manage Players", "textures/ui/FriendsDiversity.png")
        .button("Settings", "textures/ui/gear.png")
        .button("Exit", "textures/ui/redX1.png")
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
                                // If player selected an admin
                            } else {
                                // Player selected a normal player
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
        menu.button(target.name + des)
    }
    const result = await selectMenu.show(player)
    if (result.canceled) return null
    return pointAllPlayer[result.selection] ?? null
}
async function actions (player: Player, target: Player) {
    .title("Select action") 
    .button("Op") 
    .button("deop")  
    .button("Ban") 
    .button("Unban")  
    .button("Freeze")  
    .button("Unfreeze")  
    .button("Mute")  
    .button("Unmute")  
    .button("Vanish")  
    .button("Unvanish")  
    .button("Echestwipe") 
    .button("Invsee")  
    .button("Invcopy")  
    .show(player).then(res => {
    switch (res.selection){
        case 0:{
      inputCommand(player,`op "${target.name}"`,config.prefix) 
            } 
        case 1:{
      inputCommand(player,`deop "${target.name}"`,config.prefix) 
            } 
        case 2:{
      inputCommand(player,`ban "${target.name}"`,config.prefix) 
            } 
        case 3:{
      inputCommand(player,`unban "${target.name}"`,config.prefix) 
            } 
        case 4:{
      inputCommand(player,`freeze "${target.name}"`,config.prefix) 
            } 
        case 5:{
      inputCommand(player,`unfreeze "${target.name}"`,config.prefix) 
            } 
        case 6:{
      inputCommand(player,`mute "${target.name}"`,config.prefix) 
            } 
        case 7:{
      inputCommand(player,`unmute "${target.name}"`,config.prefix) 
            } 
        case 8:{
      inputCommand(player,`vanish "${target.name}"`,config.prefix) 
            } 
        case 9:{
      inputCommand(player,`unvanish "${target.name}"`,config.prefix) 
            } 
        case 10:{
      inputCommand(player,`echestwipe "${target.name}"`,config.prefix) 
            } 
        case 11:{
      inputCommand(player,`invsee "${target.name}"`,config.prefix) 
            } 
        case 12:{
      inputCommand(player,`invcopy "${target.name}"`,config.prefix) 
            } 

    } 
} 
    
