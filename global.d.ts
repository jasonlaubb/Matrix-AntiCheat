import * as Server from "@minecraft/server";
declare module "@minecraft/server" {
    interface Player {
        /**
         * Checks if the player has operator permissions.
         * @returns {boolean}
         */
        isOp: () => boolean;
    }
    interface Entity {
        antiReachRecordTime?: number;
        antiReachRecords?: Server.Vector3[];
    }
}