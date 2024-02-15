import { world } from "@minecraft/server"
import { chatSendBeforeEvent as commandListener } from "./cc/handler"

// Subscribe chat event
world.beforeEvents.chatSend.subscribe(commandListener)

// Subscribe the command to handler
import "./cc/commands/about"