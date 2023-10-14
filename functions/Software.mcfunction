##script by Matrix Team
scoreboard objectives add PosYS dummy y
scoreboard objectives add PosXS dummy X
scoreboard objectives add PosZS dummy z
scoreboard players add @s PosYS 0
scoreboard players add @s PosXS 0
scoreboard players add @s PosZS 0
scoreboard objectives add PosYC dummy y
scoreboard objectives add PosXC dummy X
scoreboard objectives add PosZC dummy z
scoreboard objectives add startMovingUp dummy y
scoreboard players add @s PosYC 0
scoreboard players add @s PosXC 0
scoreboard players add @s PosZC 0
scoreboard players add @s startMovingUp 0
scoreboard players remove @s[scores={startMovingUp=1..}] startMovingUp 1
scoreboard objectives add countOfTargets dummy
scoreboard players add @s countOfTargets 0 
scoreboard players remove @s[scores={countOfTargets=1..}] countOfTargets 1 
scoreboard  players set @s new 0
scoreboard objectives add groundX dummy 
scoreboard objectives add groundZ dummy 
scoreboard objectives add groundY dummy 
scoreboard players add @s groundX 0
scoreboard players add @s groundY 0
scoreboard players add @s groundZ 0
scoreboard objectives add flyTimer dummy 
scoreboard players add @s flyTimer 0
scoreboard players remove @s[scores={flyTimer=1..}] flyTimer 1
scoreboard players remove @s[scores={hurtCooldown=1..}] hurtCooldown 1
tag @s[scores={hurtCooldown=1..}] add cooldown
tag @s[scores={hurtCooldown=!1..}] remove cooldown
scoreboard  objectives add bantimerOffline dummy 
scoreboard players add @s bantimerOffline 0
scoreboard objectives add phaseX dummy phaseX
scoreboard objectives add phaseY dummy phaseY
scoreboard objectives add phaseZ dummy phaseZ
scoreboard players add @s phaseX 0
scoreboard players add @s phaseY 0
scoreboard players add @s phaseZ 0
scoreboard players add @s toggle:lockdown 0
tag @s[scores={nearOfTnt=1..}] add canPlaceTnt
scoreboard objectives add nearOfTnt dummy nearOfTnt
execute as @e[type=tnt_minecart] at @s run scoreboard players set @a[r=6,hasitem={item=tnt_minecart,location=slot.weapon.mainhand}] nearOfTnt 2
scoreboard players remove @s[scores={nearOfTnt=1..}] nearOfTnt 1
tag @s[scores={nearOfTnt=..0}] remove canPlaceTnt
scoreboard objectives add worldEditX2 dummy 
scoreboard objectives add worldEditZ2 dummy 
scoreboard objectives add worldEditY2 dummy 
scoreboard players add @s worldEditY2 0
scoreboard players add @s worldEditX2 0
scoreboard players add @s worldEditZ2 0
scoreboard objectives add worldEditX dummy 
scoreboard objectives add worldEditZ dummy 
scoreboard objectives add worldEditY dummy 
scoreboard players add @s worldEditY 0
scoreboard players add @s worldEditX 0
scoreboard players add @s worldEditZ 0
effect @s[scores={new=1..}] resistance 1 255 true
effect @s[scores={new=1..}] instant_health 1 255 true
effect @s[scores={new=1..}] weakness 1 255 true
scoreboard objectives add new dummy new
scoreboard players add @s[tag=!new] new 54000
scoreboard players remove @s[scores={new=1..}] new 1
tag @s add new
event entity @s add_knockback_resistance 
scoreboard objectives add overworld dummy 
scoreboard objectives add nether dummy 
scoreboard objectives add the_end dummy 
scoreboard players add @s the_end 0
scoreboard players add @s nether 0
scoreboard players add @s overworld 0
scoreboard players set @s[tag=riding] skip_check 20
scoreboard players set @s[tag=sleeping] skip_check 20
scoreboard objectives add tryScaffold dummy 
scoreboard players add @s tryScaffold 0
scoreboard  objectives add trySpeed dummy trySpeeding
scoreboard players add @s trySpeed 0
scoreboard objectives add restrySpeed dummy 
scoreboard players add @s[scores={trySpeed=1..}] restrySpeed 1
scoreboard players set @s[scores={restrySpeed=!0..100}] trySpeed 0
scoreboard players set @s[scores={restrySpeed=!0..100}] restrySpeed 0
scoreboard  objectives add tryFly dummy tryFlying
scoreboard players add @s tryFly 0
scoreboard objectives add resTryFly dummy 
scoreboard players add @s[scores={tryFly=1..}] resTryFly 1
scoreboard players set @s[scores={resTryFly=!0..100}] tryFly 0
scoreboard players set @s[scores={resTryFly=!0..100}] resTryFly 0
scoreboard objectives add antiKbTimer dummy 
scoreboard players add @s antiKbTimer 0
scoreboard players remove @s[scores={antiKbTimer=!..0}] antiKbTimer 1
scoreboard players set @s[scores={antiKbTimer=..0}] antiKb 0
scoreboard objectives add antiKb dummy antiKnockback 
scoreboard players add @s antiKb 0
scoreboard objectives add kitClaim dummy 
scoreboard players add @s kitClaim 0
scoreboard players remove @s[scores={kitClaim=1..}] kitClaim 1
tag @s[scores={kitClaim=1..}] add claimedKit
tag @s[scores={kitClaim=..0}] remove claimedKit
scoreboard objectives add noReach dummy 
scoreboard players add @s noReach 0
tag @s[scores={combatTimer=1..}] add in_fight
tag @s[scores={combatTimer=..0}]  remove in_fight
scoreboard objectives add combatTimer dummy  combatTimer
scoreboard players add @s combatTimer 0
scoreboard players remove @s[scores={combatTimer=1..}] combatTimer 1
scoreboard objectives add lobby dummy lobby 
scoreboard players remove @s[scores={lobby=1..}] lobby 1
tag @s[scores={lobby=1..}] add lobby:overa 
tag @s[scores={lobby=..0}] remove lobby:overa 
scoreboard objectives add flyFlags dummy flyFlags
scoreboard players add @s flyFlags 0
scoreboard objectives add normalF dummy 
scoreboard players add @s normalF 0
scoreboard objectives add flyTp dummy 
scoreboard players add @s flyTp 0
scoreboard players remove @s[scores={flyTp=1..}] flyTp 1
scoreboard objectives add skip_check dummy skip_check 
scoreboard players remove @s[scores={skip_check=!..0}] skip_check 1
tag @s[scores={skip_check=2..}] add skip_check 
tag @s[scores={skip_check=1}] remove skip_check 
scoreboard objectives add flytimer dummy flytimer
scoreboard players add @s flytimer 1
scoreboard objectives add flyX dummy 
scoreboard objectives add flyY dummy 
scoreboard objectives add flyZ dummy 
scoreboard players add @s flyX 0
scoreboard players add @s flyZ 0
scoreboard players add @s flyY 0
scoreboard players remove @s[scores={block=1..}] block 1
scoreboard objectives add normalS dummy normalSpeed
scoreboard players add @s normalS 0
scoreboard objectives add speedFlags dummy speedFlags
scoreboard players add @s speedFlags 0
execute at @s if block ~~-1~ ice run tag @s add skip_checkS
execute at @s if block ~~-1~ blue_ice run tag @s add skip_checkS
execute at @s if block ~~-1~ frosted_ice run tag @s add skip_checkS
execute at @s if block ~~-1~ packed_ice run tag @s add skip_checkS
execute at @s if block ~~-1~ end_portal run tag @s add skip_checkS
execute at @s if block ~~-1~ portal run tag @s add skip_checkS
execute at @s if block ~~1~ end_portal run tag @s add skip_checkS
execute at @s if block ~~1~ portal run tag @s add skip_checkS
execute at @s if block ~~~ end_portal run tag @s add skip_checkS
execute at @s if block ~~~ portal run tag @s add skip_checkS
scoreboard objectives add speedtimer dummy speedtimer
scoreboard players add @s speedtimer 1
gamemode s @s[m=c,tag=!gmc,tag=!OveraOP]
scoreboard objectives add speedX dummy speedX 
scoreboard players add @s speedX 0
scoreboard objectives add speedZ dummy speedX 
scoreboard players add @s speedZ 0
scoreboard objectives add speedX2 dummy speedX 
scoreboard players add @s speedX2 0
scoreboard objectives add speedZ2 dummy speedX 
scoreboard players add @s speedZ2 0
scoreboard objectives add Seccps2 dummy Seccps2
scoreboard players add @s Seccps2 0
scoreboard objectives add cps3 dummy cps3
scoreboard players add @s cps3 0
scoreboard objectives add rescps3 dummy rescps3
scoreboard players add @s rescps3 0
scoreboard objectives add rescps4 dummy rescps4
scoreboard players add @s rescps4 0
scoreboard players add @s[scores={Seccps2=1..}]  rescps3 1
scoreboard players set @s[scores={rescps=10..}]  Seccps2 0
scoreboard players set @s[scores={rescps3=10..}]  rescps3 0
scoreboard players add @s[scores={cps3=1..}]  rescps4 1
scoreboard players set @s[scores={rescps4=10..}]  cps3 0
scoreboard players set @s[scores={rescps4=10..}]  rescps4 0
scoreboard objectives add rescpsP2 dummy rescpsP2
scoreboard players add @s rescpsP 0
scoreboard players add @s[scores={placeCps=1..}]  rescpsP 1
scoreboard players set @s[scores={rescpsP=20..}]  placeCps 0
scoreboard players set @s[scores={rescpsP=20..}]  rescpsP 0

scoreboard players add @s[scores={placeCps=1..}]  rescpsP 1
scoreboard players set @s[scores={rescpsP=20..}]  placeCps 0
scoreboard players set @s[scores={rescpsP=20..}]  rescpsP 0
scoreboard objectives add freezeX dummy freezeX
scoreboard objectives add freezeZ dummy freezeZ
scoreboard objectives add freezeY dummy freezeY
effect @s[tag=freeze] mining_fatigue 1 255 true
effect @s[tag=freeze] weakness 1 255 true 
title @s[tag=freeze] title §afrozen
title @s[tag=freeze] subtitle §cyou are currently frozen
scoreboard objectives add spam dummy spam
scoreboard players add @s spam 0
scoreboard players remove @s[scores={spam=!0}] spam 1
scoreboard players set @s[scores={spam=!0..}] spam 0
scoreboard objectives add placeCps dummy placeCps
scoreboard players add @s placeCps 0
scoreboard objectives add rescps2 dummy rescps2
scoreboard players add @s rescps2 0
scoreboard players add @s[scores={Seccps=1..}]  rescps2 1
scoreboard players set @s[scores={rescps2=20..}]  Seccps 0
scoreboard players set @s[scores={rescps2=20..}]  rescps2 0
scoreboard objectives add rescpsP dummy rescpsP
scoreboard players add @s rescpsP 0
scoreboard players add @s[scores={placeCps=1..}]  rescpsP 1
scoreboard players set @s[scores={rescpsP=20..}]  placeCps 0
scoreboard players set @s[scores={rescpsP=20..}]  rescpsP 0
scoreboard objectives add xray dummy xray 
scoreboard players add @s xray 0
scoreboard  objectives add mineTimer dummy mineTimer
scoreboard players add @s mineTimer 0
scoreboard objectives add mineFlags dummy mineFlags
scoreboard players add @s mineFlags 0
scoreboard players remove @s[scores={mineTimer=!0}] mineTimer 1
scoreboard players set @s[scores={mineTimer=!0..}] mineTimer 0
scoreboard objectives add nukerTimer dummy nukerTimer
scoreboard players add @s nukerTimer 0
scoreboard players remove @s[scores={nukerTimer=!0}] nukerTimer 1
scoreboard players set @s[scores={nukerTimer=!0..}] nukerTimer 0
scoreboard objectives add nukeLength dummy nukeLength
scoreboard players add @s nukeLength 0
scoreboard objectives add sendMsgT dummy sendMsg
scoreboard players add @s sendMsgT 0
scoreboard players remove @s[scores={sendMsgT=!0}] sendMsgT 1
scoreboard players set @s[scores={sendMsgT=!0..}] sendMsgT 0
scoreboard objectives add cps2 dummy cps2
scoreboard players add @s cps2 0
scoreboard objectives add reachDis dummy reachDis
scoreboard players add @s reachDis 0
scoreboard objectives add online dummy online 
scoreboard objectives add trueCps dummy trueCps
scoreboard objectives add tryAutoClicker dummy tryAutoClicker 
scoreboard players add @s tryAutoClicker 0
scoreboard objectives add block dummy block 
scoreboard players add @s block 0
tag @s[scores={block=1..}] add is_using_block 
tag @s remove is_using_block
tag @s[scores={block=1..}] add is_using_block 
tag @s[rx=40,rxm=-90] add looking_up
tag @s remove looking_up
tag @s[rx=40,rxm=-90] add looking_up
scoreboard objectives add tryReachA dummy tryReachA
scoreboard players add @s tryReachA 0
tag @s[hasitem={item=elytra,location=slot.armor.chest}] add elytra 
tag @s remove elytra 
tag @s[hasitem={item=elytra,location=slot.armor.chest}] add elytra 
scoreboard objectives add knockbackSlow dummy knockbackSlow
scoreboard players add @e knockbackSlow 0
scoreboard players add @e knockback 0
scoreboard objectives add knockback dummy knockback 
scoreboard players add knockback knockback 0
scoreboard players add @s TryReachA 0
scoreboard objectives add TryReachA dummy Reach 
tag @s add Member
tag @s[hasitem={item=wooden_axe,location=slot.weapon.mainhand}] add Wood
tag @s remove Axe
tag @s[hasitem={item=wooden_axe,location=slot.weapon.mainhand}] add Wood
scoreboard objectives add ban dummy ban
scoreboard players remove @s[tag=ban] bantimer 1
scoreboard players set @s[scores={bantimer=!0..40}] bantimer 0
scoreboard objectives add bantimer dummy bantimer
scoreboard objectives add lockdown dummy lockdown 
scoreboard objectives add in_fight dummy shh
scoreboard players add @s combat_time 0
scoreboard objectives add kills dummy kills 
scoreboard players add @s kills 0
scoreboard objectives add deaths dummy deaths
scoreboard players add @s deaths 0
scoreboard players remove @s[scores={in_fight=!0}] in_fight 1
scoreboard players set @s[scores={in_fight=0}] combat_time 0
scoreboard players set @s[scores={in_fight=1..20}] combat_time 1
scoreboard players set @s[scores={in_fight=21..40}] combat_time 2
scoreboard players set @s[scores={in_fight=41..60}] combat_time 3
scoreboard players set @s[scores={in_fight=61..80}] combat_time 4
scoreboard players set @s[scores={in_fight=81..100}] combat_time 5 
scoreboard players set @s[scores={in_fight=101..120}] combat_time 6 
scoreboard players set @s[scores={in_fight=121..140}] combat_time 7 
scoreboard players set @s[scores={in_fight=141..160}] combat_time 8 
scoreboard players set @s[scores={in_fight=161..180}] combat_time 9
scoreboard players set @s[scores={in_fight=181..200}] combat_time 10
scoreboard objectives add cps dummy cps
scoreboard objectives add rescps dummy Reset
scoreboard players set @s[scores={rescps=20..}] cps 0
scoreboard players add @s rescps 1
scoreboard players set @s[scores={rescps=!0..20}] rescps 0
scoreboard players add @s cps 0
scoreboard objectives add Seccps dummy cps
scoreboard players add @s Seccps 0
scoreboard players set @s unban 0
scoreboard objectives add tryAuto dummy auto
scoreboard objectives add combat_time dummy combat_timer 
scoreboard players add @s lockdown 0 
scoreboard players remove @s[scores={lockdown=!..0}] lockdown 1
scoreboard players add @s bantimer 0
