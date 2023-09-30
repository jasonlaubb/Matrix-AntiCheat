export const GobalData = new Map<string, string | boolean | number | Vector3>();

import { world, Vector3 } from '@minecraft/server';

import config from '../data/default-config.js';
import version from '../version.js';

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
  world.setDynamicProperty('nokararos->config', JSON.stringify(config));
  world.setDynamicProperty('nokararos->version', version);
  world.setDynamicProperty('nokararos->toggle', '');
  definedString.forEach(defined => GobalData.set(defined.replace('nokararos->',''), world.getDynamicProperty(defined)));
  GobalData.clear();
  definedString.forEach(defined => GobalData.set(defined.replace('nokararos->',''), world.getDynamicProperty(defined)));
};

export { changeData, clearAllData }