import * as server from "@minecraft/server"
import * as data from "./node_modules/@minecraft/vanilla-data/lib/index"

declare module "@minecraft/server" {
    interface Player {
        // Method
        tell: (message: string | server.RawMessage) => void
        warn: (message: string | server.RawMessage) => void
        // Number value
        lastExplosionTime: number
        threwTridentAt: number
    }
    interface World {
        // Method
        show: (message: string) => void
        warn: (message: string) => void
        send: (message: string, option: server.EntityQueryOptions, warn: boolean) => void
    }
}