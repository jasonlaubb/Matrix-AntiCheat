import { Player, Vector3 } from "@minecraft/server";

export interface Module {
    on: () => void;
    off: () => void;
    runId?: number
};
export interface ModuleAction { type: 0 | 1 | 2 | 3 | false, duration: null | number }
export interface ModuleOption {
    enabled: boolean,
    punishment: "none" | "kick" | "ban",
    action: ModuleAction,
    maxVL: number,
};
export interface FlagComponent {
    flagTarget: Player;
    description: [string, string | number][] | null;
    moduleOption: ModuleOption;
};
export interface FlyMapData {
    velocityLog: number;
    lastLog: number;
    safePosition: Vector3;
}