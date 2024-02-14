import { Player } from "@minecraft/server";

export interface Module {
    on: () => void;
    off: () => void;
};
export interface ModuleAction { type: 0 | 1 | 2 | 3, duration: null | number }
export interface ModuleOption {
    enabled: boolean,
    punishment: "none" | "kick" | "ban",
    action: ModuleAction,
    maxVL: number,
};
export interface FlagComponent {
    flagTarget: Player;
    description: [ { [key: string]: string | number }] | null;
    moduleOption: ModuleOption;
};