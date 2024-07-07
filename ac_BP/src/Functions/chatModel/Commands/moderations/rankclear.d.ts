import * as Minecraft from "@minecraft/server";
// In this case, string is needed. So there is a spectial .d.ts file
declare module "@minecraft/server" {
    interface Player {
        addTag: (tag: string) => boolean;
        removeTag: (tag: string) => boolean;
        hasTag: (tag: string) => boolean;
    }
}