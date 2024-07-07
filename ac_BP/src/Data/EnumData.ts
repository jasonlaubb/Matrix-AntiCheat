/**
 * @description The tags collection of animation controller
 */
export enum AnimationControllerTags {
    mayfly = "mayfly",
    alive = "alive",
    dead = "dead",
    attackTime = "attack_time",
    gliding = "gliding",
    jumping = "jumping",
    levitating = "levitating",
    moving = "moving",
    isOnGround = "isOnGround",
    riding = "riding",
    sneaking = "sneaking",
    sprinting = "sprinting",
    swimming = "swimming",
    sleeping = "sleeping",
    usingItem = "using_item",
    north = "north",
    south = "south",
    east = "east",
    west = "west"
}

export enum DisableTags {
    item = "matrix:item-disabled",
    break = "matrix:break-disabled",
    place = "matrix:place-disabled",
    pvp = "matrix:pvp-disabled",
}

export enum MatrixUsedTags {
    disabler = "matrix:disabler-patched",
    stopRiding = "matrix:stop-riding",
    knockBack = "matrix:knockback"
}

export enum MatrixEvents {
    tempkick = "matrix:tempkick",
    unvanish = "matrix:unvanish",
    vanish = "matrix:vanish",
}