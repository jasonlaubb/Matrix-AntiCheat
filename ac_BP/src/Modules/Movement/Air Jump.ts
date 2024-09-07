import { system, world } from "@minecraft/server";
import { registerModule } from "../Modules";
const airJumpData = new Map();

system.afterEvents.scriptEventReceive.subscribe()