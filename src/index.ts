import { world } from "@minecraft/server"
import { chatSendBeforeEvent as commandListener } from "./cc/handler"
import { worldInitializeAfterEvent as languageLanucher } from "./lib/language"
import { worldInitializeAfterEvent as moduleLanucher } from "./modules/handler"

// Subscribe events
world.beforeEvents.chatSend.subscribe(commandListener)
world.afterEvents.worldInitialize.subscribe(languageLanucher)
world.afterEvents.worldInitialize.subscribe(moduleLanucher)

// Subscribe the command to handler
import "./cc/commands/about"
import "./cc/commands/help"
import "./cc/commands/toggle"