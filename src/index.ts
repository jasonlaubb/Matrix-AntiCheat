import { world } from "@minecraft/server"
import { chatSendBeforeEvent as commandListener } from "./cc/handler"

// Listen for command send
world.beforeEvents.chatSend.subscribe(commandListener)