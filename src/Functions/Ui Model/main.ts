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
  } 
