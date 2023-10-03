export const GobalData = new Map<string, string | boolean | number | Vector3>();

import { world, Vector3 } from '@minecraft/server';

import config from '../data/default-config.js';
import version from '../version.js';

import { KEY } from '../events/worldInitialize/register.js';
import { AES } from 'crypto-es/lib/aes.js';

export const definedString = [
  'nokararos->config',
  'nokararos->toggle',
  'nokararos->version',
  'nokararos->bantoken'
];

function changeData (data: string, value: string | boolean | number | Vector3) {
  world.setDynamicProperty(data, value);
  GobalData.set(data, value);
};

function clearAllData () {
  //@ts-expect-error
  world.setDynamicProperty('nokararos->config', AES.encrypt(JSON.stringify(config), KEY));
  //@ts-expect-error
  world.setDynamicProperty('nokararos->version', AES.encrypt(version, KEY));
  //@ts-expect-error
  world.setDynamicProperty('nokararos->toggle', AES.encrypt('<placeHolder>', KEY));
  //@ts-expect-error
  definedString.forEach(defined => GobalData.set(defined.replace('nokararos->',''), AES.decrypt(world.getDynamicProperty(defined), KEY)));
  GobalData.clear();
  //@ts-expect-error
  definedString.forEach(defined => GobalData.set(defined.replace('nokararos->',''), AES.decrypt(world.getDynamicProperty(defined), KEY)));
};

export { changeData, clearAllData }