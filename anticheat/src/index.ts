/**
 * @author jasonlaubb
 * @contributors ravriv, Hutao999999, RaMiGamerDev, notthinghere
 * @license AGPLv3
 * @github https://github.com/jasonlaubb/Matrix-AntiCheat
 */

import { system } from "@minecraft/server"
system.beforeEvents.watchdogTerminate.subscribe(data => data.cancel = true)

import "./Modules/Combat/Auto Clicker"
import "./Modules/Combat/Kill Aura"
import "./Modules/Combat/Reach"

import "./Modules/Misc/Spammer"

import "./Modules/Movement/Fly"
import "./Modules/Movement/Phase"
import "./Modules/Movement/Speed"
import "./Modules/Movement/NoSlow"

import "./Modules/World/Nuker"
import "./Modules/World/Scaffold"

import "./Functions/chatModel/ChatHandler"

import "./Functions/moderateModel/banHandler"
import "./Functions/moderateModel/freezeHandler"