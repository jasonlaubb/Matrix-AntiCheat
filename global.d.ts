import "@minecraft/server";
declare module "@minecraft/server" {
    interface Player {
        isAdmin: () => boolean;
    }
}