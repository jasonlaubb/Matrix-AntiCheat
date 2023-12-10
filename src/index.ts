/**
 * @author jasonlaubb
 * @contributors ravriv, Hutao999999, RaMiGamerDev, notthinghere
 * @license AGPLv3
 * @link https://github.com/jasonlaubb/Matrix-AntiCheat
 */

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
