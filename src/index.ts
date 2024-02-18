import { world } from "@minecraft/server"
import { chatSendBeforeEvent as commandListener } from "./cc/handler"
import { worldInitializeAfterEvent as languageLanucher } from "./lib/language"
import { worldInitializeAfterEvent as moduleLanucher } from "./modules/handler"
import { playerSpawnAfterEvent } from "./modules/model/ban"

// Setup the method
import "./lib/property"

// Subscribe events
world.beforeEvents.chatSend.subscribe(commandListener)
world.afterEvents.worldInitialize.subscribe(languageLanucher)
world.afterEvents.worldInitialize.subscribe(moduleLanucher)
world.afterEvents.playerSpawn.subscribe(playerSpawnAfterEvent)

// Subscribe the command to handler
import "./cc/commands/about"
import "./cc/commands/help"
import "./cc/commands/toggle"