import { system } from "@minecraft/server"

/**
 * @author jasonlaubb
 * @description Prevent watchdog to terminating the scripts
 */

system.beforeEvents.watchdogTerminate.subscribe(data => {
    data.cancel = true
})