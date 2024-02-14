import { FlagComponent } from "../data/interface";
import { lang } from "./language";
import { Player, world } from "@minecraft/server";
import config from "../data/config";

const flagData = new Map<string, { [key: string]: number }>()

export default class {
    static flag (id: string, type: "A"|"B"|"C"|"D"|"E"|"F"|"G"|"H", { flagTarget: player, description, moduleOption }: FlagComponent) {
        const shown = description ? description.map(data => {
            const [key, value] = Object.entries(data)
            return `\n§r§c» §7${key}:§9 ${value}§r`
        }).join("") : ""
        let playerFlag = flagData.get(player.id) ?? {}
        playerFlag[id] ??= 0
        playerFlag[id] += 1
        const flagMessage = `§bMatrix §7>§c ${player.name}§g ` + lang(".Util.has_failed") + ` §4${id}§r §7[§c${lang(">Type")} ${type}§7] §7[§dx${playerFlag}§7]§r` + shown
        const flagMode = world.getDynamicProperty("flagMode") ?? config.antiCheatOptions.flagMode
        switch (flagMode) {
            case "tag": {
                const targets = world.getPlayers({ tags: ["matrix:notify"]})
                targets.forEach(players => players.sendMessage(flagMessage))
                break
            }
            case "bypass": {
                const targets = world.getPlayers({ excludeNames: [player.name] })
                targets.forEach(players => players.sendMessage(flagMessage))
                break
            }
            case "admin": {
                const allPlayers = world.getAllPlayers()
                const targets = allPlayers.filter(players => this.isAdmin(players))
                targets.forEach(players => players.sendMessage(flagMessage))
                break
            }
            case "none": {
                break
            }
            default: {
                world.sendMessage(flagMessage)
                break
            }
        }
    }
    static isAdmin (player: Player) {
        return !!player.getDynamicProperty("isAdmin")
    }
}