import { Player } from '@minecraft/server'

import { GobalData, changeData as changeValue } from './DataBase.js';

//import all modules to restart them when need change
import { ac_a } from '../events/entityHitEntity/AutoClicker/ac_a.js';
import { ac_b } from '../events/entityHitBlock/AutoClicker/ac_b.js';
import { nuker_a } from '../events/playerBreakBlock/Nuker/nuker_a.js';
import { speed_a } from '../events/tickEvents/Speed/speed_a.js';
import { nofall_a } from '../events/tickEvents/NoFall/nofall_a.js';
import { killaura_a } from '../events/entityHitEntity/Killaura/killaura_a.js';
import { killaura_b } from '../events/entityHitEntity/Killaura/killaura_b.js';
import { killaura_c } from '../events/entityHitEntity/Killaura/killaura_c.js';
import { killaura_d } from '../events/entityHitEntity/Killaura/killaura_d.js';
import { killaura_e } from '../events/entityHitEntity/Killaura/killaura_e.js';
import { killaura_f } from '../events/entityHitEntity/Killaura/killaura_f.js';
import { surround_a } from '../events/playerBreakBlock/Surround/surround_a.js';
import { surround_b } from '../events/playerPlaceBlock/Surround/surround_b.js';
import { scaffold_a } from '../events/playerPlaceBlock/Scaffold/scaffold_a.js';
import { scaffold_b } from '../events/playerPlaceBlock/Scaffold/scaffold_b.js';
import { scaffold_c } from '../events/playerPlaceBlock/Scaffold/scaffold_c.js';
import { scaffold_d } from '../events/playerPlaceBlock/Scaffold/scaffold_d.js';
import { aura_a } from '../events/playerPlaceBlock/Aura/aura_a.js';
import { aura_b } from '../events/playerPlaceBlock/Aura/aura_b.js';
import { reach_a } from '../events/entityHitEntity/Reach/reach_a.js';
import { reach_b } from '../events/playerPlaceBlock/Reach/reach_b.js';
import { reach_c } from '../events/playerBreakBlock/Reach/reach_c.js';
import { spam_a } from '../events/chatSend/Spam/spam_a.js';
import { spam_b } from '../events/chatSend/Spam/spam_b.js';
import { spam_c } from '../events/chatSend/Spam/spam_c.js';
import { spammer_a } from '../events/chatSend/Spammer/spammer_a.js';
import { spammer_b } from '../events/chatSend/Spammer/spammer_b.js';
import { spammer_c } from '../events/chatSend/Spammer/spammer_c.js';
import { spammer_d } from '../events/chatSend/Spammer/spammer_d.js';
import { invaildSprint_b } from '../events/tickEvents/InvaildSprint/invaildsprint_b.js';
import { invaildsprint_a } from '../events/tickEvents/InvaildSprint/invaildsprint_a.js';
import { invaildSprint_c } from '../events/tickEvents/InvaildSprint/invaildsprint_c.js';
import { crasher_a } from '../events/tickEvents/Crasher/crasher_a.js';
import { crasher_b } from '../events/entityHitEntity/Crasher/crasher_b.js';
import { crasher_c } from '../events/entitySpawn/Crasher/crasher_c.js';
import { items } from '../events/tickEvents/Items/items.js';
import { aimbot_a } from '../events/tickEvents/AimBot/aimbot_a.js';
import { aimbot_b } from '../events/tickEvents/AimBot/aimbot_b.js';
import { fly_a } from '../events/tickEvents/Fly/fly_a.js';
import { fly_b } from '../events/tickEvents/Fly/fly_b.js';
import { fly_c } from '../events/tickEvents/Fly/fly_c.js';
import { fly_d } from '../events/tickEvents/Fly/fly_d.js';
import { autototem_a } from '../events/EntityTriggerEvents/AutoTotem/autoTotem_a.js';
import { autototem_b } from '../events/EntityTriggerEvents/AutoTotem/autoTotem_b.js';
import { autototem_c } from '../events/EntityTriggerEvents/AutoTotem/autoTotem_c.js';
import { autoshield_a } from '../events/EntityTriggerEvents/AutoShield/autoShield_a.js';
import { autoshield_b } from '../events/EntityTriggerEvents/AutoShield/autoShield_b.js';
import { autoshield_c } from '../events/EntityTriggerEvents/AutoShield/autoShield_c.js';
import { cbe_a } from '../events/EntityTriggerEvents/CBE/cbe_a.js';
import { cbe_b } from '../events/entitySpawn/CBE/cbe_b.js';
import { autotool_a } from '../events/entityHitBlock/AutoTool/autotool_a.js';
import { insteabreak_a } from '../events/playerBreakBlock/InsteaBreak/insteabreak_a.js';
import { knockback_a } from '../events/tickEvents/KnockBack/knockback_a.js';
import { phase_a } from '../events/tickEvents/Phase/phase_a.js';
import { placement_a } from '../events/playerPlaceBlock/Placement/placement_a.js';
import { placement_b } from '../events/playerPlaceBlock/Placement/placement_b.js';
import { placement_c } from '../events/playerPlaceBlock/Placement/placement_c.js';
import { placement_d } from '../events/playerPlaceBlock/Placement/placement_d.js';
import { spider_a } from '../events/tickEvents/Spider/spider_a.js';
import { jesus_a } from '../events/tickEvents/Jeues/jesus.js';
import { fastThrow_a } from '../events/itemUse/FastThrow/fastThrow_a.js';
import { namespoof_a } from '../events/playerSpawn/Namespoof/namespoof_a.js';
import { namespoof_b } from '../events/playerSpawn/Namespoof/namespoof_b.js';
import { movement_a } from '../events/entityHurt/movement/movement_a.js';
import { autotool_c } from '../events/entityHitBlock/AutoTool/autotool_c.js';
import { autotool_b } from '../events/entityHitBlock/AutoTool/autotool_b.js';

export function State (module: string, data: boolean) {
  if(!String(GobalData.get('toggle')).includes(module)) {
    return data
  } else {
    return !data
  }
};

export function changeData (module: string, player?: Player) {
  const string = module.replace('_','').toUpperCase().replace('AUTOCLICKER','AC').replace('KNOCKBACK','KB');
  const data = String(GobalData.get('Data'));
  if (String(GobalData.get('toggle')).includes(module)) {
    const data = String(GobalData.get('toggle'));
    changeValue('toggle', data.replace(module, ''))
  } else {
    changeValue('toggle', data + module);
  };
  if(!restart(string)) {
    if(player !== undefined) {
      player.sendMessage(`§dNokararos §f> Undefined Module: §e${module}`);
    } else {
      console.warn(`Failed to toggle module: ${module}`)
    };
    changeValue('toggle', data.replace(module, ''));
    return
  }
};

function restart (module: string) {
  let defined = true;
  switch (module) {
    case "ACA": {
      ac_a();
      break
    };
    case "ACB": {
      ac_b();
      break
    };
    case "NUKERA": {
      nuker_a();
      break
    };
    case "SPEEDA": {
      speed_a();
      break
    };
    case "NOFALLA": {
      nofall_a();
      break
    };
    case "KILLAURAA": {
      killaura_a();
      break
    };
    case "KILLAURAB": {
      killaura_b();
      break
    };
    case "KILLAURAC": {
      killaura_c();
      break
    };
    case "KILLAURAD": {
      killaura_d();
      break
    };
    case "KILLAURAE": {
      killaura_e();
      break
    };
    case "KILLAURAF": {
      killaura_f();
      break
    };
    case "SURROUNDA": {
      surround_a();
      break
    };
    case "SURROUNDB": {
      surround_b();
      break
    };
    case "SCAFFOLDA": {
      scaffold_a();
      break
    };
    case "SCAFFOLDB": {
      scaffold_b();
      break
    };
    case "SCAFFOLDC": {
      scaffold_c();
      break
    };
    case "SCAFFOLDD": {
      scaffold_d();
      break
    };
    case "AURAA": {
      aura_a();
      break
    };
    case "AURAB": {
      aura_b();
      break
    };
    case "REACHA": {
      reach_a();
      break
    };
    case "REACHB": {
      reach_b();
      break
    };
    case "REACHC": {
      reach_c();
      break
    };
    case "SPAMA": {
      spam_a();
      break
    };
    case "SPAMB": {
      spam_b();
      break
    };
    case "SPAMC": {
      spam_c();
      break
    };
    case "SPAMMERA": {
      spammer_a();
      break
    };
    case "SPAMMERB": {
      spammer_b();
      break
    };
    case "SPAMMERC": {
      spammer_c();
      break
    };
    case "SPAMMERD": {
      spammer_d();
      break
    };
    case "INVAILDSPRINTA": {
      invaildsprint_a();
      break
    };
    case "INVAILDSPRINTB": {
      invaildSprint_b();
      break
    };
    case "INVAILDSPRINTC": {
      invaildSprint_c();
      break
    };
    case "CRASHERA": {
      crasher_a();
      break
    };
    case "CRASHERB": {
      crasher_b();
      break
    };
    case "CRASHERC": {
      crasher_c();
      break
    };
    case "ITEMS": {
      items();
      break
    };
    case "ILLEGALITEMA": {break};
    case "ILLEGALITEMB": {break};
    case "ILLEGALITEMC": {break};
    case "ILLEGALITEMD": {break};
    case "ILLEGALITEME": {break};
    case "ILLEGALITEMF": {break};
    case "ILLEGALITEMG": {break};
    case "ILLEGALITEMH": {break};
    case "ILLEGALITEMI": {break};
    case "ILLEGALITEMJ": {break};
    case "BADENCHANTA": {break};
    case "BADENCHANTB": {break};
    case "AIMBOTA": {
      aimbot_a();
      break
    };
    case "AIMBOTB": {
      aimbot_b();
      break
    };
    case "FLYA": {
      fly_a();
      break
    };
    case "FLYB": {
      fly_b();
      break
    };
    case "FLYC": {
      fly_c();
      break
    };
    case "FLYD": {
      fly_d();
      break
    };
    case "AUTOTOTEMA": {
      autototem_a();
      break
    };
    case "AUTOTOTEMB": {
      autototem_b();
      break
    };
    case "AUTOTOTEMC": {
      autototem_c();
      break
    };
    case "AUTOSHIELDA": {
      autoshield_a();
      break
    };
    case "AUTOSHIELDB": {
      autoshield_b();
      break
    };
    case "AUTOSHIELDC": {
      autoshield_c();
      break
    };
    case "CBEA": {
      cbe_a();
      break
    };
    case "CBEB": {
      cbe_b();
      break
    };
    case "AUTOTOOLA": {
      autotool_a();
      break
    };
    case "AUTOTOOLB": {
      autotool_b();
      break
    };
    case "AUTOTOOLC": {
      autotool_c();
      break
    };
    case "INSTEABREAKA": {
      insteabreak_a();
      break
    };
    case "KBA": {
      knockback_a();
      break
    };
    case "PHASEA": {
      phase_a();
      break
    };
    case "PLACEMENTA": {
      placement_a();
      break
    };
    case "PLACEMENTB": {
      placement_b();
      break
    };
    case "PLACEMENTC": {
      placement_c();
      break
    };
    case "PLACEMENTD": {
      placement_d();
      break
    };
    case "SPIDERA": {
      spider_a();
      break
    };
    case "JESUSA": {
      jesus_a();
      break
    };
    case "FASTTHROWA": {
      fastThrow_a();
      break
    };
    case "NAMESPOOFA": {
      namespoof_a();
      break
    };
    case "NAMESPOOFB": {
      namespoof_b();
      break
    };
    case "MOVEMENTA": {
      movement_a();
      break
    };
    default: {
      defined = false
    }
  };
  return defined
}