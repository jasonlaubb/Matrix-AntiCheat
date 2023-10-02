const START_LOADING_MS: number = Date.now();

/*           _                                 
 _ __   ___ | | ____ _ _ __ __ _ _ __ ___  ___ 
| '_ \ / _ \| |/ / _` | '__/ _` | '__/ _ \/ __|
| | | | (_) |   < (_| | | | (_| | | | (_) \__ \
|_| |_|\___/|_|\_\__,_|_|  \__,_|_|  \___/|___/

Author: Jasonlaubb
Contributors: ravriv, hutaotangzhu
version: 1.0.0-alpha
license: GPL-v3.0
*/

//import all used file
import { registData } from './events/worldInitialize/register.js';
import { watchDog } from './events/systemEvents/Doge/watchDog.js';
import { join_event } from './events/playerSpawn/join_events.js';
import { ac_a } from './events/entityHitEntity/AutoClicker/ac_a.js';
import { ac_b } from './events/entityHitBlock/AutoClicker/ac_b.js';
import { nuker_a } from './events/playerBreakBlock/Nuker/nuker_a.js';
import { speed_a } from './events/tickEvents/Speed/speed_a.js';
import { nofall_a } from './events/tickEvents/NoFall/nofall_a.js';
import { killaura_a } from './events/entityHitEntity/Killaura/killaura_a.js';
import { killaura_b } from './events/entityHitEntity/Killaura/killaura_b.js';
import { killaura_c } from './events/entityHitEntity/Killaura/killaura_c.js';
import { killaura_d } from './events/entityHitEntity/Killaura/killaura_d.js';
import { killaura_e } from './events/entityHitEntity/Killaura/killaura_e.js';
import { killaura_f } from './events/entityHitEntity/Killaura/killaura_f.js';
import { surround_a } from './events/playerBreakBlock/Surround/surround_a.js';
import { surround_b } from './events/playerPlaceBlock/Surround/surround_b.js';
import { scaffold_a } from './events/playerPlaceBlock/Scaffold/scaffold_a.js';
import { scaffold_b } from './events/playerPlaceBlock/Scaffold/scaffold_b.js';
import { scaffold_c } from './events/playerPlaceBlock/Scaffold/scaffold_c.js';
import { scaffold_d } from './events/playerPlaceBlock/Scaffold/scaffold_d.js';
import { movement_a } from './events/entityHurt/movement/movement_a.js';
import { aura_a } from './events/playerPlaceBlock/Aura/aura_a.js';
import { reach_a } from './events/entityHitEntity/Reach/reach_a.js';
import { spam_a } from './events/chatSend/Spam/spam_a.js';
import { spam_b } from './events/chatSend/Spam/spam_b.js';
import { swinging_head } from './events/tickEvents/swinging_head.js';
import { spammer_a } from './events/chatSend/Spammer/spammer_a.js';
import { spammer_b } from './events/chatSend/Spammer/spammer_b.js';
import { spammer_c } from './events/chatSend/Spammer/spammer_c.js';
import { spammer_d } from './events/chatSend/Spammer/spammer_d.js';
import { invaildsprint_a } from './events/tickEvents/InvaildSprint/invaildsprint_a.js';
import { invaildSprint_b } from './events/tickEvents/InvaildSprint/invaildsprint_b.js';
import { invaildSprint_c } from './events/tickEvents/InvaildSprint/invaildsprint_c.js';
import { crasher_a } from './events/tickEvents/Crasher/crasher_a.js';
import { crasher_b } from './events/entityHitEntity/Crasher/crasher_b.js';
import { crasher_c } from './events/entitySpawn/Crasher/crasher_c.js';
import { items } from './events/tickEvents/Items/items.js';
import { aimbot_a } from './events/tickEvents/AimBot/aimbot_a.js';
import { aimbot_b } from './events/tickEvents/AimBot/aimbot_b.js';
import { fly_a } from './events/tickEvents/Fly/fly_a.js';
import { fly_b } from './events/tickEvents/Fly/fly_b.js';
import { fly_c } from './events/tickEvents/Fly/fly_c.js';
import { fly_d } from './events/tickEvents/Fly/fly_d.js';
import { autototem_a } from './events/EntityTriggerEvents/AutoTotem/autoTotem_a.js';
import { autototem_b } from './events/EntityTriggerEvents/AutoTotem/autoTotem_b.js';
import { autototem_c } from './events/EntityTriggerEvents/AutoTotem/autoTotem_c.js';
import { autoshield_a } from './events/EntityTriggerEvents/AutoShield/autoShield_a.js';
import { autoshield_b } from './events/EntityTriggerEvents/AutoShield/autoShield_b.js';
import { autoshield_c } from './events/EntityTriggerEvents/AutoShield/autoShield_c.js';
import { cbe_a } from './events/EntityTriggerEvents/CBE/cbe_a.js';
import { cbe_b } from './events/entitySpawn/CBE/cbe_b.js';
import { autotool_a } from './events/entityHitBlock/AutoTool/autotool_a.js';
import { autotool_b } from './events/entityHitBlock/AutoTool/autotool_b.js';
import { autotool_c } from './events/entityHitBlock/AutoTool/autotool_c.js';
import { insteabreak_a } from './events/playerBreakBlock/InsteaBreak/insteabreak_a.js';
import { hurt_event } from './events/entityHurt/hurt_event.js';
import { knockback_a } from './events/tickEvents/KnockBack/knockback_a.js';
import { phase_a } from './events/tickEvents/Phase/phase_a.js';
import { placement_a } from './events/playerPlaceBlock/Placement/placement_a.js';
import { placement_b } from './events/playerPlaceBlock/Placement/placement_b.js';
import { placement_c } from './events/playerPlaceBlock/Placement/placement_c.js';
import { placement_d } from './events/playerPlaceBlock/Placement/placement_d.js';
import { spider_a } from './events/tickEvents/Spider/spider_a.js';
import { jesus_a } from './events/tickEvents/Jeues/jesus.js';
import { fastThrow_a } from './events/itemUse/FastThrow/fastThrow_a.js';
import { namespoof_a } from './events/playerSpawn/Namespoof/namespoof_a.js';
import { namespoof_b } from './events/playerSpawn/Namespoof/namespoof_b.js';

//run the code of the files
watchDog();
registData();
join_event();
knockback_a();
insteabreak_a();
autotool_a();
autotool_b();
autotool_c();
autototem_a();
autototem_b();
autototem_c();
autoshield_a();
autoshield_b();
autoshield_c();
aimbot_a();
aimbot_b();
items();
crasher_a();
crasher_b();
crasher_c();
invaildsprint_a();
invaildSprint_b();
invaildSprint_c();
spammer_a();
spammer_b();
spammer_c();
spammer_d();
swinging_head();
spam_b();
spam_a();
reach_a();
aura_a();
ac_a();
ac_b();
nuker_a();
speed_a();
nofall_a();
killaura_a();
killaura_b();
killaura_c();
killaura_d();
killaura_e();
killaura_f();
surround_a();
surround_b();
scaffold_a();
scaffold_b();
scaffold_c();
scaffold_d();
fly_a();
fly_b();
fly_c();
fly_d();
hurt_event();
cbe_a();
cbe_b();
phase_a();
placement_a();
placement_b();
placement_c();
placement_d();
spider_a();
jesus_a();
fastThrow_a();
namespoof_a();
namespoof_b();
movement_a();

console.warn(`Nokararos Activated, used (${Date.now() - START_LOADING_MS} ms)`)
