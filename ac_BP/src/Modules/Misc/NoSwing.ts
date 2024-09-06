/**1
 * @author jasonlaubb
 * @description Checks if player placed block or fighting without hand swing.
 */

import { Player, system } from "@minecraft/server";

const swingData = new Map<string, number>();
async function onAction (player: Player) {
    const isSwing = 
}

async function isSwinging (player: Player, minTrackingTime: number) {
    const intervalId = system.runInterval(() => {
        min
    }, 1)
}