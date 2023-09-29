import { system } from '@minecraft/server';

const watchDog = () => {
  system.beforeEvents.watchdogTerminate.subscribe(ev => {
    ev.cancel = true;
    console.warn(`WatchDogTerminate Cancelled (Reason:${ev.terminateReason})`)
  })
};

export { watchDog }