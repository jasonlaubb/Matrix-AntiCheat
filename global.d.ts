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
        // Ore Alert
        diamondFoundAmount: number;
        lastDiamondOresFound: number;
        lastOreFoundData: { [key: string]: number };
        // Afk data
        lastMoved: number;
        // Detection data
        killauraFlag: number;
        killauraLastFlag: number;
        killauraHitList: { id: string, time: number }[];
        killauraPitch: number[];
        killauraYaw: number[];
        killaura45YawFlag: number[];
        killauraSmoothFlag: number;
        killauraXSpeed: number[];
        killauraLastRiptide: number;
        killauraPitchHistory: number[];
        killauraLastAttack: number;
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
        scaffoldStrightXZ: "x" | "z";
        scaffoldStraightCount: number;
        scaffoldDiagFlag: number;
        scaffoldExtenderFlag: number;
        autotoolLastSwitch: number;
        autotoolLastIndex: number;
        autotoolSafeIndex: number;
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
}