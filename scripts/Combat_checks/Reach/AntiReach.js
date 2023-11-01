import * as Minecraft from "@minecraft/server"
import {
  antiReachAttackEnabled,
  setScore,
  addScore, 
  detect
} from "../../config"
import {
  system,
  ItemStack,
  world,
  ItemEnchantsComponent,
  Vector,
  Container
} from "@minecraft/server"
let world = Minecraft.world
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
    let projectilHit = event.damageSource.damagingProjectile
    if (projectilHit || attacker == undefined || target == undefined) return
    let {
      x,
      y,
      z
    } = target.location;
    let {
      x: attackerx,
      y: attackery,
      z: attackerz
    } = attacker.location;
    if (target.hasTag("lobby:Matrix")) {
      target.runCommand(`tp ${x} ${y} ${z}`)
    }
    if (attacker.typeId == "minecraft:player") {
      let TargetsCount = world.scoreboard.getObjective("countOfTargets").getScore(attacker.scoreboardIdentity)
      let lastReachDis = world.scoreboard.getObjective("reachDis").getScore(attacker.scoreboardIdentity)
      let tryReachA = world.scoreboard.getObjective("tryReachA").getScore(attacker.scoreboardIdentity)
      let reachType;
      let targetName;
      targetName = target.name;
      if (targetName == undefined) {
        targetName = target.typeId.replaceAll("minecraft:", "");
        targetName = targetName.replaceAll("_", "");
      }
      let limitOfReachX;
      limitOfReachX = 3.5;
      let limitOfReachZ;
      limitOfReachZ = 3.5;
      let limitOfReachY;
      limitOfReachY = 4.7;
      if (attacker.hasTag("is_jumping")) {
        limitOfReachY = 5.7;
      }
      let attackerX = attackerx.toFixed(2)
      let attackerZ = attackerz.toFixed(2)
      let attackerY = attackery.toFixed(2)
      let disY;
      let disZ;
      let disX;
      let velocityZ;
            velocityZ = Math.abs(target.getVelocity().z) + Math.abs(attacker.getVelocity().z) * 2
      let velocityX;
      velocityX = Math.abs(target.getVelocity().x) + Math.abs(attacker.getVelocity().x) * 2
      disY = Math.abs(y - attackerY)
      disX = Math.abs(x - attackerX) - velocityX
      disZ = Math.abs(z - attackerZ) - velocityZ
      disXZ = Math.sqrt(disX * disX + disZ * disZ) - (velocityX + velocityZ)
      disXZ = disXZ.toFixed(2)
      let generalDis;
      if (attackerY > y + 3) {
        limitOfReachY = 3
      }
      
      
      
      disX = disX.toFixed(2)
      disY = disY.toFixed(2)
      disZ = disZ.toFixed(2)
      if (target.typeId.includes("dragon")) {
        limitOfReachX = 4.2
        limitOfReachY = 4.7
        limitOfReachZ = 4.2
      }
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
      target.addTag(`skip_check`)
      target.runCommand(`scoreboard players set @s skip_check 20`)
      if (disXZ > limitOfReachX || disY > limitOfReachY) {
setScore(world,attacker,"reachDis",Math.floor(distance*100)) 
addScore(world,attacker,"tryReachA",1)
      }
      if (disX < limitOfReachX && disY < limitOfReachY && disZ < limitOfReachZ) {
        setScore(world,attacker,"tryReachA",0)
      }
      addScore(world,attacker,"countOfTargets",1)
      if (TargetsCount > 1) {
        detect(attacker,"kick","§e[§cMatrix§e] §gkillaura §8(§gC§8) §chas been detected from§b "+attacker.name,null,true,"§e[§cMatrix§e] §ckillaura §8(§gC§8)")
      }
      if (disXZ >= 2) {
        if (attacker.hasTag("MatrixOP")) return
        let getVector = (p1, p2) => ({
          x: p2.x - p1.x,
          y: p2.y - p1.y,
          z: p2.z - p1.z
        });
        let getNDP = (v1, v2) => (v1.x * v2.x + v1.y * v2.y + v1.z * v2.z) / (Math.sqrt(v2.x ** 2 + v2.y ** 2 + v2
          .z ** 2) * Math.sqrt(v1.x ** 2 + v1.y ** 2 + v1.z ** 2));
        let angle = Math.acos(getNDP(attacker.getViewDirection(), getVector(attacker.location, target.location))) *
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
