##script by Matrix Team
scoreboard  objectives add block dummy block
scoreboard players add @s block 0
scoreboard  players remove @s[scores={block=1..}] block 1
scoreboard objectives add cooldownTpS dummy 
scoreboard objectives add cooldownTpFA dummy 
scoreboard objectives add cooldownTpFB dummy
scoreboard players add @a cooldownTpS 0
scoreboard players add @a cooldownTpFA 0
scoreboard players add @a cooldownTpFB 0
scoreboard players remove @a[scores={cooldownTpS=1..}] cooldownTpS 1
scoreboard players remove @a[scores={cooldownTpFA=1..}] cooldownTpFA 1
scoreboard players remove @a[scores={cooldownTpFB=1..}] cooldownTpFB 1
execute as @a at @s if block ~~2~ water run tag @s add inWater
execute as @a at @s if block ~~~ water run tag @s add inWater
tag @a remove inWater
execute as @a at @s if block ~~1~ water run tag @s add inWater
execute as @a at @s if block ~~~ water run tag @s add inWater
scoreboard objectives add speedY dummy speedY
scoreboard players add @s speedY 0
scoreboard objectives add speedX dummy speedX
scoreboard players add @s speedX 0
scoreboard objectives add speedZ dummy speedZ
scoreboard players add @s speedZ 0
scoreboard objectives add PosYS dummy y
scoreboard objectives add PosXS dummy X
scoreboard objectives add PosZS dummy z
scoreboard players add @a PosYS 0
scoreboard players add @a PosXS 0
scoreboard players add @a PosZS 0
scoreboard objectives add countOfTargets dummy
scoreboard players add @a countOfTargets 0 
scoreboard players remove @a[scores={countOfTargets=1..}] countOfTargets 1
scoreboard objectives add groundX dummy 
scoreboard objectives add groundZ dummy 
scoreboard objectives add groundY dummy 
scoreboard players add @a groundX 0
scoreboard players add @a groundY 0
scoreboard players add @a groundZ 0
scoreboard objectives add flyTimer dummy 
scoreboard players add @a flyTimer 0
scoreboard players remove @a[scores={flyTimer=1..}] flyTimer 1
scoreboard  objectives add bantimerOffline dummy 
scoreboard players add @a bantimerOffline 0
scoreboard objectives add phaseX dummy phaseX
scoreboard objectives add phaseY dummy phaseY
scoreboard objectives add phaseZ dummy phaseZ
scoreboard players add @a phaseX 0
scoreboard players add @a phaseY 0
scoreboard players add @a phaseZ 0
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
execute as @a at @s if block ~~-1~ ice run scoreboard players set @s skip_check 20
execute as @a at @s if block ~~-1~ blue_ice run scoreboard players set @s skip_check 20
execute as @a at @s if block ~~-1~ frosted_ice run scoreboard players set @s skip_check 20
execute as @a at @s if block ~~-1~ packed_ice run scoreboard players set @s skip_check 20
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
scoreboard players add @a TryReachA 0
scoreboard objectives add TryReachA dummy Reach 
scoreboard players remove @a[tag=ban] bantimer 1
scoreboard players set @a[scores={bantimer=!0..40}] bantimer 0
scoreboard objectives add bantimer dummy bantimer
scoreboard objectives add cps dummy cps
scoreboard objectives add rescps dummy Reset
scoreboard players set @a[scores={rescps=20..}] cps 0
scoreboard players add @a rescps 1
scoreboard players set @a[scores={rescps=!0..20}] rescps 0
scoreboard players add @a cps 0
scoreboard objectives add Seccps dummy cps
scoreboard players add @a Seccps 0
scoreboard players add @a bantimer 0
scoreboard objectives add fly_coldown_timer dummy fly_coldown_timer
scoreboard players add @a fly_coldown_timer 0
scoreboard players remove @a[scores={fly_coldown_timer=!..0}] fly_coldown_timer 1
scoreboard objectives add combatingTime dummy combatingTime
scoreboard players add @a combatingTime 0
scoreboard players remove @a[scores={combatingTime=!..0}] combatingTime 1
scoreboard objectives add inCombat dummy inCombat
tag @a[scores={combatingTime=!..0}] add combating
tag @a[scores={combatingTime=0}] remove combating
scoreboard objectives add protectionTime dummy combatingTime
scoreboard players add @a protectionTime 0
tellraw @a[tag=protecting,scores={protectionTime=1}] {"rawtext":[{"text":"§r§eYour are §ano longer §espawn-protected§r"}]}
scoreboard players remove @a[scores={combatingTime=!..0}] protectionTime 1
tag @a[scores={protectionTime=!..0}] add protecting
tag @a[scores={protectionTime=0}] remove protecting
scoreboard objectives add scaffold_buff dummy scaffold_buff
scoreboard players add @a scaffold_buff 0
scoreboard objectives add attacked_timer dummy attacked_timer
scoreboard players add @a attacked_timer 0
scoreboard players remove @a[scores={attacked_timer=!..0}] attacker_timer 1
tag @a[scores={attacked_timer=..0}] remove getAttacked
