import { world, GameMode } from "@minecraft/server";
import { antiFlyEnabled, detect } from "../config";

const GamemodeOf = (player) => {
  const gamemodes = {
    survival: 0,
    creative: 1,
    adventure: 2,
    spectator: 3
  }
  
  for (const gamemode of GameMode) {
    if ([...world.getPlayers({
        gameMOde: gamemode[GameMode]
    })].length > 0) return gamemode[gamemodes]
  }

  return 0
}
async function antiFlyD (player) {
  if (!antiFlyEnabled || world.scoreboard.getObjective('toggle:fly') || player.hasTag('MatrixOP')) return

  const gamemode = GamemodeOf(player)
  if (player.isFlying && world.scoreboard.getObjective('fly_coldown_timer').getScore(player) <= 0 && !gamemode === 1 && !gamemode === 3 && !player.hasTag('canfly')) {
    world.scoreboard.getObjective('fly_coldown_timer').setScore(player, 40)

    player.teleport({
      x: world.scoreboard.getObjective("groundX").getScore(player.scoreboardIdentity) / 100,
      y: world.scoreboard.getObjective("groundY").getScore(player.scoreboardIdentity) / 100,
      z: world.scoreboard.getObjective("groundZ").getScore(player.scoreboardIdentity) / 100
    })

    //no false flag in vanilla fly checks.
    detect(player, 'kick', `.\n§8 >> §c§lYou are kicked bad boy\n§r§8 >> §gReason§8:§can unNatural §gFly §8(§gD§8))\n§8 >> §gBy§8:§cMatrix`, player.location, true, `§e[§cMatrix§e] §can unNatural Movement §gFly §8(§gD§8) §cfrom §b${player.name}`)
  }
}

export { antiFlyD }