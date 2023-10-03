import { world, DynamicPropertiesDefinition } from '@minecraft/server';

import config from '../../data/default-config.js';
import version from '../../version.js';
import { definedString, GobalData } from '../../util/DataBase.js';
import { newRandom } from '../../util/World.js';

import { AES } from '../../node_modules/crypto-es/lib/aes.js';

export const KEY: string = 'cy0ETcAERcITrSzznetv2Swg2/akX54q8/I3kqnvYYI=';
//get Key: https://www.digitalsanctuary.com/aes-key-generator-free

const registData = () => {
  world.afterEvents.worldInitialize.subscribe(ev => {
    const data = new DynamicPropertiesDefinition();
    definedString.forEach(defined => data.defineString(defined, 2147483647));
    ev.propertyRegistry.registerWorldDynamicProperties(data);

    //@ts-expect-error
    if(!world.getDynamicProperty('nokararos->config')) world.setDynamicProperty('nokararos->config', AES.encrypt(JSON.stringify(config), KEY));
    //@ts-expect-error
    if(!world.getDynamicProperty('nokararos->version')) world.setDynamicProperty('nokararos->version',  AES.encrypt(version, KEY));
    //@ts-expect-error
    if(!world.getDynamicProperty('nokararos->bantoken')) world.setDynamicProperty('nokararos->bantoken', AES.encrypt(newRandom(32), KEY));
    if(world.getDynamicProperty('nokararos->version') !== version) {
      world.setDynamicProperty('nokararos->version', version);
      world.setDynamicProperty('nokararos->config', JSON.stringify(config));
    };
    //@ts-expect-error
    if(!world.getDynamicProperty('nokararos->toggle')) world.setDynamicProperty('nokararos->toggle', AES.encrypt('<placeHolder>', KEY));

    //@ts-expect-error
    definedString.forEach(defined => GobalData.set(defined.replace('nokararos->',''), AES.decrypt(world.getDynamicProperty(defined), KEY)));

    //Save all staff - yay, This thing no one can change it, unless it's api lol
    const StaffList = new DynamicPropertiesDefinition().defineBoolean('nokararos->staffState');
    ev.propertyRegistry.registerEntityTypeDynamicProperties(StaffList, 'minecraft:player');
  });
}

export { registData }