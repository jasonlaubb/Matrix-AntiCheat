//still need @ts-expact-error
declare module "@minecraft/server" {
    interface Player {
        blockData: any[];
        threwTridentAt: number;
        lastExplosionTime: number;
    }
}