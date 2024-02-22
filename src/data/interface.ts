import { Player, Vector3 } from "@minecraft/server";
import { CommandBuilder } from "../cc/handler"

export interface Module {
    on: () => void;
    off: () => void;
    runId?: number;
};
export interface ModuleAction {
    type: 0 | 1 | 2 | 3 | false;
    duration: null | number;
}
export interface ModuleOption {
    enabled: boolean;
    punishment: "none" | "kick" | "ban";
    action: ModuleAction;
    maxVL: number;
};
export interface CommandBuildOption {
    name?: string;
    description?: string;
    usage?: string[];
    aliases?: string[];
    requires?: (player?: Player) => boolean;
}
export type StringTypeKey = "string" | "int" | "float" | "location" | "boolean" | "player" | "array" | "duration"
export type Common = string | number | Vector3 | Player | Array<any>
export type BuilderCallBack = ((data: CommandBuilder) => void)
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
export type Punishment = "none" | "kick" | "ban"
export interface Ruleset {
    name: string,
    description: string,
    rule: {
        action: {
            absloute: Punishment,
            stable: Punishment,
            unstable: Punishment,
            light: Punishment
        },
        maxVL: {
            absloute: number,
            stable: number,
            unstable: number,
            light: number
        },
        alert: {
            actionFlag: {
                state: boolean,
                requires: (player: Player) => boolean | null,
                log: boolean
            },
            actionDone: {
                state: boolean,
                requires: (player: Player) => boolean | null,
                log: boolean
            }
        }
    }
}
export interface FlyMapData {
    velocityLog: number;
    lastLog: number;
    safePosition: Vector3;
}