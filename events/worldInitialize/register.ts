import { world, DynamicPropertiesDefinition } from '@minecraft/server';

import config from '../../data/default-config.js';
import version from '../../version.js';
import { definedString, GobalData } from '../../util/DataBase.js';

const registData = () => {
  world.afterEvents.worldInitialize.subscribe(ev => {
    const data = new DynamicPropertiesDefinition();
    definedString.forEach(defined => data.defineString(defined, 2147483647));
    ev.propertyRegistry.registerWorldDynamicProperties(data);

    if(!world.getDynamicProperty('nokararos->config')) world.setDynamicProperty('nokararos->config', JSON.stringify(config));
    if(!world.getDynamicProperty('nokararos->version')) world.setDynamicProperty('nokararos->version', version);
    if(world.getDynamicProperty('nokararos->version') !== version) {
      world.setDynamicProperty('nokararos->version', version);
      world.setDynamicProperty('nokararos->config', JSON.stringify(config));
    };
    if(!world.getDynamicProperty('nokararos->toggle')) world.setDynamicProperty('nokararos->toggle', '');

    definedString.forEach(defined => GobalData.set(defined.replace('nokararos->',''), world.getDynamicProperty(defined)))
  });
}

export { registData }