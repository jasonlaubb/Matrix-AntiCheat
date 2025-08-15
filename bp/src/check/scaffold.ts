import { PlayerPlaceBlockBeforeEvent, world, Block, system, GameMode, Direction, Player, Vector3 } from "@minecraft/server";
import { locEqual } from "../util/util";
import { calculateRelativeViewAngle, distanceXZ, min2 } from "../util/mathUtil";
import type { Axis } from "../../../global";
export default {
    property: "antiScaffoldEnable",
    enable() {
        world.beforeEvents.playerPlaceBlock.subscribe(blockPlace);
    },
    disable() {
        world.beforeEvents.playerPlaceBlock.unsubscribe(blockPlace);
    },
};
function blockPlace(event: PlayerPlaceBlockBeforeEvent) {
    const { block, player, face, faceLocation } = event;
    const height = player.location.y - block.location.y;
    if (player.isOp() || player.isFlying || player.getGameMode() === GameMode.Creative || height < 1) return;
    if (face === Direction.Down && player.location.y - event.faceLocation.y >= 1) {
        event.cancel = true;
        system.run(() => player.flag("Scaffold", "G", "Block"));
    }
    if (height >= 2) return;
    const { x: pitch, y: yaw } = player.getRotation();
    const isTouchInput = player.inputInfo.lastInputModeUsed === "Touch";
    const centerLoc = block.center(),
        angle = calculateRelativeViewAngle(player.location, centerLoc, yaw),
        distance = distanceXZ(player.location, centerLoc);
    const isNormalScaffold = locEqual(faceLocation, event.player.scaffoldLastPlaceLoc);
    player.scaffoldNoRotationFlag ??= 0;
    if (player.scaffoldLastPlaceLoc && pitch < (isTouchInput ? 45 : 30) && isNormalScaffold && (distance <= 2.5 || distanceXZ(center(faceLocation), event.player.location) <= distance)) {
        player.scaffoldNoRotationFlag++;
        if (player.scaffoldNoRotationFlag >= 3) {
            event.cancel = true;
            system.run(() => player.flag("Scaffold", "A", "Block", { height, pitch: pitch.toFixed(2) }));
        }
    } else player.scaffoldNoRotationFlag = 0;
    player.scaffoldIntPitch ??= 0;
    if (pitch % 1 === 0) {
        player.scaffoldIntPitch++;
        event.cancel = true;
        if (player.scaffoldIntPitch >= 3) {
            system.run(() => player.flag("Scaffold", "B", "Block", { pitch }));
        }
    } else player.scaffoldIntPitch = 0;
    player.scaffoldBackwardFlag ??= 0;
    if (distance > (isTouchInput ? 2 : 1.2) && angle > (isTouchInput ? 120 : 45)) {
        event.cancel = true;
        player.scaffoldBackwardFlag++;
        if (player.scaffoldBackwardFlag >= 3) {
            system.run(() => player.flag("Scaffold", "C", "Block", { angle: angle.toFixed(2), distance: distance.toFixed(2) }));
        }
    } else player.scaffoldBackwardFlag = 0;
    const now = Date.now();
    if (pitch > 85 && player.inputInfo.getMovementVector().y > 0 && player.scaffoldLastPlace && now - player.scaffoldLastPlace < 400) {
        player.scaffoldDownFlag++;
        if (player.scaffoldDownFlag >= 2) event.cancel = true;
        if (player.scaffoldDownFlag >= 3) {
            system.run(() => player.flag("Scaffold", "D", "Block", { pitch: pitch.toFixed(2) }));
        }
    } else player.scaffoldDownFlag = 0;
    if (checkDiagScaffold(now, player, block, isNormalScaffold)) event.cancel = true;
    player.scaffoldExtenderFlag ??= 0;
    if (!isTouchInput && pitch > 45 && distance > 2) {
        player.scaffoldExtenderFlag++;
        if (player.scaffoldExtenderFlag >= 3) {
            event.cancel = true;
            system.run(() => player.flag("Scaffold", "F", "Block", { pitch: pitch.toFixed(2), distance: distance.toFixed(2) }));
        }
    } else player.scaffoldExtenderFlag = 0;
    if (!event.cancel) {
        player.scaffoldLastPlaceLoc = block.location;
        player.scaffoldLastPlace = now;
    }
}
function checkDiagScaffold (now: number, player: Player, block: Block, isNormalScaffold: boolean) {
const lastLoc = player.scaffoldLastPlaceLoc;
const curLoc = block.location;
// Initialize mutable state once
player.scaffoldStraightCount ??= 0;
player.scaffoldStrightXZ ??= undefined; // keep your existing prop name
player.scaffoldDiagFlag ??= 0;                            // reuse existing counter
player.scaffoldAxisGrace ??= 0;                  // new: grace steps after axis change
player.scaffoldStraightRecent ??= 0;             // new: recent straight placements count (for resets)

// Compute deltas (guard for missing lastLoc)
const hasLast = !!lastLoc;
const dx = hasLast ? Math.abs(curLoc.x - lastLoc.x) : 0;
const dz = hasLast ? Math.abs(curLoc.z - lastLoc.z) : 0;
const sameY = hasLast ? curLoc.y === lastLoc.y : false;

// Movement classification on grid
const isAxisAlignedStep = sameY && hasLast && ((dx === 1 && dz === 0) || (dx === 0 && dz === 1));
const isDiagonalStep    = sameY && hasLast && (dx === 1 && dz === 1);

// Original “straight” checks relative to last block
const strightX = hasLast && lastLoc.x === curLoc.x;
const strightZ = hasLast && lastLoc.z === curLoc.z;
const exactlyOneStraight = strightX !== strightZ;

// Only consider fast sequences
const fastPlacement = player.scaffoldLastPlace && (now - player.scaffoldLastPlace) <= 500;

// 1) Axis tracking and straight-count handling (no default axis unless unambiguous)
if (hasLast && sameY) {
  // Establish axis only if exactly one of X/Z is straight
  if (player.scaffoldStrightXZ === undefined) {
    if (exactlyOneStraight) {
      player.scaffoldStrightXZ = (strightX ? "x" : "z") as Axis;
      player.scaffoldStraightCount = 1;
    } else {
      // ambiguous (diagonal or none): keep axis undefined, don’t increment
      player.scaffoldStraightCount = 0;
    }
  } else {
    // If continuing along the current axis, increment
    const continuingOnAxis =
      (strightX && player.scaffoldStrightXZ === "x") ||
      (strightZ && player.scaffoldStrightXZ === "z");

    if (continuingOnAxis) {
      player.scaffoldStraightCount++;
    } else if (exactlyOneStraight) {
      // Axis turn (x <-> z): set a short grace window and start new straight streak
      if (
        (strightX && player.scaffoldStrightXZ !== "x") ||
        (strightZ && player.scaffoldStrightXZ !== "z")
      ) {
        (player as any).scaffoldAxisGrace = 2; // grace for 2 placements after a turn
      }
      player.scaffoldStrightXZ = (strightX ? "x" : "z") as Axis;
      player.scaffoldStraightCount = 1;
    } else {
      // Diagonal or ambiguous step: do not increment straight streak
      player.scaffoldStraightCount = 0;
    }
  }
} else {
  // Different Y or no last loc: reset straight streak, keep axis undefined until we can infer it
  player.scaffoldStraightCount = 0;
  if (!hasLast) player.scaffoldStrightXZ = undefined;
}

// 2) Grace window countdown
if (player.scaffoldAxisGrace > 0) {
  player.scaffoldAxisGrace--;
}

// 3) Track recent straight placements to allow quick resets of diagonal streaks after corners
if (isAxisAlignedStep) {
  player.scaffoldStraightRecent = min2(2, (player as any).scaffoldStraightRecent + 1);
} else {
  player.scaffoldStraightRecent = 0;
}

// 4) Diagonal streak detection: only count true 1-1 diagonals, at same Y, within speed window,
//    and not during axis-change grace. This avoids punishing corners and off-axis starts.
if (fastPlacement && isDiagonalStep && (player as any).scaffoldAxisGrace === 0) {
  player.scaffoldDiagFlag++;
} else {
  // If we see at least two axis-aligned steps recently, clear the diagonal streak to forgive corners
  if (player.scaffoldStraightRecent >= 2) {
    player.scaffoldDiagFlag = 0;
  }
  // Otherwise, on slow or non-diagonal steps, decay the streak slightly instead of hard reset
  // to reduce bursty false positives from lag spikes.
  if (!fastPlacement || !isDiagonalStep) {
    player.scaffoldDiagFlag = Math.max(0, player.scaffoldDiagFlag - 1);
  }
}
if (!isNormalScaffold) {
    player.scaffoldDiagFlag = 0; // Just not a bridge action bro
}
// 5) Threshold to flag: require a longer sustained diagonal streak
const DIAG_THRESHOLD = 8; // was 6; higher to reduce false positives
if (player.scaffoldDiagFlag >= DIAG_THRESHOLD) {
  system.run(() =>
    player.flag("Scaffold", "E", "Block", {
      diagCount: player.scaffoldDiagFlag,
      dx,
      dz,
      straightCount: player.scaffoldStraightCount,
    })
  );
  return true;
}
return false;
}
function center ({ x, y, z }: Vector3): Vector3 {
    return {
        x: x + 0.5,
        y: y + 0.5,
        z: z + 0.5
    }
}