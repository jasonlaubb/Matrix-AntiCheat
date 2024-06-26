import { world, Player } from "@minecraft/server";

const eventData = new Map<string, string[]>();

const eventList = ["matrix:kick", "matrix:unvanish", "matrix:vanish"];

export async function triggerEvent(player: Player, id: string) {
    if (eventList.includes(id)) {
        let data: string[] = eventData.get(player.id) ?? [];
        data.push(id);
        eventData.set(player.id, data);
        player.triggerEvent(id);
    } else {
        player.triggerEvent(id);
    }
}

world.afterEvents.dataDrivenEntityTrigger.subscribe((event) => {
    const { entity: player, eventId: id } = event;

    if (id === "matrix:containerOpen") player.addTag("matrix:container");
    if (id === "matrix:containerClose") player.removeTag("matrix:container");

    if (!(player instanceof Player) || !eventList.includes(id)) return;

    const data: string[] = eventData.get(id) ?? [];

    eventData.set(
        player.id,
        data.filter((value) => value !== id)
    );
});

world.afterEvents.playerLeave.subscribe((event) => {
    const { playerId } = event;

    eventData.delete(playerId);
});
