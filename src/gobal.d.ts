import * as Server from "@minecraft/server";
import * as UI from "@minecraft/server-ui";
import * as VanillaData from "@minecraft/vanilla-data";

declare module "@minecraft/server" {
    interface Player {
        threwTridentAt: number;
        lastExplosionTime: number;
        noSlowBuffer: number;
        blockData: any[];
        blacklistMsgWarn: number;
        lastTouchWater: number;
        lastItemUsed: number;
        lastTouchGround: number;
    }
}