import { World, Player, world, EntityQueryOptions, RawMessage } from "@minecraft/server";

/** @description Show a message to all players */
World.prototype.show = function show (message: string) {
    this.sendMessage("§bMatrix §7>§g " + message)
}

/** @description Send a warn message to all players */
World.prototype.warn = function warn (message: string) {
    this.sendMessage("§bMatrix §7>§c " + message)
}

/** @description Send a warn message to the selected players */
World.prototype.send = function send (message: string, option: EntityQueryOptions | ((player: Player) => boolean), warn: boolean) {
    let selected: Player[]

    if (typeof option == "function") {
        const players = this.getAllPlayers()
        const filtered = players.filter(player => option(player))
        selected.push(...filtered)
    } else selected = world.getPlayers(option)

    if (warn) selected.forEach(player => player.sendMessage("§bMatrix §7>§c " + message));
    else selected.forEach(player => player.sendMessage("§bMatrix §7>§g " + message))
}

function raw (raw: RawMessage, color: string) {
    raw.rawtext.unshift({"text":"§bMatrix §7>§" + color + " "})
    return raw
}
/** @description Send a message to the player */
Player.prototype.tell = function tell (message: string | RawMessage) {
    this.sendMessage(typeof message == "string" ? "§bMatrix §7>§g " + message : raw(message, "b"))
}

/** @description Send a warn message to the player */
Player.prototype.warn = function warn (message: string | RawMessage) {
    this.sendMessage(typeof message == "string" ? "§bMatrix §7>§g " + message : raw(message, "c"))
}