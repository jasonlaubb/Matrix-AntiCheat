import {
  antiSpeed
} from "./Movement_checks/antiSpeed"
import {
  antiPhase
} from "./Movement_checks/antiNoClip"
import {
  antiCrasherA
} from "./Misc_checks/Crasher/antiCrasherA"
import {
  antiCrasherB
} from "./Misc_checks/Crasher/antiCrasherB"
import {
  antiCrasherC
} from "./Misc_checks/Crasher/antiCrasherC"
import { 
  antiNoSlow
} from "./Movement_checks/antiNoSlow"
import { 
  antiFlyA
} from "./Movement_checks/antiFlyA"
import { 
  antiFlyB 
} from "./Movement_checks/antiFlyB"
import { 
  antiFlyC
} from "./Movement_checks/antiFlyC"
import {
  moderation
} from "./Moderation/moderation"

system.runInterval(() => {
  for (const player of world.getPlayers()) {
    moderation(player)
    antiSpeed(player)
    antiFlyA(player)
    antiFlyB(player)
    antiFlyC(player)
    antiNoSlow(player)
    antiPhase(player)
    antiCrasherA(player)
    antiCrasherB(player)
    antiCrasherC(player)
  }
})