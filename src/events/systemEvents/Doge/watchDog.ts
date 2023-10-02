import { system } from '@minecraft/server';

const watchDog = () => {
  system.beforeEvents.watchdogTerminate.subscribe(ev => {
    ev.cancel = true;
    console.warn(`WatchDogTerminate Cancelled (Reason:${ev.terminateReason})`)
  });
  /*
    OMG? this events emmmm... I don't think I need to make "state" from this lol
    This thing will not notify any thing or some thing
    And if no this... world will crash idk, so it only something line?
    idk, but at least, why you want to see this messag?
    I am cool but I am not meanful to you?
    Maybe only one line can do this idk, I will show you:

    system.beforeEvents.watchdogTerminate.subscribe(ev => ev.cancel = true)
    
    easy don't ask me why.

    Modules amount can beat all modules few
                                              --jasonlaubb
                                                    2/10/2023
  */
};

export { watchDog }