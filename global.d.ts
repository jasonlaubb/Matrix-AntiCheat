import * as Server from "@minecraft/server";
declare module "@minecraft/server" {
    interface Player {
        /**
         * Checks if the player has operator permissions.
         * @returns {boolean}
         */
        isOp: () => boolean;
        flag: (id: string, type: string, category: string, data?: { [key: string]: string | number }) => void;
        // Detection data
        killauraFlag: number;
        killauraLastFlag: number;
        killauraHitList: { id: string, time: number }[];
        killauraPitch: number[];
        killauraYaw: number[];
        killaura45YawFlag: number[];
        killauraSmoothFlag: number;
        killauraXSpeed: number[];
        nofallLastFallState: boolean;
        nofallLastOnGroundLocation: Vector3;
        autototemLastItem: [boolean, boolean];
    }
    interface Entity {
        // Detection data
        antiReachRecordTime: number;
        antiReachRecords: Server.Vector3[];
        antiReachRecording?: boolean;
    }
}