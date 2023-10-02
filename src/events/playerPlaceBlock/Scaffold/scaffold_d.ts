import { Vector3, system, world } from "@minecraft/server";
import config from "../../../data/config.js";
import { flag } from "../../../util/Flag.js";

class playerAction {
  type: string;
  time: number;
  position: Vector3
};

const scaffoldData = new Map<string, Array<playerAction>>();

const scaffold_d = () => {
  const EVENT1 = world.beforeEvents.playerPlaceBlock.subscribe(ev => {
    const block = ev.block;
    const player = ev.player;

        const { location: { x, y, z } } = block;
        const currentTime: number = Date.now();
        const playerAction: Array<playerAction> = scaffoldData.get(player.id) || [];
        const timeThreshold: number = currentTime - config.modules.scaffoldD.timer;

        playerAction.push({ type: 'scaffoldData', time: currentTime, position: { x, y, z } });
        const updatedActions: Array<playerAction> = playerAction.filter(action => action.time >= timeThreshold);

        scaffoldData.set(player.id, updatedActions);

        if (updatedActions.length < config.modules.scaffoldD.maxBlockPlacePerSecond) return;

        const [lastAction]: Array<playerAction> = updatedActions;
        const timeDifference: number = currentTime - lastAction.time;
        const distance: number = Math.sqrt((x - lastAction.position.x) ** 2 + (y - lastAction.position.y) ** 2 + (z - lastAction.position.z) ** 2);
        const blocksPlacedPerSecond: number = updatedActions.length / (timeDifference / config.modules.scaffoldD.timer);
        const averageDistance: number = distance / updatedActions.length;

        if (blocksPlacedPerSecond >= config.modules.scaffoldD.maxBlockPlacePerSecond && averageDistance < 1) {
            ev.cancel = true;
            system.run(() => player.applyDamage(6));
            flag(player, 'Scaffold/D', config.modules.scaffoldD as ModuleClass, [`BBPS=${blocksPlacedPerSecond}`])
        }
  });
  const EVENT2 = world.afterEvents.playerLeave.subscribe(ev => {
    scaffoldData.delete(ev.playerId)
  });

  if (!config.modules.scaffoldD.state) {
    world.beforeEvents.playerPlaceBlock.unsubscribe(EVENT1);
    world.afterEvents.playerLeave.unsubscribe(EVENT2);
  }
};

export { scaffold_d }