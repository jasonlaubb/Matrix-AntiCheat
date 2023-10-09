/* punishment type */
export class punishmentType {
    none: string;
    tempkick: string;
    kick:string;
    ban: string;
    default: string;
}
;
/* module class when flag */
export class ModuleClass {
    name: string;
    punishment: punishmentType | string;
    minVL: number;
}
;
/* command class */
export class CommandClass {
    needTag: string[] | null;
    needAdmin: boolean;
    needOp: boolean;
    description: string;
    usage: string[];
}
;
/* javascript console */
export class Console {
    static log(data: any) {
        //@ts-expect-error
        console.log(`${data}`);
    }
    ;
    static warn(data: any) {
        //@ts-expect-error
        console.warn(`${data}`);
    }
    ;
}
