import * as Server from "../node_modules/@minecraft/server/index";
import * as Ui from "../node_modules/@minecraft/server-ui/index";
import * as VanillaData from "./node_modules/@minecraft/vanilla-data/lib/index";

declare module "@minecraft/server" {
    interface Player {
        threwTridentAt: number;
        lastExplosionTime: number;
        blockData: any[];
        blacklistMsgWarn: number;
        lastTouchWater: number;
        lastItemUsed: number;
        lastTouchGround: number;
        lastOpTry: number;
        lastGliding: number;
        lastBlockPlace: number;
        lastTeleportTime: number;
        lastSpeedSkipCheck: number;
        lastVelLog: number;
        lastGlidingFire: number;
        lastClip: number;
        lastApplyDamage: number;
        backClip: number;
        lastSafePos: Vector3;
        befoClip: number;
        lastBreakSolid: number;
        verifyTimer: number;
        verifyClickSpeed: number;
        verifying: boolean;
        notVerified: boolean;
        tryVerify: number;
        verified: boolean;
    }
    interface World {
        antiBotEnabled: boolean;
    }
}
