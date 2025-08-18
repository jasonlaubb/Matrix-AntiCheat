import * as Server from "@minecraft/server";
declare module "@minecraft/server" {
    interface Player {
        /**
         * Checks if the player has operator permissions.
         * @returns {boolean}
         */
        isOp: () => boolean;
        flag: (id: string, type: string, category: string, data?: { [key: string]: string | number }) => void;
        kick: (reason: string) => void;
	    /**
	     * Checks if player is safe device like Xbox and PS4
	     */
		isSafeDevice: () => boolean;
        // Xray data
        lastNoTntMsg: number;
        // WorldBorder data
        lastSafeLocation: Vector3;
        lastDimension: string;
        // Watch command
        isWatching?: boolean;
        watchTargetPos?: Vector3;
        watchPlayerPos?: Vector3;
        watchBeforeGM?: GameMode;
        cameraType?: "down" | "head" | "behind";
        // Freecam command
        freecamCameraPosition?: Server.Vector3;
        // Ore Alert
        diamondFoundAmount: number;
        lastDiamondOresFound: number;
        lastOreFoundData: { [key: string]: number };
        // Afk data
        lastMoved: number;
        // Detection handler data
        lastRiptide: number;
        lastKnockback: number;
        itemStartUse?: number;
        // AntiSpam Data
        lastMessage: number;
        tooFastFlag: number;
        lastMessageRaw: string;
        // AutoMute Data
        chatEntered: boolean;
        // Detection data
        killauraFlag: number;
        killauraLastFlag: number;
        killauraHitList: { id: string, time: number }[];
        killauraPitch: number[];
        killauraYaw: number[];
        killaura45YawFlag: number[];
        killauraSmoothFlag: number;
        killauraXSpeed: number[];
        killauraLastAttack: number;
        killauraLastInAir: number;
        killauraHeadData: Vector3[];
        killauraHeadRecording?: boolean;
        nofallLastFallState: boolean;
        nofallLastOnGroundLocation: Server.Vector3;
        autototemLastItem: [boolean, boolean];
        chestauraLastLostIndex: number;
        disablerLastFlagged: boolean;
        ziplineLastPlace: number;
        ziplineFlag: number;
        ziplineLastLoc: Server.Vector3;
        scaffoldLastPlace: number;
        scaffoldLastPlaceLoc: Server.Vector3;
        scaffoldNoRotationFlag: number;
        scaffoldIntPitch: number;
        scaffoldBackwardFlag: number;
        scaffoldDownFlag: number;
        scaffoldStrightXZ: Axis;
        scaffoldAxisGrace: number;
        scaffoldStraightRecent: number;
        scaffoldDiagTimes: number[];
        scaffoldAllTimes: number[];
        scaffoldBridgeY: number;
        scaffoldStraightCount: number;
        scaffoldDiagFlag: number;
        scaffoldExtenderFlag: number;
        autotoolLastSwitch: number;
        autotoolLastIndex: number;
        autotoolSafeIndex: number;
        autotoolFlag: number;
        autotoolLastFlag: number;
        speedData: SpeedData;
        flyData: FlyData;
        flyLastPistonPush: number,
        breakData: InstabreakData;
        entityFlyData: EntityFlyData;
        elytraFlyData: ElytraFlyData;
        autoclickerAttackDuration: number;
        autoclickerInitTimestamp: number;
        autoclickerFlag: number;
        autoclickerLastFlag: number;
        autoclickerCpsCount: number;
        xpLastValid: number;
        xpLastXpAmount: number;
        freecamLastMoved: number;
        freecamCameraModified: boolean;
        surroundLastPlaceObsidian: number;
        surroundNearbyFlag: number;
        fastthrowLastThrow: number;
        fastthrowFlag: number;
        fastthrowLastFlag: number;
        aimAssistData: AimAssistData;
		breakerLastBreak: number;
        invalidSprintBlindAt: number;
        invalidSprintStopUseAt: number;
    }
    interface Entity {
        // Detection data
        antiReachRecordTime: number;
        antiReachRecords: Server.Vector3[];
        antiReachRecording?: boolean;
    }
    interface Block {
        // Detection data
        chestauraIsTracking: boolean;
        previousOpen: string;
    }
    interface World {
        lockdown?: boolean;
        banItemEventRegistered?: boolean;
        educationalFeaturesEnabled?: boolean;
    }
}
interface Console {
    log: (data: any) => void;
    warn: (data: any) => void;
    error: (data: any) => void;
}
declare global {
	var console: Console;
}
interface SpeedData {
    lastAttackTimestamp: number,
    lastRidingEndTimestamp: number,
    flagAmount: number,
    lastFlagTimestamp: number,
    lastStopLocation: Server.Vector3,
    lastSleep: number,
    previousSpeed: number[],
    timerFlagAmount: number,
    lastTriggerLocation: Server.Vector3,
    lastTimerFlagTimestamp: number,
    timerMainFlagAmount: number,
    lastSprint: boolean,
    lastEnderPeal: number,
    lastRiding: boolean,
    lastLocation: Server.Vector3;
    lastVelocity: Server.VectorXZ;
    lastSpeedXZ: number;
}
interface FlyData {
    lastOnGroundLocation: Server.Vector3,
    velocityYList: number[],
    lastFlaggedLocation: Server.Vector3,
    flagAmount: number,
    lastFlagTimestamp: number,
    hasStarted: number,
    lastVelocityY: number;
}
export interface InstabreakData {
    brokenBlocks: BrokenBlockList;
    brokenAmount: number;
    startBreakingTime: number;
    flagInsteaBreak: boolean;
}
export type BrokenBlockList = { blockPermutation: Server.BlockPermutation; blockPosition: Server.Vector3 }[];
export interface EntityFlyData {
    pastVelocityY: number[]
    lastNotRidingLocation: Server.Vector3,
    prefectCombo: number,
    superCombo: number,
    illegalFactorAmount: number,
}
export interface ElytraFlyData {
    startGlideTime: number,
    startGlideSpeed: number,
    isSpeedDecreasing: boolean,
    highestGlidingSpeed: number,
    isLastTickGliding: boolean,
    usedRocket: boolean,
    lastSpeedDeviation: number,
    triggeredType2: boolean,
    lastSpeedXZ: number;
}
export interface AimAssistData {
    lastYaw: number;
    lastPitch: number;
    lastDeltaYaw: number;
    lastDeltaPitch: number;
    flagAmount: {
        a: number;
        b: number;
        c: number;
        d: number;
    };
}
export type Axis = "x" | "z" | undefined;
