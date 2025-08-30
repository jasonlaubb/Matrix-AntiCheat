import { PlayerPlaceBlockBeforeEvent, system, Vector3, world } from "@minecraft/server";
export default {
    property: "antiScaffoldEnable",
    enable() {
        world.beforeEvents.playerPlaceBlock.subscribe(onblockPlace);
    },
    disable() {
        world.beforeEvents.playerPlaceBlock.unsubscribe(onblockPlace);
    },
};
function onblockPlace (event: PlayerPlaceBlockBeforeEvent) {
    const { player, face, faceLocation } = event;
    const pitch = player.getRotation().x;
    const data: typeof player.scaffoldData = player.scaffoldData ?? {};
    const now = Date.now();
    const interval = data.lastPlace ? now - data.lastPlace : 3000;
    if (interval < 350) {
        data.quickPlaceAmount++;
        if (data.lastPlaceDirection !== face) {
            data.turnAmount++;
        }
    } else {
        data.quickPlaceAmount = 0;
        data.turnAmount = 0;
    }
    player.sendMessage(String(data.turnAmount / data.quickPlaceAmount) + " | " + pitch + " | " + isSafeBridge(faceLocation));
    if (data.quickPlaceAmount > 8) {
        const steeringRate = data.turnAmount / data.quickPlaceAmount;
        if (steeringRate > 0.5 || steeringRate > 0.25 && isSafeBridge(faceLocation)) {
            system.run(() => player.flag("Scaffold", "A", "Block", { steeringRate }));
        }
    }
    data.lastPlaceDirection = face;
    data.lastPlace = now;
    player.scaffoldData = data;
}
function isSafeBridge ({ x, y, z }: Vector3) {
    return x === 0 && y === 0 && z === 0;
}