import "./moderation/moderation"
import "./Combat_AntiCheat/Reach/AntiReach"
import "./Combat_AntiCheat/AutoClicker/AntiAutoClicker"
import "./Block_AntiCheat/Reach/AntiBreak&PlaceReach" 
import "./Block_AntiCheat/SpeedMine/AntiSpeedMine" 
import "./Block_AntiCheat/Nuker/AntiNuker" 
import "./Block_AntiCheat/Xray/AntiXray" 
import "./Block_AntiCheat/autoClicker/AntiAutoClicker" 
import "./Block_AntiCheat/Scaffold/AntiScaffold" 
import "./Commands/beforeChat"

import { world } from "@minecraft/server"
//prevent crash by script
world.beforeEvents.watchdogTerminate.subscribe(ev => ev.cancel = true);
