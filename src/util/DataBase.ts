export const GobalData = new Map<string, any>();

const RealName = new Map<string, string>();

import { world } from '@minecraft/server';
import config from '../data/default-config.js';
import version from '../version.js';

const defaultValue = { config: config, toggle: '', version: version }

const WorldOn = () => {
  let inputValue = '';
  const AllThings = world.scoreboard.getObjectives().filter(scoreboard => scoreboard.displayName.startsWith('NokararosData--'));
  world.afterEvents.worldInitialize.subscribe(ev => {
    if (AllThings.length <= 0) {
      inputValue = JSON.stringify(defaultValue);
      GobalData.set('Data', defaultValue);
      startGen(inputValue)
    } else {
      let oldData = undefined;
      for(const thing of AllThings) {
        const data = thing.getParticipants()[0].displayName;
        if(!data.endsWith('.')) continue;
        oldData = data.slice(0, -1);
        if(JSON.parse(oldData).version < version){
          oldData = JSON.stringify(defaultValue);
          console.warn('DataBase Version too old, it set to default')
        };
        break
      };
      if(oldData === undefined) {
        AllThings.forEach(scoreboard => world.scoreboard.removeObjective(scoreboard));
        WorldOn();
        return
      };
      AllThings.forEach(scoreboard => world.scoreboard.removeObjective(scoreboard));
      startGen(oldData)
    }
  })
};

function newRandom () {
    let index = '';
    const strings = ("0123456789qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM").split('');
    for(let i = 0; i < 16; i++) {
      const random = Math.trunc(Math.random() * 62);
      index += strings[random]
    }
    return index
  }

function startGen (inputValue: string) {
  const realPreFix = newRandom();
  RealName.set('Data', realPreFix);
  world.scoreboard.addObjective(realPreFix, `NokararosData--${realPreFix}`);
  world.scoreboard.getObjective(realPreFix).setScore(inputValue + '.', 2147483648);
  for(let i = 0; i < 1199; i++) {
    const ran = newRandom();
    try {
      world.scoreboard.addObjective(ran, `NokararosData--${ran}`);
    } catch {
      --i
    }
  }
};

export function changeValue (inputValue: any) {
  const realPreFix = RealName.get('Data');
  const database = world.scoreboard.getObjective(`NokararosData--${realPreFix}`);
  database.removeParticipant(world.scoreboard.getParticipants()[0]);
  database.setScore(JSON.stringify(inputValue) + '.', 2147483648);
  GobalData.set('Data', inputValue)
}
