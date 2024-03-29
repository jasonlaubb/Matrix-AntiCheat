/**
 * @author jasonlaubb
 * @contributors ravriv, Hutao999999, RaMiGamerDev, notthinghere
 * @translate amico_nabbo, kris02, Selder578
 * @license AGPLv3
 * @link https://github.com/jasonlaubb/Matrix-AntiCheat
 */

// Watch dog, get out
import { watchDog } from "./Modules/Misc/Crasher"
watchDog()

//Load the language
import "./Assets/Language"

//load the public subscibe util
import "./Assets/Public"

//load the functions
import "./Functions/chatModel/ChatHandler"
import "./Functions/moderateModel/banHandler"
import "./Functions/moderateModel/freezeHandler"
import "./Functions/moderateModel/eventHandler"
import "./Functions/moderateModel/dimensionLock"
import "./Functions/moderateModel/lockDown"

//start all modules
import { moduleStart } from "./Modules/Modules"
moduleStart()

import { world, system } from "@minecraft/server"
import { c } from "./Assets/Util"

if (c().createScoreboard) {
    system.runTimeout(() => {
        try {
            world.scoreboard.addObjective("matrix:api", "").setScore("matrix:beta-api-enabled", -2048)
        } catch { }
    }, 10)
}