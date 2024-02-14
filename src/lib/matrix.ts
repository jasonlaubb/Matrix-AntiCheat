import { FlagComponent } from "../data/interface";
import { lang } from "./language";
import { Player, world } from "@minecraft/server";
import config from "../data/config";

const flagData = new Map<string, { [key: string]: number }>()

export default class {
    static flag (id: string, type: "A"|"B"|"C"|"D"|"E"|"F"|"G"|"H", { flagTarget: player, description, moduleOption: { punishment, maxVL } }: FlagComponent) {
        const shown = description ? description.map(data => {
            const [key, value] = Object.entries(data)
            return `\n§r§c» §7${key}:§9 ${value}§r`
        }).join("") : ""
        let playerFlag = flagData.get(player.id) ?? {}
        playerFlag[id] ??= 0
        playerFlag[id] += 1
        let flagMessage = `§bMatrix §7>§c ${player.name}§g ` + lang(".Util.has_failed") + ` §4${id}§r §7[§c${lang(">Type")} ${type}§7] §7[§dx${playerFlag}§7]§r` + shown
        const flagMode = world.getDynamicProperty("flagMode") ?? config.antiCheatOptions.flagMode
        if (punishment && playerFlag[id] > maxVL) {
            let punishmentDone = false
            switch (punishment) {
                case "kick": {
                    punishmentDone = true
                    this.kick (player, lang(".Util.unfair").replace("%a", `${id} ${type}`), lang(".Util.by"))
                    flagMessage += "\n§bMatrix §7>§g " + lang(".Util.formkick").replace("%a", player.name)
                    break
                }
                case "ban": {
                    punishmentDone = true
                    this.ban (player, lang(".Util.unfair").replace("%a", `${id} ${type}`), lang(".Util.by"), config.punishment.ban.minutes as number | "forever" === "forever" ? "forever" : Date.now() + (config.punishment.ban.minutes * 60000))
                    flagMessage += "\n§bMatrix §7>§g " + lang(".Util.formban").replace("%a", player.name)
                    break
                }
            }
            if (punishmentDone) {
                playerFlag[id] = 0
            }
        }
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
    
        flagData.set(player.id, playerFlag)
    }
    static isAdmin (player: Player) {
        return !!player.getDynamicProperty("isAdmin")
    }
    static kick (player: Player, reason?: string, by?: string) {
        try {
            player.runCommand(`kick "${player.name}" §r\n§c§l${lang(".Util.kicked")}§r\n§7${lang(".Util.reason")}: §e${reason ?? lang(".Util.noreason")}\n§7${lang(".Util.operator")}: §e${by ?? lang(".Util.unknown")}`)
        } catch {
            player.triggerEvent("matrix:kick")
        }
    }
}