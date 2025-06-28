/**
 * All possible MinecraftCameraPresetsTypes
 */
export declare enum MinecraftCameraPresetsTypes {
    ControlSchemeCamera = "minecraft:control_scheme_camera",
    FirstPerson = "minecraft:first_person",
    FixedBoom = "minecraft:fixed_boom",
    FollowOrbit = "minecraft:follow_orbit",
    Free = "minecraft:free",
    ThirdPerson = "minecraft:third_person",
    ThirdPersonFront = "minecraft:third_person_front"
}
/**
 * Union type equivalent of the MinecraftCameraPresetsTypes enum.
 */
export type MinecraftCameraPresetsTypesUnion = keyof typeof MinecraftCameraPresetsTypes;
