import { GameMode, PlayerLeaveAfterEvent, system, world } from "@minecraft/server";
import { Module, FlyMapData, FlagComponent, ModuleOption } from "../../data/interface";
import matrix from "../../lib/matrix";
import config from "../../data/config";
import { lang } from "../../lib/language";

export default {
    runId: undefined,
    on () {
        this.runId = system.runInterval(tickEvent)
        world.afterEvents.playerLeave.subscribe(playerLeaveAfterEvent)
    },
    off () {
        system.clearRun(this.runId)
        world.afterEvents.playerLeave.unsubscribe(playerLeaveAfterEvent)
    }
} as Module

const flyMapData = new Map<string, FlyMapData>()
function tickEvent () {
    const players = world.getPlayers({ excludeGameModes: [GameMode.spectator] })
    for (const player of players) {
        const skipCondition = matrix.isAdmin(player) || player.isFlying || player.isGliding || matrix.skipIf(player, 5500, 5000) || matrix.effectSkipIf(player, 2, 2)
        const data: FlyMapData = flyMapData.get(player.id) ?? { velocityLog: 0, lastLog: 0, safePosition: player.location }
        const { y: floatUp } = player.getVelocity()
        if (floatUp > config.modules.antiFly.maxVelocity && !skipCondition) {
            data.velocityLog += 1;
        } else if (floatUp > 0 || floatUp == 0 && player.isOnGround || skipCondition)
            data.velocityLog = 0
        if (player.isOnGround && floatUp == 0) data.safePosition = player.location
        if (skipCondition) {
            flyMapData.set(player.id, data)
            continue
        }
        const flagConditionA = data.velocityLog > 0 && data.velocityLog == data.lastLog
        const flagConditionB = config.modules.antiFly.maxVelocity && player.fallDistance < -1.5
        if (flagConditionA || flagConditionB) {
            const flagInfo: FlagComponent = {
                flagTarget: player,
                description: [[lang(">velocityY"), floatUp]],
                moduleOption: config.modules.antiFly as ModuleOption
            }
            matrix.flag("Fly", "A", 5000, 500, flagInfo, data.safePosition)
        }
        flyMapData.set(player.id, data)
    }
}
function playerLeaveAfterEvent ({ playerId }: PlayerLeaveAfterEvent) {
    flyMapData.delete(playerId)
}