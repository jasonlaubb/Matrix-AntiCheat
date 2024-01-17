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
    switch (result.selection){
        case 1:{
       commandUI(player) 
      } case 2:{
       configUI(player) 
      } case 3:{
       aboutUI(player) 
      } 
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
  const ui = new ActionFormData() 
  ui.title("config UI") 
  ui.body("Admin tool help you enable and disable modules easily")
  ui.button("AntiKillaura "+status("killaura")) 
  ui.button("AntiReach "+status("reach")) 
  ui.button("AntiAutoClicker "+status("autoClicker")) 
  ui.button("AntiBlockReach "+status("blockReach")) 
  ui.button("AntiTower "+status("tower")) 
  ui.button("AntiScaffold "+status("scaffold")) 
  ui.button("AntiNuker "+status("nuker")) 
  ui.button("AntiFastUse "+status("fastUse")) 
  } 







  } 
