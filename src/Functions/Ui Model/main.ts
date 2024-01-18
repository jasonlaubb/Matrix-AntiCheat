import { system, Player, world } from "@minecraft/server";
import { ActionFormData } from "@minecraft/server-ui";
import { isAdmin } from "../../Assets/Util";

export const adminUI = (player: Player) => system.run(() => menu(player))
async function menu (player: Player) {
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
            switch (res.selection) {
                case 0: {
                    selectPlayer(player).then(target => {
                        if (target !== null) {
                            if (isAdmin(player)) {
                            switch (target.selection) 
                                case 1:{
                                .title("Admin GUI") 
                            for (let players of world.getPlayers()){
                                if (players.name == player.name){
                                .button(player.name+" §c[YOU]")
                             } else if(players.name != player.name){
                               if(isAdmin(players)){
                                .button(players.name+" §c[Admin]") 
                               } else if(!isAdmin(players)){
                                .button(players.name)
                                 } 
                                } 
                               } else {
                                //nomal manage player ui
                            }
                        }
                    })
                    break
                }
                case 1: {
                    // wait
                    break
                }
            }
        })
}

async function selectPlayer (player: Player) {
    const pointAllPlayer = world.getPlayers()
    const menu = new ActionFormData()
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
    const result = await menu.show(player)
    if (result.canceled) return null
    return pointAllPlayer[result.selection] ?? null
}
