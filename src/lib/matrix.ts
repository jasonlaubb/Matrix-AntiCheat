import { FlagComponent, Module, BasicCallBack, Subject, Handler } from "../data/interface";
import { lang } from "./language";
import { Player, Vector3, system, world } from "@minecraft/server";
import config from "../data/config";
import { MinecraftEffectTypes } from "../node_modules/@minecraft/vanilla-data/lib/index";

const flagData = new Map<string, { [key: string]: number }>()

class Util {
    static flag (id: string, type: "A"|"B"|"C"|"D"|"E"|"F"|"G"|"H", maxDelay: number, minDelay: number, { flagTarget: player, description, moduleOption: { punishment, maxVL, action } }: FlagComponent, extended?: Vector3) {
        let playerFlag = flagData.get(player.id) ?? {}
        const lastFlag = playerFlag["*" + id + type]
        const now = Date.now()
        if (minDelay && (!lastFlag || now - lastFlag <= minDelay || now - lastFlag > maxDelay)) {
            playerFlag["*" + id + type] = now
            flagData.set(player.id, playerFlag)
            return
        }
        const shown = description ? description.map(data => {
            const [key, value] = Object.entries(data)
            return `\n§r§c» §7${key}:§9 ${value}§r`
        }).join("") : ""
        playerFlag[id] ??= 0
        playerFlag[id] += 1
        let flagMessage = `§bMatrix §7>§c ${player.name}§g ` + lang(".Util.has_failed") + ` §4${id}§r §7[§c${lang(">Type")} ${type}§7] §7[§dx${playerFlag}§7]§r` + shown
        console.log("[Matrix::flag] " + player.name + " -> " + id + ` (${type}) x${playerFlag[id]}`)
        const flagMode = world.getDynamicProperty("flagMode") ?? config.antiCheatOptions.flagMode
        switch (action.type) {
            case 0: {
                if (player.hasTag("matrix:pvp-disabled")) break
                player.addTag("matrix:pvp-disabled")
                system.runTimeout(() => player.removeTag("matrix:pvp-disabled"), action.duration)
                break
            }
            case 1: {
                if (player.hasTag("matrix:block-disabled")) break
                player.addTag("matrix:block-disabled")
                system.runTimeout(() => player.removeTag("matrix:block-disabled"), action.duration)
                break

            }
            case 2: {
                player.tryTeleport(extended)
                break
            }
            case 3: {
                player.applyDamage(6)
                break
            }
            case false: {
                break
            }
            default: {
                throw new Error("[Util::Flag] Invalid case of punishment: " + action.type)
            }
        }
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
                    //this.ban (player, lang(".Util.unfair").replace("%a", `${id} ${type}`), lang(".Util.by"), config.punishment.ban.minutes as number | "forever" === "forever" ? "forever" : Date.now() + (config.punishment.ban.minutes * 60000))
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
    static isAdmin (player: Player): boolean {
        return !!player.getDynamicProperty("isAdmin")
    }
    static kick (player: Player, reason?: string, by?: string) {
        try {
            player.runCommand(`kick "${player.name}" §r\n§c§l${lang(".Util.kicked")}§r\n§7${lang(".Util.reason")}: §e${reason ?? lang(".Util.noreason")}\n§7${lang(".Util.operator")}: §e${by ?? lang(".Util.unknown")}`)
        } catch {
            player.triggerEvent("matrix:kick")
        }
    }
    static skipIf (player: Player, minMsAfterExplode: number, minMsAfterTrident: number): boolean {
        const now = Date.now()
        return !(player.lastExplosionTime && now - player.lastExplosionTime < minMsAfterExplode) && !(player.threwTridentAt && now - player.threwTridentAt < minMsAfterTrident)
    }
    static effectSkipIf (player: Player, jumpBoostLimit: number | false, levitationLimit: number | false) {
        const j = player.getEffect(MinecraftEffectTypes.JumpBoost)
        const l = player.getEffect(MinecraftEffectTypes.Levitation)
        if (j && jumpBoostLimit && j.amplifier > jumpBoostLimit) return false
        if (l && levitationLimit && l.amplifier > levitationLimit) return false

        return true
    }
}

export default Util

class AntiCheatModule {
    private output: Module = { on: () => {}, off: () => {} }
    private runId: number[] = []
    private moduleId: string
    public constructor (moduleId: string, matchForm: [subject: Subject, handler: Handler][]) {
        this.moduleId = moduleId
        this.output.on = () => {
            for (const [subject, handler] of matchForm) {
                if (typeof handler == "number") {
                    this.runId.push(system.runInterval(subject as BasicCallBack, handler))
                } else {
                    handler.subscribe(subject)
                }
            }
        }
        this.output.off = () => {
            for (const [subject, handler] of matchForm) {
                if (typeof handler == "number") {
                    system.clearRun(this.runId[0])
                    this.runId.shift()
                } else {
                    handler.unsubscribe(subject)
                }
            }
        }
    }
    public readonly getName = (): string => this.moduleId
    public readonly switch = (): Module => this.output
    // Create a copy for Util functions
    protected readonly util = Util
}

export { AntiCheatModule }