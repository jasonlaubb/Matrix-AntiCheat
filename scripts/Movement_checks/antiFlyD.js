import { world, GameMode } from "@minecraft/server";
import { antiFlyEnabled, detect } from "../config";

const GamemodeOf = (player) => {
  const gamemodes = {
    survival: 0,
    creative: 1,
    adventure: 2,
    spectator: 3
  }
  
  for (const gamemode in GameMode) {
    if ([...world.getPlayers({
        name: player.name,
        gameMode: GameMode[gamemode]
    })].length > 0) return gamemodes[gamemode]
  }
}

async function antiFlyD (player) {
try {
  if (!antiFlyEnabled || world.scoreboard.getObjective('toggle:fly') || player.hasTag('MatrixOP')) return

  const gamemode = GamemodeOf(player)
  if (player.isFlying && world.scoreboard.getObjective('fly_coldown_timer').getScore(player) <= 0 && gamemode !== 1 && gamemode !== 3 && !player.hasTag('canfly')) {
    world.scoreboard.getObjective('fly_coldown_timer').setScore(player, 40)

    player.teleport({
      x: world.scoreboard.getObjective("groundX").getScore(player.scoreboardIdentity) / 100,
      y: world.scoreboard.getObjective("groundY").getScore(player.scoreboardIdentity) / 100,
      z: world.scoreboard.getObjective("groundZ").getScore(player.scoreboardIdentity) / 100
    })

    //no false flag in vanilla fly checks.
    detect(player, 'kick', `.\n§8 >> §c§lYou are kicked bad boy\n§r§8 >> §gReason§8:§can unNatural §gFly §8(§gD§8))\n§8 >> §gBy§8:§cMatrix`, player.location, true, `§e[§cMatrix§e] §can unNatural Movement §gFly §8(§gD§8) §cfrom §b${player.name}`)
  }
} catch (e) {
  player.runCommand(`title @a[tag=notify] §c${e}`)
}
}

export { antiFlyD }