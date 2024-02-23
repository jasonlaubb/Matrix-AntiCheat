import { world } from "@minecraft/server"
import { chatSendBeforeEvent as commandListener } from "./cc/handler"
import { worldInitializeAfterEvent as languageLanucher } from "./lib/language"
import { worldInitializeAfterEvent as moduleLanucher } from "./modules/handler"
import { playerSpawnAfterEvent as banLanucher } from "./modules/model/ban"
import { worldInitializeAfterEvent as ruleHandler } from "./lib/rule_handler"

// Setup the method
import "./lib/property"

// Subscribe events
world.beforeEvents.chatSend.subscribe(commandListener)
world.afterEvents.worldInitialize.subscribe(languageLanucher)
world.afterEvents.worldInitialize.subscribe(moduleLanucher)
world.afterEvents.playerSpawn.subscribe(banLanucher)
world.afterEvents.worldInitialize.subscribe(ruleHandler)

// Subscribe the command to handler
import "./cc/commands/about"
import "./cc/commands/borderSize"
import "./cc/commands/defaultrank"
import "./cc/commands/help"
import "./cc/commands/passwords"
import "./cc/commands/showallrank"
import "./cc/commands/toggle"
import "./cc/commands/toggles"