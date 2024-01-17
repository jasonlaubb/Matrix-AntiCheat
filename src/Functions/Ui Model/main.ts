// It's empty! Let fill 100k line!
//lets do that
import { world, system } from "@minecraft/server"
import { ActionFormData } from "@minecraft/server-ui"
function UI(player){
const ui = new ActionFormData() 
  ui.title("Admin gui") 
  ui.body("Admin tool for manage matrix easily") 
  ui.button("§cCommands") 
  ui.button("Config") 
  ui.button("About") 
  ui.show(attacker).then(result => {
    if(result.selection == 0){
       commandUI(player) 
  } if(result.selection == 1){
       configUI(player) 
  } if(result.selection == 2){
       aboutUI(player) 
  } 
 }) 
} 
function commandUI(player){
  const ui = new ActionFormData() 
  ui.title("Command UI") 
  ui.body("Admin tool help you use commands easily")
  ui.button("ban") 
  ui.button("unban") 
  ui.button("lockdown") 
  ui.button("invsee") 
  ui.button("invcopy") 
  ui.button("kick") 
  ui.button("freeze") 
  ui.button("unfreeze") 
  ui.button("mute") 
  ui.button("unmute") 
} 
function configUI(player){
  ui.title("config UI") 
  ui.body("Admin tool help you enable and disable easily")
  } 
