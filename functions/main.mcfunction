##script by Matrix Team
scoreboard objectives add PosYS dummy y
scoreboard objectives add PosXS dummy X
scoreboard objectives add PosZS dummy z
scoreboard players add @a PosYS 0
scoreboard players add @a PosXS 0
scoreboard players add @a PosZS 0
scoreboard objectives add PosYC dummy y
scoreboard objectives add PosXC dummy X
scoreboard objectives add PosZC dummy z
scoreboard objectives add startMovingUp dummy y
scoreboard players add @a PosYC 0
scoreboard players add @a PosXC 0
scoreboard players add @a PosZC 0
scoreboard players add @a startMovingUp 0
scoreboard players remove @a[scores={startMovingUp=1..}] startMovingUp 1
scoreboard objectives add countOfTargets dummy
scoreboard players add @a countOfTargets 0 
scoreboard players remove @a[scores={countOfTargets=1..}] countOfTargets 1 
scoreboard players set @a new 0
scoreboard objectives add groundX dummy 
scoreboard objectives add groundZ dummy 
scoreboard objectives add groundY dummy 
scoreboard players add @a groundX 0
scoreboard players add @a groundY 0
scoreboard players add @a groundZ 0
scoreboard objectives add flyTimer dummy 
scoreboard players add @a flyTimer 0
scoreboard players remove @a[scores={flyTimer=1..}] flyTimer 1
scoreboard players remove @a[scores={hurtCooldown=1..}] hurtCooldown 1
tag @a[scores={hurtCooldown=1..}] add cooldown
tag @a[scores={hurtCooldown=!1..}] remove cooldown
scoreboard  objectives add bantimerOffline dummy 
scoreboard players add @a bantimerOffline 0
scoreboard objectives add phaseX dummy phaseX
scoreboard objectives add phaseY dummy phaseY
scoreboard objectives add phaseZ dummy phaseZ
scoreboard players add @a phaseX 0
scoreboard players add @a phaseY 0
scoreboard players add @a phaseZ 0
scoreboard players add @a toggle:lockdown 0
tag @a[scores={nearOfTnt=1..}] add canPlaceTnt
scoreboard objectives add nearOfTnt dummy nearOfTnt
execute as @e[type=tnt_minecart] at @a run scoreboard players set @a[r=6,hasitem={item=tnt_minecart,location=slot.weapon.mainhand}] nearOfTnt 2
scoreboard players remove @a[scores={nearOfTnt=1..}] nearOfTnt 1
tag @a[scores={nearOfTnt=..0}] remove canPlaceTnt
scoreboard objectives add worldEditX2 dummy 
scoreboard objectives add worldEditZ2 dummy 
scoreboard objectives add worldEditY2 dummy 
scoreboard players add @a worldEditY2 0
scoreboard players add @a worldEditX2 0
scoreboard players add @a worldEditZ2 0
scoreboard objectives add worldEditX dummy 
scoreboard objectives add worldEditZ dummy 
scoreboard objectives add worldEditY dummy 
scoreboard players add @a worldEditY 0
scoreboard players add @a worldEditX 0
scoreboard players add @a worldEditZ 0
effect @a[scores={new=1..}] resistance 1 255 true
effect @a[scores={new=1..}] instant_health 1 255 true
effect @a[scores={new=1..}] weakness 1 255 true
scoreboard objectives add new dummy new
scoreboard players add @a[tag=!new] new 54000
scoreboard players remove @a[scores={new=1..}] new 1
tag @a add new
event entity @a add_knockback_resistance 
scoreboard objectives add overworld dummy 
scoreboard objectives add nether dummy 
scoreboard objectives add the_end dummy 
scoreboard players add @a the_end 0
scoreboard players add @a nether 0
scoreboard players add @a overworld 0
scoreboard players set @a[tag=riding] skip_check 20
scoreboard players set @a[tag=sleeping] skip_check 20
scoreboard objectives add tryScaffold dummy 
scoreboard players add @a tryScaffold 0
scoreboard  objectives add trySpeed dummy trySpeeding
scoreboard players add @a trySpeed 0
scoreboard objectives add restrySpeed dummy 
scoreboard players add @a[scores={trySpeed=1..}] restrySpeed 1
scoreboard players set @a[scores={restrySpeed=!0..100}] trySpeed 0
scoreboard players set @a[scores={restrySpeed=!0..100}] restrySpeed 0
scoreboard  objectives add tryFly dummy tryFlying
scoreboard players add @a tryFly 0
scoreboard objectives add resTryFly dummy 
scoreboard players add @a[scores={tryFly=1..}] resTryFly 1
scoreboard players set @a[scores={resTryFly=!0..100}] tryFly 0
scoreboard players set @a[scores={resTryFly=!0..100}] resTryFly 0
scoreboard objectives add antiKbTimer dummy 
scoreboard players add @a antiKbTimer 0
scoreboard players remove @a[scores={antiKbTimer=!..0}] antiKbTimer 1
scoreboard players set @a[scores={antiKbTimer=..0}] antiKb 0
scoreboard objectives add antiKb dummy antiKnockback 
scoreboard players add @a antiKb 0
scoreboard objectives add kitClaim dummy 
scoreboard players add @a kitClaim 0
scoreboard players remove @a[scores={kitClaim=1..}] kitClaim 1
tag @a[scores={kitClaim=1..}] add claimedKit
tag @a[scores={kitClaim=..0}] remove claimedKit
scoreboard objectives add noReach dummy 
scoreboard players add @a noReach 0
tag @a[scores={combatTimer=1..}] add in_fight
tag @a[scores={combatTimer=..0}]  remove in_fight
scoreboard objectives add combatTimer dummy  combatTimer
scoreboard players add @a combatTimer 0
scoreboard players remove @a[scores={combatTimer=1..}] combatTimer 1
scoreboard objectives add lobby dummy lobby 
scoreboard players remove @a[scores={lobby=1..}] lobby 1
tag @a[scores={lobby=1..}] add lobby:overa 
tag @a[scores={lobby=..0}] remove lobby:overa 
scoreboard objectives add flyFlags dummy flyFlags
scoreboard players add @a flyFlags 0
scoreboard objectives add normalF dummy 
scoreboard players add @a normalF 0
scoreboard objectives add flyTp dummy 
scoreboard players add @a flyTp 0
scoreboard players remove @a[scores={flyTp=1..}] flyTp 1
scoreboard objectives add skip_check dummy skip_check 
scoreboard players remove @a[scores={skip_check=!..0}] skip_check 1
tag @a[scores={skip_check=2..}] add skip_check 
tag @a[scores={skip_check=1}] remove skip_check 
scoreboard objectives add flytimer dummy flytimer
scoreboard players add @a flytimer 1
scoreboard objectives add flyX dummy 
scoreboard objectives add flyY dummy 
scoreboard objectives add flyZ dummy 
scoreboard players add @a flyX 0
scoreboard players add @a flyZ 0
scoreboard players add @a flyY 0
scoreboard players remove @a[scores={block=1..}] block 1
scoreboard objectives add normalS dummy normalSpeed
scoreboard players add @a normalS 0
scoreboard objectives add speedFlags dummy speedFlags
scoreboard players add @a speedFlags 0
execute as @a at @s if block ~~-1~ ice run tag @s add skip_checkS
execute as @a at @s if block ~~-1~ blue_ice run tag @s add skip_checkS
execute as @a at @s if block ~~-1~ frosted_ice run tag @s add skip_checkS
execute as @a at @s if block ~~-1~ packed_ice run tag @s add skip_checkS
execute as @a at @s if block ~~-1~ end_portal run tag @s add skip_checkS
execute as @a at @s if block ~~-1~ portal run tag @s add skip_checkS
execute as @a at @s if block ~~1~ end_portal run tag @s add skip_checkS
execute as @a at @s if block ~~1~ portal run tag @s add skip_checkS
execute as @a at @s if block ~~~ end_portal run tag @s add skip_checkS
execute as @a at @s if block ~~~ portal run tag @s add skip_checkS
scoreboard objectives add speedtimer dummy speedtimer
scoreboard players add @a speedtimer 1
gamemode s @a[m=c,tag=!gmc,tag=!MatrixOP]
scoreboard objectives add speedX dummy speedX 
scoreboard players add @a speedX 0
scoreboard objectives add speedZ dummy speedX 
scoreboard players add @a speedZ 0
scoreboard objectives add speedX2 dummy speedX 
scoreboard players add @a speedX2 0
scoreboard objectives add speedZ2 dummy speedX 
scoreboard players add @a speedZ2 0
scoreboard objectives add Seccps2 dummy Seccps2
scoreboard players add @a Seccps2 0
scoreboard objectives add cps3 dummy cps3
scoreboard players add @a cps3 0
scoreboard objectives add rescps3 dummy rescps3
scoreboard players add @a rescps3 0
scoreboard objectives add rescps4 dummy rescps4
scoreboard players add @a rescps4 0
scoreboard players add @a[scores={Seccps2=1..}]  rescps3 1
scoreboard players set @a[scores={rescps=10..}]  Seccps2 0
scoreboard players set @a[scores={rescps3=10..}]  rescps3 0
scoreboard players add @a[scores={cps3=1..}]  rescps4 1
scoreboard players set @a[scores={rescps4=10..}]  cps3 0
scoreboard players set @a[scores={rescps4=10..}]  rescps4 0
scoreboard objectives add rescpsP2 dummy rescpsP2
scoreboard players add @a rescpsP 0
scoreboard players add @a[scores={placeCps=1..}]  rescpsP 1
scoreboard players set @a[scores={rescpsP=20..}]  placeCps 0
scoreboard players set @a[scores={rescpsP=20..}]  rescpsP 0

scoreboard players add @a[scores={placeCps=1..}]  rescpsP 1
scoreboard players set @a[scores={rescpsP=20..}]  placeCps 0
scoreboard players set @a[scores={rescpsP=20..}]  rescpsP 0
scoreboard objectives add freezeX dummy freezeX
scoreboard objectives add freezeZ dummy freezeZ
scoreboard objectives add freezeY dummy freezeY
effect @a[tag=freeze] mining_fatigue 1 255 true
effect @a[tag=freeze] weakness 1 255 true 
title @a[tag=freeze] title §afrozen
title @a[tag=freeze] subtitle §cyou are currently frozen
scoreboard objectives add spam dummy spam
scoreboard players add @a spam 0
scoreboard players remove @a[scores={spam=!0}] spam 1
scoreboard players set @a[scores={spam=!0..}] spam 0
scoreboard objectives add placeCps dummy placeCps
scoreboard players add @a placeCps 0
scoreboard objectives add rescps2 dummy rescps2
scoreboard players add @a rescps2 0
scoreboard players add @a[scores={Seccps=1..}]  rescps2 1
scoreboard players set @a[scores={rescps2=20..}]  Seccps 0
scoreboard players set @a[scores={rescps2=20..}]  rescps2 0
scoreboard objectives add rescpsP dummy rescpsP
scoreboard players add @a rescpsP 0
scoreboard players add @a[scores={placeCps=1..}]  rescpsP 1
scoreboard players set @a[scores={rescpsP=20..}]  placeCps 0
scoreboard players set @a[scores={rescpsP=20..}]  rescpsP 0
scoreboard objectives add xray dummy xray 
scoreboard players add @a xray 0
scoreboard  objectives add mineTimer dummy mineTimer
scoreboard players add @a mineTimer 0
scoreboard objectives add mineFlags dummy mineFlags
scoreboard players add @a mineFlags 0
scoreboard players remove @a[scores={mineTimer=!0}] mineTimer 1
scoreboard players set @a[scores={mineTimer=!0..}] mineTimer 0
scoreboard objectives add nukerTimer dummy nukerTimer
scoreboard players add @a nukerTimer 0
scoreboard players remove @a[scores={nukerTimer=!0}] nukerTimer 1
scoreboard players set @a[scores={nukerTimer=!0..}] nukerTimer 0
scoreboard objectives add nukeLength dummy nukeLength
scoreboard players add @a nukeLength 0
scoreboard objectives add sendMsgT dummy sendMsg
scoreboard players add @a sendMsgT 0
scoreboard players remove @a[scores={sendMsgT=!0}] sendMsgT 1
scoreboard players set @a[scores={sendMsgT=!0..}] sendMsgT 0
scoreboard objectives add cps2 dummy cps2
scoreboard players add @a cps2 0
scoreboard objectives add reachDis dummy reachDis
scoreboard players add @a reachDis 0
scoreboard objectives add online dummy online 
scoreboard objectives add trueCps dummy trueCps
scoreboard objectives add tryAutoClicker dummy tryAutoClicker 
scoreboard players add @a tryAutoClicker 0
scoreboard objectives add block dummy block 
scoreboard players add @a block 0
tag @a[scores={block=1..}] add is_using_block 
tag @a remove is_using_block
tag @a[scores={block=1..}] add is_using_block 
tag @a[rx=40,rxm=-90] add looking_up
tag @a remove looking_up
tag @a[rx=40,rxm=-90] add looking_up
scoreboard objectives add tryReachA dummy tryReachA
scoreboard players add @a tryReachA 0
tag @a[hasitem={item=elytra,location=slot.armor.chest}] add elytra 
tag @a remove elytra 
tag @a[hasitem={item=elytra,location=slot.armor.chest}] add elytra 
scoreboard objectives add knockbackSlow dummy knockbackSlow
scoreboard players add @e knockbackSlow 0
scoreboard players add @e knockback 0
scoreboard objectives add knockback dummy knockback 
scoreboard players add knockback knockback 0
scoreboard players add @a TryReachA 0
scoreboard objectives add TryReachA dummy Reach 
tag @a add Member
tag @a[hasitem={item=wooden_axe,location=slot.weapon.mainhand}] add Wood
tag @a remove Axe
tag @a[hasitem={item=wooden_axe,location=slot.weapon.mainhand}] add Wood
scoreboard objectives add ban dummy ban
scoreboard players remove @a[tag=ban] bantimer 1
scoreboard players set @a[scores={bantimer=!0..40}] bantimer 0
scoreboard objectives add bantimer dummy bantimer
scoreboard objectives add lockdown dummy lockdown 
scoreboard objectives add in_fight dummy shh
scoreboard players add @a combat_time 0
scoreboard objectives add kills dummy kills 
scoreboard players add @a kills 0
scoreboard objectives add deaths dummy deaths
scoreboard players add @a deaths 0
scoreboard players remove @a[scores={in_fight=!0}] in_fight 1
scoreboard players set @a[scores={in_fight=0}] combat_time 0
scoreboard players set @a[scores={in_fight=1..20}] combat_time 1
scoreboard players set @a[scores={in_fight=21..40}] combat_time 2
scoreboard players set @a[scores={in_fight=41..60}] combat_time 3
scoreboard players set @a[scores={in_fight=61..80}] combat_time 4
scoreboard players set @a[scores={in_fight=81..100}] combat_time 5 
scoreboard players set @a[scores={in_fight=101..120}] combat_time 6 
scoreboard players set @a[scores={in_fight=121..140}] combat_time 7 
scoreboard players set @a[scores={in_fight=141..160}] combat_time 8 
scoreboard players set @a[scores={in_fight=161..180}] combat_time 9
scoreboard players set @a[scores={in_fight=181..200}] combat_time 10
scoreboard objectives add cps dummy cps
scoreboard objectives add rescps dummy Reset
scoreboard players set @a[scores={rescps=20..}] cps 0
scoreboard players add @a rescps 1
scoreboard players set @a[scores={rescps=!0..20}] rescps 0
scoreboard players add @a cps 0
scoreboard objectives add Seccps dummy cps
scoreboard players add @a Seccps 0
scoreboard players set @a unban 0
scoreboard objectives add tryAuto dummy auto
scoreboard objectives add combat_time dummy combat_timer 
scoreboard players add @a lockdown 0 
scoreboard players remove @a[scores={lockdown=!..0}] lockdown 1
scoreboard players add @a bantimer 0
