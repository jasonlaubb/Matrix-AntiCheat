import { Player, world } from "@minecraft/server";

const loopForEach = [] as ((player: Player) => any)[];
const loopForCheck = [] as ((player: Player) => any)[];
const loop = [] as (() => any)[];

export function tick() {
  const players = world.getAllPlayers();
  players.forEach((player) => {
    loop.forEach((f) => f());
    loopForEach.forEach((f) => f(player));
    if (!player.isOp()) loopForCheck.forEach((f) => f(player));
  });
}
export function addInterval(callback: () => any) {
  loop.push(callback);
}
export function removeInterval(callback: () => any) {
  const index = loop.indexOf(callback);
  if (index !== -1) loop.splice(index, 1);
}
export function addPlayerInterval(callback: (player: Player) => any) {
  loopForEach.push(callback);
}
export function removePlayerInterval(callback: (player: Player) => any) {
  const index = loopForEach.indexOf(callback);
  if (index !== -1) loopForEach.splice(index, 1);
}
export function addCheckInterval(callback: (player: Player) => any) {
  loopForCheck.push(callback);
}
export function removeCheckInterval(callback: (player: Player) => any) {
  const index = loopForCheck.indexOf(callback);
  if (index !== -1) loopForCheck.splice(index, 1);
}
