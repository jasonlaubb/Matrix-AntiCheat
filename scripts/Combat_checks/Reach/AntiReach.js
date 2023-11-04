//@ts-check
import {
  antiReachAttackEnabled,
  setScore,
  addScore, 
  detect
} from "../../config"
import {
  Player,
  world
} from "@minecraft/server"

let reachAToggle;
let disXZ;
if (antiReachAttackEnabled == true) {
  world.afterEvents.entityHurt.subscribe((event) => {
    try {
      reachAToggle = world.scoreboard.getObjective("toggle:reachA").displayName
    } catch {
      reachAToggle = true
    }
    if (reachAToggle != true) return
    const attacker = event.damageSource.damagingEntity
    const target = event.hurtEntity
    const projectilHit = event.damageSource.damagingProjectile
    if (projectilHit || attacker == undefined || target == undefined) return
    const {
      x,
      y,
      z
    } = target.location;
    const {
      x: attackerx,
      y: attackery,
      z: attackerz
    } = attacker.location;
    if (attacker instanceof Player) {
      const TargetsCount = world.scoreboard.getObjective("countOfTargets").getScore(attacker.scoreboardIdentity)
      const lastReachDis = new Map()
      const tryReachA = new Map()
      if(tryReachA.get(attacker) == undefined &&  lastReachDis.get(attacker) == undefined){
         tryReachA.set(attacker,0) 
         lastReachDis.set(attacker,0)
        }
      let reachType;
      let targetName;
      //@ts-expect-error
      targetName = target.name;
      if (targetName == undefined) {
        targetName = target.typeId.replaceAll("minecraft:", "");
        targetName = targetName.replaceAll("_", "");
      }
      const limitOfReachX = 3.7
      const limitOfReachZ = 3.7
      let limitOfReachY;
      limitOfReachY = 4.7;
      if (attacker.hasTag("is_jumping")) {
        limitOfReachY = 5.7;
      }
      const attackerX = Number(attackerx.toFixed(2))
      const attackerZ = Number(attackerz.toFixed(2))
      const attackerY = Number(attackery.toFixed(2))
      let disY;
      let disZ;
      let disX;
      let velocityZ = Math.abs(target.getVelocity().z) + Math.abs(attacker.getVelocity().z) * 2
      let velocityX;
      velocityX = Math.abs(target.getVelocity().x) + Math.abs(attacker.getVelocity().x) * 2
      disY = Math.abs(y - attackerY)
      disX = Math.abs(x - attackerX) - velocityX
      disZ = Math.abs(z - attackerZ) - velocityZ
      disXZ = Math.sqrt(disX * disX + disZ * disZ) - (velocityX + velocityZ)
      disXZ = Number(disXZ.toFixed(2))
      if (attackerY > y + 3) {
        limitOfReachY = 3
      }
      disX = Number(disX.toFixed(2))
      disY = Number(disY.toFixed(2))
      disZ = Number(disZ.toFixed(2))
      let distance;
      if (disX > limitOfReachX == true) {
        distance = disX;
        reachType = "x"
      }
      if (disZ > limitOfReachZ == true) {
        distance = disZ;
        reachType = "z"
      }
      if (disY > limitOfReachY == true) {
        distance = disY;
        reachType = "y"
      }
      if (disXZ > limitOfReachX == true) {
        distance = disXZ;
        reachType = "x§8,§gz"
      }
      if (disXZ > limitOfReachX || disY > limitOfReachY) {
lastReachDis.set(attacker,distance)
tryReachA.set(attacker,tryReachA.get(player)+1)
      }
      if (disX < limitOfReachX && disY < limitOfReachY && disZ < limitOfReachZ) {
        tryReachA.set(attacker,0)
      }
      addScore(world,attacker,"countOfTargets",2)
      if (TargetsCount > 1) {
        detect(attacker,"kick","§e[§cMatrix§e] §gkillaura §8(§gC§8) §chas been detected from§b "+attacker.name,null,true,"§e[§cMatrix§e] §ckillaura §8(§gC§8)")
      }
      if (disXZ >= 2) {
        if (attacker.hasTag("MatrixOP")) return
        const getVector (p1, p2) => ({
          x: p2.x - p1.x,
          y: p2.y - p1.y,
          z: p2.z - p1.z
        });
        const getNDP = (v1, v2) => (v1.x * v2.x + v1.y * v2.y + v1.z * v2.z) / (Math.sqrt(v2.x ** 2 + v2.y ** 2 + v2
          .z ** 2) * Math.sqrt(v1.x ** 2 + v1.y ** 2 + v1.z ** 2));
        const angle = Math.acos(getNDP(attacker.getViewDirection(), getVector(attacker.location, target.location))) *
          (180 / Math.PI);
        if (angle > 90) {
          //this anti killaura by obsidian antiCheat ravrvir i set your copyrights dont worry about that
          world.sendMessage(
            `§e[§cMatrix§e] §b${attacker.name} §chas been kicked!§r\n§gBy§8:§cMatrix\n§gReason§8:§ckillaura §8(§gB§8)§r`
            )
          attacker.runCommand(
            `tellraw @a[tag=notify]{"rawtext":[{"text":"§g[§cMatrix§g] §gkillaura §8(§gB§8) §chas been detected from §b${attacker.name}\n§cangle §8= §8(§g${angle}§8/§g90§8)\n§cTarget§8 = §8(§g${targetName}§8)"}]}`
            )
          attacker.runCommand(
            `kick "${attacker.name}" .\n§8 >> §c§lYou are kicked bad boy\n§r§8 >> §gReason§8:§ckillaura §8(§gB§8) §cangle §8= §8(§g${angle}§8/§g90§8)§r\n§8 >> §gBy§8:§cMatrix`
            )
        }
      }
      if (tryReachA == 1 && disXZ > limitOfReachX || tryReachA == 1 && disX > limitOfReachX || tryReachA == 1 &&
        disY > limitOfReachY || tryReachA == 1 && disZ > limitOfReachZ || tryReachA >= 2) {
        if (attacker.hasTag("MatrixOP")) return
        attacker.runCommand(
          `tellraw @a[tag=notify]{"rawtext":[{"text":"§g[§cMatrix§g] §can unNatural §gReach §8(§gA§8) §chas been detected from §b${attacker.name}\n§cDistance §8= §8(§g${lastReachDis/100}§8/§gBlocks§8)\n§cTarget§8 = §8(§g${targetName}§8)\n§cReach type §8= (§g${reachType}§8)"}]}`
          )
        setScore(world,attacker,"tryReachA",0)
        attacker.runCommand(
          `kick "${attacker.name}" .\n§8 >> §c§lYou are kicked bad boy\n§r§8 >> §gReason§8:§can unNatural §gReach §8(§gA§8) §cDistance §8= §8(§g${lastReachDis/100}§8/§gBlocks§8)\n§8 >> §gBy§8:§cMatrix`
          )
        world.sendMessage(
          `§e[§cMatrix§e] §b${attacker.name} §chas been kicked!§r\n§gBy§8:§cMatrix\n§gReason§8:§can unNatural §gReach §8(§gA§8) §cDistance §8= §8(§g${lastReachDis/100}§8/§gBlocks§8)`
          )
      }
    }
  })
}
world.afterEvents.entityHurt.subscribe((event) => {
   const explode = event.damageSource.cause
   const attacker = event.damageSource.damagingEntity
    const target = event.hurtEntity
    if(target.typeId == "minecraft:player" && attacker != undefined){
    setScore(world,target,"skip_check",40)
    }if(explode == "entityExplosion"){
      setScore(world,target,"skip_check",60)
    }
})
export {
  disXZ
}
