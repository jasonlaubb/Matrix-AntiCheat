import * as server from "@minecraft/server"
import * as data from "./node_modules/@minecraft/vanilla-data/lib/index"

declare module "@minecraft/server" {
    interface Player {
        // Number value
        lastExplosionTime: number
        threwTridentAt: number
    }
}