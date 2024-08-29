import { EntityHitEntityAfterEvent, Player, world } from "@minecraft/server";
import { configi, registerModule } from "../Modules";

async function auraCheck (config: configi, {}: EntityHitEntityAfterEvent) {
    
}
registerModule(
    "antiAura",
    false,
    [],
    {
        worldSignal: world.afterEvents.entityHitEntity,
        then: auraCheck,
    }
)