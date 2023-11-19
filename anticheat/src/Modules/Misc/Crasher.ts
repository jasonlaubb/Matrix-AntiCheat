import { system } from "@minecraft/server"

/**
 * @author jasonlaubb
 * @description Prevent watchdog to terminating the scripts
 */

// Prevent watchdog to terminating the scripts \:doge\:
system.beforeEvents.watchdogTerminate.subscribe(data => {

    //cancel the watchdog terminate
    data.cancel = true
})