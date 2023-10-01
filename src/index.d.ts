declare var console: {
    log: (...data: any[]) => void;
    info: (...data: any[]) => void;
    warn: (...data: any[]) => void;
    error: (...data: any[]) => void;
};

declare class Punishment {
    private constructor();
    readonly 'none'?: string;
    readonly 'undefined'?: boolean;
    readonly 'kick'?: string;
    readonly 'tempkick'?: string;
    readonly 'ban'?: string;
    readonly 'INVALID'?: string
}

declare class ModuleClass {
    private constructor();
    readonly punishment: Punishment;
    /**
     * @remarks
     * The punishment of the modules, undefined when no punishment. e.g. None, TempKick, Kick, Ban
     */
    readonly VL: number | boolean
    /**
     * @remarks
     * If player vl is bigger than this value flag them. undefined when no VL limit
     */
    readonly state: boolean;
    /**
     * @remarks
     * Present is it enabled
     */
}