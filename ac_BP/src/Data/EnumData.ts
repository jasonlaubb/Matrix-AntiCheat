/**
 * @description The tags collection of animation controller
 */
export enum AnimationControllerTags {
    mayfly = "mayfly",
    alive = "alive",
    dead = "dead",
    attackTime = "attackTime",
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
    eating = "eating",
    emoting = "emoting",
    digging = "digging",
    ignited = "ignited",
    wet = "wet",
    firstPerson = "firstPerson",
    north = "north",
    south = "south",
    east = "east",
    west = "west",
}

export enum DisableTags {
    item = "matrix:item-disabled",
    break = "matrix:break-disabled",
    place = "matrix:place-disabled",
    pvp = "matrix:pvp-disabled",
}

export enum MatrixUsedTags {
    disabler = "matrix:disabler-patched",
    crasher = "matrix:crasher",
    stopRiding = "matrix:stop-riding",
    knockBack = "matrix:knockback",
    verified = "matrix:verified",
    slime = "matrix:slime",
    packetlogger = "matrix:packetLogger",
    movementbypass = "matrix:movementCheckBypassTag",
    container = "matrix:container_opened",
    impeccable = "matrix:impeccable",
}

export enum MatrixEvents {
    tempkick = "matrix:tempkick",
    unvanish = "matrix:unvanish",
    vanish = "matrix:vanish",
}
