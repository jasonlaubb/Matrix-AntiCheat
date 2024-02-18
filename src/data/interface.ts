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
export interface BanDataOption {
    reason: string;
    by: string;
    time: number | "forever";
}
export interface FlagComponent {
    flagTarget: Player;
    description: [string, string | number][] | null;
    moduleOption: ModuleOption;
};
export interface EventSignal {
    subscribe: (callback: (input: any) => void, subscribeOption?: any) => void
    unsubscribe: (callback: (input: any) => void) => void
}
export type BasicCallBack = () => void
export type Subject = BasicCallBack | ((input: any) => void)
export type Handler = EventSignal | number
export type BuildForm = [Subject, Handler][]
export interface FlyMapData {
    velocityLog: number;
    lastLog: number;
    safePosition: Vector3;
}