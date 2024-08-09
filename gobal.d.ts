import * as Server from "./node_modules/@minecraft/server/index";
import * as Ui from "./node_modules/@minecraft/server-ui/index";
import * as VanillaData from "./ac_BP/src/node_modules/@minecraft/vanilla-data/lib/index";
import { Module } from "./ac_BP/src/Modules/Modules";
import { AnimationControllerTags, DisableTags, MatrixEvents, MatrixUsedTags } from "./ac_BP/src/Data/EnumData";
import { Translate } from "./ac_BP/src/Assets/Language";
declare module "@minecraft/server" {
    interface Player {
        threwTridentAt: number;
        lastExplosionTime: number;
        blockData: any[];
        blacklistMsgWarn: number;
        lastTouchWater: number;
        lastItemUsed: number;
        lastTouchGround: number;
        lastOpTry: number;
        lastGliding: number;
        lastBlockPlace: number;
        lastTeleportTime: number;
        lastSpeedSkipCheck: number;
        lastVelLog: number;
        lastGlidingFire: number;
        lastClip: number;
        lastApplyDamage: number;
        backClip: number;
        lastSafePos: Vector3;
        beforeClip: number;
        lastBreakSolid: number;
        verifyTimer: number;
        verifyClickSpeed: number;
        verifying: boolean;
        notVerified: boolean;
        tryVerify: number;
        verified: boolean;
        lastSelectSlot: number;
        lastTouchBlock: number;
        lastTouchBlockId: string;
        spawnTime: number;
        lastXZLogged: number;
        lastVelocity: number;
        lastVelObject: Vector3;
        lastLocObject: Vector3;
        pingTick: number;
        perfectMove: number;
        lastTouchEntity: number;
        lastNonGlidingPoint: Vector3;
        isSpawning: boolean;
        // Nah
        hasTag: (tag: AnimationControllerTags | DisableTags | MatrixUsedTags) => boolean;
        addTag: (tag: DisableTags | MatrixUsedTags) => boolean;
        removeTag: (tag: DisableTags | MatrixUsedTags) => boolean;
    }
    interface World {
        modules: Module[];
        antiBotEnabled: boolean;
        sendMsg: (...arg: (string | RawText)[]) => void;
    }
}

declare global {
    var console: Console;
    interface Console {
        log: (...arg: any) => void;
        error: (...arg: any) => void;
        warn: (...arg: any) => void;
    }
    interface String {
        latinise: () => string;
        latinize: () => string;
        isLatin: () => boolean;
    }
    // For the unstable thingyinterface WritableStream<T> {
        interface WritableStream<T> {
            write(chunk: T): void;
            close(): void;
            abort(reason?: any): void;
          }
          
          interface ReadableStream<T> {
            read(): T | null;
            cancel(reason?: any): void;
          }
          
          interface Transformer<T, U> {
            start(controller: TransformStreamDefaultController<T, U>): void;
            transform(chunk: T, controller: TransformStreamDefaultController<T, U>): void;
            flush(controller: TransformStreamDefaultController<T, U>): void;
          }
          
          interface TransformStream<T, U> {
            writable: WritableStream<T>;
            readable: ReadableStream<U>;
          }
          
          interface TransformStreamDefaultController<T, U> {
            enqueue(chunk: T): void;
            terminate(): void;
            error(reason?: any): void;
          }
}
