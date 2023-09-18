// Type definitions for Minecraft Bedrock Edition script APIs
// Project: https://docs.microsoft.com/minecraft/creator/
// Definitions by: Jake Shirley <https://github.com/JakeShirley>
//                 Mike Ammerlaan <https://github.com/mammerla>

/* *****************************************************************************
   Copyright (c) Microsoft Corporation.
   ***************************************************************************** */
/**
 * @packageDocumentation
 * Contains many types related to manipulating a Minecraft
 * world, including entities, blocks, dimensions, and more.
 *
 * Manifest Details
 * ```json
 * {
 *   "module_name": "@minecraft/server",
 *   "version": "1.3.0"
 * }
 * ```
 *
 */
/**
 * @beta
 */
export enum BlockVolumeIntersection {
    Disjoint = 0,
    Contains = 1,
    Intersects = 2,
}

/**
 * @beta
 */
export enum CompoundBlockVolumeAction {
    Add = 0,
    Subtract = 1,
}

/**
 * @beta
 * A general purpose relative direction enumeration.
 */
export enum Direction {
    /**
     * @beta
     * @remarks
     * Returns the block beneath (y - 1) of this item.
     *
     */
    Down = 'Down',
    /**
     * @beta
     * @remarks
     * Returns the block to the east (x + 1) of this item.
     *
     */
    East = 'East',
    /**
     * @beta
     * @remarks
     * Returns the block to the east (z + 1) of this item.
     *
     */
    North = 'North',
    /**
     * @beta
     * @remarks
     * Returns the block to the south (z - 1) of this item.
     *
     */
    South = 'South',
    /**
     * @beta
     * @remarks
     * Returns the block above (y + 1) of this item.
     *
     */
    Up = 'Up',
    /**
     * @beta
     * @remarks
     * Returns the block to the west (x - 1) of this item.
     *
     */
    West = 'West',
}

/**
 * @beta
 */
export enum DisplaySlotId {
    BelowName = 'BelowName',
    List = 'List',
    Sidebar = 'Sidebar',
}

/**
 * @beta
 */
export enum DyeColor {
    Black = 'Black',
    Blue = 'Blue',
    Brown = 'Brown',
    Cyan = 'Cyan',
    Gray = 'Gray',
    Green = 'Green',
    LightBlue = 'LightBlue',
    Lime = 'Lime',
    Magenta = 'Magenta',
    Orange = 'Orange',
    Pink = 'Pink',
    Purple = 'Purple',
    Red = 'Red',
    Silver = 'Silver',
    White = 'White',
    Yellow = 'Yellow',
}

export enum EntityDamageCause {
    anvil = 'anvil',
    blockExplosion = 'blockExplosion',
    charging = 'charging',
    contact = 'contact',
    drowning = 'drowning',
    entityAttack = 'entityAttack',
    entityExplosion = 'entityExplosion',
    fall = 'fall',
    fallingBlock = 'fallingBlock',
    fire = 'fire',
    fireTick = 'fireTick',
    fireworks = 'fireworks',
    flyIntoWall = 'flyIntoWall',
    freezing = 'freezing',
    lava = 'lava',
    lightning = 'lightning',
    magic = 'magic',
    magma = 'magma',
    none = 'none',
    override = 'override',
    piston = 'piston',
    projectile = 'projectile',
    stalactite = 'stalactite',
    stalagmite = 'stalagmite',
    starve = 'starve',
    suffocation = 'suffocation',
    suicide = 'suicide',
    temperature = 'temperature',
    thorns = 'thorns',
    'void' = 'void',
    wither = 'wither',
}

/**
 * @beta
 * Describes the lifetime state of an Entity. For example,
 * Entities can be loaded or unloaded depending on whether
 * their chunks are loaded or when they move across dimensions.
 */
export enum EntityLifetimeState {
    /**
     * @beta
     * @remarks
     * Corresponding object is loaded.
     *
     */
    Loaded = 'Loaded',
    /**
     * @beta
     * @remarks
     * Corresponding object is now unloaded. Unloaded entities
     * cannot be manipulated. However, if an unloaded Entity later
     * reloads, it becomes valid and can once again be manipulated.
     *
     */
    Unloaded = 'Unloaded',
}

/**
 * @beta
 * The equipment slot of the mob. This includes armor, offhand
 * and mainhand slots.
 */
export enum EquipmentSlot {
    /**
     * @beta
     * @remarks
     * The chest slot. This slot is used to hold items such as
     * Chestplate or Elytra.
     *
     */
    chest = 'chest',
    /**
     * @beta
     * @remarks
     * The feet slot. This slot is used to hold items such as
     * Boots.
     *
     */
    feet = 'feet',
    /**
     * @beta
     * @remarks
     * The head slot. This slot is used to hold items such as
     * Helmets or Carved Pumpkins.
     *
     */
    head = 'head',
    /**
     * @beta
     * @remarks
     * The legs slot. This slot is used to hold items such as
     * Leggings.
     *
     */
    legs = 'legs',
    /**
     * @beta
     * @remarks
     * The mainhand slot. For players, the mainhand slot refers to
     * the currently active hotbar slot.
     *
     */
    mainhand = 'mainhand',
    /**
     * @beta
     * @remarks
     * The offhand slot. This slot is used to hold items such as
     * shields and maps.
     *
     */
    offhand = 'offhand',
}

/**
 * @beta
 * Represents the type of fluid for use within a fluid
 * containing block, like a cauldron.
 */
export enum FluidType {
    /**
     * @beta
     * @remarks
     * Represents lava as a type of fluid.
     *
     */
    Lava = 'Lava',
    /**
     * @beta
     * @remarks
     * Represents a potion as a type of fluid.
     *
     */
    Potion = 'Potion',
    /**
     * @beta
     * @remarks
     * Represents powder snow as a type of fluid.
     *
     */
    PowderSnow = 'PowderSnow',
    /**
     * @beta
     * @remarks
     * Represents water as a type of fluida.
     *
     */
    Water = 'Water',
}

/**
 * Represents a game mode for the current world experience.
 */
export enum GameMode {
    /**
     * @remarks
     * World is in a more locked-down experience, where blocks may
     * not be manipulated.
     *
     */
    adventure = 'adventure',
    /**
     * @remarks
     * World is in a full creative mode. In creative mode, the
     * player has all the resources available in the item selection
     * tabs and the survival selection tab. They can also destroy
     * blocks instantly including those which would normally be
     * indestructible. Command and structure blocks can also be
     * used in creative mode. Items also do not lose durability or
     * disappear.
     *
     */
    creative = 'creative',
    /**
     * @remarks
     * World is in spectator mode. In spectator mode, spectators
     * are always flying and cannot become grounded. Spectators can
     * pass through solid blocks and entities without any
     * collisions, and cannot use items or interact with blocks or
     * mobs. Spectators cannot be seen by mobs or other players,
     * except for other spectators; spectators appear as a
     * transparent floating head.
     *
     */
    spectator = 'spectator',
    /**
     * @remarks
     * World is in a survival mode, where players can take damage
     * and entities may not be peaceful. Survival mode is where the
     * player must collect resources, build structures while
     * surviving in their generated world. Activities can, over
     * time, chip away at player health and hunger bar.
     *
     */
    survival = 'survival',
}

/**
 * Describes how an an item can be moved within a container.
 */
export enum ItemLockMode {
    /**
     * @remarks
     * The item cannot be dropped or crafted with.
     *
     */
    inventory = 'inventory',
    /**
     * @remarks
     * The item has no container restrictions.
     *
     */
    none = 'none',
    /**
     * @remarks
     * The item cannot be moved from its slot, dropped or crafted
     * with.
     *
     */
    slot = 'slot',
}

/**
 * @beta
 * Used for specifying a sort order for how to display an
 * objective and its list of participants.
 */
export enum ObjectiveSortOrder {
    /**
     * @beta
     * @remarks
     * Objective participant list is displayed in ascending (e.g.,
     * A-Z) order.
     *
     */
    Ascending = 0,
    /**
     * @beta
     * @remarks
     * Objective participant list is displayed in descending (e.g.,
     * Z-A) order.
     *
     */
    Descending = 1,
}

/**
 * @beta
 * Contains objectives and participants for the scoreboard.
 */
export enum ScoreboardIdentityType {
    /**
     * @beta
     * @remarks
     * This scoreboard participant is tied to an entity.
     *
     */
    Entity = 'Entity',
    /**
     * @beta
     * @remarks
     * This scoreboard participant is tied to a pseudo player
     * entity - typically this is used to store scores as data or
     * as abstract progress.
     *
     */
    FakePlayer = 'FakePlayer',
    /**
     * @beta
     * @remarks
     * This scoreboard participant is tied to a player.
     *
     */
    Player = 'Player',
}

/**
 * @beta
 * Describes where the script event originated from.
 */
export enum ScriptEventSource {
    /**
     * @beta
     * @remarks
     * The script event originated from a Block such as a Command
     * Block.
     *
     */
    Block = 'Block',
    /**
     * @beta
     * @remarks
     * The script event originated from an Entity such as a Player,
     * Command Block Minecart or Animation Controller.
     *
     */
    Entity = 'Entity',
    /**
     * @beta
     * @remarks
     * The script event originated from an NPC dialogue.
     *
     */
    NPCDialogue = 'NPCDialogue',
    /**
     * @beta
     * @remarks
     * The script event originated from the server, such as from a
     * runCommand API call or a dedicated server console.
     *
     */
    Server = 'Server',
}

/**
 * @beta
 * Represents a side of a sign.
 */
export enum SignSide {
    /**
     * @beta
     * @remarks
     * The back of the sign.
     *
     */
    Back = 'Back',
    /**
     * @beta
     * @remarks
     * The front of the sign.
     *
     */
    Front = 'Front',
}

/**
 * @beta
 * Provides numeric values for common periods in the Minecraft
 * day.
 */
export enum TimeOfDay {
    Day = 1000,
    Noon = 6000,
    Sunset = 12000,
    Night = 13000,
    Midnight = 18000,
    Sunrise = 23000,
}

/**
 * @beta
 * An enumeration with the reason that a watchdog is deciding
 * to terminate execution of a behavior packs' script.
 */
export enum WatchdogTerminateReason {
    /**
     * @beta
     * @remarks
     * Script runtime for a behavior pack is terminated due to
     * non-responsiveness from script (a hang or infinite loop).
     *
     */
    Hang = 'Hang',
    /**
     * @beta
     * @remarks
     * Script runtime for a behavior pack is terminated due to a
     * stack overflow (a long, and potentially infinite) chain of
     * function calls.
     *
     */
    StackOverflow = 'StackOverflow',
}

/**
 * @beta
 */
export enum WeatherType {
    Clear = 'Clear',
    Rain = 'Rain',
    Thunder = 'Thunder',
}

/**
 * Represents a block in a dimension. A block represents a
 * unique X, Y, and Z within a dimension and get/sets the state
 * of the block at that location. This type was significantly
 * updated in version 1.17.10.21.
 */
export class Block {
    private constructor();
    /**
     * @remarks
     * Returns the dimension that the block is within.
     *
     */
    readonly dimension: Dimension;
    /**
     * @beta
     * @remarks
     * Returns or sets whether this block has a liquid on it.
     *
     * This property can't be edited in read-only mode.
     *
     */
    isWaterlogged: boolean;
    /**
     * @remarks
     * Coordinates of the specified block.
     *
     * @throws This property can throw when used.
     */
    readonly location: Vector3;
    /**
     * @remarks
     * Additional block configuration data that describes the
     * block.
     *
     * @throws This property can throw when used.
     */
    readonly permutation: BlockPermutation;
    /**
     * @beta
     * @remarks
     * Gets the type of block.
     *
     * @throws This property can throw when used.
     */
    readonly 'type': BlockType;
    /**
     * @beta
     * @remarks
     * Identifier of the type of block for this block.
     *
     * @throws This property can throw when used.
     */
    readonly typeId: string;
    /**
     * @remarks
     * X coordinate of the block.
     *
     */
    readonly x: number;
    /**
     * @remarks
     * Y coordinate of the block.
     *
     */
    readonly y: number;
    /**
     * @remarks
     * Z coordinate of the block.
     *
     */
    readonly z: number;
    /**
     * @beta
     * @remarks
     * Checks to see whether it is valid to place the specified
     * block type or block permutation, on a specified face on this
     * block
     *
     * @param blockToPlace
     * Block type or block permutation to check placement for.
     * @param faceToPlaceOn
     * Optional specific face of this block to check placement
     * against.
     * @returns
     * Returns `true` if the block type or permutation can be
     * placed on this block, else `false`.
     * @throws This function can throw errors.
     */
    canPlace(blockToPlace: BlockPermutation | BlockType, faceToPlaceOn?: Direction): boolean;
    /**
     * @remarks
     * Gets additional configuration properties (a component) for
     * specific capabilities of particular blocks - for example, an
     * inventory component of a chest block.
     *
     * @param componentName
     * Identifier of the component. If a namespace is not
     * specified, minecraft: is assumed.
     * @returns
     * Returns the component object if it is present on the
     * particular block.
     * @throws This function can throw errors.
     */
    getComponent(componentName: string): BlockComponent | undefined;
    /**
     * @beta
     * @remarks
     * Creates a prototype item stack based on this block that can
     * be used with Container/ContainerSlot APIs.
     *
     * @param amount
     * Number of instances of this block to place in the item
     * stack.
     * @param withData
     * Whether additional data facets of the item stack are
     * included.
     * @throws This function can throw errors.
     */
    getItemStack(amount?: number, withData?: boolean): ItemStack;
    /**
     * @beta
     * @remarks
     * Returns the net redstone power of this block.
     *
     * @returns
     * Returns undefined if redstone power is not applicable to
     * this block.
     * @throws This function can throw errors.
     */
    getRedstonePower(): number | undefined;
    /**
     * @beta
     * @remarks
     * Returns a set of tags for a block.
     *
     * @returns
     * The list of tags that the block has.
     * @throws This function can throw errors.
     */
    getTags(): string[];
    /**
     * @beta
     * @remarks
     * Checks to see if the permutation of this block has a
     * specific tag.
     *
     * @param tag
     * Tag to check for.
     * @returns
     * Returns `true` if the permutation of this block has the tag,
     * else `false`.
     * @throws This function can throw errors.
     * @example check_block_tags.js
     * ```typescript
     * import { world } from "@minecraft/server";
     *
     * // Fetch the block
     * const block = world.getDimension("overworld").getBlock({ x: 1, y: 2, z: 3 });
     *
     * console.log(`Block is dirt: ${block.hasTag("dirt")}`);
     * console.log(`Block is wood: ${block.hasTag("wood")}`);
     * console.log(`Block is stone: ${block.hasTag("stone")}`);
     * ```
     */
    hasTag(tag: string): boolean;
    /**
     * @beta
     * @remarks
     * Returns true if this block is an air block (i.e., empty
     * space).
     *
     * @throws This function can throw errors.
     */
    isAir(): boolean;
    /**
     * @beta
     * @remarks
     * Returns true if this block is a liquid block - (e.g., a
     * water block and a lava black are liquid, while an air block
     * and a stone block are not).
     *
     * @throws This function can throw errors.
     */
    isLiquid(): boolean;
    /**
     * @beta
     * @remarks
     * Returns true if this block is solid and impassible - (e.g.,
     * a cobblestone block and a diamond block are solid, while a
     * ladder block and a fence block are not).
     *
     * @throws This function can throw errors.
     */
    isSolid(): boolean;
    /**
     * @beta
     * @remarks
     * Returns true if this reference to a block is still valid
     * (for example, if the block is unloaded, references to that
     * block will no longer be valid.)
     *
     * @returns
     * True if this block object is still working and valid.
     */
    isValid(): boolean;
    /**
     * @remarks
     * Sets the block in the dimension to the state of the
     * permutation.
     *
     * This function can't be called in read-only mode.
     *
     * @param permutation
     * Permutation that contains a set of property states for the
     * Block.
     * @throws This function can throw errors.
     */
    setPermutation(permutation: BlockPermutation): void;
    /**
     * @beta
     * @remarks
     * Sets the type of block.
     *
     * This function can't be called in read-only mode.
     *
     * @param blockType
     * Identifier of the type of block to apply - for example,
     * minecraft:powered_repeater.
     * @throws This function can throw errors.
     */
    setType(blockType: BlockType): void;
    /**
     * @beta
     * @remarks
     * Tries to set the block in the dimension to the state of the
     * permutation by first checking if the placement is valid.
     *
     * This function can't be called in read-only mode.
     *
     * @param permutation
     * Permutation that contains a set of property states for the
     * Block.
     * @returns
     * Returns `true` if the block permutation data was
     * successfully set, else `false`.
     * @throws This function can throw errors.
     */
    trySetPermutation(permutation: BlockPermutation): boolean;
}

/**
 * @beta
 * Holds information for expressing the net size of a volume of
 * blocks.
 */
export class BlockAreaSize {
    /**
     * @remarks
     * X size (west to east) component of this block area.
     *
     */
    x: number;
    /**
     * @remarks
     * Y size (down to up) of this block area size.
     *
     */
    y: number;
    /**
     * @remarks
     * Z size (south to north) of this block area size.
     *
     */
    z: number;
    /**
     * @remarks
     * Creates a new BlockAreaSize object.
     *
     */
    constructor(x: number, y: number, z: number);
    /**
     * @remarks
     * Tests whether this block area size is equal to another
     * BlockAreaSize object.
     *
     */
    equals(other: BlockAreaSize): boolean;
}

/**
 * @beta
 * Contains information regarding an event where a player
 * breaks a block.
 */
// @ts-ignore Class inheritance allowed for native defined classes
export class BlockBreakAfterEvent extends BlockEvent {
    private constructor();
    /**
     * @remarks
     * Returns permutation information about this block before it
     * was broken.
     *
     */
    readonly brokenBlockPermutation: BlockPermutation;
    /**
     * @remarks
     * Player that broke the block for this event.
     *
     */
    readonly player: Player;
}

/**
 * @beta
 * Manages callbacks that are connected to when a block is
 * broken.
 */
// @ts-ignore Class inheritance allowed for native defined classes
export class BlockBreakAfterEventSignal extends IBlockBreakAfterEventSignal {
    private constructor();
}

/**
 * Base type for components associated with blocks.
 */
// @ts-ignore Class inheritance allowed for native defined classes
export class BlockComponent extends Component {
    private constructor();
    /**
     * @remarks
     * Block instance that this component pertains to.
     *
     */
    readonly block: Block;
}

/**
 * Contains information regarding an event that impacts a
 * specific block.
 */
export class BlockEvent {
    private constructor();
    /**
     * @remarks
     * Block impacted by this event.
     *
     */
    readonly block: Block;
    /**
     * @remarks
     * Dimension that contains the block that is the subject of
     * this event.
     *
     */
    readonly dimension: Dimension;
}

/**
 * @beta
 * Contains information regarding an explosion that has
 * occurred for a specific block.
 */
// @ts-ignore Class inheritance allowed for native defined classes
export class BlockExplodeAfterEvent extends BlockEvent {
    private constructor();
    /**
     * @remarks
     * Description of the block that has exploded.
     *
     */
    readonly explodedBlockPermutation: BlockPermutation;
    /**
     * @remarks
     * Optional source of the explosion.
     *
     */
    readonly source?: Entity;
}

/**
 * @beta
 * Manages callbacks that are connected to when an explosion
 * occurs, as it impacts individual blocks.
 */
// @ts-ignore Class inheritance allowed for native defined classes
export class BlockExplodeAfterEventSignal extends IBlockExplodeAfterEventSignal {
    private constructor();
}

/**
 * Represents the inventory of a block in the world. Used with
 * blocks like chests.
 */
// @ts-ignore Class inheritance allowed for native defined classes
export class BlockInventoryComponent extends BlockComponent {
    private constructor();
    /**
     * @remarks
     * The container which holds an {@link ItemStack}.
     *
     * @throws This property can throw when used.
     */
    readonly container: Container;
    static readonly componentId = 'minecraft:inventory';
}

/**
 * @beta
 * Represents a fluid container block that currently contains
 * lava.
 */
// @ts-ignore Class inheritance allowed for native defined classes
export class BlockLavaContainerComponent extends BlockLiquidContainerComponent {
    private constructor();
    static readonly componentId = 'minecraft:lavaContainer';
}

/**
 * @beta
 * For blocks that can contain a liquid (e.g., a cauldron),
 * this is a base component for liquid containers.
 */
// @ts-ignore Class inheritance allowed for native defined classes
export class BlockLiquidContainerComponent extends BlockComponent {
    private constructor();
    /**
     * @remarks
     * Relative fill level of the liquid container.
     *
     * This property can't be edited in read-only mode.
     *
     */
    fillLevel: number;
    isValidLiquid(): boolean;
}

/**
 * @beta
 * A BlockLocationIterator returns the next block location of
 * the block volume across which it is iterating.
 * The BlockLocationIterator is used to abstract the shape of
 * the block volume it was fetched from (so it can represent
 * all the block locations that make up rectangles, cubes,
 * spheres, lines and complex shapes).
 * Each iteration pass returns the next valid block location in
 * the parent shape.
 * Unless otherwise specified by the parent shape - the
 * BlockLocationIterator will iterate over a 3D space in the
 * order of increasing X, followed by increasing Z followed by
 * increasing Y.
 * (Effectively stepping across the XZ plane, and when all the
 * locations in that plane are exhausted, increasing the Y
 * coordinate to the next XZ slice)
 */
export class BlockLocationIterator implements Iterable<Vector3> {
    private constructor();
    /**
     * @remarks
     * This function can't be called in read-only mode.
     *
     */
    [Symbol.iterator](): Iterator<Vector3>;
    /**
     * @remarks
     * This function can't be called in read-only mode.
     *
     */
    next(): IteratorResult<Vector3>;
}

/**
 * Contains the combination of type {@link BlockType} and
 * properties (also sometimes called block state) which
 * describe a block (but does not belong to a specific {@link
 * Block}).
 */
export class BlockPermutation {
    private constructor();
    /**
     * @beta
     * @remarks
     * The {@link BlockType} that the permutation has.
     *
     */
    readonly 'type': BlockType;
    /**
     * @beta
     * @remarks
     * Creates a copy of this permutation.
     *
     * @returns
     * A copy of the permutation.
     */
    clone(): BlockPermutation;
    /**
     * @beta
     * @remarks
     * Returns all available block states associated with this
     * block.
     *
     * @returns
     * Returns the list of all of the block states that the
     * permutation has.
     */
    getAllStates(): Record<string, boolean | number | string>;
    /**
     * @beta
     * @remarks
     * Retrieves a prototype item stack based on this block
     * permutation that can be used with item
     * Container/ContainerSlot APIs.
     *
     * @param amount
     * Number of instances of this block to place in the prototype
     * item stack.
     */
    getItemStack(amount?: number): ItemStack;
    /**
     * @beta
     * @remarks
     * Gets a state for the permutation.
     *
     * @param stateName
     * Name of the block state who's value is to be returned.
     * @returns
     * Returns the state if the permutation has it, else
     * `undefined`.
     */
    getState(stateName: string): boolean | number | string | undefined;
    /**
     * @beta
     * @remarks
     * Creates a copy of the permutation.
     *
     */
    getTags(): string[];
    /**
     * @beta
     * @remarks
     * Checks to see if the permutation has a specific tag.
     *
     * @returns
     * Returns `true` if the permutation has the tag, else `false`.
     * @example check_block_tags.js
     * ```typescript
     * import { world } from "@minecraft/server";
     *
     * // Fetch the block
     * const block = world.getDimension("overworld").getBlock({ x: 1, y: 2, z: 3 });
     * const blockPerm = block.getPermutation();
     *
     * console.log(`Block is dirt: ${blockPerm.hasTag("dirt")}`);
     * console.log(`Block is wood: ${blockPerm.hasTag("wood")}`);
     * console.log(`Block is stone: ${blockPerm.hasTag("stone")}`);
     * ```
     */
    hasTag(tag: string): boolean;
    /**
     * @remarks
     * Returns a boolean whether a specified permutation matches
     * this permutation. If states is not specified, matches checks
     * against the set of types more broadly.
     *
     * @param blockName
     * An optional set of states to compare against.
     */
    matches(blockName: string, states?: Record<string, boolean | number | string>): boolean;
    /**
     * @beta
     * @remarks
     * Returns a derived BlockPermutation with a specific property
     * set.
     *
     * @param name
     * Identifier of the block property.
     * @param value
     * Value of the block property.
     * @throws This function can throw errors.
     */
    withState(name: string, value: boolean | number | string): BlockPermutation;
    /**
     * @remarks
     * Given a type identifier and an optional set of properties,
     * will return a BlockPermutation object that is usable in
     * other block APIs (e.g., block.setPermutation)
     *
     * @param blockName
     * Identifier of the block to check.
     * @throws This function can throw errors.
     * @example addBlockColorCube.ts
     * ```typescript
     *   const allColorNames: string[] = [
     *     "white",
     *     "orange",
     *     "magenta",
     *     "light_blue",
     *     "yellow",
     *     "lime",
     *     "pink",
     *     "gray",
     *     "silver",
     *     "cyan",
     *     "purple",
     *     "blue",
     *     "brown",
     *     "green",
     *     "red",
     *     "black",
     *   ];
     *
     *   const cubeDim = 7;
     *
     *   let colorIndex = 0;
     *
     *   for (let x = 0; x <= cubeDim; x++) {
     *     for (let y = 0; y <= cubeDim; y++) {
     *       for (let z = 0; z <= cubeDim; z++) {
     *         colorIndex++;
     *         overworld
     *           .getBlock({ x: targetLocation.x + x, y: targetLocation.y + y, z: targetLocation.z + z })
     *           ?.setPermutation(
     *             mc.BlockPermutation.resolve("minecraft:wool", {
     *               color: allColorNames[colorIndex % allColorNames.length],
     *             })
     *           );
     *       }
     *     }
     *   }
     * ```
     */
    static resolve(blockName: string, states?: Record<string, boolean | number | string>): BlockPermutation;
}

/**
 * @beta
 * When present, this block has piston-like behavior. Contains
 * additional properties for discovering block piston state.
 */
// @ts-ignore Class inheritance allowed for native defined classes
export class BlockPistonComponent extends BlockComponent {
    private constructor();
    /**
     * @remarks
     * Whether the piston is fully expanded.
     *
     * @throws This property can throw when used.
     */
    readonly isExpanded: boolean;
    /**
     * @remarks
     * Whether the piston is in the process of expanding.
     *
     * @throws This property can throw when used.
     */
    readonly isExpanding: boolean;
    /**
     * @remarks
     * Whether the piston is in the process of expanding or
     * retracting.
     *
     * @throws This property can throw when used.
     */
    readonly isMoving: boolean;
    /**
     * @remarks
     * Whether the piston is fully retracted.
     *
     * @throws This property can throw when used.
     */
    readonly isRetracted: boolean;
    /**
     * @remarks
     * Whether the piston is in the process of retracting.
     *
     * @throws This property can throw when used.
     */
    readonly isRetracting: boolean;
    static readonly componentId = 'minecraft:piston';
    /**
     * @remarks
     * Retrieves a set of blocks that this piston is connected
     * with.
     *
     * @throws This function can throw errors.
     */
    getAttachedBlocks(): Vector3[];
}

/**
 * @beta
 * Contains information regarding an event where a player
 * places a block.
 */
// @ts-ignore Class inheritance allowed for native defined classes
export class BlockPlaceAfterEvent extends BlockEvent {
    private constructor();
    /**
     * @remarks
     * Player that placed the block for this event.
     *
     */
    readonly player: Player;
}

/**
 * @beta
 * Manages callbacks that are connected to when a block is
 * placed.
 */
// @ts-ignore Class inheritance allowed for native defined classes
export class BlockPlaceAfterEventSignal extends IBlockPlaceAfterEventSignal {
    private constructor();
}

/**
 * @beta
 * Represents a fluid container block that currently contains a
 * potion.
 */
// @ts-ignore Class inheritance allowed for native defined classes
export class BlockPotionContainerComponent extends BlockLiquidContainerComponent {
    private constructor();
    static readonly componentId = 'minecraft:potionContainer';
    /**
     * @remarks
     * Sets the potion type based on an item stack.
     *
     * This function can't be called in read-only mode.
     *
     * @throws This function can throw errors.
     */
    setPotionType(itemStack: ItemStack): void;
}

/**
 * @beta
 * Represents a block that can play a record.
 */
// @ts-ignore Class inheritance allowed for native defined classes
export class BlockRecordPlayerComponent extends BlockComponent {
    private constructor();
    static readonly componentId = 'minecraft:recordPlayer';
    /**
     * @remarks
     * Clears the currently playing record of this record-playing
     * block.
     *
     * This function can't be called in read-only mode.
     *
     * @throws This function can throw errors.
     */
    clearRecord(): void;
    /**
     * @remarks
     * Returns true if the record-playing block is currently
     * playing a record.
     *
     * @throws This function can throw errors.
     */
    isPlaying(): boolean;
    /**
     * @remarks
     * Sets and plays a record based on an item type.
     *
     * This function can't be called in read-only mode.
     *
     * @throws This function can throw errors.
     */
    setRecord(recordItemType: ItemType): void;
}

/**
 * @beta
 * Represents a block that can display text on it.
 */
// @ts-ignore Class inheritance allowed for native defined classes
export class BlockSignComponent extends BlockComponent {
    private constructor();
    /**
     * @remarks
     * Whether or not players can edit the sign. This happens if a
     * sign has had a honeycomb used on it or `setWaxed` was called
     * on the sign.
     *
     * @throws This property can throw when used.
     */
    readonly isWaxed: boolean;
    static readonly componentId = 'minecraft:sign';
    /**
     * @remarks
     * Returns the RawText of the sign if `setText` was called with
     * a RawMessage or a RawText object, otherwise returns
     * undefined.
     *
     * @param side
     * The side of the sign to read the message from. If not
     * provided, this will return the message from the front side
     * of the sign.
     * @throws This function can throw errors.
     */
    getRawText(side?: SignSide): RawText | undefined;
    /**
     * @remarks
     * Returns the text of the sign if `setText` was called with a
     * string, otherwise returns undefined.
     *
     * @param side
     * The side of the sign to read the message from. If not
     * provided, this will return the message from the front side
     * of the sign.
     * @throws This function can throw errors.
     */
    getText(side?: SignSide): string | undefined;
    /**
     * @remarks
     * Gets the dye that is on the text or undefined if the sign
     * has not been dyed.
     *
     * @param side
     * The side of the sign to read the dye from. If not provided,
     * this will return the dye on the front side of the sign.
     * @throws This function can throw errors.
     */
    getTextDyeColor(side?: SignSide): DyeColor | undefined;
    /**
     * @remarks
     * Sets the text of the sign component.
     *
     * This function can't be called in read-only mode.
     *
     * @param message
     * The message to set on the sign. If set to a string, then
     * call `getText` to read that string. If set to a RawMessage,
     * then calling `getRawText` will return a RawText. If set to a
     * RawText, then calling `getRawText` will return the same
     * object that was passed in.
     * @param side
     * The side of the sign the message will be set on. If not
     * provided, the message will be set on the front side of the
     * sign.
     * @throws This function can throw errors.
     * @example SetRawMessage.ts
     * ```typescript
     * const helloWorldMessage: RawMessage = { text: 'Hello World' };
     * sign.setText(helloWorldMessage);
     *
     * // Sign text will be saved as a RawText
     * const result: RawText = sign.getRawText();
     * JSON.stringify(result); // { rawtext: [{ text: 'Hello World' }] };
     * ```
     * @example SetRawText.ts
     * ```typescript
     * const helloWorldText: RawText = { rawtext: [{ text: 'Hello World' }] };
     * sign.setText(helloWorldText);
     *
     * // There will be no data transformation unlike calling setText with a RawMessage
     * const result: RawText = sign.getRawText();
     * JSON.stringify(result); // { rawtext: [{ text: 'Hello World' }] };
     * ```
     * @example SetString.ts
     * ```typescript
     * // Set sign to say 'Hello'
     * sign.setText('Hello');
     * sign.getText(); // 'Hello'
     * ```
     */
    setText(message: RawMessage | RawText | string, side?: SignSide): void;
    /**
     * @remarks
     * Sets the dye color of the text.
     *
     * This function can't be called in read-only mode.
     *
     * @param color
     * The dye color to apply to the sign or undefined to clear the
     * dye on the sign.
     * @param side
     * The side of the sign the color will be set on. If not
     * provided, the color will be set on the front side of the
     * sign.
     * @throws This function can throw errors.
     */
    setTextDyeColor(color?: DyeColor, side?: SignSide): void;
    /**
     * @remarks
     * Makes it so players cannot edit this sign.
     *
     * This function can't be called in read-only mode.
     *
     * @throws This function can throw errors.
     */
    setWaxed(): void;
}

/**
 * @beta
 * Represents a fluid container block that currently contains
 * snow.
 */
// @ts-ignore Class inheritance allowed for native defined classes
export class BlockSnowContainerComponent extends BlockLiquidContainerComponent {
    private constructor();
    static readonly componentId = 'minecraft:snowContainer';
}

/**
 * @beta
 * Enumerates all {@link BlockStateType}s.
 */
export class BlockStates {
    private constructor();
    /**
     * @remarks
     * Retrieves a specific block state instance.
     *
     */
    static get(stateName: string): BlockStateType;
    /**
     * @remarks
     * Retrieves a set of all available block states.
     *
     */
    static getAll(): BlockStateType[];
}

/**
 * @beta
 * Represents a configurable state value of a block instance.
 * For example, the facing direction of stairs is accessible as
 * a block state.
 */
export class BlockStateType {
    private constructor();
    /**
     * @remarks
     * Identifier of the block property.
     *
     */
    readonly id: string;
    /**
     * @remarks
     * A set of valid values for the block property.
     *
     */
    readonly validValues: (boolean | number | string)[];
}

/**
 * @beta
 * The type (or template) of a block. Does not contain
 * permutation data (state) other than the type of block it
 * represents. This type was introduced as of version
 * 1.17.10.21.
 */
export class BlockType {
    private constructor();
    /**
     * @remarks
     * Represents whether this type of block can be waterlogged.
     *
     */
    readonly canBeWaterlogged: boolean;
    /**
     * @remarks
     * Block type name - for example, `minecraft:acacia_stairs`.
     *
     */
    readonly id: string;
}

/**
 * @beta
 * Block Volume Utils is a utility class that provides a number
 * of useful functions for the creation and utility of {@link
 * @minecraft-server.BlockVolume} objects
 */
export class BlockVolumeUtils {
    private constructor();
    /**
     * @remarks
     * Check to see if the given location is directly adjacent to
     * the outer surface of a BlockVolume.
     *
     *
     * This function can't be called in read-only mode.
     *
     * @param volume
     * The volume to test against
     * @param pos
     * The world block location to test
     * @returns
     * If the location is either inside or more than 0 blocks away,
     * the function will return false.
     * If the location is directly contacting the outer surface of
     * the BlockVolume, the function will return true.
     */
    static doesLocationTouchFaces(volume: BlockVolume, pos: Vector3): boolean;
    /**
     * @remarks
     * Check to see if a two block volumes are directly adjacent
     * and two faces touch.
     *
     * This function can't be called in read-only mode.
     *
     * @param volume
     * The volume to test against
     * @param other
     * The volume to test
     * @returns
     * If the outer faces of both block volumes touch and are
     * directly adjacent at any point, return true.
     */
    static doesVolumeTouchFaces(volume: BlockVolume, other: BlockVolume): boolean;
    /**
     * @remarks
     * Test the equality of two block volumes
     *
     * This function can't be called in read-only mode.
     *
     * @returns
     * Return true if two block volumes are identical
     */
    static equals(volume: BlockVolume, other: BlockVolume): boolean;
    /**
     * @remarks
     * Fetch a {@link BlockLocationIterator} that represents all of
     * the block world locations within the specified volume
     *
     * This function can't be called in read-only mode.
     *
     */
    static getBlockLocationIterator(volume: BlockVolume): BlockLocationIterator;
    /**
     * @remarks
     * Return a {@link BoundingBox} object which represents the
     * validated min and max coordinates of the volume
     *
     * This function can't be called in read-only mode.
     *
     */
    static getBoundingBox(volume: BlockVolume): BoundingBox;
    /**
     * @remarks
     * Return the capacity (volume) of the BlockVolume (W*D*H)
     *
     * This function can't be called in read-only mode.
     *
     */
    static getCapacity(volume: BlockVolume): number;
    /**
     * @remarks
     * Get the largest corner position of the volume (guaranteed to
     * be >= min)
     *
     * This function can't be called in read-only mode.
     *
     */
    static getMax(volume: BlockVolume): Vector3;
    /**
     * @remarks
     * Get the smallest corner position of the volume (guaranteed
     * to be <= max)
     *
     * This function can't be called in read-only mode.
     *
     */
    static getMin(volume: BlockVolume): Vector3;
    /**
     * @remarks
     * Get a {@link Vector3} object where each component represents
     * the number of blocks along that axis
     *
     * This function can't be called in read-only mode.
     *
     */
    static getSpan(volume: BlockVolume): Vector3;
    /**
     * @remarks
     * Return an enumeration which represents the intersection
     * between two BlockVolume objects
     *
     * This function can't be called in read-only mode.
     *
     */
    static intersects(volume: BlockVolume, other: BlockVolume): BlockVolumeIntersection;
    /**
     * @remarks
     * Check to see if a given world block location is inside a
     * BlockVolume
     *
     * This function can't be called in read-only mode.
     *
     */
    static isInside(volume: BlockVolume, pos: Vector3): boolean;
    /**
     * @remarks
     * Move a BlockVolume by a specified amount
     *
     * This function can't be called in read-only mode.
     *
     * @param delta
     * Amount of blocks to move by
     * @returns
     * Returns a new BlockVolume object which represents the new
     * volume
     */
    static translate(volume: BlockVolume, delta: Vector3): BlockVolume;
}

/**
 * @beta
 * Represents a fluid container block that currently contains
 * water.
 */
// @ts-ignore Class inheritance allowed for native defined classes
export class BlockWaterContainerComponent extends BlockLiquidContainerComponent {
    private constructor();
    static readonly componentId = 'minecraft:waterContainer';
    /**
     * @remarks
     * Adds an item and colors the water based on a dye item type.
     *
     * This function can't be called in read-only mode.
     *
     * @throws This function can throw errors.
     */
    addDye(itemType: ItemType): void;
    /**
     * @remarks
     * Retrieves a custom base color used for the sign text.
     *
     * @returns
     * Color that is used as the base color for sign text.
     * @throws This function can throw errors.
     */
    getCustomColor(): Color;
    /**
     * @remarks
     * Sets a custom base color used for the sign text.
     *
     * This function can't be called in read-only mode.
     *
     * @throws This function can throw errors.
     */
    setCustomColor(color: Color): void;
}

/**
 * @beta
 * Bounding Box Utils is a utility class that provides a number
 * of useful functions for the creation and utility of {@link
 * @minecraft-server.BoundingBox} objects
 */
export class BoundingBoxUtils {
    private constructor();
    /**
     * @remarks
     * Create a validated instance of a {@link
     * @minecraft-server.BoundingBox} where the min and max
     * components are guaranteed to be (min <= max)
     *
     * This function can't be called in read-only mode.
     *
     * @param min
     * A corner world location
     * @param max
     * A corner world location diametrically opposite
     */
    static createValid(min: Vector3, max: Vector3): BoundingBox;
    /**
     * @remarks
     * Expand a {@link @minecraft-server.BoundingBox} by a given
     * amount along each axis.
     * Sizes can be negative to perform contraction.
     * Note: corners can be inverted if the contraction size is
     * greater than the span, but the min/max relationship will
     * remain correct
     *
     * This function can't be called in read-only mode.
     *
     * @returns
     * Return a new {@link @minecraft-server.BoundingBox} object
     * representing the changes
     */
    static dilate(box: BoundingBox, size: Vector3): BoundingBox;
    /**
     * @remarks
     * Check if two {@link @minecraft-server.BoundingBox} objects
     * are identical
     *
     * This function can't be called in read-only mode.
     *
     */
    static equals(box: BoundingBox, other: BoundingBox): boolean;
    /**
     * @remarks
     * Expand the initial box object bounds to include the 2nd box
     * argument.  The resultant {@link
     * @minecraft-server.BoundingBox} object will be a BoundingBox
     * which exactly encompasses the two boxes.
     *
     * This function can't be called in read-only mode.
     *
     * @returns
     * A new {@link @minecraft-server.BoundingBox} instance
     * representing the smallest possible bounding box which can
     * encompass both
     */
    static expand(box: BoundingBox, other: BoundingBox): BoundingBox;
    /**
     * @remarks
     * Calculate the center block of a given {@link
     * @minecraft-server.BoundingBox} object.
     *
     * This function can't be called in read-only mode.
     *
     * @returns
     * Note that {@link @minecraft-server.BoundingBox} objects
     * represent whole blocks, so the center of boxes which have
     * odd numbered bounds are not mathematically centered...
     * i.e. a BoundingBox( 0,0,0 -> 3,3,3 )  would have a center of
     * (1,1,1)  (not (1.5, 1.5, 1.5) as expected)
     */
    static getCenter(box: BoundingBox): Vector3;
    /**
     * @remarks
     * Calculate the BoundingBox which represents the union area of
     * two intersecting BoundingBoxes
     *
     * This function can't be called in read-only mode.
     *
     */
    static getIntersection(box: BoundingBox, other: BoundingBox): BoundingBox | undefined;
    /**
     * @remarks
     * Get the Span of each of the BoundingBox Axis components
     *
     * This function can't be called in read-only mode.
     *
     */
    static getSpan(box: BoundingBox): Vector3;
    /**
     * @remarks
     * Check to see if two BoundingBox objects intersect
     *
     * This function can't be called in read-only mode.
     *
     */
    static intersects(box: BoundingBox, other: BoundingBox): boolean;
    /**
     * @remarks
     * Check to see if a given coordinate is inside a BoundingBox
     *
     * This function can't be called in read-only mode.
     *
     */
    static isInside(box: BoundingBox, pos: Vector3): boolean;
    /**
     * @remarks
     * Check to see if a BoundingBox is valid (i.e. (min <= max))
     *
     * This function can't be called in read-only mode.
     *
     */
    static isValid(box: BoundingBox): boolean;
    /**
     * @remarks
     * Move a BoundingBox by a given amount
     *
     * This function can't be called in read-only mode.
     *
     * @returns
     * Return a new BoundingBox object which represents the change
     */
    static translate(box: BoundingBox, delta: Vector3): BoundingBox;
}

/**
 * Contains information related to changes to a button push.
 */
// @ts-ignore Class inheritance allowed for native defined classes
export class ButtonPushAfterEvent extends BlockEvent {
    private constructor();
    /**
     * @remarks
     * Optional source that triggered the button push.
     *
     */
    readonly source: Entity;
}

/**
 * Manages callbacks that are connected to when a button is
 * pushed.
 */
// @ts-ignore Class inheritance allowed for native defined classes
export class ButtonPushAfterEventSignal extends IButtonPushAfterEventSignal {
    private constructor();
}

/**
 * @beta
 * An event that fires as players enter chat messages.
 */
export class ChatSendAfterEvent {
    private constructor();
    /**
     * @remarks
     * Message that is being broadcast. In a beforeChat event
     * handler, _message_ can be updated with edits before the
     * message is displayed to players.
     *
     */
    message: string;
    /**
     * @remarks
     * Player that sent the chat message.
     *
     */
    sender: Player;
    /**
     * @remarks
     * If true, this message is directly targeted to one or more
     * players (i.e., is not broadcast.)
     *
     */
    sendToTargets: boolean;
    /**
     * @remarks
     * List of players that will receive this message.
     *
     * @returns
     * List of player objects.
     */
    getTargets(): Player[];
}

/**
 * @beta
 * Manages callbacks that are connected to chat messages being
 * sent.
 */
// @ts-ignore Class inheritance allowed for native defined classes
export class ChatSendAfterEventSignal extends IChatSendAfterEventSignal {
    private constructor();
}

/**
 * @beta
 * An event that fires as players enter chat messages.
 */
// @ts-ignore Class inheritance allowed for native defined classes
export class ChatSendBeforeEvent extends ChatSendAfterEvent {
    private constructor();
    /**
     * @remarks
     * If set to true in a beforeChat event handler, this message
     * is not broadcast out.
     *
     */
    cancel: boolean;
    /**
     * @remarks
     * Sets an updated list of players that will receive this
     * message.
     *
     * @param players
     * Updated array of players that should receive this message.
     */
    setTargets(players: Player[]): void;
}

/**
 * @beta
 * Manages callbacks that are connected to an event that fires
 * before chat messages are sent.
 */
// @ts-ignore Class inheritance allowed for native defined classes
export class ChatSendBeforeEventSignal extends IChatSendBeforeEventSignal {
    private constructor();
}

/**
 * Contains return data on the result of a command execution.
 */
export class CommandResult {
    private constructor();
    /**
     * @remarks
     * If the command operates against a number of entities,
     * blocks, or items, this returns the number of successful
     * applications of this command.
     *
     */
    readonly successCount: number;
}

/**
 * Base class for downstream Component implementations.
 */
export class Component {
    private constructor();
    /**
     * @remarks
     * Identifier of the component.
     *
     */
    readonly typeId: string;
    /**
     * @beta
     * @remarks
     * Returns whether the component is valid. A component is
     * considered valid if its owner is valid, in addition to any
     * addition to any additional validation required by the
     * component.
     *
     * @returns
     * Whether the component is valid.
     */
    isValid(): boolean;
}

/**
 * @beta
 * The Compound Block Volume is a collection of individual
 * block volume definitions which, as a collection, define a
 * larger volume of (sometimes non-contiguous) irregular
 * shapes.
 * This class is loosely based on the concept of CSG
 * (Computational Solid Geometry) and allows a user to create
 * complex volumes by building a stack of volumes and voids to
 * make a larger single volume.
 * For example - normally a creator would create a hollow cube
 * by creating 6 "wall" surfaces for each face.
 * With a Compound Block Volume, a creator can define a hollow
 * cube by creating a single outer solid cube, and then
 * defining a further single 'void' cube inside the larger one.
 * Similarly, the Compound Block Volume can represent irregular
 * shaped volumes (e.g. a tree consists of a trunk and lots of
 * leaf cubes which are not necessarily contiguously placed)
 */
export class CompoundBlockVolume {
    /**
     * @remarks
     * Return the 'capacity' of the bounding rectangle which
     * represents the collection of volumes in the stack
     *
     */
    readonly capacity: number;
    /**
     * @remarks
     * Return the number of volumes (positive and negative) in the
     * volume stack
     *
     */
    readonly volumeCount: number;
    /**
     * @remarks
     * Clear the contents of the volume stack
     *
     * This function can't be called in read-only mode.
     *
     */
    clear(): void;
    /**
     * @remarks
     * Fetch a Block Location Iterator for the Compound Block
     * Volume.  This iterator will allow a creator to iterate
     * across all of the selected volumes within the larger
     * bounding area.
     * Areas of a volume which have been overridden by a
     * subtractive volume will not be included in the iterator
     * step.
     * (i.e. if you push a cube to the stack, and then push a
     * subtractive volume to the same location, then the iterator
     * will step over the initial volume because it is considered
     * negative space)
     *
     *
     * This function can't be called in read-only mode.
     *
     */
    getBlockLocationIterator(): BlockLocationIterator;
    /**
     * @remarks
     * Get the largest bounding box that represents a container for
     * all of the volumes on the stack
     *
     * This function can't be called in read-only mode.
     *
     */
    getBoundingBox(): BoundingBox;
    /**
     * @remarks
     * Get the max block location of the outermost bounding
     * rectangle which represents the volumes on the stack
     *
     * This function can't be called in read-only mode.
     *
     */
    getMax(): Vector3;
    /**
     * @remarks
     * Get the min block location of the outermost bounding
     * rectangle which represents the volumes on the stack
     *
     * This function can't be called in read-only mode.
     *
     */
    getMin(): Vector3;
    /**
     * @remarks
     * Return a boolean representing whether or not a given block
     * location is inside a positive block volume.
     * E.g. if the stack contains a large cube followed by a
     * slightly smaller negative cube, and the test location is
     * within the negative cube - the function will return false
     * because it's not 'inside' a volume (it IS inside the
     * bounding rectangle, but it is not inside a positively
     * defined location)
     *
     * This function can't be called in read-only mode.
     *
     * @param delta
     * block location to test
     */
    isInside(delta: Vector3): boolean;
    /**
     * @remarks
     * Inspect the last entry pushed to the volume stack without
     * affecting the stack contents
     *
     * This function can't be called in read-only mode.
     *
     * @returns
     * Returns undefined if the stack is empty
     */
    peekLastVolume(): CompoundBlockVolumeItem | undefined;
    /**
     * @remarks
     * Remove the last entry from the volume stack.  This will
     * reduce the stack size by one
     *
     * This function can't be called in read-only mode.
     *
     */
    popVolume(): boolean;
    /**
     * @remarks
     * Push a volume item to the stack.  The volume item contains
     * an 'action' parameter which determines whether this volume
     * is a positive or negative space
     *
     * This function can't be called in read-only mode.
     *
     * @param item
     * Item to push to the end of the stack
     */
    pushVolume(item: CompoundBlockVolumeItem): void;
    /**
     * @remarks
     * If the volume stack is empty, this function will push the
     * specified item to the stack.
     * If the volume stack is NOT empty, this function will replace
     * the last item on the stack with the new item.
     *
     * This function can't be called in read-only mode.
     *
     * @param item
     * Item to add or replace
     */
    replaceOrAddLastVolume(item: CompoundBlockVolumeItem): boolean;
    /**
     * @remarks
     * Move the root block location of the volume by a given
     * amount.  This effectively adds the specified delta to the
     * block location of all of the volumes in the stack
     *
     * This function can't be called in read-only mode.
     *
     * @param delta
     * Amount to move
     */
    translate(delta: Vector3): void;
}

/**
 * Represents a container that can hold sets of items. Used
 * with entities such as Players, Chest Minecarts, Llamas, and
 * more.
 */
export class Container {
    private constructor();
    /**
     * @remarks
     * Count of the slots in the container that are empty.
     *
     * @throws
     * Throws if the container is invalid.
     */
    readonly emptySlotsCount: number;
    /**
     * @remarks
     * The number of slots in this container. For example, a
     * standard single-block chest has a size of 27. Note, a
     * player's inventory container contains a total of 36 slots, 9
     * hotbar slots plus 27 inventory slots.
     *
     * @throws
     * Throws if the container is invalid.
     */
    readonly size: number;
    /**
     * @remarks
     * Adds an item to the container. The item is placed in the
     * first available slot(s) and can be stacked with existing
     * items of the same type. Note, use {@link Container.setItem}
     * if you wish to set the item in a particular slot.
     *
     * This function can't be called in read-only mode.
     *
     * @param itemStack
     * The stack of items to add.
     * @throws This function can throw errors.
     */
    addItem(itemStack: ItemStack): ItemStack;
    /**
     * @remarks
     * Clears all inventory items in the container.
     *
     * This function can't be called in read-only mode.
     *
     * @throws
     * Throws if the container is invalid.
     */
    clearAll(): void;
    /**
     * @remarks
     * Gets an {@link ItemStack} of the item at the specified slot.
     * If the slot is empty, returns `undefined`. This method does
     * not change or clear the contents of the specified slot. To
     * get a reference to a particular slot, see {@link
     * Container.getSlot}.
     *
     * @param slot
     * Zero-based index of the slot to retrieve items from.
     * @throws
     * Throws if the container is invalid or if the `slot` index is
     * out of bounds.
     * @example getItem.ts
     * ```typescript
     * // Get a copy of the first item in the player's hotbar
     * const inventory = player.getComponent("inventory") as EntityInventoryComponent;
     * const itemStack = inventory.container.getItem(0);
     * ```
     */
    getItem(slot: number): ItemStack | undefined;
    /**
     * @beta
     * @remarks
     * Returns a container slot. This acts as a reference to a slot
     * at the given index for this container.
     *
     * @param slot
     * The index of the slot to return. This index must be within
     * the bounds of the container.
     * @throws
     * Throws if the container is invalid or if the `slot` index is
     * out of bounds.
     */
    getSlot(slot: number): ContainerSlot;
    /**
     * @beta
     * @remarks
     * Returns whether a container object (or the entity or block
     * that this container is associated with) is still available
     * for use in this context.
     *
     */
    isValid(): boolean;
    /**
     * @remarks
     * Moves an item from one slot to another, potentially across
     * containers.
     *
     * This function can't be called in read-only mode.
     *
     * @param fromSlot
     * Zero-based index of the slot to transfer an item from, on
     * this container.
     * @param toSlot
     * Zero-based index of the slot to transfer an item to, on
     * `toContainer`.
     * @param toContainer
     * Target container to transfer to. Note this can be the same
     * container as the source.
     * @throws
     * Throws if either this container or `toContainer` are invalid
     * or if the `fromSlot` or `toSlot` indices out of bounds.
     * @example moveItem.ts
     * ```typescript
     * // Move an item from the first slot of fromPlayer's inventory to the fifth slot of toPlayer's inventory
     * const fromInventory = fromPlayer.getComponent('inventory') as EntityInventoryComponent;
     * const toInventory = toPlayer.getComponent('inventory') as EntityInventoryComponent;
     * fromInventory.container.moveItem(0, 4, toInventory.container);
     * ```
     */
    moveItem(fromSlot: number, toSlot: number, toContainer: Container): void;
    /**
     * @remarks
     * Sets an item stack within a particular slot.
     *
     * This function can't be called in read-only mode.
     *
     * @param slot
     * Zero-based index of the slot to set an item at.
     * @param itemStack
     * Stack of items to place within the specified slot. Setting
     * `itemStack` to undefined will clear the slot.
     * @throws
     * Throws if the container is invalid or if the `slot` index is
     * out of bounds.
     */
    setItem(slot: number, itemStack?: ItemStack): void;
    /**
     * @remarks
     * Swaps items between two different slots within containers.
     *
     * This function can't be called in read-only mode.
     *
     * @param slot
     * Zero-based index of the slot to swap from this container.
     * @param otherSlot
     * Zero-based index of the slot to swap with.
     * @param otherContainer
     * Target container to swap with. Note this can be the same
     * container as this source.
     * @throws
     * Throws if either this container or `otherContainer` are
     * invalid or if the `slot` or `otherSlot` are out of bounds.
     * @example swapItems.ts
     * ```typescript
     * // Swaps an item between slots 0 and 4 in the player's inventory
     * const inventory = fromPlayer.getComponent('inventory') as EntityInventoryComponent;
     * inventory.container.swapItems(0, 4, inventory);
     * ```
     */
    swapItems(slot: number, otherSlot: number, otherContainer: Container): void;
    /**
     * @remarks
     * Moves an item from one slot to another container, or to the
     * first available slot in the same container.
     *
     * This function can't be called in read-only mode.
     *
     * @param fromSlot
     * Zero-based index of the slot to transfer an item from, on
     * this container.
     * @param toContainer
     * Target container to transfer to. Note this can be the same
     * container as the source.
     * @throws
     * Throws if either this container or `toContainer` are invalid
     * or if the `fromSlot` or `toSlot` indices out of bounds.
     * @example transferItem.ts
     * ```typescript
     * // Transfer an item from the first slot of fromPlayer's inventory to toPlayer's inventory
     * const fromInventory = fromPlayer.getComponent('inventory') as EntityInventoryComponent;
     * const toInventory = toPlayer.getComponent('inventory') as EntityInventoryComponent;
     * fromInventory.container.transferItem(0, toInventory.container);
     * ```
     */
    transferItem(fromSlot: number, toContainer: Container): ItemStack;
}

/**
 * @beta
 * Represents a slot within a broader container (e.g., entity
 * inventory.)
 */
export class ContainerSlot {
    private constructor();
    /**
     * @remarks
     * Number of the items in the stack. Valid values range between
     * 1-255. The provided value will be clamped to the item's
     * maximum stack size.
     *
     * This property can't be edited in read-only mode.
     *
     * @throws
     * Throws if the value is outside the range of 1-255.
     */
    amount: number;
    /**
     * @remarks
     * Returns whether the item is stackable. An item is considered
     * stackable if the item's maximum stack size is greater than 1
     * and the item does not contain any custom data or properties.
     *
     * @throws
     * Throws if the slot's container is invalid.
     */
    readonly isStackable: boolean;
    /**
     * @remarks
     * Gets or sets whether the item is kept on death.
     *
     * This property can't be edited in read-only mode.
     *
     * @throws
     * Throws if the slot's container is invalid.
     */
    keepOnDeath: boolean;
    /**
     * @remarks
     * Gets or sets the item's lock mode. The default value is
     * `ItemLockMode.none`.
     *
     * This property can't be edited in read-only mode.
     *
     * @throws
     * Throws if the slot's container is invalid.
     */
    lockMode: ItemLockMode;
    /**
     * @remarks
     * The maximum stack size. This value varies depending on the
     * type of item. For example, torches have a maximum stack size
     * of 64, while eggs have a maximum stack size of 16.
     *
     * @throws
     * Throws if the slot's container is invalid.
     */
    readonly maxAmount: number;
    /**
     * @remarks
     * Given name of this stack of items. The name tag is displayed
     * when hovering over the item. Setting the name tag to an
     * empty string or `undefined` will remove the name tag.
     *
     * This property can't be edited in read-only mode.
     *
     * @throws
     * Throws if the slot's container is invalid. Also throws if
     * the length exceeds 255 characters.
     */
    nameTag?: string;
    /**
     * @remarks
     * The type of the item.
     *
     * @throws
     * Throws if the slot's container is invalid.
     */
    readonly 'type': ItemType;
    /**
     * @remarks
     * Identifier of the type of items for the stack. If a
     * namespace is not specified, 'minecraft:' is assumed.
     * Examples include 'wheat' or 'apple'.
     *
     * @throws
     * Throws if the slot's container is invalid.
     */
    readonly typeId?: string;
    /**
     * @remarks
     * Creates an exact copy of the item stack, including any
     * custom data or properties.
     *
     * @returns
     * Returns a copy of the item in the slot. Returns undefined if
     * the slot is empty.
     * @throws This function can throw errors.
     */
    getItem(): ItemStack | undefined;
    /**
     * @remarks
     * Returns the lore value - a secondary display string - for an
     * ItemStack.
     *
     * @returns
     * An array of lore strings. If the item does not have lore,
     * returns an empty array.
     * @throws
     * Throws if the slot's container is invalid.
     */
    getLore(): string[];
    /**
     * @remarks
     * Returns all tags for the item in the slot.
     *
     * @returns
     * Returns all tags for the item in the slot. Return an empty
     * array if the the slot is empty.
     * @throws This function can throw errors.
     */
    getTags(): string[];
    /**
     * @remarks
     * Returns whether the item in the slot slot has the given tag.
     *
     * @param tag
     * The item tag.
     * @returns
     * Returns false when the slot is empty or the item in the slot
     * does not have the given tag.
     * @throws This function can throw errors.
     */
    hasTag(tag: string): boolean;
    /**
     * @remarks
     * Returns whether this item stack can be stacked with the
     * given `itemStack`. This is determined by comparing the item
     * type and any custom data and properties associated with the
     * item stacks. The amount of each item stack is not taken into
     * consideration.
     *
     * @param itemStack
     * The ItemStack that is being compared.
     * @returns
     * Returns whether this item stack can be stacked with the
     * given `itemStack`.
     * @throws
     * Throws if the slot's container is invalid.
     */
    isStackableWith(itemStack: ItemStack): boolean;
    /**
     * @remarks
     * Returns whether the ContainerSlot is valid. The container
     * slot is valid if the container exists and is loaded, and the
     * slot index is valid.
     *
     */
    isValid(): boolean;
    /**
     * @remarks
     * The list of block types this item can break in Adventure
     * mode. The block names are displayed in the item's tooltip.
     * Setting the value to undefined will clear the list.
     *
     * This function can't be called in read-only mode.
     *
     * @param blockIdentifiers
     * The list of blocks, given by their identifiers.
     * @throws
     * Throws if the slot's container is invalid. Also throws if
     * any of the provided block identifiers are invalid.
     */
    setCanDestroy(blockIdentifiers?: string[]): void;
    /**
     * @remarks
     * The list of block types this item can be placed on in
     * Adventure mode. This is only applicable to block items. The
     * block names are displayed in the item's tooltip. Setting the
     * value to undefined will clear the list.
     *
     * This function can't be called in read-only mode.
     *
     * @param blockIdentifiers
     * The list of blocks, given by their identifiers.
     * @throws
     * Throws if the slot's container is invalid. Also throws if
     * any of the provided block identifiers are invalid.
     */
    setCanPlaceOn(blockIdentifiers?: string[]): void;
    /**
     * @remarks
     * Sets the given ItemStack in the slot, replacing any existing
     * item.
     *
     * This function can't be called in read-only mode.
     *
     * @param itemStack
     * The ItemStack to be placed in the slot.
     * @throws This function can throw errors.
     */
    setItem(itemStack?: ItemStack): void;
    /**
     * @remarks
     * Sets the lore value - a secondary display string - for an
     * ItemStack.
     *
     * This function can't be called in read-only mode.
     *
     * @param loreList
     * A list of lore strings. Setting this argument to undefined
     * will clear the lore.
     * @throws
     * Throws if the slot's container is invalid.
     */
    setLore(loreList?: string[]): void;
}

/**
 * @beta
 * Contains information related to firing of a data driven
 * entity event - for example, the minecraft:ageable_grow_up
 * event on a chicken.
 */
export class DataDrivenEntityTriggerAfterEvent {
    private constructor();
    /**
     * @remarks
     * Entity that the event triggered on.
     *
     */
    readonly entity: Entity;
    /**
     * @remarks
     * Name of the data driven event being triggered.
     *
     */
    readonly id: string;
    /**
     * @remarks
     * An updateable list of modifications to component state that
     * are the effect of this triggered event.
     *
     * This function can't be called in read-only mode.
     *
     */
    getModifiers(): DefinitionModifier[];
}

/**
 * @beta
 * Contains event registration related to firing of a data
 * driven entity event - for example, the
 * minecraft:ageable_grow_up event on a chicken.
 */
// @ts-ignore Class inheritance allowed for native defined classes
export class DataDrivenEntityTriggerAfterEventSignal extends IDataDrivenEntityTriggerAfterEventSignal {
    private constructor();
}

/**
 * @beta
 * Contains information related to firing of a data driven
 * entity event - for example, the minecraft:ageable_grow_up
 * event on a chicken.
 */
export class DataDrivenEntityTriggerBeforeEvent {
    private constructor();
    /**
     * @remarks
     * If set to true, this entity event is not triggered.
     *
     */
    cancel: boolean;
    /**
     * @remarks
     * Entity that the event triggered on.
     *
     */
    readonly entity: Entity;
    /**
     * @remarks
     * Name of the data driven event being triggered.
     *
     */
    readonly id: string;
    /**
     * @remarks
     * An updateable list of modifications to component state that
     * are the effect of this triggered event.
     *
     */
    getModifiers(): DefinitionModifier[];
    /**
     * @remarks
     * Changes a list of modifications to component state that are
     * the effect of this triggered event.
     *
     * @param modifiers
     * An updated list of modifications to component state.
     */
    setModifiers(modifiers: DefinitionModifier[]): void;
}

/**
 * @beta
 * Contains information related to firing of a data driven
 * entity event - for example, the minecraft:ageable_grow_up
 * event on a chicken.
 */
// @ts-ignore Class inheritance allowed for native defined classes
export class DataDrivenEntityTriggerBeforeEventSignal extends IDataDrivenEntityTriggerBeforeEventSignal {
    private constructor();
}

/**
 * @beta
 * Contains a set of updates to the component definition state
 * of an entity.
 */
export class DefinitionModifier {
    /**
     * @remarks
     * Retrieves the list of component groups that will be added
     * via this definition modification.
     *
     */
    getComponentGroupsToAdd(): string[];
    /**
     * @remarks
     * Retrieves the list of component groups that will be removed
     * via this definition modification.
     *
     */
    getComponentGroupsToRemove(): string[];
    /**
     * @remarks
     * Retrieves the list of entity definition events that will be
     * fired via this update.
     *
     */
    getTriggers(): Trigger[];
    /**
     * @remarks
     * Updates the list of component groups that will be added via
     * this definition modification.
     *
     */
    setComponentGroupsToAdd(newGroups: string[]): void;
    /**
     * @remarks
     * Updates the list of component groups that will be removed
     * via this definition modification.
     *
     */
    setComponentGroupsToRemove(removedGroups: string[]): void;
    /**
     * @remarks
     * Updates the list of entity definition events that will be
     * fired via this update.
     *
     */
    setTriggers(newTriggers: Trigger[]): void;
}

/**
 * A class that represents a particular dimension (e.g., The
 * End) within a world.
 */
export class Dimension {
    private constructor();
    /**
     * @remarks
     * Identifier of the dimension.
     *
     * @throws This property can throw when used.
     */
    readonly id: string;
    /**
     * @beta
     * @remarks
     * Creates an explosion at the specified location.
     *
     * This function can't be called in read-only mode.
     *
     * @param location
     * The location of the explosion.
     * @param radius
     * Radius, in blocks, of the explosion to create.
     * @param explosionOptions
     * Additional configurable options for the explosion.
     * @throws This function can throw errors.
     * @example createExplosion.ts
     * ```typescript
     *   const overworld = mc.world.getDimension("overworld");
     *
     *   log("Creating an explosion of radius 10.");
     *   overworld.createExplosion(targetLocation, 10);
     * ```
     * @example createFireAndWaterExplosions.ts
     * ```typescript
     *   const overworld = mc.world.getDimension("overworld");
     *
     *   const explosionLoc = { x: targetLocation.x + 0.5, y: targetLocation.y + 0.5, z: targetLocation.z + 0.5};
     *
     *   log("Creating an explosion of radius 15 that causes fire.");
     *   overworld.createExplosion(explosionLoc, 15, { causesFire: true });
     *
     *   const belowWaterLoc = { x: targetLocation.x + 3, y: targetLocation.y + 1,z: targetLocation.z + 3};
     *
     *   log("Creating an explosion of radius 10 that can go underwater.");
     *   overworld.createExplosion(belowWaterLoc, 10, { allowUnderwater: true });
     * ```
     * @example createNoBlockExplosion.ts
     * ```typescript
     *   const overworld = mc.world.getDimension("overworld");
     *
     *   const explodeNoBlocksLoc = {
     *     x: Math.floor(targetLocation.x + 1),
     *     y: Math.floor(targetLocation.y + 2),
     *     z: Math.floor(targetLocation.z + 1)
     *   };
     *
     *   log("Creating an explosion of radius 15 that does not break blocks.");
     *   overworld.createExplosion(explodeNoBlocksLoc, 15, { breaksBlocks: false });
     * ```
     */
    createExplosion(location: Vector3, radius: number, explosionOptions?: ExplosionOptions): void;
    /**
     * @beta
     * @remarks
     * Fills an area between begin and end with block of type
     * block.
     *
     * This function can't be called in read-only mode.
     *
     * @param begin
     * The lower northwest starting corner of the area.
     * @param end
     * The upper southeast ending corner of the area.
     * @param block
     * Type of block to fill the volume with.
     * @param options
     * A set of additional options, such as a matching block to
     * potentially replace this fill block with.
     * @returns
     *  Returns number of blocks placed.
     * @throws This function can throw errors.
     */
    fillBlocks(begin: Vector3, end: Vector3, block: BlockPermutation | BlockType, options?: BlockFillOptions): number;
    /**
     * @remarks
     * Returns a block instance at the given location.
     *
     * @param location
     * The location at which to return a block.
     * @returns
     * Block at the specified location, or 'undefined' if asking
     * for a block at an unloaded chunk.
     * @throws
     * PositionInUnloadedChunkError: Exception thrown when trying
     * to interact with a Block object that isn't in a loaded and
     * ticking chunk anymore
     *
     * PositionOutOfWorldBoundariesError: Exception thrown when
     * trying to interact with a position outside of dimension
     * height range
     *
     */
    getBlock(location: Vector3): Block | undefined;
    /**
     * @beta
     * @remarks
     * Gets the first block that intersects with a vector emanating
     * from a location.
     *
     * @param location
     * Location from where to initiate the ray check.
     * @param direction
     * Vector direction to cast the ray.
     * @param options
     * Additional options for processing this raycast query.
     */
    getBlockFromRay(location: Vector3, direction: Vector3, options?: BlockRaycastOptions): BlockRaycastHit | undefined;
    /**
     * @remarks
     * Returns a set of entities based on a set of conditions
     * defined via the EntityQueryOptions set of filter criteria.
     *
     * @param options
     * Additional options that can be used to filter the set of
     * entities returned.
     * @returns
     * An entity array.
     * @throws This function can throw errors.
     * @example bounceSkeletons.ts
     * ```typescript
     *   let mobs = ["creeper", "skeleton", "sheep"];
     *
     *   // create some sample mob data
     *   for (let i = 0; i < 10; i++) {
     *     overworld.spawnEntity(mobs[i % mobs.length], targetLocation);
     *   }
     *
     *   let eqo: mc.EntityQueryOptions = {
     *     type: "skeleton",
     *   };
     *
     *   for (let entity of overworld.getEntities(eqo)) {
     *     entity.applyKnockback(0, 0, 0, 1);
     *   }
     * ```
     * @example tagsQuery.ts
     * ```typescript
     *   let mobs = ["creeper", "skeleton", "sheep"];
     *
     *   // create some sample mob data
     *   for (let i = 0; i < 10; i++) {
     *     let mobTypeId = mobs[i % mobs.length];
     *     let entity = overworld.spawnEntity(mobTypeId, targetLocation);
     *     entity.addTag("mobparty." + mobTypeId);
     *   }
     *
     *   let eqo: mc.EntityQueryOptions = {
     *     tags: ["mobparty.skeleton"],
     *   };
     *
     *   for (let entity of overworld.getEntities(eqo)) {
     *     entity.kill();
     *   }
     * ```
     * @example testThatEntityIsFeatherItem.ts
     * ```typescript
     *   const overworld = mc.world.getDimension("overworld");
     *
     *   const items = overworld.getEntities({
     *     location: targetLocation,
     *     maxDistance: 20,
     *   });
     *
     *   for (const item of items) {
     *     const itemComp = item.getComponent("item") as mc.EntityItemComponent;
     *
     *     if (itemComp) {
     *       if (itemComp.itemStack.typeId.endsWith("feather")) {
     *         log("Success! Found a feather", 1);
     *       }
     *     }
     *   }
     * ```
     */
    getEntities(options?: EntityQueryOptions): Entity[];
    /**
     * @remarks
     * Returns a set of entities at a particular location.
     *
     * @param location
     * The location at which to return entities.
     * @returns
     * Zero or more entities at the specified location.
     */
    getEntitiesAtBlockLocation(location: Vector3): Entity[];
    /**
     * @beta
     * @remarks
     * Gets entities that intersect with a specified vector
     * emanating from a location.
     *
     * @param options
     * Additional options for processing this raycast query.
     */
    getEntitiesFromRay(location: Vector3, direction: Vector3, options?: EntityRaycastOptions): EntityRaycastHit[];
    /**
     * @remarks
     * Returns a set of players based on a set of conditions
     * defined via the EntityQueryOptions set of filter criteria.
     *
     * @param options
     * Additional options that can be used to filter the set of
     * players returned.
     * @returns
     * A player array.
     * @throws This function can throw errors.
     */
    getPlayers(options?: EntityQueryOptions): Player[];
    /**
     * @remarks
     * Runs a command synchronously using the context of the
     * broader dimenion.
     *
     * This function can't be called in read-only mode.
     *
     * @param commandString
     * Command to run. Note that command strings should not start
     * with slash.
     * @returns
     * Returns a command result with a count of successful values
     * from the command.
     * @throws
     * Throws an exception if the command fails due to incorrect
     * parameters or command syntax, or in erroneous cases for the
     * command. Note that in many cases, if the command does not
     * operate (e.g., a target selector found no matches), this
     * method will not throw an exception.
     */
    runCommand(commandString: string): CommandResult;
    /**
     * @remarks
     * Runs a particular command asynchronously from the context of
     * the broader dimension.  Note that there is a maximum queue
     * of 128 asynchronous commands that can be run in a given
     * tick.
     *
     * @param commandString
     * Command to run. Note that command strings should not start
     * with slash.
     * @returns
     * For commands that return data, returns a CommandResult with
     * an indicator of command results.
     * @throws
     * Throws an exception if the command fails due to incorrect
     * parameters or command syntax, or in erroneous cases for the
     * command. Note that in many cases, if the command does not
     * operate (e.g., a target selector found no matches), this
     * method will not throw an exception.
     */
    runCommandAsync(commandString: string): Promise<CommandResult>;
    /**
     * @beta
     * @remarks
     * Sets the current weather within the dimesion
     *
     * This function can't be called in read-only mode.
     *
     * @param weatherType
     * Set of weather to apply.
     */
    setWeather(weatherType: WeatherType): void;
    /**
     * @remarks
     * Creates a new entity (e.g., a mob) at the specified
     * location.
     *
     * This function can't be called in read-only mode.
     *
     * @param identifier
     * Identifier of the type of entity to spawn. If no namespace
     * is specified, 'minecraft:' is assumed.
     * @param location
     * The location at which to create the entity.
     * @returns
     * Newly created entity at the specified location.
     * @throws This function can throw errors.
     * @example createOldHorse.ts
     * ```typescript
     *   const overworld = mc.world.getDimension("overworld");
     *
     *   log("Create a horse and triggering the 'ageable_grow_up' event, ensuring the horse is created as an adult");
     *   overworld.spawnEntity("minecraft:horse<minecraft:ageable_grow_up>", targetLocation);
     * ```
     * @example quickFoxLazyDog.ts
     * ```typescript
     *   const overworld = mc.world.getDimension("overworld");
     *
     *   const fox = overworld.spawnEntity("minecraft:fox", {
     *     x: targetLocation.x + 1,
     *     y: targetLocation.y + 2,
     *     z: targetLocation.z + 3,
     *   });
     *
     *   fox.addEffect("speed", 10, {
     *     amplifier: 2,
     *   });
     *   log("Created a fox.");
     *
     *   const wolf = overworld.spawnEntity("minecraft:wolf", {
     *     x: targetLocation.x + 4,
     *     y: targetLocation.y + 2,
     *     z: targetLocation.z + 3,
     *   });
     *   wolf.addEffect("slowness", 10, {
     *     amplifier: 2,
     *   });
     *   wolf.isSneaking = true;
     *   log("Created a sneaking wolf.", 1);
     * ```
     * @example triggerEvent.ts
     * ```typescript
     *   const creeper = overworld.spawnEntity("minecraft:creeper", targetLocation);
     *
     *   creeper.triggerEvent("minecraft:start_exploding_forced");
     * ```
     */
    spawnEntity(identifier: string, location: Vector3): Entity;
    /**
     * @remarks
     * Creates a new item stack as an entity at the specified
     * location.
     *
     * This function can't be called in read-only mode.
     *
     * @param location
     * The location at which to create the item stack.
     * @returns
     * Newly created item stack entity at the specified location.
     * @throws This function can throw errors.
     * @example itemStacks.ts
     * ```typescript
     * const overworld = mc.world.getDimension('overworld');
     *
     * const oneItemLoc = { x: targetLocation.x + targetLocation.y + 3, y: 2, z: targetLocation.z + 1 };
     * const fiveItemsLoc = { x: targetLocation.x + 1, y: targetLocation.y + 2, z: targetLocation.z + 1 };
     * const diamondPickaxeLoc = { x: targetLocation.x + 2, y: targetLocation.y + 2, z: targetLocation.z + 4 };
     *
     * const oneEmerald = new mc.ItemStack(mc.MinecraftItemTypes.Emerald, 1);
     * const onePickaxe = new mc.ItemStack(mc.MinecraftItemTypes.DiamondPickaxe, 1);
     * const fiveEmeralds = new mc.ItemStack(mc.MinecraftItemTypes.Emerald, 5);
     *
     * log(`Spawning an emerald at (${oneItemLoc.x}, ${oneItemLoc.y}, ${oneItemLoc.z})`);
     * overworld.spawnItem(oneEmerald, oneItemLoc);
     *
     * log(`Spawning five emeralds at (${fiveItemsLoc.x}, ${fiveItemsLoc.y}, ${fiveItemsLoc.z})`);
     * overworld.spawnItem(fiveEmeralds, fiveItemsLoc);
     *
     * log(`Spawning a diamond pickaxe at (${diamondPickaxeLoc.x}, ${diamondPickaxeLoc.y}, ${diamondPickaxeLoc.z})`);
     * overworld.spawnItem(onePickaxe, diamondPickaxeLoc);
     * ```
     * @example spawnItem.ts
     * ```typescript
     * const featherItem = new mc.ItemStack(mc.MinecraftItemTypes.Feather, 1);
     *
     * overworld.spawnItem(featherItem, targetLocation);
     * log(`New feather created at ${targetLocation.x}, ${targetLocation.y}, ${targetLocation.z}!`);
     * ```
     */
    spawnItem(itemStack: ItemStack, location: Vector3): Entity;
    /**
     * @beta
     * @remarks
     * Creates a new particle emitter at a specified location in
     * the world.
     *
     * This function can't be called in read-only mode.
     *
     * @param effectName
     * Identifier of the particle to create.
     * @param location
     * The location at which to create the particle emitter.
     * @param molangVariables
     * A set of additional, customizable variables that can be
     * adjusted for this particle emitter.
     * @returns
     * Newly created entity at the specified location.
     * @throws This function can throw errors.
     * @example spawnParticle.ts
     * ```typescript
     *   for (let i = 0; i < 100; i++) {
     *     const molang = new mc.MolangVariableMap();
     *
     *     molang.setColorRGB("variable.color", { red: Math.random(), green: Math.random(), blue: Math.random(), alpha: 1 });
     *
     *     let newLocation = {
     *       x: targetLocation.x + Math.floor(Math.random() * 8) - 4,
     *       y: targetLocation.y + Math.floor(Math.random() * 8) - 4,
     *       z: targetLocation.z + Math.floor(Math.random() * 8) - 4,
     *     };
     *     overworld.spawnParticle("minecraft:colored_flame_particle", newLocation, molang);
     *   }
     * ```
     */
    spawnParticle(effectName: string, location: Vector3, molangVariables: MolangVariableMap): void;
}

/**
 * @beta
 * Class used in conjunction with {@link PropertyRegistry} to
 * define dynamic properties that can be used on entities of a
 * specified type or at the global World- level.
 */
export class DynamicPropertiesDefinition {
    /**
     * @remarks
     * Defines a boolean dynamic property.
     *
     * @throws This function can throw errors.
     */
    defineBoolean(identifier: string, defaultValue?: boolean): DynamicPropertiesDefinition;
    /**
     * @remarks
     * Defines a number dynamic property.
     *
     * @throws This function can throw errors.
     */
    defineNumber(identifier: string, defaultValue?: number): DynamicPropertiesDefinition;
    /**
     * @remarks
     * Defines a string dynamic property.
     *
     * @throws This function can throw errors.
     */
    defineString(identifier: string, maxLength: number, defaultValue?: string): DynamicPropertiesDefinition;
}

/**
 * Represents an effect - like poison - that has been added to
 * an Entity.
 */
export class Effect {
    private constructor();
    /**
     * @remarks
     * Gets an amplifier that may have been applied to this effect.
     * Sample values range typically from 0 to 4. Example: The
     * effect 'Jump Boost II' will have an amplifier value of 1.
     *
     * @throws This property can throw when used.
     */
    readonly amplifier: number;
    /**
     * @remarks
     * Gets the player-friendly name of this effect.
     *
     * @throws This property can throw when used.
     */
    readonly displayName: string;
    /**
     * @remarks
     * Gets the entire specified duration, in ticks, of this
     * effect. There are 20 ticks per second. Use {@link
     * TicksPerSecond} constant to convert between ticks and
     * seconds.
     *
     * @throws This property can throw when used.
     */
    readonly duration: number;
    /**
     * @remarks
     * Gets the type id of this effect.
     *
     * @throws This property can throw when used.
     */
    readonly typeId: string;
    /**
     * @remarks
     * Returns whether an effect instance is available for use in
     * this context.
     *
     */
    isValid(): boolean;
}

/**
 * @beta
 * Contains information related to changes to an effect - like
 * poison - being added to an entity.
 */
export class EffectAddAfterEvent {
    private constructor();
    /**
     * @remarks
     * Additional properties and details of the effect.
     *
     * This property can't be edited in read-only mode.
     *
     */
    effect: Effect;
    /**
     * @remarks
     * Additional variant number for the effect.
     *
     * This property can't be edited in read-only mode.
     *
     */
    effectState: number;
    /**
     * @remarks
     * Entity that the effect is being added to.
     *
     * This property can't be edited in read-only mode.
     *
     */
    entity: Entity;
}

/**
 * @beta
 * Manages callbacks that are connected to when an effect is
 * added to an entity.
 */
// @ts-ignore Class inheritance allowed for native defined classes
export class EffectAddAfterEventSignal extends IEffectAddAfterEventSignal {
    private constructor();
}

/**
 * Represents a type of effect - like poison - that can be
 * applied to an entity.
 */
export class EffectType {
    private constructor();
    /**
     * @remarks
     * Identifier name of this effect type.
     *
     * @returns
     * Identifier of the effect type.
     */
    getName(): string;
}

/**
 * @beta
 * Represents a type of effect - like poison - that can be
 * applied to an entity.
 */
export class EffectTypes {
    private constructor();
    /**
     * @remarks
     * Effect type for the given identifier.
     *
     * This function can't be called in read-only mode.
     *
     * @returns
     * Effect type for the given identifier or undefined if the
     * effect does not exist.
     */
    static get(identifier: string): EffectType | undefined;
    /**
     * @remarks
     * Gets all effects.
     *
     * This function can't be called in read-only mode.
     *
     * @returns
     * A list of all effects.
     */
    static getAll(): EffectType[];
}

/**
 * @beta
 * This class represents a specific leveled enchantment that is
 * applied to an item.
 */
export class Enchantment {
    /**
     * @remarks
     * The level of this enchantment instance.
     *
     * This property can't be edited in read-only mode.
     *
     */
    level: number;
    /**
     * @remarks
     * The enchantment type of this instance.
     *
     */
    readonly 'type': EnchantmentType;
    /**
     * @remarks
     * Creates a new particular type of enchantment configuration.
     *
     * @param enchantmentType
     * Type of the enchantment.
     * @param level
     * Level of the enchantment.
     * @throws This function can throw errors.
     */
    constructor(enchantmentType: EnchantmentType | string, level?: number);
}

/**
 * @beta
 * This class represents a collection of enchantments that can
 * be applied to an item.
 */
export class EnchantmentList implements Iterable<Enchantment> {
    /**
     * @remarks
     * The item slot/type that this collection is applied to.
     *
     */
    readonly slot: number;
    /**
     * @remarks
     * Creates a new EnchantmentList.
     *
     */
    constructor(enchantmentSlot: number);
    /**
     * @remarks
     * This function can't be called in read-only mode.
     *
     */
    [Symbol.iterator](): Iterator<Enchantment>;
    /**
     * @remarks
     * Attempts to add the enchantment to this collection. Returns
     * true if successful.
     *
     * This function can't be called in read-only mode.
     *
     */
    addEnchantment(enchantment: Enchantment): boolean;
    /**
     * @remarks
     * Returns whether or not the provided EnchantmentInstance can
     * be added to this collection.
     *
     * This function can't be called in read-only mode.
     *
     */
    canAddEnchantment(enchantment: Enchantment): boolean;
    /**
     * @remarks
     * Returns an enchantment associated with a type.
     *
     * This function can't be called in read-only mode.
     *
     * @throws This function can throw errors.
     */
    getEnchantment(enchantmentType: EnchantmentType | string): Enchantment | undefined;
    /**
     * @remarks
     * If this collection has an EnchantmentInstance with type,
     * returns the level of the enchantment. Returns 0 if not
     * present.
     *
     * @throws This function can throw errors.
     */
    hasEnchantment(enchantmentType: EnchantmentType | string): number;
    /**
     * @remarks
     * This function can't be called in read-only mode.
     *
     */
    next(): IteratorResult<Enchantment>;
    /**
     * @remarks
     * Removes an EnchantmentInstance with type from this
     * collection if present.
     *
     * This function can't be called in read-only mode.
     *
     * @throws This function can throw errors.
     */
    removeEnchantment(enchantmentType: EnchantmentType | string): void;
}

/**
 * @beta
 * This enum represents the item slot or type that an
 * enchantment can be applied to.
 */
export class EnchantmentSlot {
    private constructor();
    static readonly all = -1;
    static readonly armorFeet = 4;
    static readonly armorHead = 1;
    static readonly armorLegs = 8;
    static readonly armorTorso = 2;
    static readonly axe = 512;
    static readonly bow = 32;
    static readonly carrotStick = 8192;
    static readonly cosmeticHead = 262144;
    static readonly crossbow = 65536;
    static readonly elytra = 16384;
    static readonly fishingRod = 4096;
    static readonly flintsteel = 256;
    static readonly gArmor = 15;
    static readonly gDigging = 3648;
    static readonly gTool = 131520;
    static readonly hoe = 64;
    static readonly none = 0;
    static readonly pickaxe = 1024;
    static readonly shears = 128;
    static readonly shield = 131072;
    static readonly shovel = 2048;
    static readonly spear = 32768;
    static readonly sword = 16;
}

/**
 * @beta
 * Contains information on a type of enchantment.
 */
export class EnchantmentType {
    private constructor();
    /**
     * @remarks
     * The name of the enchantment type.
     *
     */
    readonly id: string;
    /**
     * @remarks
     * The maximum level this type of enchantment can have.
     *
     */
    readonly maxLevel: number;
}

/**
 * @beta
 * Provides a list of enchantment types.
 */
export class EnchantmentTypes {
    private constructor();
    /**
     * @remarks
     * Retrieves an enchantment with the specified identifier.
     *
     * @param enchantmentId
     * Identifier of the enchantment.  For example,
     * "minecraft:flame".
     * @returns
     * If available, returns an EnchantmentType object that
     * represents the specified enchantment.
     */
    static get(enchantmentId: string): EnchantmentType | undefined;
}

/**
 * Represents the state of an entity (a mob, the player, or
 * other moving objects like minecarts) in the world.
 */
export class Entity {
    private constructor();
    /**
     * @remarks
     * Dimension that the entity is currently within.
     *
     * @throws This property can throw when used.
     */
    readonly dimension: Dimension;
    /**
     * @beta
     * @remarks
     * The distance an entity has fallen. The value is reset when
     * the entity is teleported. The value is always 1 when gliding
     * with Elytra.
     *
     * @throws This property can throw when used.
     */
    readonly fallDistance: number;
    /**
     * @remarks
     * Unique identifier of the entity. This identifier is intended
     * to be consistent across loads of a world instance. No
     * meaning should be inferred from the value and structure of
     * this unique identifier - do not parse or interpret it. This
     * property is accessible even if {@link Entity.isValid} is
     * false.
     *
     * @throws This property can throw when used.
     */
    readonly id: string;
    /**
     * @beta
     * @remarks
     * Whether the entity is touching a climbable block. For
     * example, a player next to a ladder or a spider next to a
     * stone wall.
     *
     * @throws This property can throw when used.
     */
    readonly isClimbing: boolean;
    /**
     * @beta
     * @remarks
     * Whether the entity has a fall distance greater than 0, or
     * greater than 1 while gliding.
     *
     * @throws This property can throw when used.
     */
    readonly isFalling: boolean;
    /**
     * @beta
     * @remarks
     * Whether any part of the entity is inside a water block.
     *
     * @throws This property can throw when used.
     */
    readonly isInWater: boolean;
    /**
     * @beta
     * @remarks
     * Whether the entity is on top of a solid block.
     *
     * @throws This property can throw when used.
     */
    readonly isOnGround: boolean;
    /**
     * @beta
     * @remarks
     * Whether the entity is sneaking - that is, moving more slowly
     * and more quietly.
     *
     * This property can't be edited in read-only mode.
     *
     */
    isSneaking: boolean;
    /**
     * @beta
     * @remarks
     * Whether the entity is sprinting. For example, a player using
     * the sprint action, an ocelot running away or a pig boosting
     * with Carrot on a Stick.
     *
     * @throws This property can throw when used.
     */
    readonly isSprinting: boolean;
    /**
     * @beta
     * @remarks
     * Whether the entity is in the swimming state. For example, a
     * player using the swim action or a fish in water.
     *
     * @throws This property can throw when used.
     */
    readonly isSwimming: boolean;
    /**
     * @beta
     * @remarks
     * Whether the entity reference that you have is valid or not.
     * For example, an entity may be unloaded if it moves into a
     * chunk that is unloaded, but may be reactivated if the chunk
     * it is within gets reloaded.
     *
     */
    readonly lifetimeState: EntityLifetimeState;
    /**
     * @remarks
     * Current location of the entity.
     *
     * @throws This property can throw when used.
     */
    readonly location: Vector3;
    /**
     * @remarks
     * Given name of the entity.
     *
     * This property can't be edited in read-only mode.
     *
     */
    nameTag: string;
    /**
     * @beta
     * @remarks
     * Returns a scoreboard identity that represents this entity.
     *
     * @throws This property can throw when used.
     */
    readonly scoreboardIdentity?: ScoreboardIdentity;
    /**
     * @beta
     * @remarks
     * Retrieves or sets an entity that is used as the target of
     * AI-related behaviors, like attacking.
     *
     * @throws This property can throw when used.
     */
    readonly target: Entity;
    /**
     * @remarks
     * Unique identifier of the type of the entity - for example,
     * 'minecraft:skeleton'. This property is accessible even if
     * {@link Entity.isValid} is false.
     *
     * @throws This property can throw when used.
     */
    readonly typeId: string;
    /**
     * @remarks
     * Adds or updates an effect, like poison, to the entity.
     *
     * This function can't be called in read-only mode.
     *
     * @param effectType
     * Type of effect to add to the entity.
     * @param duration
     * Amount of time, in ticks, for the effect to apply. There are
     * 20 ticks per second. Use {@link TicksPerSecond} constant to
     * convert between ticks and seconds. The value must be within
     * the range [0, 20000000].
     * @param options
     * Additional options for the effect.
     * @returns
     * Returns nothing if the effect was added or updated
     * successfully. This can throw an error if the duration or
     * amplifier are outside of the valid ranges, or if the effect
     * does not exist.
     * @throws This function can throw errors.
     * @example addEffect.js
     * ```typescript
     * const villagerId = 'minecraft:villager_v2<minecraft:ageable_grow_up>';
     * const villagerLoc: mc.Vector3 = { x: 1, y: 2, z: 1 };
     * const villager = test.spawn(villagerId, villagerLoc);
     * const duration = 20;
     *
     * villager.addEffect(EffectTypes.get('poison'), duration, { amplifier: 1 });
     * ```
     * @example quickFoxLazyDog.ts
     * ```typescript
     *   const overworld = mc.world.getDimension("overworld");
     *
     *   const fox = overworld.spawnEntity("minecraft:fox", {
     *     x: targetLocation.x + 1,
     *     y: targetLocation.y + 2,
     *     z: targetLocation.z + 3,
     *   });
     *
     *   fox.addEffect("speed", 10, {
     *     amplifier: 2,
     *   });
     *   log("Created a fox.");
     *
     *   const wolf = overworld.spawnEntity("minecraft:wolf", {
     *     x: targetLocation.x + 4,
     *     y: targetLocation.y + 2,
     *     z: targetLocation.z + 3,
     *   });
     *   wolf.addEffect("slowness", 10, {
     *     amplifier: 2,
     *   });
     *   wolf.isSneaking = true;
     *   log("Created a sneaking wolf.", 1);
     * ```
     */
    addEffect(effectType: EffectType | string, duration: number, options?: EntityEffectOptions): void;
    /**
     * @remarks
     * Adds a specified tag to an entity.
     *
     * This function can't be called in read-only mode.
     *
     * @param tag
     * Content of the tag to add. The tag must be less than 256
     * characters.
     * @returns
     * Returns true if the tag was added successfully. This can
     * fail if the tag already exists on the entity.
     * @throws This function can throw errors.
     * @example tagsQuery.ts
     * ```typescript
     *   let mobs = ["creeper", "skeleton", "sheep"];
     *
     *   // create some sample mob data
     *   for (let i = 0; i < 10; i++) {
     *     let mobTypeId = mobs[i % mobs.length];
     *     let entity = overworld.spawnEntity(mobTypeId, targetLocation);
     *     entity.addTag("mobparty." + mobTypeId);
     *   }
     *
     *   let eqo: mc.EntityQueryOptions = {
     *     tags: ["mobparty.skeleton"],
     *   };
     *
     *   for (let entity of overworld.getEntities(eqo)) {
     *     entity.kill();
     *   }
     * ```
     */
    addTag(tag: string): boolean;
    /**
     * @remarks
     * Applies a set of damage to an entity.
     *
     * This function can't be called in read-only mode.
     *
     * @param amount
     * Amount of damage to apply.
     * @param options
     * Additional options about the source of damage, which may add
     * additional effects or spur additional behaviors on this
     * entity.
     * @returns
     * Whether the entity takes any damage. This can return false
     * if the entity is invulnerable or if the damage applied is
     * less than or equal to 0.
     * @throws This function can throw errors.
     * @example applyDamageThenHeal.ts
     * ```typescript
     *   const skelly = overworld.spawnEntity("minecraft:skeleton", targetLocation);
     *
     *   skelly.applyDamage(19); // skeletons have max damage of 20 so this is a near-death skeleton
     *
     *   mc.system.runTimeout(() => {
     *     let health = skelly.getComponent("health") as mc.EntityHealthComponent;
     *     log("Skeleton health before heal: " + health.currentValue);
     *     health.resetToMaxValue();
     *     log("Skeleton health after heal: " + health.currentValue);
     *   }, 20);
     * ```
     */
    applyDamage(amount: number, options?: EntityApplyDamageByProjectileOptions | EntityApplyDamageOptions): boolean;
    /**
     * @remarks
     * Applies impulse vector to the current velocity of the
     * entity.
     *
     * This function can't be called in read-only mode.
     *
     * @param vector
     * Impulse vector.
     * @throws This function can throw errors.
     * @example applyImpulse.ts
     * ```typescript
     *   const zombie = overworld.spawnEntity("minecraft:zombie", targetLocation);
     *
     *   zombie.clearVelocity();
     *
     *   // throw the zombie up in the air
     *   zombie.applyImpulse({ x: 0, y: 0.5, z: 0 });
     * ```
     */
    applyImpulse(vector: Vector3): void;
    /**
     * @remarks
     * Applies impulse vector to the current velocity of the
     * entity.
     *
     * This function can't be called in read-only mode.
     *
     * @param directionX
     * X direction in horizontal plane.
     * @param directionZ
     * Z direction in horizontal plane.
     * @param horizontalStrength
     * Knockback strength for the horizontal vector.
     * @param verticalStrength
     * Knockback strength for the vertical vector.
     * @throws This function can throw errors.
     * @example bounceSkeletons.ts
     * ```typescript
     *   let mobs = ["creeper", "skeleton", "sheep"];
     *
     *   // create some sample mob data
     *   for (let i = 0; i < 10; i++) {
     *     overworld.spawnEntity(mobs[i % mobs.length], targetLocation);
     *   }
     *
     *   let eqo: mc.EntityQueryOptions = {
     *     type: "skeleton",
     *   };
     *
     *   for (let entity of overworld.getEntities(eqo)) {
     *     entity.applyKnockback(0, 0, 0, 1);
     *   }
     * ```
     */
    applyKnockback(directionX: number, directionZ: number, horizontalStrength: number, verticalStrength: number): void;
    /**
     * @remarks
     * Sets the current velocity of the Entity to zero. Note that
     * this method may not have an impact on Players.
     *
     * This function can't be called in read-only mode.
     *
     * @throws This function can throw errors.
     * @example applyImpulse.ts
     * ```typescript
     *   const zombie = overworld.spawnEntity("minecraft:zombie", targetLocation);
     *
     *   zombie.clearVelocity();
     *
     *   // throw the zombie up in the air
     *   zombie.applyImpulse({ x: 0, y: 0.5, z: 0 });
     * ```
     */
    clearVelocity(): void;
    /**
     * @beta
     * @remarks
     * Extinguishes the fire if the entity is on fire. Note that
     * you can call getComponent('minecraft:onfire') and, if
     * present, the entity is on fire.
     *
     * This function can't be called in read-only mode.
     *
     * @param useEffects
     * Whether to show any visual effects connected to the
     * extinguishing.
     * @returns
     * Returns whether the entity was on fire.
     * @throws This function can throw errors.
     * @example setOnFire.ts
     * ```typescript
     *   const skelly = overworld.spawnEntity("minecraft:skeleton", targetLocation);
     *
     *   skelly.setOnFire(20, true);
     *
     *   mc.system.runTimeout(() => {
     *     let onfire = skelly.getComponent("onfire") as mc.EntityOnFireComponent;
     *     log(onfire.onFireTicksRemaining + " fire ticks remaining.");
     *
     *     skelly.extinguishFire(true);
     *     log("Never mind. Fire extinguished.");
     *   }, 20);
     * ```
     * @example teleport.ts
     * ```typescript
     *   const cow = overworld.spawnEntity("minecraft:cow", targetLocation);
     *
     *   mc.system.runTimeout(() => {
     *     cow.teleport(
     *       { x: targetLocation.x + 2, y: targetLocation.y + 2, z: targetLocation.z + 2 },
     *       {
     *         facingLocation: targetLocation,
     *       }
     *     );
     *   }, 20);
     * ```
     */
    extinguishFire(useEffects?: boolean): boolean;
    /**
     * @beta
     * @remarks
     * Returns the first intersecting block from the direction that
     * this entity is looking at.
     *
     * @param options
     * Additional configuration options for the ray cast.
     * @returns
     * Returns the first intersecting block from the direction that
     * this entity is looking at.
     * @throws This function can throw errors.
     */
    getBlockFromViewDirection(options?: BlockRaycastOptions): BlockRaycastHit | undefined;
    /**
     * @remarks
     * Gets a component (that represents additional capabilities)
     * for an entity.
     *
     * @param componentId
     * The identifier of the component (e.g., 'minecraft:rideable')
     * to retrieve. If no namespace prefix is specified,
     * 'minecraft:' is assumed. If the component is not present on
     * the entity, undefined is returned.
     * @returns
     * Returns the component if it exists on the entity, otherwise
     * undefined.
     */
    getComponent(componentId: string): EntityComponent | undefined;
    /**
     * @remarks
     * Returns all components that are both present on this entity
     * and supported by the API.
     *
     * @returns
     * Returns all components that are both present on this entity
     * and supported by the API.
     */
    getComponents(): EntityComponent[];
    /**
     * @beta
     * @remarks
     * Returns a property value.
     *
     * @param identifier
     * The property identifier.
     * @returns
     * Returns the value for the property, or undefined if the
     * property has not been set.
     * @throws This function can throw errors.
     */
    getDynamicProperty(identifier: string): boolean | number | string | undefined;
    /**
     * @remarks
     * Returns the effect for the specified EffectType on the
     * entity, undefined if the effect is not present, or throws an
     * error if the effect does not exist.
     *
     * @param effectType
     * The effect identifier.
     * @returns
     * Effect object for the specified effect, undefined if the
     * effect is not present, or throws an error if the effect does
     * not exist.
     * @throws This function can throw errors.
     */
    getEffect(effectType: EffectType | string): Effect | undefined;
    /**
     * @remarks
     * Returns a set of effects applied to this entity.
     *
     * @returns
     * List of effects.
     * @throws This function can throw errors.
     */
    getEffects(): Effect[];
    /**
     * @beta
     * @remarks
     * Gets the entities that this entity is looking at by
     * performing a ray cast from the view of this entity.
     *
     * @param options
     * Additional configuration options for the ray cast.
     * @returns
     * Returns a set of entities from the direction that this
     * entity is looking at.
     * @throws This function can throw errors.
     */
    getEntitiesFromViewDirection(options?: EntityRaycastOptions): EntityRaycastHit[];
    /**
     * @remarks
     * Returns the current location of the head component of this
     * entity.
     *
     * @returns
     * Returns the current location of the head component of this
     * entity.
     * @throws This function can throw errors.
     */
    getHeadLocation(): Vector3;
    /**
     * @beta
     * @remarks
     * Returns the current rotation component of this entity.
     *
     * @returns
     * Returns the current rotation component of this entity.
     * @throws This function can throw errors.
     */
    getRotation(): Vector2;
    /**
     * @remarks
     * Returns all tags associated with an entity.
     *
     * @returns
     * Returns the current rotation component of this entity.
     * @throws This function can throw errors.
     */
    getTags(): string[];
    /**
     * @remarks
     * Returns the current velocity vector of the entity.
     *
     * @returns
     * Returns the current velocity vector of the entity.
     * @throws This function can throw errors.
     * @example getFireworkVelocity.ts
     * ```typescript
     *   const fireworkRocket = overworld.spawnEntity("minecraft:fireworks_rocket", targetLocation);
     *
     *   mc.system.runTimeout(() => {
     *     let velocity = fireworkRocket.getVelocity();
     *
     *     log("Velocity of firework is: (x: " + velocity.x + ", y:" + velocity.y + ", z:" + velocity.z + ")");
     *   }, 5);
     * ```
     */
    getVelocity(): Vector3;
    /**
     * @remarks
     * Returns the current view direction of the entity.
     *
     * @returns
     * Returns the current view direction of the entity.
     * @throws This function can throw errors.
     */
    getViewDirection(): Vector3;
    /**
     * @remarks
     * Returns true if the specified component is present on this
     * entity.
     *
     * @param componentId
     * The identifier of the component (e.g., 'minecraft:rideable')
     * to retrieve. If no namespace prefix is specified,
     * 'minecraft:' is assumed.
     * @returns
     * Returns true if the specified component is present on this
     * entity.
     */
    hasComponent(componentId: string): boolean;
    /**
     * @remarks
     * Returns whether an entity has a particular tag.
     *
     * @param tag
     * Identifier of the tag to test for.
     * @returns
     * Returns whether an entity has a particular tag.
     * @throws This function can throw errors.
     */
    hasTag(tag: string): boolean;
    /**
     * @beta
     * @remarks
     * Returns whether the entity can be manipulated by script. A
     * Player is considered valid when it's EntityLifetimeState is
     * set to Loaded.
     *
     * @returns
     * Whether the entity is valid.
     */
    isValid(): boolean;
    /**
     * @remarks
     * Kills this entity. The entity will drop loot as normal.
     *
     * This function can't be called in read-only mode.
     *
     * @returns
     * Returns true if entity can be killed (even if it is already
     * dead), otherwise it returns false.
     * @throws This function can throw errors.
     * @example tagsQuery.ts
     * ```typescript
     *   let mobs = ["creeper", "skeleton", "sheep"];
     *
     *   // create some sample mob data
     *   for (let i = 0; i < 10; i++) {
     *     let mobTypeId = mobs[i % mobs.length];
     *     let entity = overworld.spawnEntity(mobTypeId, targetLocation);
     *     entity.addTag("mobparty." + mobTypeId);
     *   }
     *
     *   let eqo: mc.EntityQueryOptions = {
     *     tags: ["mobparty.skeleton"],
     *   };
     *
     *   for (let entity of overworld.getEntities(eqo)) {
     *     entity.kill();
     *   }
     * ```
     */
    kill(): boolean;
    /**
     * @beta
     * @remarks
     * Cause the entity to play the given animation.
     *
     * This function can't be called in read-only mode.
     *
     * @param animationName
     * The animation identifier. e.g. animation.creeper.swelling
     * @param options
     * Additional options to control the playback and transitions
     * of the animation.
     * @throws This function can throw errors.
     */
    playAnimation(animationName: string, options?: PlayAnimationOptions): void;
    /**
     * @beta
     * @remarks
     * Removes a specified property.
     *
     * @param identifier
     * The property identifier.
     * @returns
     * Returns whether the given property existed on the entity.
     * @throws This function can throw errors.
     */
    removeDynamicProperty(identifier: string): boolean;
    /**
     * @remarks
     * Removes the specified EffectType on the entity, or returns
     * false if the effect is not present.
     *
     * This function can't be called in read-only mode.
     *
     * @param effectType
     * The effect identifier.
     * @returns
     * Returns true if the effect has been removed. Returns false
     * if the effect is not found or does not exist.
     * @throws This function can throw errors.
     */
    removeEffect(effectType: EffectType | string): boolean;
    /**
     * @remarks
     * Removes a specified tag from an entity.
     *
     * This function can't be called in read-only mode.
     *
     * @param tag
     * Content of the tag to remove.
     * @returns
     * Returns whether the tag existed on the entity.
     * @throws This function can throw errors.
     */
    removeTag(tag: string): boolean;
    /**
     * @remarks
     * Runs a synchronous command on the entity.
     *
     * This function can't be called in read-only mode.
     *
     * @param commandString
     * The command string. Note: This should not include a leading
     * forward slash.
     * @returns
     * A command result containing whether the command was
     * successful.
     * @throws This function can throw errors.
     */
    runCommand(commandString: string): CommandResult;
    /**
     * @remarks
     * Runs a particular command asynchronously from the context of
     * this entity. Note that there is a maximum queue of 128
     * asynchronous commands that can be run in a given tick.
     *
     * @param commandString
     * Command to run. Note that command strings should not start
     * with slash.
     * @returns
     * For commands that return data, returns a JSON structure with
     * command response values.
     * @throws This function can throw errors.
     */
    runCommandAsync(commandString: string): Promise<CommandResult>;
    /**
     * @beta
     * @remarks
     * Sets a specified property to a value.
     *
     * @param identifier
     * The property identifier.
     * @param value
     * Data value of the property to set.
     * @throws This function can throw errors.
     */
    setDynamicProperty(identifier: string, value: boolean | number | string): void;
    /**
     * @beta
     * @remarks
     * Sets an entity on fire (if it is not in water or rain). Note
     * that you can call getComponent('minecraft:onfire') and, if
     * present, the entity is on fire.
     *
     * This function can't be called in read-only mode.
     *
     * @param seconds
     * Length of time to set the entity on fire.
     * @param useEffects
     * Whether side-effects should be applied (e.g. thawing freeze)
     * and other conditions such as rain or fire protection should
     * be taken into consideration.
     * @returns
     * Whether the entity was set on fire. This can fail if seconds
     * is less than or equal to zero, the entity is wet or the
     * entity is immune to fire.
     * @throws This function can throw errors.
     * @example setOnFire.ts
     * ```typescript
     *   const skelly = overworld.spawnEntity("minecraft:skeleton", targetLocation);
     *
     *   skelly.setOnFire(20, true);
     *
     *   mc.system.runTimeout(() => {
     *     let onfire = skelly.getComponent("onfire") as mc.EntityOnFireComponent;
     *     log(onfire.onFireTicksRemaining + " fire ticks remaining.");
     *
     *     skelly.extinguishFire(true);
     *     log("Never mind. Fire extinguished.");
     *   }, 20);
     * ```
     * @example teleport.ts
     * ```typescript
     *   const cow = overworld.spawnEntity("minecraft:cow", targetLocation);
     *
     *   mc.system.runTimeout(() => {
     *     cow.teleport(
     *       { x: targetLocation.x + 2, y: targetLocation.y + 2, z: targetLocation.z + 2 },
     *       {
     *         facingLocation: targetLocation,
     *       }
     *     );
     *   }, 20);
     * ```
     */
    setOnFire(seconds: number, useEffects?: boolean): boolean;
    /**
     * @beta
     * @remarks
     * Sets the main rotation of the entity.
     *
     * This function can't be called in read-only mode.
     *
     * @param rotation
     * The x and y rotation of the entity. For most mobs, the x
     * rotation controls the head tilt and the y rotation controls
     * the body rotation.
     * @throws This function can throw errors.
     */
    setRotation(rotation: Vector2): void;
    /**
     * @remarks
     * Teleports the selected entity to a new location
     *
     * This function can't be called in read-only mode.
     *
     * @param location
     * New location for the entity.
     * @param teleportOptions
     * Options regarding the teleport operation.
     * @throws This function can throw errors.
     * @example teleportMovement.ts
     * ```typescript
     *   const pig = overworld.spawnEntity("minecraft:pig", targetLocation);
     *
     *   let inc = 1;
     *   let runId = mc.system.runInterval(() => {
     *     pig.teleport(
     *       { x: targetLocation.x + inc / 4, y: targetLocation.y + inc / 4, z: targetLocation.z + inc / 4 },
     *       {
     *         facingLocation: targetLocation,
     *       }
     *     );
     *
     *     if (inc > 100) {
     *       mc.system.clearRun(runId);
     *     }
     *     inc++;
     *   }, 4);
     * ```
     */
    teleport(location: Vector3, teleportOptions?: TeleportOptions): void;
    /**
     * @beta
     * @remarks
     * Triggers an entity type event. For every entity, a number of
     * events are defined in an entities' definition for key entity
     * behaviors; for example, creepers have a
     * minecraft:start_exploding type event.
     *
     * This function can't be called in read-only mode.
     *
     * @param eventName
     * Name of the entity type event to trigger. If a namespace is
     * not specified, minecraft: is assumed.
     * @throws This function can throw errors.
     * @example triggerEvent.ts
     * ```typescript
     *   const creeper = overworld.spawnEntity("minecraft:creeper", targetLocation);
     *
     *   creeper.triggerEvent("minecraft:start_exploding_forced");
     * ```
     */
    triggerEvent(eventName: string): void;
    /**
     * @remarks
     * Attempts to try a teleport, but may not complete the
     * teleport operation (for example, if there are blocks at the
     * destination.)
     *
     * This function can't be called in read-only mode.
     *
     * @param location
     * Location to teleport the entity to.
     * @param teleportOptions
     * Options regarding the teleport operation.
     * @returns
     * Returns whether the teleport succeeded. This can fail if the
     * destination chunk is unloaded or if the teleport would
     * result in intersecting with blocks.
     * @throws This function can throw errors.
     */
    tryTeleport(location: Vector3, teleportOptions?: TeleportOptions): boolean;
}

/**
 * @beta
 * When added, this component makes the entity spawn with a
 * rider of the specified entityType.
 */
// @ts-ignore Class inheritance allowed for native defined classes
export class EntityAddRiderComponent extends EntityComponent {
    private constructor();
    /**
     * @remarks
     * The type of entity that is added as a rider for this entity
     * when spawned under certain conditions.
     *
     * @throws This property can throw when used.
     */
    readonly entityType: string;
    /**
     * @remarks
     * Optional spawn event to trigger on the rider when that rider
     * is spawned for this entity.
     *
     * @throws This property can throw when used.
     */
    readonly spawnEvent: string;
    static readonly componentId = 'minecraft:addrider';
}

/**
 * @beta
 * Adds a timer for the entity to grow up. It can be
 * accelerated by giving the entity the items it likes as
 * defined by feedItems.
 */
// @ts-ignore Class inheritance allowed for native defined classes
export class EntityAgeableComponent extends EntityComponent {
    private constructor();
    /**
     * @remarks
     * Amount of time before the entity grows up, -1 for always a
     * baby.
     *
     * @throws This property can throw when used.
     */
    readonly duration: number;
    /**
     * @remarks
     * Event to run when this entity grows up.
     *
     * @throws This property can throw when used.
     */
    readonly growUp: Trigger;
    static readonly componentId = 'minecraft:ageable';
    /**
     * @remarks
     * List of items that the entity drops when it grows up.
     *
     * @throws This function can throw errors.
     */
    getDropItems(): string[];
    /**
     * @remarks
     * List of items that can be fed to the entity. Includes 'item'
     * for the item name and 'growth' to define how much time it
     * grows up by.
     *
     * @throws This function can throw errors.
     */
    getFeedItems(): EntityDefinitionFeedItem[];
}

/**
 * This is a base abstract class for any entity component that
 * centers around a number and can have a minimum, maximum, and
 * default defined value.
 */
// @ts-ignore Class inheritance allowed for native defined classes
export class EntityAttributeComponent extends EntityComponent {
    private constructor();
    /**
     * @remarks
     * Current value of this attribute for this instance.
     *
     * @throws This property can throw when used.
     */
    readonly currentValue: number;
    /**
     * @remarks
     * Returns the default defined value for this attribute.
     *
     * @throws This property can throw when used.
     */
    readonly defaultValue: number;
    /**
     * @remarks
     * Returns the effective max of this attribute given any other
     * ambient components or factors.
     *
     * @throws This property can throw when used.
     */
    readonly effectiveMax: number;
    /**
     * @remarks
     * Returns the effective min of this attribute given any other
     * ambient components or factors.
     *
     * @throws This property can throw when used.
     */
    readonly effectiveMin: number;
    /**
     * @remarks
     * Resets the current value of this attribute to the defined
     * default value.
     *
     * This function can't be called in read-only mode.
     *
     * @throws This function can throw errors.
     */
    resetToDefaultValue(): void;
    /**
     * @remarks
     * Resets the current value of this attribute to the maximum
     * defined value.
     *
     * This function can't be called in read-only mode.
     *
     * @throws This function can throw errors.
     */
    resetToMaxValue(): void;
    /**
     * @remarks
     * Resets the current value of this attribute to the minimum
     * defined value.
     *
     * This function can't be called in read-only mode.
     *
     * @throws This function can throw errors.
     */
    resetToMinValue(): void;
    /**
     * @remarks
     * Sets the current value of this attribute.
     *
     * This function can't be called in read-only mode.
     *
     * @throws This function can throw errors.
     */
    setCurrentValue(value: number): boolean;
}

/**
 * Base class for a family of entity movement events.
 */
// @ts-ignore Class inheritance allowed for native defined classes
export class EntityBaseMovementComponent extends EntityComponent {
    private constructor();
    readonly maxTurn: number;
}

/**
 * @beta
 * Defines what blocks this entity can breathe in and gives
 * them the ability to suffocate.
 */
// @ts-ignore Class inheritance allowed for native defined classes
export class EntityBreathableComponent extends EntityComponent {
    private constructor();
    /**
     * @remarks
     * If true, this entity can breathe in air.
     *
     * @throws This property can throw when used.
     */
    readonly breathesAir: boolean;
    /**
     * @remarks
     * If true, this entity can breathe in lava.
     *
     * @throws This property can throw when used.
     */
    readonly breathesLava: boolean;
    /**
     * @remarks
     * If true, this entity can breathe in solid blocks.
     *
     * @throws This property can throw when used.
     */
    readonly breathesSolids: boolean;
    /**
     * @remarks
     * If true, this entity can breathe in water.
     *
     * @throws This property can throw when used.
     */
    readonly breathesWater: boolean;
    /**
     * @remarks
     * If true, this entity will have visible bubbles while in
     * water.
     *
     * @throws This property can throw when used.
     */
    readonly generatesBubbles: boolean;
    /**
     * @remarks
     * Time in seconds to recover breath to maximum.
     *
     * @throws This property can throw when used.
     */
    readonly inhaleTime: number;
    /**
     * @remarks
     * Time in seconds between suffocation damage.
     *
     * @throws This property can throw when used.
     */
    readonly suffocateTime: number;
    /**
     * @remarks
     * Time in seconds the entity can hold its breath.
     *
     * @throws This property can throw when used.
     */
    readonly totalSupply: number;
    static readonly componentId = 'minecraft:breathable';
    /**
     * @remarks
     * List of blocks this entity can breathe in, in addition to
     * the separate properties for classes of blocks.
     *
     * @throws This function can throw errors.
     */
    getBreatheBlocks(): BlockPermutation[];
    /**
     * @remarks
     * List of blocks this entity can't breathe in.
     *
     * @throws This function can throw errors.
     */
    getNonBreatheBlocks(): BlockPermutation[];
    /**
     * @remarks
     * Sets the current air supply of the entity.
     *
     * @param value
     * New air supply for the entity.
     * @throws This function can throw errors.
     */
    setAirSupply(value: number): void;
}

/**
 * When added, this component signifies that the entity can
 * climb up ladders.
 */
// @ts-ignore Class inheritance allowed for native defined classes
export class EntityCanClimbComponent extends EntityComponent {
    private constructor();
    static readonly componentId = 'minecraft:can_climb';
}

/**
 * When added, this component signifies that the entity can
 * fly, and the pathfinder won't be restricted to paths where a
 * solid block is required underneath it.
 */
// @ts-ignore Class inheritance allowed for native defined classes
export class EntityCanFlyComponent extends EntityComponent {
    private constructor();
    static readonly componentId = 'minecraft:can_fly';
}

/**
 * When added, this component signifies that the entity can
 * power jump like the horse does within Minecraft.
 */
// @ts-ignore Class inheritance allowed for native defined classes
export class EntityCanPowerJumpComponent extends EntityComponent {
    private constructor();
    static readonly componentId = 'minecraft:can_power_jump';
}

/**
 * Defines the entity's color. Only works on certain entities
 * that have predefined color values (e.g., sheep, llama,
 * shulker).
 */
// @ts-ignore Class inheritance allowed for native defined classes
export class EntityColorComponent extends EntityComponent {
    private constructor();
    /**
     * @remarks
     * Value of this particular color.
     *
     * This property can't be edited in read-only mode.
     *
     */
    value: number;
    static readonly componentId = 'minecraft:color';
}

/**
 * Base class for downstream entity components.
 */
// @ts-ignore Class inheritance allowed for native defined classes
export class EntityComponent extends Component {
    private constructor();
    /**
     * @beta
     * @remarks
     * The entity that owns this component.
     *
     */
    readonly entity: Entity;
}

/**
 * @beta
 * As part of the Ageable component, represents a set of items
 * that can be fed to an entity and the rate at which that
 * causes them to grow.
 */
export class EntityDefinitionFeedItem {
    private constructor();
    /**
     * @remarks
     * The amount by which an entity's age will increase when fed
     * this item. Values usually range between 0 and 1.
     *
     */
    readonly growth: number;
    /**
     * @remarks
     * Identifier of type of item that can be fed. If a namespace
     * is not specified, 'minecraft:' is assumed. Example values
     * include 'wheat' or 'golden_apple'.
     *
     */
    readonly item: string;
}

/**
 * @beta
 * Contains data related to the death of an entity in the game.
 */
export class EntityDieAfterEvent {
    private constructor();
    /**
     * @remarks
     * If specified, provides more information on the source of
     * damage that caused the death of this entity.
     *
     */
    readonly damageSource: EntityDamageSource;
    /**
     * @remarks
     * Now-dead entity object.
     *
     */
    readonly deadEntity: Entity;
}

/**
 * @beta
 */
// @ts-ignore Class inheritance allowed for native defined classes
export class EntityDieAfterEventSignal extends IEntityDieAfterEventSignal {
    private constructor();
}

/**
 * @beta
 * Provides access to a mob's equipment slots. This component
 * exists for all mob entities.
 */
// @ts-ignore Class inheritance allowed for native defined classes
export class EntityEquipmentInventoryComponent extends EntityComponent {
    private constructor();
    static readonly componentId = 'minecraft:equipment_inventory';
    /**
     * @remarks
     * Gets the equipped item for the given EquipmentSlot.
     *
     * This function can't be called in read-only mode.
     *
     * @param equipmentSlot
     * The equipment slot. e.g. "head", "chest", "offhand"
     * @returns
     * Returns the item equipped to the given EquipmentSlot. If
     * empty, returns undefined.
     * @throws This function can throw errors.
     */
    getEquipment(equipmentSlot: EquipmentSlot): ItemStack | undefined;
    /**
     * @remarks
     * Gets the ContainerSlot corresponding to the given
     * EquipmentSlot.
     *
     * This function can't be called in read-only mode.
     *
     * @param equipmentSlot
     * The equipment slot. e.g. "head", "chest", "offhand".
     * @returns
     * Returns the ContainerSlot corresponding to the given
     * EquipmentSlot.
     * @throws This function can throw errors.
     */
    getEquipmentSlot(equipmentSlot: EquipmentSlot): ContainerSlot;
    /**
     * @remarks
     * Replaces the item in the given EquipmentSlot.
     *
     * This function can't be called in read-only mode.
     *
     * @param equipmentSlot
     * The equipment slot. e.g. "head", "chest", "offhand".
     * @param itemStack
     * The item to equip. If undefined, clears the slot.
     * @throws This function can throw errors.
     */
    setEquipment(equipmentSlot: EquipmentSlot, itemStack?: ItemStack): void;
}

/**
 * When added, this component signifies that this entity
 * doesn't take damage from fire.
 */
// @ts-ignore Class inheritance allowed for native defined classes
export class EntityFireImmuneComponent extends EntityComponent {
    private constructor();
    static readonly componentId = 'minecraft:fire_immune';
}

/**
 * When added, this component signifies that this entity can
 * float in liquid blocks.
 */
// @ts-ignore Class inheritance allowed for native defined classes
export class EntityFloatsInLiquidComponent extends EntityComponent {
    private constructor();
    static readonly componentId = 'minecraft:floats_in_liquid';
}

/**
 * Represents the flying speed of an entity.
 */
// @ts-ignore Class inheritance allowed for native defined classes
export class EntityFlyingSpeedComponent extends EntityComponent {
    private constructor();
    /**
     * @remarks
     * This property can't be edited in read-only mode.
     *
     */
    value: number;
    static readonly componentId = 'minecraft:flying_speed';
}

/**
 * Defines how much friction affects this entity.
 */
// @ts-ignore Class inheritance allowed for native defined classes
export class EntityFrictionModifierComponent extends EntityComponent {
    private constructor();
    /**
     * @remarks
     * This property can't be edited in read-only mode.
     *
     */
    value: number;
    static readonly componentId = 'minecraft:friction_modifier';
}

/**
 * Sets the offset from the ground that the entity is actually
 * at.
 */
// @ts-ignore Class inheritance allowed for native defined classes
export class EntityGroundOffsetComponent extends EntityComponent {
    private constructor();
    /**
     * @remarks
     * Value of this particular ground offset.
     *
     * This property can't be edited in read-only mode.
     *
     */
    value: number;
    static readonly componentId = 'minecraft:ground_offset';
}

/**
 * Defines the interactions with this entity for healing it.
 */
// @ts-ignore Class inheritance allowed for native defined classes
export class EntityHealableComponent extends EntityComponent {
    private constructor();
    /**
     * @beta
     * @throws This property can throw when used.
     */
    readonly filters: FilterGroup;
    /**
     * @remarks
     * Determines if an item can be used regardless of the entity
     * being at full health.
     *
     * @throws This property can throw when used.
     */
    readonly forceUse: boolean;
    static readonly componentId = 'minecraft:healable';
    /**
     * @remarks
     * A set of items that can specifically heal this entity.
     *
     * @returns
     * Entity that this component is associated with.
     * @throws This function can throw errors.
     */
    getFeedItems(): FeedItem[];
}

/**
 * @beta
 * Contains information related to an entity when its health
 * changes. Warning: don't change the health of an entity in
 * this event, or it will cause an infinite loop!
 */
export class EntityHealthChangedAfterEvent {
    private constructor();
    /**
     * @remarks
     * Entity whose health changed.
     *
     */
    readonly entity: Entity;
    /**
     * @remarks
     * New health value of the entity.
     *
     */
    readonly newValue: number;
    /**
     * @remarks
     * Old health value of the entity.
     *
     */
    readonly oldValue: number;
}

/**
 * @beta
 * Manages callbacks that are connected to when the health of
 * an entity changes.
 */
// @ts-ignore Class inheritance allowed for native defined classes
export class EntityHealthChangedAfterEventSignal extends IEntityHealthChangedAfterEventSignal {
    private constructor();
}

/**
 * Defines the health properties of an entity.
 */
// @ts-ignore Class inheritance allowed for native defined classes
export class EntityHealthComponent extends EntityAttributeComponent {
    private constructor();
    static readonly componentId = 'minecraft:health';
}

/**
 * @beta
 * Contains information related to an entity hitting a block.
 */
export class EntityHitBlockAfterEvent {
    private constructor();
    readonly blockFace: Direction;
    /**
     * @remarks
     * Entity that made the attack.
     *
     */
    readonly damagingEntity: Entity;
    /**
     * @remarks
     * Block that was hit by the attack.
     *
     */
    readonly hitBlock: Block;
}

/**
 * @beta
 * Manages callbacks that are connected to when an entity hits
 * a block.
 */
// @ts-ignore Class inheritance allowed for native defined classes
export class EntityHitBlockAfterEventSignal extends IEntityHitBlockAfterEventSignal {
    private constructor();
}

/**
 * @beta
 * Contains information related to an entity hitting (melee
 * attacking) another entity.
 */
export class EntityHitEntityAfterEvent {
    private constructor();
    /**
     * @remarks
     * Entity that made a hit/melee attack.
     *
     */
    readonly damagingEntity: Entity;
    /**
     * @remarks
     * Entity that was hit by the attack.
     *
     */
    readonly hitEntity: Entity;
}

/**
 * @beta
 * Manages callbacks that are connected to when an entity makes
 * a melee attack on another entity.
 */
// @ts-ignore Class inheritance allowed for native defined classes
export class EntityHitEntityAfterEventSignal extends IEntityHitEntityAfterEventSignal {
    private constructor();
}

/**
 * @beta
 * Contains information related to an entity getting hurt.
 */
export class EntityHurtAfterEvent {
    private constructor();
    /**
     * @remarks
     * Describes the amount of damage caused.
     *
     */
    readonly damage: number;
    /**
     * @remarks
     * Source information on the entity that may have applied this
     * damage.
     *
     */
    readonly damageSource: EntityDamageSource;
    /**
     * @remarks
     * Entity that was hurt.
     *
     */
    readonly hurtEntity: Entity;
}

/**
 * @beta
 * Manages callbacks that are connected to when an entity is
 * hurt.
 */
// @ts-ignore Class inheritance allowed for native defined classes
export class EntityHurtAfterEventSignal extends IEntityHurtAfterEventSignal {
    private constructor();
}

/**
 * Defines this entity's inventory properties.
 */
// @ts-ignore Class inheritance allowed for native defined classes
export class EntityInventoryComponent extends EntityComponent {
    private constructor();
    /**
     * @remarks
     * Number of slots that this entity can gain per extra
     * strength.
     *
     * @throws This property can throw when used.
     */
    readonly additionalSlotsPerStrength: number;
    /**
     * @remarks
     * If true, the contents of this inventory can be removed by a
     * hopper.
     *
     * @throws This property can throw when used.
     */
    readonly canBeSiphonedFrom: boolean;
    /**
     * @remarks
     * Defines the container for this entity.
     *
     * @throws This property can throw when used.
     */
    readonly container: Container;
    /**
     * @remarks
     * Type of container this entity has.
     *
     * @throws This property can throw when used.
     */
    readonly containerType: string;
    /**
     * @remarks
     * Number of slots the container has.
     *
     * @throws This property can throw when used.
     */
    readonly inventorySize: number;
    /**
     * @remarks
     * If true, the entity will not drop it's inventory on death.
     *
     * @throws This property can throw when used.
     */
    readonly 'private': boolean;
    /**
     * @remarks
     * If true, the entity's inventory can only be accessed by its
     * owner or itself.
     *
     * @throws This property can throw when used.
     */
    readonly restrictToOwner: boolean;
    static readonly componentId = 'minecraft:inventory';
}

/**
 * When added, this component signifies that this entity is a
 * baby.
 */
// @ts-ignore Class inheritance allowed for native defined classes
export class EntityIsBabyComponent extends EntityComponent {
    private constructor();
    static readonly componentId = 'minecraft:is_baby';
}

/**
 * When added, this component signifies that this entity is
 * charged.
 */
// @ts-ignore Class inheritance allowed for native defined classes
export class EntityIsChargedComponent extends EntityComponent {
    private constructor();
    static readonly componentId = 'minecraft:is_charged';
}

/**
 * When added, this component signifies that this entity is
 * currently carrying a chest.
 */
// @ts-ignore Class inheritance allowed for native defined classes
export class EntityIsChestedComponent extends EntityComponent {
    private constructor();
    static readonly componentId = 'minecraft:is_chested';
}

/**
 * When added, this component signifies that dyes can be used
 * on this entity to change its color.
 */
// @ts-ignore Class inheritance allowed for native defined classes
export class EntityIsDyeableComponent extends EntityComponent {
    private constructor();
    static readonly componentId = 'minecraft:is_dyeable';
}

/**
 * When added, this component signifies that this entity can
 * hide from hostile mobs while invisible.
 */
// @ts-ignore Class inheritance allowed for native defined classes
export class EntityIsHiddenWhenInvisibleComponent extends EntityComponent {
    private constructor();
    static readonly componentId = 'minecraft:is_hidden_when_invisible';
}

/**
 * When added, this component signifies that this entity this
 * currently on fire.
 */
// @ts-ignore Class inheritance allowed for native defined classes
export class EntityIsIgnitedComponent extends EntityComponent {
    private constructor();
    static readonly componentId = 'minecraft:is_ignited';
}

/**
 * When added, this component signifies that this entity is an
 * illager captain.
 */
// @ts-ignore Class inheritance allowed for native defined classes
export class EntityIsIllagerCaptainComponent extends EntityComponent {
    private constructor();
    static readonly componentId = 'minecraft:is_illager_captain';
}

/**
 * When added, this component signifies that this entity is
 * currently saddled.
 */
// @ts-ignore Class inheritance allowed for native defined classes
export class EntityIsSaddledComponent extends EntityComponent {
    private constructor();
    static readonly componentId = 'minecraft:is_saddled';
}

/**
 * When added, this component signifies that this entity is
 * currently shaking.
 */
// @ts-ignore Class inheritance allowed for native defined classes
export class EntityIsShakingComponent extends EntityComponent {
    private constructor();
    static readonly componentId = 'minecraft:is_shaking';
}

/**
 * When added, this component signifies that this entity is
 * currently sheared.
 */
// @ts-ignore Class inheritance allowed for native defined classes
export class EntityIsShearedComponent extends EntityComponent {
    private constructor();
    static readonly componentId = 'minecraft:is_sheared';
}

/**
 * When added, this component signifies that this entity can be
 * stacked.
 */
// @ts-ignore Class inheritance allowed for native defined classes
export class EntityIsStackableComponent extends EntityComponent {
    private constructor();
    static readonly componentId = 'minecraft:is_stackable';
}

/**
 * When added, this component signifies that this entity is
 * currently stunned.
 */
// @ts-ignore Class inheritance allowed for native defined classes
export class EntityIsStunnedComponent extends EntityComponent {
    private constructor();
    static readonly componentId = 'minecraft:is_stunned';
}

/**
 * When added, this component signifies that this entity is
 * currently tamed.
 */
// @ts-ignore Class inheritance allowed for native defined classes
export class EntityIsTamedComponent extends EntityComponent {
    private constructor();
    static readonly componentId = 'minecraft:is_tamed';
}

/**
 * If added onto the entity, this indicates that the entity
 * represents a free-floating item in the world. Lets you
 * retrieve the actual item stack contents via the itemStack
 * property.
 */
// @ts-ignore Class inheritance allowed for native defined classes
export class EntityItemComponent extends EntityComponent {
    private constructor();
    /**
     * @remarks
     * Item stack represented by this entity in the world.
     *
     * @throws This property can throw when used.
     */
    readonly itemStack: ItemStack;
    static readonly componentId = 'minecraft:item';
}

/**
 * @beta
 * This type is usable for iterating over a set of entities.
 * This means it can be used in statements like for...of
 * statements, Array.from(iterator), and more.
 */
export class EntityIterator implements Iterable<Entity> {
    private constructor();
    /**
     * @remarks
     * This function can't be called in read-only mode.
     *
     */
    [Symbol.iterator](): Iterator<Entity>;
    /**
     * @remarks
     * Retrieves the next item in this iteration. The resulting
     * IteratorResult contains .done and .value properties which
     * can be used to see the next Entity in the iteration.
     *
     * This function can't be called in read-only mode.
     *
     */
    next(): IteratorResult<Entity>;
}

/**
 * @beta
 * Defines the base movement speed in lava of this entity.
 */
// @ts-ignore Class inheritance allowed for native defined classes
export class EntityLavaMovementComponent extends EntityAttributeComponent {
    private constructor();
    static readonly componentId = 'minecraft:lava_movement';
}

/**
 * @beta
 * Allows this entity to be leashed and defines the conditions
 * and events for this entity when is leashed.
 */
// @ts-ignore Class inheritance allowed for native defined classes
export class EntityLeashableComponent extends EntityComponent {
    private constructor();
    /**
     * @remarks
     * Distance in blocks at which the 'spring' effect starts
     * acting to keep this entity close to the entity that leashed
     * it.
     *
     * @throws This property can throw when used.
     */
    readonly softDistance: number;
    static readonly componentId = 'minecraft:leashable';
    /**
     * @remarks
     * Leashes this entity to another entity.
     *
     * This function can't be called in read-only mode.
     *
     * @param leashHolder
     * The entity to leash this entity to.
     * @throws This function can throw errors.
     */
    leash(leashHolder: Entity): void;
    /**
     * @remarks
     * Unleashes this entity if it is leashed to another entity.
     *
     * This function can't be called in read-only mode.
     *
     * @throws This function can throw errors.
     */
    unleash(): void;
}

/**
 * Additional variant value. Can be used to further
 * differentiate variants.
 */
// @ts-ignore Class inheritance allowed for native defined classes
export class EntityMarkVariantComponent extends EntityComponent {
    private constructor();
    /**
     * @remarks
     * Value of the mark variant value for this entity.
     *
     * This property can't be edited in read-only mode.
     *
     */
    value: number;
    static readonly componentId = 'minecraft:mark_variant';
}

/**
 * @beta
 * Contains options for taming a rideable entity based on the
 * entity that mounts it.
 */
// @ts-ignore Class inheritance allowed for native defined classes
export class EntityMountTamingComponent extends EntityComponent {
    private constructor();
    static readonly componentId = 'minecraft:tamemount';
    /**
     * @remarks
     * Sets this rideable entity as tamed.
     *
     * This function can't be called in read-only mode.
     *
     * @param showParticles
     * Whether to show effect particles when this entity is tamed.
     * @throws This function can throw errors.
     */
    setTamed(showParticles: boolean): void;
}

/**
 * When added, this movement control allows the mob to swim in
 * water and walk on land.
 */
// @ts-ignore Class inheritance allowed for native defined classes
export class EntityMovementAmphibiousComponent extends EntityBaseMovementComponent {
    private constructor();
    static readonly componentId = 'minecraft:movement.amphibious';
}

/**
 * This component accents the movement of an entity.
 */
// @ts-ignore Class inheritance allowed for native defined classes
export class EntityMovementBasicComponent extends EntityBaseMovementComponent {
    private constructor();
    static readonly componentId = 'minecraft:movement.basic';
}

/**
 * @beta
 * Defines the general movement speed of this entity.
 */
// @ts-ignore Class inheritance allowed for native defined classes
export class EntityMovementComponent extends EntityAttributeComponent {
    private constructor();
    static readonly componentId = 'minecraft:movement';
}

/**
 * When added, this move control causes the mob to fly.
 */
// @ts-ignore Class inheritance allowed for native defined classes
export class EntityMovementFlyComponent extends EntityBaseMovementComponent {
    private constructor();
    static readonly componentId = 'minecraft:movement.fly';
}

/**
 * When added, this move control allows a mob to fly, swim,
 * climb, etc.
 */
// @ts-ignore Class inheritance allowed for native defined classes
export class EntityMovementGenericComponent extends EntityBaseMovementComponent {
    private constructor();
    static readonly componentId = 'minecraft:movement.generic';
}

/**
 * @beta
 * When added, this movement control allows the mob to glide.
 */
// @ts-ignore Class inheritance allowed for native defined classes
export class EntityMovementGlideComponent extends EntityBaseMovementComponent {
    private constructor();
    /**
     * @remarks
     * Speed in effect when the entity is turning.
     *
     * @throws This property can throw when used.
     */
    readonly speedWhenTurning: number;
    /**
     * @remarks
     * Start speed during a glide.
     *
     * @throws This property can throw when used.
     */
    readonly startSpeed: number;
    static readonly componentId = 'minecraft:movement.glide';
}

/**
 * When added, this move control causes the mob to hover.
 */
// @ts-ignore Class inheritance allowed for native defined classes
export class EntityMovementHoverComponent extends EntityBaseMovementComponent {
    private constructor();
    static readonly componentId = 'minecraft:movement.hover';
}

/**
 * Move control that causes the mob to jump as it moves with a
 * specified delay between jumps.
 */
// @ts-ignore Class inheritance allowed for native defined classes
export class EntityMovementJumpComponent extends EntityBaseMovementComponent {
    private constructor();
    static readonly componentId = 'minecraft:movement.jump';
}

/**
 * When added, this move control causes the mob to hop as it
 * moves.
 */
// @ts-ignore Class inheritance allowed for native defined classes
export class EntityMovementSkipComponent extends EntityBaseMovementComponent {
    private constructor();
    static readonly componentId = 'minecraft:movement.skip';
}

/**
 * @beta
 * When added, this move control causes the mob to sway side to
 * side giving the impression it is swimming.
 */
// @ts-ignore Class inheritance allowed for native defined classes
export class EntityMovementSwayComponent extends EntityBaseMovementComponent {
    private constructor();
    /**
     * @remarks
     * Amplitude of the sway motion.
     *
     * @throws This property can throw when used.
     */
    readonly swayAmplitude: number;
    /**
     * @remarks
     * Amount of sway frequency.
     *
     * @throws This property can throw when used.
     */
    readonly swayFrequency: number;
    static readonly componentId = 'minecraft:movement.sway';
}

/**
 * @beta
 * Allows this entity to generate paths that include vertical
 * walls (for example, like Minecraft spiders do.)
 */
// @ts-ignore Class inheritance allowed for native defined classes
export class EntityNavigationClimbComponent extends EntityNavigationComponent {
    private constructor();
    static readonly componentId = 'minecraft:navigation.climb';
}

/**
 * @beta
 * Allows this entity to generate paths that include vertical
 * walls (for example, like Minecraft spiders do.)
 */
// @ts-ignore Class inheritance allowed for native defined classes
export class EntityNavigationComponent extends EntityComponent {
    private constructor();
    /**
     * @remarks
     * Tells the pathfinder to avoid blocks that cause damage when
     * finding a path.
     *
     * @throws This property can throw when used.
     */
    readonly avoidDamageBlocks: boolean;
    /**
     * @remarks
     * Tells the pathfinder to avoid portals (like nether portals)
     * when finding a path.
     *
     * @throws This property can throw when used.
     */
    readonly avoidPortals: boolean;
    /**
     * @remarks
     * Whether or not the pathfinder should avoid tiles that are
     * exposed to the sun when creating paths.
     *
     * @throws This property can throw when used.
     */
    readonly avoidSun: boolean;
    /**
     * @remarks
     * Tells the pathfinder to avoid water when creating a path.
     *
     * @throws This property can throw when used.
     */
    readonly avoidWater: boolean;
    /**
     * @remarks
     * Tells the pathfinder whether or not it can jump out of water
     * (like a dolphin).
     *
     * @throws This property can throw when used.
     */
    readonly canBreach: boolean;
    /**
     * @remarks
     * Tells the pathfinder that it can path through a closed door
     * and break it.
     *
     * @throws This property can throw when used.
     */
    readonly canBreakDoors: boolean;
    /**
     * @remarks
     * Tells the pathfinder whether or not it can float.
     *
     * @throws This property can throw when used.
     */
    readonly canFloat: boolean;
    /**
     * @remarks
     * Tells the pathfinder whether or not it can jump up blocks.
     *
     * @throws This property can throw when used.
     */
    readonly canJump: boolean;
    /**
     * @remarks
     * Tells the pathfinder that it can path through a closed door
     * assuming the AI will open the door.
     *
     * @throws This property can throw when used.
     */
    readonly canOpenDoors: boolean;
    /**
     * @remarks
     * Tells the pathfinder that it can path through a closed iron
     * door assuming the AI will open the door.
     *
     * @throws This property can throw when used.
     */
    readonly canOpenIronDoors: boolean;
    /**
     * @remarks
     * Whether a path can be created through a door.
     *
     * @throws This property can throw when used.
     */
    readonly canPassDoors: boolean;
    /**
     * @remarks
     * Tells the pathfinder that it can start pathing when in the
     * air.
     *
     * @throws This property can throw when used.
     */
    readonly canPathFromAir: boolean;
    /**
     * @remarks
     * Tells the pathfinder whether or not it can travel on the
     * surface of the lava.
     *
     * @throws This property can throw when used.
     */
    readonly canPathOverLava: boolean;
    /**
     * @remarks
     * Tells the pathfinder whether or not it can travel on the
     * surface of the water.
     *
     * @throws This property can throw when used.
     */
    readonly canPathOverWater: boolean;
    /**
     * @remarks
     * Tells the pathfinder whether or not it will be pulled down
     * by gravity while in water.
     *
     * @throws This property can throw when used.
     */
    readonly canSink: boolean;
    /**
     * @remarks
     * Tells the pathfinder whether or not it can path anywhere
     * through water and plays swimming animation along that path.
     *
     * @throws This property can throw when used.
     */
    readonly canSwim: boolean;
    /**
     * @remarks
     * Tells the pathfinder whether or not it can walk on the
     * ground outside water.
     *
     * @throws This property can throw when used.
     */
    readonly canWalk: boolean;
    /**
     * @remarks
     * Tells the pathfinder whether or not it can travel in lava
     * like walking on ground.
     *
     * @throws This property can throw when used.
     */
    readonly canWalkInLava: boolean;
    /**
     * @remarks
     * Tells the pathfinder whether or not it can walk on the
     * ground or go underwater.
     *
     * @throws This property can throw when used.
     */
    readonly isAmphibious: boolean;
}

/**
 * @beta
 * Allows this entity to generate paths by flying around the
 * air like the regular Ghast.
 */
// @ts-ignore Class inheritance allowed for native defined classes
export class EntityNavigationFloatComponent extends EntityNavigationComponent {
    private constructor();
    static readonly componentId = 'minecraft:navigation.float';
}

/**
 * @beta
 * Allows this entity to generate paths in the air (for
 * example, like Minecraft parrots do.)
 */
// @ts-ignore Class inheritance allowed for native defined classes
export class EntityNavigationFlyComponent extends EntityNavigationComponent {
    private constructor();
    static readonly componentId = 'minecraft:navigation.fly';
}

/**
 * @beta
 * Allows this entity to generate paths by walking, swimming,
 * flying and/or climbing around and jumping up and down a
 * block.
 */
// @ts-ignore Class inheritance allowed for native defined classes
export class EntityNavigationGenericComponent extends EntityNavigationComponent {
    private constructor();
    static readonly componentId = 'minecraft:navigation.generic';
}

/**
 * @beta
 * Allows this entity to generate paths in the air (for
 * example, like the Minecraft Bees do.) Keeps them from
 * falling out of the skies and doing predictive movement.
 */
// @ts-ignore Class inheritance allowed for native defined classes
export class EntityNavigationHoverComponent extends EntityNavigationComponent {
    private constructor();
    static readonly componentId = 'minecraft:navigation.hover';
}

/**
 * @beta
 * Allows this entity to generate paths by walking around and
 * jumping up and down a block like regular mobs.
 */
// @ts-ignore Class inheritance allowed for native defined classes
export class EntityNavigationWalkComponent extends EntityNavigationComponent {
    private constructor();
    static readonly componentId = 'minecraft:navigation.walk';
}

/**
 * @beta
 * When present on an entity, this entity is on fire.
 */
// @ts-ignore Class inheritance allowed for native defined classes
export class EntityOnFireComponent extends EntityComponent {
    private constructor();
    /**
     * @remarks
     * The number of ticks remaining before the fire goes out.
     *
     */
    readonly onFireTicksRemaining: number;
    static readonly componentId = 'minecraft:onfire';
}

/**
 * Sets the distance through which the entity can push through.
 */
// @ts-ignore Class inheritance allowed for native defined classes
export class EntityPushThroughComponent extends EntityComponent {
    private constructor();
    /**
     * @remarks
     * Value of the push through distances of this entity.
     *
     * This property can't be edited in read-only mode.
     *
     */
    value: number;
    static readonly componentId = 'minecraft:push_through';
}

/**
 * @beta
 * Data for an event that happens when an entity is removed
 * from the world (for example, the entity is unloaded because
 * it is not close to players.)
 */
export class EntityRemovedAfterEvent {
    private constructor();
    /**
     * @remarks
     * Reference to an entity that was removed.
     *
     */
    readonly removedEntity: string;
}

/**
 * @beta
 */
// @ts-ignore Class inheritance allowed for native defined classes
export class EntityRemovedAfterEventSignal extends IEntityRemovedAfterEventSignal {
    private constructor();
}

/**
 * @beta
 * When added, this component adds the capability that an
 * entity can be ridden by another entity.
 */
// @ts-ignore Class inheritance allowed for native defined classes
export class EntityRideableComponent extends EntityComponent {
    private constructor();
    /**
     * @remarks
     * Zero-based index of the seat that can used to control this
     * entity.
     *
     * @throws This property can throw when used.
     */
    readonly controllingSeat: number;
    /**
     * @remarks
     * Determines whether interactions are not supported if the
     * entity is crouching.
     *
     * @throws This property can throw when used.
     */
    readonly crouchingSkipInteract: boolean;
    /**
     * @remarks
     * Set of text that should be displayed when a player is
     * looking to ride on this entity (commonly with touch-screen
     * controls).
     *
     * @throws This property can throw when used.
     */
    readonly interactText: string;
    /**
     * @remarks
     * If true, this entity will pull in entities that are in the
     * correct family_types into any available seat.
     *
     * @throws This property can throw when used.
     */
    readonly pullInEntities: boolean;
    /**
     * @remarks
     * If true, this entity will be picked when looked at by the
     * rider.
     *
     * @throws This property can throw when used.
     */
    readonly riderCanInteract: boolean;
    /**
     * @remarks
     * Number of seats for riders defined for this entity.
     *
     * @throws This property can throw when used.
     */
    readonly seatCount: number;
    static readonly componentId = 'minecraft:rideable';
    /**
     * @remarks
     * Adds an entity to this entity as a rider.
     *
     * This function can't be called in read-only mode.
     *
     * @param rider
     * Entity that will become the rider of this entity.
     * @returns
     * True if the rider entity was successfully added.
     * @throws This function can throw errors.
     */
    addRider(rider: Entity): boolean;
    /**
     * @remarks
     * Ejects the specified rider of this entity.
     *
     * This function can't be called in read-only mode.
     *
     * @param rider
     * Entity that should be ejected from this entity.
     * @throws This function can throw errors.
     */
    ejectRider(rider: Entity): void;
    /**
     * @remarks
     * Ejects all riders of this entity.
     *
     * This function can't be called in read-only mode.
     *
     * @throws This function can throw errors.
     */
    ejectRiders(): void;
    /**
     * @remarks
     * A string-list of entity types that this entity can support
     * as riders.
     *
     * @throws This function can throw errors.
     */
    getFamilyTypes(): string[];
    /**
     * @remarks
     * Gets a list of the all the entities currently riding this
     * entity.
     *
     * @throws This function can throw errors.
     */
    getRiders(): Entity[];
    /**
     * @remarks
     * Gets a list of positions and number of riders for each
     * position for entities riding this entity.
     *
     * @throws This function can throw errors.
     */
    getSeats(): Seat[];
}

/**
 * @beta
 * This component is added to any entity when it is riding
 * another entity.
 */
// @ts-ignore Class inheritance allowed for native defined classes
export class EntityRidingComponent extends EntityComponent {
    private constructor();
    /**
     * @remarks
     * The entity this entity is currently riding on.
     *
     * @throws This property can throw when used.
     */
    readonly entityRidingOn: Entity;
    static readonly componentId = 'minecraft:riding';
}

/**
 * Sets the entity's visual size.
 */
// @ts-ignore Class inheritance allowed for native defined classes
export class EntityScaleComponent extends EntityComponent {
    private constructor();
    /**
     * @remarks
     * Current value for the scale property set on entities.
     *
     * This property can't be edited in read-only mode.
     *
     */
    value: number;
    static readonly componentId = 'minecraft:scale';
}

/**
 * Skin Id value. Can be used to differentiate skins, such as
 * base skins for villagers.
 */
// @ts-ignore Class inheritance allowed for native defined classes
export class EntitySkinIdComponent extends EntityComponent {
    private constructor();
    /**
     * @remarks
     * This property can't be edited in read-only mode.
     *
     */
    value: number;
    static readonly componentId = 'minecraft:skin_id';
}

/**
 * @beta
 * Contains data related to an entity spawning within the
 * world.
 */
export class EntitySpawnAfterEvent {
    private constructor();
    /**
     * @remarks
     * Entity that was spawned.
     *
     * This property can't be edited in read-only mode.
     *
     */
    entity: Entity;
}

/**
 * @beta
 * Registers a script-based event handler for handling what
 * happens when an entity spawns.
 */
// @ts-ignore Class inheritance allowed for native defined classes
export class EntitySpawnAfterEventSignal extends IEntitySpawnAfterEventSignal {
    private constructor();
}

/**
 * @beta
 * Defines the entity's strength to carry items.
 */
// @ts-ignore Class inheritance allowed for native defined classes
export class EntityStrengthComponent extends EntityComponent {
    private constructor();
    /**
     * @remarks
     * Maximum strength of this entity, as defined in the entity
     * type definition.
     *
     * @throws This property can throw when used.
     */
    readonly max: number;
    /**
     * @remarks
     * Current value of the strength component that has been set
     * for entities.
     *
     * @throws This property can throw when used.
     */
    readonly value: number;
    static readonly componentId = 'minecraft:strength';
}

/**
 * @beta
 * Defines the rules for an entity to be tamed by the player.
 */
// @ts-ignore Class inheritance allowed for native defined classes
export class EntityTameableComponent extends EntityComponent {
    private constructor();
    /**
     * @remarks
     * The chance of taming the entity with each item use between
     * 0.0 and 1.0, where 1.0 is 100%
     *
     * @throws This property can throw when used.
     */
    readonly probability: number;
    static readonly componentId = 'minecraft:tameable';
    /**
     * @remarks
     * Returns a set of items that can be used to tame this entity.
     *
     * @throws This function can throw errors.
     */
    getTameItems(): string[];
    /**
     * @remarks
     * Tames this entity.
     *
     * This function can't be called in read-only mode.
     *
     * @returns
     * Returns true if the entity was tamed.
     * @throws This function can throw errors.
     */
    tame(): boolean;
}

/**
 * @beta
 * Represents information about a type of entity.
 */
export class EntityType {
    private constructor();
    /**
     * @remarks
     * Identifier of this entity type - for example,
     * 'minecraft:skeleton'.
     *
     */
    readonly id: string;
}

/**
 * @beta
 * An iterator that loops through available entity types.
 */
export class EntityTypeIterator implements Iterable<EntityType> {
    private constructor();
    /**
     * @remarks
     * This function can't be called in read-only mode.
     *
     */
    [Symbol.iterator](): Iterator<EntityType>;
    /**
     * @remarks
     * This function can't be called in read-only mode.
     *
     */
    next(): IteratorResult<EntityType>;
}

/**
 * @beta
 * Used for accessing all entity types currently available for
 * use within the world.
 */
export class EntityTypes {
    private constructor();
    /**
     * @remarks
     * Retrieves an entity type using a string-based identifier.
     *
     */
    static get(identifier: string): EntityType;
    /**
     * @remarks
     * Retrieves an iterator of all entity types within this world.
     *
     */
    static getAll(): EntityTypeIterator;
}

/**
 * @beta
 * Defines the general movement speed underwater of this
 * entity.
 */
// @ts-ignore Class inheritance allowed for native defined classes
export class EntityUnderwaterMovementComponent extends EntityAttributeComponent {
    private constructor();
    static readonly componentId = 'minecraft:underwater_movement';
}

/**
 * Used to differentiate the component group of a variant of an
 * entity from others. (e.g. ocelot, villager).
 */
// @ts-ignore Class inheritance allowed for native defined classes
export class EntityVariantComponent extends EntityComponent {
    private constructor();
    /**
     * @remarks
     * Current value for variant for this entity, as specified via
     * components.
     *
     * @throws This property can throw when used.
     */
    readonly value: number;
    static readonly componentId = 'minecraft:variant';
}

/**
 * When added, this component signifies that this entity wants
 * to become a jockey.
 */
// @ts-ignore Class inheritance allowed for native defined classes
export class EntityWantsJockeyComponent extends EntityComponent {
    private constructor();
    static readonly componentId = 'minecraft:wants_jockey';
}

/**
 * @beta
 * Contains information regarding an explosion that has
 * happened.
 */
export class ExplosionAfterEvent {
    private constructor();
    /**
     * @remarks
     * Dimension where the explosion has occurred.
     *
     */
    readonly dimension: Dimension;
    /**
     * @remarks
     * Optional source of the explosion.
     *
     */
    readonly source?: Entity;
    /**
     * @remarks
     * A collection of blocks impacted by this explosion event.
     *
     */
    getImpactedBlocks(): Vector3[];
}

/**
 * @beta
 * Manages callbacks that are connected to when an explosion
 * occurs.
 */
// @ts-ignore Class inheritance allowed for native defined classes
export class ExplosionAfterEventSignal extends IExplosionAfterEventSignal {
    private constructor();
}

/**
 * @beta
 * Contains information regarding an explosion that has
 * happened.
 */
// @ts-ignore Class inheritance allowed for native defined classes
export class ExplosionBeforeEvent extends ExplosionAfterEvent {
    private constructor();
    /**
     * @remarks
     * If set to true, cancels the explosion event.
     *
     */
    cancel: boolean;
    /**
     * @remarks
     * Updates a collection of blocks impacted by this explosion
     * event.
     *
     * @param blocks
     * New list of blocks that are impacted by this explosion.
     */
    setImpactedBlocks(blocks: Vector3[]): void;
}

/**
 * @beta
 * Manages callbacks that are connected to before an explosion
 * occurs.
 */
// @ts-ignore Class inheritance allowed for native defined classes
export class ExplosionBeforeEventSignal extends IExplosionBeforeEventSignal {
    private constructor();
}

/**
 * As part of the Healable component, represents a specific
 * item that can be fed to an entity to cause health effects.
 */
export class FeedItem {
    private constructor();
    /**
     * @remarks
     * The amount of health this entity gains when fed this item.
     * This number is an integer starting at 0. Sample values can
     * go as high as 40.
     *
     */
    readonly healAmount: number;
    /**
     * @remarks
     * Identifier of type of item that can be fed. If a namespace
     * is not specified, 'minecraft:' is assumed. Example values
     * include 'wheat' or 'golden_apple'.
     *
     */
    readonly item: string;
    /**
     * @remarks
     * As part of the Healable component, an optional collection of
     * side effects that can occur from being fed an item.
     *
     */
    getEffects(): FeedItemEffect[];
}

/**
 * Represents an effect that is applied as a result of a food
 * item being fed to an entity.
 */
export class FeedItemEffect {
    private constructor();
    /**
     * @remarks
     * Gets an amplifier that may have been applied to this effect.
     * Valid values are integers starting at 0 and up - but usually
     * ranging between 0 and 4.
     *
     */
    readonly amplifier: number;
    /**
     * @remarks
     * Chance that this effect is applied as a result of the entity
     * being fed this item. Valid values range between 0 and 1.
     *
     */
    readonly chance: number;
    /**
     * @remarks
     * Gets the duration, in ticks, of this effect.
     *
     */
    readonly duration: number;
    /**
     * @remarks
     * Gets the identifier of the effect to apply. Example values
     * include 'fire_resistance' or 'regeneration'.
     *
     */
    readonly name: string;
}

/**
 * @beta
 * Represents a set of filters for when an event should occur.
 */
export class FilterGroup {
    private constructor();
}

/**
 * @beta
 * Represents constants related to fluid containers.
 */
export class FluidContainer {
    private constructor();
    /**
     * @remarks
     * Constant that represents the maximum fill level of a fluid
     * container.
     *
     */
    static readonly maxFillLevel = 6;
    /**
     * @remarks
     * Constant that represents the minimum fill level of a fluid
     * container.
     *
     */
    static readonly minFillLevel = 0;
}

/**
 * @beta
 * Provides an adaptable interface for callers to subscribe to
 * an event that fires when blocks are broken.
 */
export class IBlockBreakAfterEventSignal {
    private constructor();
    /**
     * @remarks
     * This function can't be called in read-only mode.
     *
     */
    subscribe(callback: (arg: BlockBreakAfterEvent) => void): (arg: BlockBreakAfterEvent) => void;
    /**
     * @remarks
     * This function can't be called in read-only mode.
     *
     * @throws This function can throw errors.
     */
    unsubscribe(callback: (arg: BlockBreakAfterEvent) => void): void;
}

/**
 * @beta
 * Provides an adaptable interface for callers to subscribe to
 * an event that fires when an explosion occurs.
 */
export class IBlockExplodeAfterEventSignal {
    private constructor();
    /**
     * @remarks
     * This function can't be called in read-only mode.
     *
     */
    subscribe(callback: (arg: BlockExplodeAfterEvent) => void): (arg: BlockExplodeAfterEvent) => void;
    /**
     * @remarks
     * This function can't be called in read-only mode.
     *
     * @throws This function can throw errors.
     */
    unsubscribe(callback: (arg: BlockExplodeAfterEvent) => void): void;
}

/**
 * @beta
 * Provides an adaptable interface for callers to subscribe to
 * an event that fires after a block is placed.
 */
export class IBlockPlaceAfterEventSignal {
    private constructor();
    /**
     * @remarks
     * This function can't be called in read-only mode.
     *
     */
    subscribe(callback: (arg: BlockPlaceAfterEvent) => void): (arg: BlockPlaceAfterEvent) => void;
    /**
     * @remarks
     * This function can't be called in read-only mode.
     *
     * @throws This function can throw errors.
     */
    unsubscribe(callback: (arg: BlockPlaceAfterEvent) => void): void;
}

/**
 * Provides an adaptable interface for callers to subscribe to
 * an event that fires when a button is pushed.
 */
export class IButtonPushAfterEventSignal {
    private constructor();
    /**
     * @remarks
     * This function can't be called in read-only mode.
     *
     */
    subscribe(callback: (arg: ButtonPushAfterEvent) => void): (arg: ButtonPushAfterEvent) => void;
    /**
     * @remarks
     * This function can't be called in read-only mode.
     *
     * @throws This function can throw errors.
     */
    unsubscribe(callback: (arg: ButtonPushAfterEvent) => void): void;
}

/**
 * @beta
 * Provides an adaptable interface for callers to subscribe to
 * an event that fires when a chat message is sent.
 */
export class IChatSendAfterEventSignal {
    private constructor();
    /**
     * @remarks
     * This function can't be called in read-only mode.
     *
     */
    subscribe(callback: (arg: ChatSendAfterEvent) => void): (arg: ChatSendAfterEvent) => void;
    /**
     * @remarks
     * This function can't be called in read-only mode.
     *
     * @throws This function can throw errors.
     */
    unsubscribe(callback: (arg: ChatSendAfterEvent) => void): void;
}

/**
 * @beta
 * Provides an adaptable interface for callers to subscribe to
 * an event that fires before a chat message is sent.
 */
export class IChatSendBeforeEventSignal {
    private constructor();
    /**
     * @remarks
     * This function can't be called in read-only mode.
     *
     */
    subscribe(callback: (arg: ChatSendBeforeEvent) => void): (arg: ChatSendBeforeEvent) => void;
    /**
     * @remarks
     * This function can't be called in read-only mode.
     *
     * @throws This function can throw errors.
     */
    unsubscribe(callback: (arg: ChatSendBeforeEvent) => void): void;
}

/**
 * @beta
 * Provides an adaptable interface for callers to subscribe to
 * an event that fires when an entities' definition is
 * triggered to change.
 */
export class IDataDrivenEntityTriggerAfterEventSignal {
    private constructor();
    /**
     * @remarks
     * This function can't be called in read-only mode.
     *
     */
    subscribe(
        callback: (arg: DataDrivenEntityTriggerAfterEvent) => void,
        options?: EntityDataDrivenTriggerEventOptions,
    ): (arg: DataDrivenEntityTriggerAfterEvent) => void;
    /**
     * @remarks
     * This function can't be called in read-only mode.
     *
     * @throws This function can throw errors.
     */
    unsubscribe(callback: (arg: DataDrivenEntityTriggerAfterEvent) => void): void;
}

/**
 * @beta
 * Provides an adaptable interface for callers to subscribe to
 * an event that fires before an entities' definition is
 * scheduled to change via a triggered event.
 */
export class IDataDrivenEntityTriggerBeforeEventSignal {
    private constructor();
    /**
     * @remarks
     * This function can't be called in read-only mode.
     *
     */
    subscribe(
        callback: (arg: DataDrivenEntityTriggerBeforeEvent) => void,
        options?: EntityDataDrivenTriggerEventOptions,
    ): (arg: DataDrivenEntityTriggerBeforeEvent) => void;
    /**
     * @remarks
     * This function can't be called in read-only mode.
     *
     * @throws This function can throw errors.
     */
    unsubscribe(callback: (arg: DataDrivenEntityTriggerBeforeEvent) => void): void;
}

/**
 * @beta
 * Provides an adaptable interface for callers to subscribe to
 * an event that fires when an effect is added to an entity.
 */
export class IEffectAddAfterEventSignal {
    private constructor();
    /**
     * @remarks
     * This function can't be called in read-only mode.
     *
     */
    subscribe(
        callback: (arg: EffectAddAfterEvent) => void,
        options?: EntityEventOptions,
    ): (arg: EffectAddAfterEvent) => void;
    /**
     * @remarks
     * This function can't be called in read-only mode.
     *
     * @throws This function can throw errors.
     */
    unsubscribe(callback: (arg: EffectAddAfterEvent) => void): void;
}

/**
 * @beta
 * Provides an adaptable interface for callers to subscribe to
 * an event that fires when an entity dies.
 */
export class IEntityDieAfterEventSignal {
    private constructor();
    /**
     * @remarks
     * This function can't be called in read-only mode.
     *
     */
    subscribe(
        callback: (arg: EntityDieAfterEvent) => void,
        options?: EntityEventOptions,
    ): (arg: EntityDieAfterEvent) => void;
    /**
     * @remarks
     * This function can't be called in read-only mode.
     *
     * @throws This function can throw errors.
     */
    unsubscribe(callback: (arg: EntityDieAfterEvent) => void): void;
}

/**
 * @beta
 */
export class IEntityHealthChangedAfterEventSignal {
    private constructor();
    /**
     * @remarks
     * This function can't be called in read-only mode.
     *
     */
    subscribe(
        callback: (arg: EntityHealthChangedAfterEvent) => void,
        options?: EntityEventOptions,
    ): (arg: EntityHealthChangedAfterEvent) => void;
    /**
     * @remarks
     * This function can't be called in read-only mode.
     *
     * @throws This function can throw errors.
     */
    unsubscribe(callback: (arg: EntityHealthChangedAfterEvent) => void): void;
}

/**
 * @beta
 */
export class IEntityHitBlockAfterEventSignal {
    private constructor();
    /**
     * @remarks
     * This function can't be called in read-only mode.
     *
     */
    subscribe(
        callback: (arg: EntityHitBlockAfterEvent) => void,
        options?: EntityEventOptions,
    ): (arg: EntityHitBlockAfterEvent) => void;
    /**
     * @remarks
     * This function can't be called in read-only mode.
     *
     * @throws This function can throw errors.
     */
    unsubscribe(callback: (arg: EntityHitBlockAfterEvent) => void): void;
}

/**
 * @beta
 */
export class IEntityHitEntityAfterEventSignal {
    private constructor();
    /**
     * @remarks
     * This function can't be called in read-only mode.
     *
     */
    subscribe(
        callback: (arg: EntityHitEntityAfterEvent) => void,
        options?: EntityEventOptions,
    ): (arg: EntityHitEntityAfterEvent) => void;
    /**
     * @remarks
     * This function can't be called in read-only mode.
     *
     * @throws This function can throw errors.
     */
    unsubscribe(callback: (arg: EntityHitEntityAfterEvent) => void): void;
}

/**
 * @beta
 * Provides an adaptable interface for callers to subscribe to
 * an event that fires when an entity is hurt.
 */
export class IEntityHurtAfterEventSignal {
    private constructor();
    /**
     * @remarks
     * This function can't be called in read-only mode.
     *
     */
    subscribe(
        callback: (arg: EntityHurtAfterEvent) => void,
        options?: EntityEventOptions,
    ): (arg: EntityHurtAfterEvent) => void;
    /**
     * @remarks
     * This function can't be called in read-only mode.
     *
     * @throws This function can throw errors.
     */
    unsubscribe(callback: (arg: EntityHurtAfterEvent) => void): void;
}

/**
 * @beta
 */
export class IEntityRemovedAfterEventSignal {
    private constructor();
    /**
     * @remarks
     * This function can't be called in read-only mode.
     *
     */
    subscribe(
        callback: (arg: EntityRemovedAfterEvent) => void,
        options?: EntityEventOptions,
    ): (arg: EntityRemovedAfterEvent) => void;
    /**
     * @remarks
     * This function can't be called in read-only mode.
     *
     * @throws This function can throw errors.
     */
    unsubscribe(callback: (arg: EntityRemovedAfterEvent) => void): void;
}

/**
 * @beta
 * Provides an adaptable interface for callers to subscribe to
 * an event that fires after an entity is spawned.
 */
export class IEntitySpawnAfterEventSignal {
    private constructor();
    /**
     * @remarks
     * This function can't be called in read-only mode.
     *
     */
    subscribe(callback: (arg: EntitySpawnAfterEvent) => void): (arg: EntitySpawnAfterEvent) => void;
    /**
     * @remarks
     * This function can't be called in read-only mode.
     *
     * @throws This function can throw errors.
     */
    unsubscribe(callback: (arg: EntitySpawnAfterEvent) => void): void;
}

/**
 * @beta
 * Provides an adaptable interface for callers to subscribe to
 * an event that fires after an explosion occurs.
 */
export class IExplosionAfterEventSignal {
    private constructor();
    /**
     * @remarks
     * This function can't be called in read-only mode.
     *
     */
    subscribe(callback: (arg: ExplosionAfterEvent) => void): (arg: ExplosionAfterEvent) => void;
    /**
     * @remarks
     * This function can't be called in read-only mode.
     *
     * @throws This function can throw errors.
     */
    unsubscribe(callback: (arg: ExplosionAfterEvent) => void): void;
}

/**
 * @beta
 * Provides an adaptable interface for callers to subscribe to
 * an event that fires before an explosion begins.
 */
export class IExplosionBeforeEventSignal {
    private constructor();
    /**
     * @remarks
     * This function can't be called in read-only mode.
     *
     */
    subscribe(callback: (arg: ExplosionBeforeEvent) => void): (arg: ExplosionBeforeEvent) => void;
    /**
     * @remarks
     * This function can't be called in read-only mode.
     *
     * @throws This function can throw errors.
     */
    unsubscribe(callback: (arg: ExplosionBeforeEvent) => void): void;
}

/**
 * @beta
 */
export class IItemCompleteUseAfterEventSignal {
    private constructor();
    /**
     * @remarks
     * This function can't be called in read-only mode.
     *
     */
    subscribe(callback: (arg: ItemCompleteUseAfterEvent) => void): (arg: ItemCompleteUseAfterEvent) => void;
    /**
     * @remarks
     * This function can't be called in read-only mode.
     *
     * @throws This function can throw errors.
     */
    unsubscribe(callback: (arg: ItemCompleteUseAfterEvent) => void): void;
}

/**
 * @beta
 * Provides an adaptable interface for callers to subscribe to
 * an event that fires after an items' definition has changed.
 */
export class IItemDefinitionAfterEventSignal {
    private constructor();
    /**
     * @remarks
     * This function can't be called in read-only mode.
     *
     */
    subscribe(
        callback: (arg: ItemDefinitionTriggeredAfterEvent) => void,
    ): (arg: ItemDefinitionTriggeredAfterEvent) => void;
    /**
     * @remarks
     * This function can't be called in read-only mode.
     *
     * @throws This function can throw errors.
     */
    unsubscribe(callback: (arg: ItemDefinitionTriggeredAfterEvent) => void): void;
}

/**
 * @beta
 * Provides an adaptable interface for callers to subscribe to
 * an event that fires before an items' definition changes.
 */
export class IItemDefinitionBeforeEventSignal {
    private constructor();
    /**
     * @remarks
     * This function can't be called in read-only mode.
     *
     */
    subscribe(
        callback: (arg: ItemDefinitionTriggeredBeforeEvent) => void,
    ): (arg: ItemDefinitionTriggeredBeforeEvent) => void;
    /**
     * @remarks
     * This function can't be called in read-only mode.
     *
     * @throws This function can throw errors.
     */
    unsubscribe(callback: (arg: ItemDefinitionTriggeredBeforeEvent) => void): void;
}

/**
 * @beta
 */
export class IItemReleaseUseAfterEventSignal {
    private constructor();
    /**
     * @remarks
     * This function can't be called in read-only mode.
     *
     */
    subscribe(callback: (arg: ItemReleaseUseAfterEvent) => void): (arg: ItemReleaseUseAfterEvent) => void;
    /**
     * @remarks
     * This function can't be called in read-only mode.
     *
     * @throws This function can throw errors.
     */
    unsubscribe(callback: (arg: ItemReleaseUseAfterEvent) => void): void;
}

/**
 * @beta
 */
export class IItemStartUseAfterEventSignal {
    private constructor();
    /**
     * @remarks
     * This function can't be called in read-only mode.
     *
     */
    subscribe(callback: (arg: ItemStartUseAfterEvent) => void): (arg: ItemStartUseAfterEvent) => void;
    /**
     * @remarks
     * This function can't be called in read-only mode.
     *
     * @throws This function can throw errors.
     */
    unsubscribe(callback: (arg: ItemStartUseAfterEvent) => void): void;
}

/**
 * @beta
 * Provides an adaptable interface for callers to subscribe to
 * an event that fires when an item item is starting to be used
 * on a block.
 */
export class IItemStartUseOnAfterEventSignal {
    private constructor();
    /**
     * @remarks
     * This function can't be called in read-only mode.
     *
     */
    subscribe(callback: (arg: ItemStartUseOnAfterEvent) => void): (arg: ItemStartUseOnAfterEvent) => void;
    /**
     * @remarks
     * This function can't be called in read-only mode.
     *
     * @throws This function can throw errors.
     */
    unsubscribe(callback: (arg: ItemStartUseOnAfterEvent) => void): void;
}

/**
 * @beta
 */
export class IItemStopUseAfterEventSignal {
    private constructor();
    /**
     * @remarks
     * This function can't be called in read-only mode.
     *
     */
    subscribe(callback: (arg: ItemStopUseAfterEvent) => void): (arg: ItemStopUseAfterEvent) => void;
    /**
     * @remarks
     * This function can't be called in read-only mode.
     *
     * @throws This function can throw errors.
     */
    unsubscribe(callback: (arg: ItemStopUseAfterEvent) => void): void;
}

/**
 * @beta
 * Provides an adaptable interface for callers to subscribe to
 * an event that fires when an item has stopped being used on a
 * block.
 */
export class IItemStopUseOnAfterEventSignal {
    private constructor();
    /**
     * @remarks
     * This function can't be called in read-only mode.
     *
     */
    subscribe(callback: (arg: ItemStopUseOnAfterEvent) => void): (arg: ItemStopUseOnAfterEvent) => void;
    /**
     * @remarks
     * This function can't be called in read-only mode.
     *
     * @throws This function can throw errors.
     */
    unsubscribe(callback: (arg: ItemStopUseOnAfterEvent) => void): void;
}

/**
 * @beta
 * Provides an adaptable interface for callers to subscribe to
 * an event that fires after an item is used.
 */
export class IItemUseAfterEventSignal {
    private constructor();
    /**
     * @remarks
     * This function can't be called in read-only mode.
     *
     */
    subscribe(callback: (arg: ItemUseAfterEvent) => void): (arg: ItemUseAfterEvent) => void;
    /**
     * @remarks
     * This function can't be called in read-only mode.
     *
     * @throws This function can throw errors.
     */
    unsubscribe(callback: (arg: ItemUseAfterEvent) => void): void;
}

/**
 * @beta
 * Provides an adaptable interface for callers to subscribe to
 * an event that fires before an item is used.
 */
export class IItemUseBeforeEventSignal {
    private constructor();
    /**
     * @remarks
     * This function can't be called in read-only mode.
     *
     */
    subscribe(callback: (arg: ItemUseBeforeEvent) => void): (arg: ItemUseBeforeEvent) => void;
    /**
     * @remarks
     * This function can't be called in read-only mode.
     *
     * @throws This function can throw errors.
     */
    unsubscribe(callback: (arg: ItemUseBeforeEvent) => void): void;
}

/**
 * @beta
 * Provides an adaptable interface for callers to subscribe to
 * an event that fires after an item is used on a block.
 */
export class IItemUseOnAfterEventSignal {
    private constructor();
    /**
     * @remarks
     * This function can't be called in read-only mode.
     *
     */
    subscribe(callback: (arg: ItemUseOnAfterEvent) => void): (arg: ItemUseOnAfterEvent) => void;
    /**
     * @remarks
     * This function can't be called in read-only mode.
     *
     * @throws This function can throw errors.
     */
    unsubscribe(callback: (arg: ItemUseOnAfterEvent) => void): void;
}

/**
 * @beta
 * Provides an adaptable interface for callers to subscribe to
 * an event that fires before an item is being used on a block.
 */
export class IItemUseOnBeforeEventSignal {
    private constructor();
    /**
     * @remarks
     * This function can't be called in read-only mode.
     *
     */
    subscribe(callback: (arg: ItemUseOnBeforeEvent) => void): (arg: ItemUseOnBeforeEvent) => void;
    /**
     * @remarks
     * This function can't be called in read-only mode.
     *
     * @throws This function can throw errors.
     */
    unsubscribe(callback: (arg: ItemUseOnBeforeEvent) => void): void;
}

/**
 * Provides an adaptable interface for callers to subscribe to
 * an event that fires after a lever is used.
 */
export class ILeverActionAfterEventSignal {
    private constructor();
    /**
     * @remarks
     * This function can't be called in read-only mode.
     *
     */
    subscribe(callback: (arg: LeverActionAfterEvent) => void): (arg: LeverActionAfterEvent) => void;
    /**
     * @remarks
     * This function can't be called in read-only mode.
     *
     * @throws This function can throw errors.
     */
    unsubscribe(callback: (arg: LeverActionAfterEvent) => void): void;
}

/**
 * @beta
 * Provides an adaptable interface for callers to subscribe to
 * an event that fires after a piston is activated.
 */
export class IPistonActivateAfterEventSignal {
    private constructor();
    /**
     * @remarks
     * This function can't be called in read-only mode.
     *
     */
    subscribe(callback: (arg: PistonActivateAfterEvent) => void): (arg: PistonActivateAfterEvent) => void;
    /**
     * @remarks
     * This function can't be called in read-only mode.
     *
     * @throws This function can throw errors.
     */
    unsubscribe(callback: (arg: PistonActivateAfterEvent) => void): void;
}

/**
 * @beta
 * Provides an adaptable interface for callers to subscribe to
 * an event that fires before a piston is activated.
 */
export class IPistonActivateBeforeEventSignal {
    private constructor();
    /**
     * @remarks
     * This function can't be called in read-only mode.
     *
     */
    subscribe(callback: (arg: PistonActivateBeforeEvent) => void): (arg: PistonActivateBeforeEvent) => void;
    /**
     * @remarks
     * This function can't be called in read-only mode.
     *
     * @throws This function can throw errors.
     */
    unsubscribe(callback: (arg: PistonActivateBeforeEvent) => void): void;
}

/**
 * Provides an adaptable interface for callers to subscribe to
 * an event that fires after a player joins a world.
 */
export class IPlayerJoinAfterEventSignal {
    private constructor();
    /**
     * @remarks
     * This function can't be called in read-only mode.
     *
     */
    subscribe(callback: (arg: PlayerJoinAfterEvent) => void): (arg: PlayerJoinAfterEvent) => void;
    /**
     * @remarks
     * This function can't be called in read-only mode.
     *
     * @throws This function can throw errors.
     */
    unsubscribe(callback: (arg: PlayerJoinAfterEvent) => void): void;
}

/**
 * Provides an adaptable interface for callers to subscribe to
 * an event that fires after a player leaves a world.
 */
export class IPlayerLeaveAfterEventSignal {
    private constructor();
    /**
     * @remarks
     * This function can't be called in read-only mode.
     *
     */
    subscribe(callback: (arg: PlayerLeaveAfterEvent) => void): (arg: PlayerLeaveAfterEvent) => void;
    /**
     * @remarks
     * This function can't be called in read-only mode.
     *
     * @throws This function can throw errors.
     */
    unsubscribe(callback: (arg: PlayerLeaveAfterEvent) => void): void;
}

/**
 * Provides an adaptable interface for callers to subscribe to
 * an event that fires after a player spawns.
 */
export class IPlayerSpawnAfterEventSignal {
    private constructor();
    /**
     * @remarks
     * This function can't be called in read-only mode.
     *
     */
    subscribe(callback: (arg: PlayerSpawnAfterEvent) => void): (arg: PlayerSpawnAfterEvent) => void;
    /**
     * @remarks
     * This function can't be called in read-only mode.
     *
     * @throws This function can throw errors.
     */
    unsubscribe(callback: (arg: PlayerSpawnAfterEvent) => void): void;
}

/**
 * @beta
 */
export class IPressurePlatePopAfterEventSignal {
    private constructor();
    /**
     * @remarks
     * This function can't be called in read-only mode.
     *
     */
    subscribe(callback: (arg: PressurePlatePopAfterEvent) => void): (arg: PressurePlatePopAfterEvent) => void;
    /**
     * @remarks
     * This function can't be called in read-only mode.
     *
     * @throws This function can throw errors.
     */
    unsubscribe(callback: (arg: PressurePlatePopAfterEvent) => void): void;
}

/**
 * @beta
 */
export class IPressurePlatePushAfterEventSignal {
    private constructor();
    /**
     * @remarks
     * This function can't be called in read-only mode.
     *
     */
    subscribe(callback: (arg: PressurePlatePushAfterEvent) => void): (arg: PressurePlatePushAfterEvent) => void;
    /**
     * @remarks
     * This function can't be called in read-only mode.
     *
     * @throws This function can throw errors.
     */
    unsubscribe(callback: (arg: PressurePlatePushAfterEvent) => void): void;
}

/**
 * @beta
 * Provides an adaptable interface for callers to subscribe to
 * an event that fires after a projectile hits a target.
 */
export class IProjectileHitAfterEventSignal {
    private constructor();
    /**
     * @remarks
     * This function can't be called in read-only mode.
     *
     */
    subscribe(callback: (arg: ProjectileHitAfterEvent) => void): (arg: ProjectileHitAfterEvent) => void;
    /**
     * @remarks
     * This function can't be called in read-only mode.
     *
     * @throws This function can throw errors.
     */
    unsubscribe(callback: (arg: ProjectileHitAfterEvent) => void): void;
}

/**
 * @beta
 * Provides an adaptable interface for callers to subscribe to
 * an event that fires when /script event command is called.
 */
export class IScriptEventCommandMessageAfterEventSignal {
    private constructor();
    /**
     * @remarks
     * This function can't be called in read-only mode.
     *
     */
    subscribe(
        callback: (arg: ScriptEventCommandMessageAfterEvent) => void,
        options?: ScriptEventMessageFilterOptions,
    ): (arg: ScriptEventCommandMessageAfterEvent) => void;
    /**
     * @remarks
     * This function can't be called in read-only mode.
     *
     * @throws This function can throw errors.
     */
    unsubscribe(callback: (arg: ScriptEventCommandMessageAfterEvent) => void): void;
}

/**
 * @beta
 * Provides an adaptable interface for callers to subscribe to
 * an event that fires after a server message is sent. Note
 * that this event is for internal use only.
 */
export class IServerMessageAfterEventSignal {
    private constructor();
    /**
     * @remarks
     * This function can't be called in read-only mode.
     *
     */
    subscribe(callback: (arg: MessageReceiveAfterEvent) => void): (arg: MessageReceiveAfterEvent) => void;
    /**
     * @remarks
     * This function can't be called in read-only mode.
     *
     * @throws This function can throw errors.
     */
    unsubscribe(callback: (arg: MessageReceiveAfterEvent) => void): void;
}

/**
 * @beta
 */
export class ITargetBlockHitAfterEventSignal {
    private constructor();
    /**
     * @remarks
     * This function can't be called in read-only mode.
     *
     */
    subscribe(callback: (arg: TargetBlockHitAfterEvent) => void): (arg: TargetBlockHitAfterEvent) => void;
    /**
     * @remarks
     * This function can't be called in read-only mode.
     *
     * @throws This function can throw errors.
     */
    unsubscribe(callback: (arg: TargetBlockHitAfterEvent) => void): void;
}

/**
 * @beta
 * Contains information related to a chargeable item completing
 * being charged.
 */
export class ItemCompleteUseAfterEvent {
    private constructor();
    /**
     * @remarks
     * Returns the item stack that has completed charging.
     *
     */
    readonly itemStack: ItemStack;
    /**
     * @remarks
     * Returns the source entity that triggered this item event.
     *
     */
    readonly source: Entity;
    /**
     * @remarks
     * Returns the time, in ticks, for the remaining duration left
     * before the charge completes its cycle.
     *
     */
    readonly useDuration: number;
}

/**
 * @beta
 * Manages callbacks that are connected to the completion of
 * charging for a chargeable item.
 */
// @ts-ignore Class inheritance allowed for native defined classes
export class ItemCompleteUseAfterEventSignal extends IItemCompleteUseAfterEventSignal {
    private constructor();
}

/**
 * Base class for item components.
 */
// @ts-ignore Class inheritance allowed for native defined classes
export class ItemComponent extends Component {
    private constructor();
}

/**
 * @beta
 * When present on an item, this item has a cooldown effect
 * when used by entities.
 */
// @ts-ignore Class inheritance allowed for native defined classes
export class ItemCooldownComponent extends ItemComponent {
    private constructor();
    /**
     * @remarks
     * Represents the cooldown category that this item is
     * associated with.
     *
     * @throws This property can throw when used.
     */
    readonly cooldownCategory: string;
    /**
     * @remarks
     * Amount of time, in ticks, that remain for this item
     * cooldown.
     *
     * @throws This property can throw when used.
     */
    readonly cooldownTicks: number;
    static readonly componentId = 'minecraft:cooldown';
    /**
     * @remarks
     * Starts a new cooldown period for this item.
     *
     * This function can't be called in read-only mode.
     *
     * @throws This function can throw errors.
     */
    startCooldown(player: Player): void;
}

/**
 * @beta
 * Manages callbacks that are connected to an item's definition
 * and components changing.
 */
// @ts-ignore Class inheritance allowed for native defined classes
export class ItemDefinitionAfterEventSignal extends IItemDefinitionAfterEventSignal {
    private constructor();
}

/**
 * @beta
 * Manages callbacks that are connected to an item's definition
 * and components changing.
 */
// @ts-ignore Class inheritance allowed for native defined classes
export class ItemDefinitionBeforeEventSignal extends IItemDefinitionBeforeEventSignal {
    private constructor();
}

/**
 * @beta
 * Contains information related to a custom item having a data
 * definition change being triggered.
 */
export class ItemDefinitionTriggeredAfterEvent {
    private constructor();
    /**
     * @remarks
     * Name of the data-driven item event that is triggering this
     * change.
     *
     */
    readonly eventName: string;
    itemStack: ItemStack;
    /**
     * @remarks
     * Returns the source entity that triggered this item event.
     *
     */
    readonly source: Entity;
}

/**
 * @beta
 * Contains information related to a triggering of a custom
 * item definition change.
 */
// @ts-ignore Class inheritance allowed for native defined classes
export class ItemDefinitionTriggeredBeforeEvent extends ItemDefinitionTriggeredAfterEvent {
    private constructor();
    /**
     * @remarks
     * If set to true, will cancel the application of this item
     * definition change.
     *
     */
    cancel: boolean;
}

/**
 * @beta
 * When present on an item, this item can take damage in the
 * process of being used. Note that this component only applies
 * to data-driven items.
 */
// @ts-ignore Class inheritance allowed for native defined classes
export class ItemDurabilityComponent extends ItemComponent {
    private constructor();
    /**
     * @remarks
     * Returns the current damage level of this particular item.
     *
     * This property can't be edited in read-only mode.
     *
     */
    damage: number;
    /**
     * @remarks
     * Represents the amount of damage that this item can take
     * before breaking.
     *
     * @throws This property can throw when used.
     */
    readonly maxDurability: number;
    static readonly componentId = 'minecraft:durability';
    /**
     * @remarks
     * Returns the maximum chance that this item would be damaged
     * using the damageRange property, given an unbreaking level.
     *
     * This function can't be called in read-only mode.
     *
     * @param unbreaking
     * Unbreaking factor to consider in factoring the damage
     * chance. Incoming unbreaking parameter must be greater than
     * 0.
     * @throws This function can throw errors.
     */
    getDamageChance(unbreaking?: number): number;
    /**
     * @remarks
     * A range of numbers that describes the chance of the item
     * losing durability.
     *
     * This function can't be called in read-only mode.
     *
     * @throws This function can throw errors.
     */
    getDamageRange(): NumberRange;
}

/**
 * @beta
 * When present on an item, this item has applied enchantment
 * effects. Note that this component only applies to
 * data-driven items.
 */
// @ts-ignore Class inheritance allowed for native defined classes
export class ItemEnchantsComponent extends ItemComponent {
    private constructor();
    /**
     * @remarks
     * Returns a collection of the enchantments applied to this
     * item stack.
     *
     * This property can't be edited in read-only mode.
     *
     */
    enchantments: EnchantmentList;
    static readonly componentId = 'minecraft:enchantments';
    /**
     * @remarks
     * Removes all enchantments applied to this item stack.
     *
     * This function can't be called in read-only mode.
     *
     * @throws This function can throw errors.
     */
    removeAllEnchantments(): void;
}

/**
 * @beta
 * When present on an item, this item is consumable by
 * entities. Note that this component only applies to
 * data-driven items.
 */
// @ts-ignore Class inheritance allowed for native defined classes
export class ItemFoodComponent extends ItemComponent {
    private constructor();
    /**
     * @remarks
     * If true, the player can always eat this item (even when not
     * hungry).
     *
     * @throws This property can throw when used.
     */
    readonly canAlwaysEat: boolean;
    /**
     * @remarks
     * Represents how much nutrition this food item will give an
     * entity when eaten.
     *
     * @throws This property can throw when used.
     */
    readonly nutrition: number;
    /**
     * @remarks
     * When an item is eaten, this value is used according to this
     * formula (nutrition * saturation_modifier * 2) to apply a
     * saturation buff.
     *
     * @throws This property can throw when used.
     */
    readonly saturationModifier: number;
    /**
     * @remarks
     * When specified, converts the active item to the one
     * specified by this property.
     *
     * @throws This property can throw when used.
     */
    readonly usingConvertsTo: string;
    static readonly componentId = 'minecraft:food';
}

/**
 * @beta
 * Contains information related to a chargeable item when the
 * player has finished using the item and released the build
 * action.
 */
export class ItemReleaseUseAfterEvent {
    private constructor();
    /**
     * @remarks
     * Returns the item stack that triggered this item event.
     *
     */
    readonly itemStack: ItemStack;
    /**
     * @remarks
     * Returns the source entity that triggered this item event.
     *
     */
    readonly source: Entity;
    /**
     * @remarks
     * Returns the time, in ticks, for the remaining duration left
     * before the charge completes its cycle.
     *
     */
    readonly useDuration: number;
}

/**
 * @beta
 * Manages callbacks that are connected to the releasing of
 * charging for a chargeable item.
 */
// @ts-ignore Class inheritance allowed for native defined classes
export class ItemReleaseUseAfterEventSignal extends IItemReleaseUseAfterEventSignal {
    private constructor();
}

/**
 * Defines a collection of items.
 */
export class ItemStack {
    /**
     * @remarks
     * Number of the items in the stack. Valid values range between
     * 1-255. The provided value will be clamped to the item's
     * maximum stack size.
     *
     * This property can't be edited in read-only mode.
     *
     * @throws
     * Throws if the value is outside the range of 1-255.
     */
    amount: number;
    /**
     * @remarks
     * Returns whether the item is stackable. An item is considered
     * stackable if the item's maximum stack size is greater than 1
     * and the item does not contain any custom data or properties.
     *
     */
    readonly isStackable: boolean;
    /**
     * @remarks
     * Gets or sets whether the item is kept on death.
     *
     * This property can't be edited in read-only mode.
     *
     */
    keepOnDeath: boolean;
    /**
     * @remarks
     * Gets or sets the item's lock mode. The default value is
     * `ItemLockMode.none`.
     *
     * This property can't be edited in read-only mode.
     *
     */
    lockMode: ItemLockMode;
    /**
     * @remarks
     * The maximum stack size. This value varies depending on the
     * type of item. For example, torches have a maximum stack size
     * of 64, while eggs have a maximum stack size of 16.
     *
     */
    readonly maxAmount: number;
    /**
     * @remarks
     * Given name of this stack of items. The name tag is displayed
     * when hovering over the item. Setting the name tag to an
     * empty string or `undefined` will remove the name tag.
     *
     * This property can't be edited in read-only mode.
     *
     * @throws
     * Throws if the length exceeds 255 characters.
     */
    nameTag?: string;
    /**
     * @remarks
     * The type of the item.
     *
     */
    readonly 'type': ItemType;
    /**
     * @remarks
     * Identifier of the type of items for the stack. If a
     * namespace is not specified, 'minecraft:' is assumed.
     * Examples include 'wheat' or 'apple'.
     *
     */
    readonly typeId: string;
    /**
     * @remarks
     * Creates a new instance of a stack of items for use in the
     * world.
     *
     * @param itemType
     * Type of item to create. See the {@link
     * @minecraft/vanilla-data.MinecraftItemTypes} enumeration for
     * a list of standard item types in Minecraft experiences.
     * @param amount
     * Number of items to place in the stack, between 1-255. The
     * provided value will be clamped to the item's maximum stack
     * size. Note that certain items can only have one item in the
     * stack.
     * @throws
     * Throws if `itemType` is invalid, or if `amount` is outside
     * the range of 1-255.
     */
    constructor(itemType: ItemType | string, amount?: number);
    /**
     * @beta
     * @remarks
     * Creates an exact copy of the item stack, including any
     * custom data or properties.
     *
     * @returns
     * Returns a copy of this item stack.
     */
    clone(): ItemStack;
    /**
     * @remarks
     * Gets a component (that represents additional capabilities)
     * for an item stack.
     *
     * @param componentId
     * The identifier of the component (e.g., 'minecraft:food') to
     * retrieve. If no namespace prefix is specified, 'minecraft:'
     * is assumed. If the component is not present on the item
     * stack, undefined is returned.
     * @example durability.ts
     * ```typescript
     * // Get the maximum durability of a custom sword item
     * const itemStack = new ItemStack("custom:sword");
     * const durability = itemStack.getComponent("minecraft:durability") as ItemDurabilityComponent;
     * const maxDurability = durability.maxDurability;
     * ```
     */
    getComponent(componentId: string): ItemComponent | undefined;
    /**
     * @remarks
     * Returns all components that are both present on this item
     * stack and supported by the API.
     *
     */
    getComponents(): ItemComponent[];
    /**
     * @beta
     * @remarks
     * Returns the lore value - a secondary display string - for an
     * ItemStack.
     *
     * @returns
     * An array of lore strings. If the item does not have lore,
     * returns an empty array.
     */
    getLore(): string[];
    /**
     * @beta
     * @remarks
     * Returns a set of tags associated with this item stack.
     *
     */
    getTags(): string[];
    /**
     * @remarks
     * Returns true if the specified component is present on this
     * item stack.
     *
     * @param componentId
     * The identifier of the component (e.g., 'minecraft:food') to
     * retrieve. If no namespace prefix is specified, 'minecraft:'
     * is assumed.
     */
    hasComponent(componentId: string): boolean;
    /**
     * @beta
     * @remarks
     * Checks whether this item stack has a particular tag
     * associated with it.
     *
     * @param tag
     * Tag to search for.
     * @returns
     * True if the Item Stack has the tag associated with it, else
     * false.
     */
    hasTag(tag: string): boolean;
    /**
     * @remarks
     * Returns whether this item stack can be stacked with the
     * given `itemStack`. This is determined by comparing the item
     * type and any custom data and properties associated with the
     * item stacks. The amount of each item stack is not taken into
     * consideration.
     *
     */
    isStackableWith(itemStack: ItemStack): boolean;
    /**
     * @beta
     * @remarks
     * The list of block types this item can break in Adventure
     * mode. The block names are displayed in the item's tooltip.
     * Setting the value to undefined will clear the list.
     *
     * This function can't be called in read-only mode.
     *
     * @throws
     * Throws if any of the provided block identifiers are invalid.
     * @example example.ts
     * ```typescript
     * // Creates a diamond pickaxe that can destroy cobblestone and obsidian
     * const specialPickaxe = new ItemStack("minecraft:diamond_pickaxe");
     * specialPickaxe.setCanDestroy(["minecraft:cobblestone", "minecraft:obsidian"]);
     * ```
     */
    setCanDestroy(blockIdentifiers?: string[]): void;
    /**
     * @beta
     * @remarks
     * The list of block types this item can be placed on in
     * Adventure mode. This is only applicable to block items. The
     * block names are displayed in the item's tooltip. Setting the
     * value to undefined will clear the list.
     *
     * This function can't be called in read-only mode.
     *
     * @throws
     * Throws if any of the provided block identifiers are invalid.
     * @example example.ts
     * ```typescript
     * // Creates a gold block that can be placed on grass and dirt
     * const specialGoldBlock = new ItemStack("minecraft:gold_block");
     * specialPickaxe.setCanPlaceOn(["minecraft:grass", "minecraft:dirt"]);
     * ```
     */
    setCanPlaceOn(blockIdentifiers?: string[]): void;
    /**
     * @beta
     * @remarks
     * Sets the lore value - a secondary display string - for an
     * ItemStack.
     *
     * This function can't be called in read-only mode.
     *
     * @example diamondAwesomeSword.ts
     * ```typescript
     *   const diamondAwesomeSword = new mc.ItemStack(mc.MinecraftItemTypes.diamondSword, 1);
     *   let players = mc.world.getAllPlayers();
     *
     *   diamondAwesomeSword.setLore(["§c§lDiamond Sword of Awesome§r", "+10 coolness", "§p+4 shiny§r"]);
     *
     *   // hover over/select the item in your inventory to see the lore.
     *   const inventory = players[0].getComponent("inventory") as mc.EntityInventoryComponent;
     *   inventory.container.setItem(0, diamondAwesomeSword);
     *
     *   let item = inventory.container.getItem(0);
     *
     *   if (item) {
     *     let enchants = item.getComponent("minecraft:enchantments") as mc.ItemEnchantsComponent;
     *     let knockbackEnchant = new mc.Enchantment("knockback", 3);
     *     enchants.enchantments.addEnchantment(knockbackEnchant);
     *   }
     * ```
     * @example multilineLore.ts
     * ```typescript
     * // Set the lore of an item to multiple lines of text
     * const itemStack = new ItemStack("minecraft:diamond_sword");
     * itemStack.setLore(["Line 1", "Line 2", "Line 3"]);
     * ```
     */
    setLore(loreList?: string[]): void;
    /**
     * @beta
     * @remarks
     * Triggers an item type event. For custom items, a number of
     * events are defined in an items' definition for key item
     * behaviors.
     *
     * This function can't be called in read-only mode.
     *
     * @param eventName
     * Name of the item type event to trigger. If a namespace is
     * not specified, minecraft: is assumed.
     */
    triggerEvent(eventName: string): void;
}

/**
 * @beta
 * Contains information related to a chargeable item starting
 * to be charged.
 */
export class ItemStartUseAfterEvent {
    private constructor();
    /**
     * @remarks
     * The impacted item stack that is starting to be charged.
     *
     */
    readonly itemStack: ItemStack;
    /**
     * @remarks
     * Returns the source entity that triggered this item event.
     *
     */
    readonly source: Entity;
    /**
     * @remarks
     * Returns the time, in ticks, for the remaining duration left
     * before the charge completes its cycle.
     *
     */
    readonly useDuration: number;
}

/**
 * @beta
 * Manages callbacks that are connected to the start of
 * charging for a chargeable item.
 */
// @ts-ignore Class inheritance allowed for native defined classes
export class ItemStartUseAfterEventSignal extends IItemStartUseAfterEventSignal {
    private constructor();
}

/**
 * @beta
 * Contains information related to an item being used on a
 * block. This event fires when a player presses the the Use
 * Item / Place Block button to successfully use an item or
 * place a block. Fires for the first block that is interacted
 * with when performing a build action. Note: This event cannot
 * be used with Hoe or Axe items.
 */
export class ItemStartUseOnAfterEvent {
    private constructor();
    /**
     * @remarks
     * The block that the item is used on.
     *
     */
    readonly block: Block;
    /**
     * @remarks
     * The face of the block that an item is being used on.
     *
     */
    readonly blockFace: Direction;
    /**
     * @remarks
     * The impacted item stack that is starting to be used.
     *
     */
    readonly itemStack: ItemStack;
    /**
     * @remarks
     * Returns the source entity that triggered this item event.
     *
     */
    readonly source: Entity;
}

/**
 * @beta
 * Manages callbacks that are connected to an item starting
 * being used on a block event.
 */
// @ts-ignore Class inheritance allowed for native defined classes
export class ItemStartUseOnAfterEventSignal extends IItemStartUseOnAfterEventSignal {
    private constructor();
}

/**
 * @beta
 * Contains information related to a chargeable item has
 * finished an items use cycle, or when the player has released
 * the use action with the item.
 */
export class ItemStopUseAfterEvent {
    private constructor();
    /**
     * @remarks
     * The impacted item stack that is stopping being charged.
     *
     */
    readonly itemStack: ItemStack;
    /**
     * @remarks
     * Returns the source entity that triggered this item event.
     *
     */
    readonly source: Entity;
    /**
     * @remarks
     * Returns the time, in ticks, for the remaining duration left
     * before the charge completes its cycle.
     *
     */
    readonly useDuration: number;
}

/**
 * @beta
 * Manages callbacks that are connected to the stopping of
 * charging for an item that has a registered
 * minecraft:chargeable component.
 */
// @ts-ignore Class inheritance allowed for native defined classes
export class ItemStopUseAfterEventSignal extends IItemStopUseAfterEventSignal {
    private constructor();
}

/**
 * @beta
 * Contains information related to an item that has stopped
 * being used on a block. This event fires when a player
 * successfully uses an item or places a block by pressing the
 * Use Item / Place Block button. If multiple blocks are
 * placed, this event will only occur once at the beginning of
 * the block placement. Note: This event cannot be used with
 * Hoe or Axe items.
 */
export class ItemStopUseOnAfterEvent {
    private constructor();
    /**
     * @remarks
     * The block that the item is used on.
     *
     */
    readonly block: Block;
    /**
     * @remarks
     * The impacted item stack that is being used on a block.
     *
     */
    readonly itemStack?: ItemStack;
    /**
     * @remarks
     * Returns the source entity that triggered this item event.
     *
     */
    readonly source: Entity;
}

/**
 * @beta
 * Manages callbacks that are connected to an item stops used
 * on a block event.
 */
// @ts-ignore Class inheritance allowed for native defined classes
export class ItemStopUseOnAfterEventSignal extends IItemStopUseOnAfterEventSignal {
    private constructor();
}

/**
 * Represents the type of an item - for example, Wool.
 */
export class ItemType {
    private constructor();
    /**
     * @remarks
     * Returns the identifier of the item type - for example,
     * 'minecraft:apple'.
     *
     */
    readonly id: string;
}

/**
 * @beta
 */
export class ItemTypeIterator implements Iterable<ItemType> {
    private constructor();
    /**
     * @remarks
     * This function can't be called in read-only mode.
     *
     */
    [Symbol.iterator](): Iterator<ItemType>;
    /**
     * @remarks
     * This function can't be called in read-only mode.
     *
     */
    next(): IteratorResult<ItemType>;
}

/**
 * @beta
 * Returns the set of item types registered within Minecraft.
 */
export class ItemTypes {
    private constructor();
    /**
     * @remarks
     * Returns a specific item type, if available within Minecraft.
     *
     */
    static get(itemId: string): ItemType;
    /**
     * @remarks
     * Retrieves all available item types registered within
     * Minecraft.
     *
     */
    static getAll(): ItemTypeIterator;
}

/**
 * @beta
 * Contains information related to an item being used. This
 * event fires when an item is successfully used by a player.
 */
export class ItemUseAfterEvent {
    private constructor();
    /**
     * @remarks
     * The impacted item stack that is being used.
     *
     */
    itemStack: ItemStack;
    /**
     * @remarks
     * Returns the source entity that triggered this item event.
     *
     */
    readonly source: Entity;
}

/**
 * @beta
 * Manages callbacks that are connected to an item use event.
 */
// @ts-ignore Class inheritance allowed for native defined classes
export class ItemUseAfterEventSignal extends IItemUseAfterEventSignal {
    private constructor();
}

/**
 * @beta
 * Contains information related to an item being used.
 */
// @ts-ignore Class inheritance allowed for native defined classes
export class ItemUseBeforeEvent extends ItemUseAfterEvent {
    private constructor();
    /**
     * @remarks
     * If set to true, this will cancel the item use behavior.
     *
     */
    cancel: boolean;
}

/**
 * @beta
 * Manages callbacks that fire before an item is used.
 */
// @ts-ignore Class inheritance allowed for native defined classes
export class ItemUseBeforeEventSignal extends IItemUseBeforeEventSignal {
    private constructor();
}

/**
 * @beta
 * Contains information related to an item being used on a
 * block. This event fires when an item is successfully used on
 * a block by a player.
 */
export class ItemUseOnAfterEvent {
    private constructor();
    /**
     * @remarks
     * The block that the item is used on.
     *
     */
    readonly block: Block;
    /**
     * @remarks
     * The face of the block that an item is being used on.
     *
     */
    readonly blockFace: Direction;
    /**
     * @remarks
     * Location relative to the bottom north-west corner of the
     * block where the item is placed.
     *
     */
    readonly faceLocation: Vector3;
    /**
     * @remarks
     * The impacted item stack that is being used on a block.
     *
     */
    readonly itemStack: ItemStack;
    /**
     * @remarks
     * Returns the source entity that triggered this item event.
     *
     */
    readonly source: Entity;
}

/**
 * @beta
 * Manages callbacks that are connected to an item being used
 * on a block event.
 */
// @ts-ignore Class inheritance allowed for native defined classes
export class ItemUseOnAfterEventSignal extends IItemUseOnAfterEventSignal {
    private constructor();
}

/**
 * @beta
 * Contains information related to an item being used on a
 * block.
 */
// @ts-ignore Class inheritance allowed for native defined classes
export class ItemUseOnBeforeEvent extends ItemUseOnAfterEvent {
    private constructor();
    /**
     * @remarks
     * If set to true, this will cancel the item use behavior.
     *
     */
    cancel: boolean;
}

/**
 * @beta
 * Manages callbacks that fire before an item being used on a
 * block event.
 */
// @ts-ignore Class inheritance allowed for native defined classes
export class ItemUseOnBeforeEventSignal extends IItemUseOnBeforeEventSignal {
    private constructor();
}

/**
 * @beta
 */
export class ITripWireTripAfterEventSignal {
    private constructor();
    /**
     * @remarks
     * This function can't be called in read-only mode.
     *
     */
    subscribe(callback: (arg: TripWireTripAfterEvent) => void): (arg: TripWireTripAfterEvent) => void;
    /**
     * @remarks
     * This function can't be called in read-only mode.
     *
     * @throws This function can throw errors.
     */
    unsubscribe(callback: (arg: TripWireTripAfterEvent) => void): void;
}

/**
 * @beta
 * An event that fires before the watchdog is about to
 * terminate a world because various performance metrics for
 * scripting have exceeded a threshold.
 */
export class IWatchdogTerminateBeforeEventSignal {
    private constructor();
    /**
     * @remarks
     * This function can't be called in read-only mode.
     *
     */
    subscribe(callback: (arg: WatchdogTerminateBeforeEvent) => void): (arg: WatchdogTerminateBeforeEvent) => void;
    /**
     * @remarks
     * This function can't be called in read-only mode.
     *
     * @throws This function can throw errors.
     */
    unsubscribe(callback: (arg: WatchdogTerminateBeforeEvent) => void): void;
}

/**
 * @beta
 * An event that fires after the weather has changed.
 */
export class IWeatherChangeAfterEventSignal {
    private constructor();
    /**
     * @remarks
     * This function can't be called in read-only mode.
     *
     */
    subscribe(callback: (arg: WeatherChangeAfterEvent) => void): (arg: WeatherChangeAfterEvent) => void;
    /**
     * @remarks
     * This function can't be called in read-only mode.
     *
     * @throws This function can throw errors.
     */
    unsubscribe(callback: (arg: WeatherChangeAfterEvent) => void): void;
}

/**
 * @beta
 * An event that fires when a world is first initialized or
 * loaded.
 */
export class IWorldInitializeAfterEventSignal {
    private constructor();
    /**
     * @remarks
     * This function can't be called in read-only mode.
     *
     */
    subscribe(callback: (arg: WorldInitializeAfterEvent) => void): (arg: WorldInitializeAfterEvent) => void;
    /**
     * @remarks
     * This function can't be called in read-only mode.
     *
     * @throws This function can throw errors.
     */
    unsubscribe(callback: (arg: WorldInitializeAfterEvent) => void): void;
}

/**
 * Contains information related to changes to a lever
 * activating or deactivating.
 */
// @ts-ignore Class inheritance allowed for native defined classes
export class LeverActionAfterEvent extends BlockEvent {
    private constructor();
    /**
     * @remarks
     * True if the lever is activated (that is, transmitting
     * power).
     *
     */
    readonly isPowered: boolean;
    /**
     * @remarks
     * Optional player that triggered the lever activation.
     *
     */
    readonly player: Player;
}

/**
 * Manages callbacks that are connected to lever moves
 * (activates or deactivates).
 */
// @ts-ignore Class inheritance allowed for native defined classes
export class LeverActionAfterEventSignal extends ILeverActionAfterEventSignal {
    private constructor();
}

/**
 * @beta
 * A specific currently-internal event used for passing
 * messages from client to server.
 */
export class MessageReceiveAfterEvent {
    private constructor();
    /**
     * @remarks
     * The message identifier.
     *
     */
    readonly id: string;
    /**
     * @remarks
     * The message.
     *
     */
    readonly message: string;
    /**
     * @remarks
     * The player who sent the message.
     *
     */
    readonly player: Player;
}

/**
 * @beta
 * Contains definitions of standard Minecraft and Minecraft
 * Education Edition block types.
 */
export class MinecraftBlockTypes {
    private constructor();
    /**
     * @remarks
     * Represents an acacia button within Minecraft.
     *
     */
    static readonly acaciaButton: BlockType;
    /**
     * @remarks
     * Represents an acacia door within Minecraft.
     *
     */
    static readonly acaciaDoor: BlockType;
    static readonly acaciaFence: BlockType;
    /**
     * @remarks
     * Represents an acacia fence gate within Minecraft.
     *
     */
    static readonly acaciaFenceGate: BlockType;
    static readonly acaciaHangingSign: BlockType;
    static readonly acaciaLog: BlockType;
    /**
     * @remarks
     * Represents an acacia pressure plate within Minecraft.
     *
     */
    static readonly acaciaPressurePlate: BlockType;
    /**
     * @remarks
     * Represents a set of acacia stairs within Minecraft.
     *
     */
    static readonly acaciaStairs: BlockType;
    /**
     * @remarks
     * Represents an acacia standing sign within Minecraft.
     *
     */
    static readonly acaciaStandingSign: BlockType;
    /**
     * @remarks
     * Represents an acacia trapdoor within Minecraft.
     *
     */
    static readonly acaciaTrapdoor: BlockType;
    /**
     * @remarks
     * Represents an acacia wall sign within Minecraft.
     *
     */
    static readonly acaciaWallSign: BlockType;
    /**
     * @remarks
     * Represents an activator rail within Minecraft.
     *
     */
    static readonly activatorRail: BlockType;
    /**
     * @remarks
     * Represents an empty space (air) within Minecraft.
     *
     */
    static readonly air: BlockType;
    /**
     * @remarks
     * Represents an allow block within Minecraft.
     *
     */
    static readonly allow: BlockType;
    /**
     * @remarks
     * Represents an amethyst block within Minecraft.
     *
     */
    static readonly amethystBlock: BlockType;
    /**
     * @remarks
     * Represents a cluster of amethyst within Minecraft.
     *
     */
    static readonly amethystCluster: BlockType;
    /**
     * @remarks
     * Represents ancient debris within Minecraft.
     *
     */
    static readonly ancientDebris: BlockType;
    /**
     * @remarks
     * Represents andesite stairs within Minecraft.
     *
     */
    static readonly andesiteStairs: BlockType;
    /**
     * @remarks
     * Represents an anvil within Minecraft.
     *
     */
    static readonly anvil: BlockType;
    /**
     * @remarks
     * Represents an azalea flowering plant within Minecraft.
     *
     */
    static readonly azalea: BlockType;
    /**
     * @remarks
     * Represents azalea leaves within Minecraft.
     *
     */
    static readonly azaleaLeaves: BlockType;
    /**
     * @remarks
     * Represents flowered azalea leaves within Minecraft.
     *
     */
    static readonly azaleaLeavesFlowered: BlockType;
    /**
     * @remarks
     * Represents a bamboo tree within Minecraft.
     *
     */
    static readonly bamboo: BlockType;
    static readonly bambooBlock: BlockType;
    static readonly bambooButton: BlockType;
    static readonly bambooDoor: BlockType;
    static readonly bambooDoubleSlab: BlockType;
    static readonly bambooFence: BlockType;
    static readonly bambooFenceGate: BlockType;
    static readonly bambooHangingSign: BlockType;
    static readonly bambooMosaic: BlockType;
    static readonly bambooMosaicDoubleSlab: BlockType;
    static readonly bambooMosaicSlab: BlockType;
    static readonly bambooMosaicStairs: BlockType;
    static readonly bambooPlanks: BlockType;
    static readonly bambooPressurePlate: BlockType;
    /**
     * @remarks
     * Represents a bamboo sapling within Minecraft.
     *
     */
    static readonly bambooSapling: BlockType;
    static readonly bambooSlab: BlockType;
    static readonly bambooStairs: BlockType;
    static readonly bambooStandingSign: BlockType;
    static readonly bambooTrapdoor: BlockType;
    static readonly bambooWallSign: BlockType;
    /**
     * @remarks
     * Represents a barrel within Minecraft.
     *
     */
    static readonly barrel: BlockType;
    /**
     * @remarks
     * Represents an invisible but logical barrier within
     * Minecraft.
     *
     */
    static readonly barrier: BlockType;
    /**
     * @remarks
     * Represents a basalt block within Minecraft.
     *
     */
    static readonly basalt: BlockType;
    /**
     * @remarks
     * Represents a beacon within Minecraft.
     *
     */
    static readonly beacon: BlockType;
    /**
     * @remarks
     * Represents a bed within Minecraft.
     *
     */
    static readonly bed: BlockType;
    /**
     * @remarks
     * Represents a bedrock block within Minecraft.
     *
     */
    static readonly bedrock: BlockType;
    /**
     * @remarks
     * Represents a beehive within Minecraft.
     *
     */
    static readonly beehive: BlockType;
    /**
     * @remarks
     * Represents a bee nest within Minecraft.
     *
     */
    static readonly beeNest: BlockType;
    /**
     * @remarks
     * Represents a beetroot vegetable within Minecraft.
     *
     */
    static readonly beetroot: BlockType;
    /**
     * @remarks
     * Represents a bell within Minecraft.
     *
     */
    static readonly bell: BlockType;
    /**
     * @remarks
     * Represents a big dripleaf plant within Minecraft.
     *
     */
    static readonly bigDripleaf: BlockType;
    /**
     * @remarks
     * Represents a birch button within Minecraft.
     *
     */
    static readonly birchButton: BlockType;
    /**
     * @remarks
     * Represents a birch door within Minecraft.
     *
     */
    static readonly birchDoor: BlockType;
    static readonly birchFence: BlockType;
    /**
     * @remarks
     * Represents a birch fence gate within Minecraft.
     *
     */
    static readonly birchFenceGate: BlockType;
    static readonly birchHangingSign: BlockType;
    static readonly birchLog: BlockType;
    /**
     * @remarks
     * Represents a birch pressure plate within Minecraft.
     *
     */
    static readonly birchPressurePlate: BlockType;
    /**
     * @remarks
     * Represents a birch stairs block within Minecraft.
     *
     */
    static readonly birchStairs: BlockType;
    /**
     * @remarks
     * Represents a birch standing sign within Minecraft.
     *
     */
    static readonly birchStandingSign: BlockType;
    /**
     * @remarks
     * Represents a birch trapdoor within Minecraft.
     *
     */
    static readonly birchTrapdoor: BlockType;
    /**
     * @remarks
     * Represents a birch wall sign within Minecraft.
     *
     */
    static readonly birchWallSign: BlockType;
    /**
     * @remarks
     * Represents a black candle within Minecraft.
     *
     */
    static readonly blackCandle: BlockType;
    /**
     * @remarks
     * Represents a black candle cake within Minecraft.
     *
     */
    static readonly blackCandleCake: BlockType;
    static readonly blackCarpet: BlockType;
    static readonly blackConcrete: BlockType;
    /**
     * @remarks
     * Represents a black glazed terracotta block within Minecraft.
     *
     */
    static readonly blackGlazedTerracotta: BlockType;
    static readonly blackShulkerBox: BlockType;
    /**
     * @remarks
     * Represents a blackstone block within Minecraft.
     *
     */
    static readonly blackstone: BlockType;
    /**
     * @remarks
     * Represents a blackstone double slab within Minecraft.
     *
     */
    static readonly blackstoneDoubleSlab: BlockType;
    /**
     * @remarks
     * Represents a blackstone slab within Minecraft.
     *
     */
    static readonly blackstoneSlab: BlockType;
    /**
     * @remarks
     * Represents blackstone stairs within Minecraft.
     *
     */
    static readonly blackstoneStairs: BlockType;
    /**
     * @remarks
     * Represents a blackstone wall within Minecraft.
     *
     */
    static readonly blackstoneWall: BlockType;
    static readonly blackWool: BlockType;
    /**
     * @remarks
     * Represents a blast furnace within Minecraft.
     *
     */
    static readonly blastFurnace: BlockType;
    /**
     * @remarks
     * Represents a blue candle within Minecraft.
     *
     */
    static readonly blueCandle: BlockType;
    /**
     * @remarks
     * Represents a blue candle cake within Minecraft.
     *
     */
    static readonly blueCandleCake: BlockType;
    static readonly blueCarpet: BlockType;
    static readonly blueConcrete: BlockType;
    /**
     * @remarks
     * Represents a blue glazed terracotta block within Minecraft.
     *
     */
    static readonly blueGlazedTerracotta: BlockType;
    /**
     * @remarks
     * Represents a blue ice block within Minecraft.
     *
     */
    static readonly blueIce: BlockType;
    static readonly blueShulkerBox: BlockType;
    static readonly blueWool: BlockType;
    /**
     * @remarks
     * Represents a bone block within Minecraft.
     *
     */
    static readonly boneBlock: BlockType;
    /**
     * @remarks
     * Represents an unbreakable border block within Minecraft.
     *
     */
    static readonly bookshelf: BlockType;
    /**
     * @remarks
     * Represents a border block within Minecraft.
     *
     */
    static readonly borderBlock: BlockType;
    static readonly brainCoral: BlockType;
    /**
     * @remarks
     * Represents a brewing stand within Minecraft.
     *
     */
    static readonly brewingStand: BlockType;
    /**
     * @remarks
     * Represents a block of brick within Minecraft.
     *
     */
    static readonly brickBlock: BlockType;
    /**
     * @remarks
     * Represents brick stairs within Minecraft.
     *
     */
    static readonly brickStairs: BlockType;
    /**
     * @remarks
     * Represents a brown candle within Minecraft.
     *
     */
    static readonly brownCandle: BlockType;
    /**
     * @remarks
     * Represents a brown candle cake within Minecraft.
     *
     */
    static readonly brownCandleCake: BlockType;
    static readonly brownCarpet: BlockType;
    static readonly brownConcrete: BlockType;
    /**
     * @remarks
     * Represents a brown glazed terracotta block within Minecraft.
     *
     */
    static readonly brownGlazedTerracotta: BlockType;
    /**
     * @remarks
     * Represents a brown mushroom within Minecraft.
     *
     */
    static readonly brownMushroom: BlockType;
    /**
     * @remarks
     * Represents a block of brown mushroom within Minecraft.
     *
     */
    static readonly brownMushroomBlock: BlockType;
    static readonly brownShulkerBox: BlockType;
    static readonly brownWool: BlockType;
    /**
     * @remarks
     * Represents a column of bubbles within Minecraft.
     *
     */
    static readonly bubbleColumn: BlockType;
    static readonly bubbleCoral: BlockType;
    /**
     * @remarks
     * Represents a block of budding amethyst within Minecraft.
     *
     */
    static readonly buddingAmethyst: BlockType;
    /**
     * @remarks
     * Represents a cactus within Minecraft.
     *
     */
    static readonly cactus: BlockType;
    /**
     * @remarks
     * Represents a cake within Minecraft.
     *
     */
    static readonly cake: BlockType;
    /**
     * @remarks
     * Represents a calcite block within Minecraft.
     *
     */
    static readonly calcite: BlockType;
    static readonly calibratedSculkSensor: BlockType;
    /**
     * @remarks
     * Represents a camera within Minecraft Education Edition. It
     * is not available in Minecraft Bedrock Edition.
     *
     */
    static readonly camera: BlockType;
    /**
     * @remarks
     * Represents a campfire within Minecraft.
     *
     */
    static readonly campfire: BlockType;
    /**
     * @remarks
     * Represents a candle within Minecraft.
     *
     */
    static readonly candle: BlockType;
    /**
     * @remarks
     * Represents a cake with candles within Minecraft.
     *
     */
    static readonly candleCake: BlockType;
    /**
     * @remarks
     * Represents carrots within Minecraft.
     *
     */
    static readonly carrots: BlockType;
    /**
     * @remarks
     * Represents a cartography table block within Minecraft.
     *
     */
    static readonly cartographyTable: BlockType;
    /**
     * @remarks
     * Represents a carved pumpkin within Minecraft.
     *
     */
    static readonly carvedPumpkin: BlockType;
    /**
     * @remarks
     * Represents a cauldron within Minecraft.
     *
     */
    static readonly cauldron: BlockType;
    /**
     * @remarks
     * Represents a set of cave vines within Minecraft.
     *
     */
    static readonly caveVines: BlockType;
    /**
     * @remarks
     * Represents the body of a set of cave vines with berries
     * within Minecraft.
     *
     */
    static readonly caveVinesBodyWithBerries: BlockType;
    /**
     * @remarks
     * Represents the head of a set of cave vines with berries
     * within Minecraft.
     *
     */
    static readonly caveVinesHeadWithBerries: BlockType;
    /**
     * @remarks
     * Represents a metallic chain within Minecraft.
     *
     */
    static readonly chain: BlockType;
    /**
     * @remarks
     * Represents a block that gives off heat but not light, within
     * Minecraft Education Edition or Bedrock Edition with
     * Education features.
     *
     */
    static readonly chainCommandBlock: BlockType;
    /**
     * @remarks
     * Represents a chemical heat block within Minecraft.
     *
     */
    static readonly chemicalHeat: BlockType;
    /**
     * @remarks
     * Represents a chemistry table within Minecraft Education
     * experiences.
     *
     */
    static readonly chemistryTable: BlockType;
    static readonly cherryButton: BlockType;
    static readonly cherryDoor: BlockType;
    static readonly cherryDoubleSlab: BlockType;
    static readonly cherryFence: BlockType;
    static readonly cherryFenceGate: BlockType;
    static readonly cherryHangingSign: BlockType;
    static readonly cherryLeaves: BlockType;
    static readonly cherryLog: BlockType;
    static readonly cherryPlanks: BlockType;
    static readonly cherryPressurePlate: BlockType;
    static readonly cherrySapling: BlockType;
    static readonly cherrySlab: BlockType;
    static readonly cherryStairs: BlockType;
    static readonly cherryStandingSign: BlockType;
    static readonly cherryTrapdoor: BlockType;
    static readonly cherryWallSign: BlockType;
    static readonly cherryWood: BlockType;
    /**
     * @remarks
     * Represents a chest within Minecraft.
     *
     */
    static readonly chest: BlockType;
    static readonly chiseledBookshelf: BlockType;
    /**
     * @remarks
     * Represents a set of chiseled deepslate within Minecraft.
     *
     */
    static readonly chiseledDeepslate: BlockType;
    /**
     * @remarks
     * Represents a block of chiseled nether bricks within
     * Minecraft.
     *
     */
    static readonly chiseledNetherBricks: BlockType;
    /**
     * @remarks
     * Represents a block of chiseled polished blackstone within
     * Minecraft.
     *
     */
    static readonly chiseledPolishedBlackstone: BlockType;
    /**
     * @remarks
     * Represents a chorus flower within Minecraft.
     *
     */
    static readonly chorusFlower: BlockType;
    /**
     * @remarks
     * Represents a chorus plant within Minecraft.
     *
     */
    static readonly chorusPlant: BlockType;
    /**
     * @remarks
     * Represents a block of clay within Minecraft.
     *
     */
    static readonly clay: BlockType;
    static readonly clientRequestPlaceholderBlock: BlockType;
    /**
     * @remarks
     * Represents a block of solid coal within Minecraft.
     *
     */
    static readonly coalBlock: BlockType;
    /**
     * @remarks
     * Represents a block with embedded coal ore within Minecraft.
     *
     */
    static readonly coalOre: BlockType;
    /**
     * @remarks
     * Represents a block of cobbled deepslate within Minecraft.
     *
     */
    static readonly cobbledDeepslate: BlockType;
    /**
     * @remarks
     * Represents a double slab of cobbled deepslate within
     * Minecraft.
     *
     */
    static readonly cobbledDeepslateDoubleSlab: BlockType;
    /**
     * @remarks
     * Represents a slab of deepslate within Minecraft.
     *
     */
    static readonly cobbledDeepslateSlab: BlockType;
    /**
     * @remarks
     * Represents cobbled deepslate stairs within Minecraft.
     *
     */
    static readonly cobbledDeepslateStairs: BlockType;
    /**
     * @remarks
     * Represents a cobbled deepslate wall within Minecraft.
     *
     */
    static readonly cobbledDeepslateWall: BlockType;
    /**
     * @remarks
     * Represents a block of cobblestone within Minecraft.
     *
     */
    static readonly cobblestone: BlockType;
    /**
     * @remarks
     * Represents a wall of cobblestone within Minecraft.
     *
     */
    static readonly cobblestoneWall: BlockType;
    /**
     * @remarks
     * Represents a set of cocoa beans (typically on a tree) within
     * Minecraft.
     *
     */
    static readonly cocoa: BlockType;
    /**
     * @remarks
     * Represents blue/purple torches within Minecraft.
     *
     */
    static readonly coloredTorchBp: BlockType;
    /**
     * @remarks
     * Represents red/green torches within Minecraft.
     *
     */
    static readonly coloredTorchRg: BlockType;
    /**
     * @remarks
     * Represents a block that can run commands within Minecraft.
     *
     */
    static readonly commandBlock: BlockType;
    /**
     * @remarks
     * Represents a composter block within Minecraft.
     *
     */
    static readonly composter: BlockType;
    /**
     * @remarks
     * Represents a block of concrete powder within Minecraft.
     *
     */
    static readonly concretePowder: BlockType;
    /**
     * @remarks
     * Represents a conduit block within Minecraft.
     *
     */
    static readonly conduit: BlockType;
    /**
     * @remarks
     * Represents a solid block of copper within Minecraft.
     *
     */
    static readonly copperBlock: BlockType;
    /**
     * @remarks
     * Represents a block with embedded copper ore within
     * Minecraft.
     *
     */
    static readonly copperOre: BlockType;
    /**
     * @remarks
     * Represents a solid block of coral within Minecraft.
     *
     */
    static readonly coralBlock: BlockType;
    /**
     * @remarks
     * Represents a fan formation of coral within Minecraft.
     *
     */
    static readonly coralFan: BlockType;
    /**
     * @remarks
     * Represents a fan formation of dead coral within Minecraft.
     *
     */
    static readonly coralFanDead: BlockType;
    /**
     * @remarks
     * Represents a hanging fan formation of coral within
     * Minecraft.
     *
     */
    static readonly coralFanHang: BlockType;
    /**
     * @remarks
     * Represents an alternate hanging fan formation of coral (#2)
     * within Minecraft.
     *
     */
    static readonly coralFanHang2: BlockType;
    /**
     * @remarks
     * Represents an alternate hanging fan formation of coral (#3)
     * within Minecraft.
     *
     */
    static readonly coralFanHang3: BlockType;
    /**
     * @remarks
     * Represents a block of cracked deepslate bricks within
     * Minecraft.
     *
     */
    static readonly crackedDeepslateBricks: BlockType;
    /**
     * @remarks
     * Represents tiles of cracked deepslate within Minecraft.
     *
     */
    static readonly crackedDeepslateTiles: BlockType;
    /**
     * @remarks
     * Represents a block of cracked nether bricks within
     * Minecraft.
     *
     */
    static readonly crackedNetherBricks: BlockType;
    /**
     * @remarks
     * Represents a block of cracked and polished blackstone bricks
     * within Minecraft.
     *
     */
    static readonly crackedPolishedBlackstoneBricks: BlockType;
    /**
     * @remarks
     * Represents a crafting table within Minecraft.
     *
     */
    static readonly craftingTable: BlockType;
    /**
     * @remarks
     * Represents a crimson button within Minecraft.
     *
     */
    static readonly crimsonButton: BlockType;
    /**
     * @remarks
     * Represents a crimson door within Minecraft.
     *
     */
    static readonly crimsonDoor: BlockType;
    /**
     * @remarks
     * Represents a crimson double slab within Minecraft.
     *
     */
    static readonly crimsonDoubleSlab: BlockType;
    /**
     * @remarks
     * Represents a crimson fence within Minecraft.
     *
     */
    static readonly crimsonFence: BlockType;
    /**
     * @remarks
     * Represents a crimson fence gate within Minecraft.
     *
     */
    static readonly crimsonFenceGate: BlockType;
    /**
     * @remarks
     * Represents a crimson fungus within Minecraft.
     *
     */
    static readonly crimsonFungus: BlockType;
    static readonly crimsonHangingSign: BlockType;
    /**
     * @remarks
     * Represents crimson hyphae within Minecraft.
     *
     */
    static readonly crimsonHyphae: BlockType;
    /**
     * @remarks
     * Represents crimson nylium within Minecraft.
     *
     */
    static readonly crimsonNylium: BlockType;
    /**
     * @remarks
     * Represents a set of crimson planks within Minecraft.
     *
     */
    static readonly crimsonPlanks: BlockType;
    /**
     * @remarks
     * Represents a crimson pressure plate within Minecraft.
     *
     */
    static readonly crimsonPressurePlate: BlockType;
    /**
     * @remarks
     * Represents a set of crimson roots within Minecraft.
     *
     */
    static readonly crimsonRoots: BlockType;
    /**
     * @remarks
     * Represents a crimson slab within Minecraft.
     *
     */
    static readonly crimsonSlab: BlockType;
    /**
     * @remarks
     * Represents a set of crimson stairs within Minecraft.
     *
     */
    static readonly crimsonStairs: BlockType;
    /**
     * @remarks
     * Represents a crimson standing sign within Minecraft.
     *
     */
    static readonly crimsonStandingSign: BlockType;
    /**
     * @remarks
     * Represents a crimson stem within Minecraft.
     *
     */
    static readonly crimsonStem: BlockType;
    /**
     * @remarks
     * Represents a crimson trapdoor within Minecraft.
     *
     */
    static readonly crimsonTrapdoor: BlockType;
    /**
     * @remarks
     * Represents a crimson wall sign within Minecraft.
     *
     */
    static readonly crimsonWallSign: BlockType;
    /**
     * @remarks
     * Represents crying obsidian within Minecraft.
     *
     */
    static readonly cryingObsidian: BlockType;
    /**
     * @remarks
     * Represents a cut copper block within Minecraft.
     *
     */
    static readonly cutCopper: BlockType;
    /**
     * @remarks
     * Represents a cut copper slab within Minecraft.
     *
     */
    static readonly cutCopperSlab: BlockType;
    /**
     * @remarks
     * Represents a set of cut copper stairs within Minecraft.
     *
     */
    static readonly cutCopperStairs: BlockType;
    /**
     * @remarks
     * Represents a cyan-colored candle within Minecraft.
     *
     */
    static readonly cyanCandle: BlockType;
    /**
     * @remarks
     * Represents a cake with a cyan-colored candle within
     * Minecraft.
     *
     */
    static readonly cyanCandleCake: BlockType;
    static readonly cyanCarpet: BlockType;
    static readonly cyanConcrete: BlockType;
    /**
     * @remarks
     * Represents a block of cyan-colored glazed terracotta within
     * Minecraft.
     *
     */
    static readonly cyanGlazedTerracotta: BlockType;
    static readonly cyanShulkerBox: BlockType;
    static readonly cyanWool: BlockType;
    /**
     * @remarks
     * Represents a dark oak button within Minecraft.
     *
     */
    static readonly darkOakButton: BlockType;
    /**
     * @remarks
     * Represents a dark oak door within Minecraft.
     *
     */
    static readonly darkOakDoor: BlockType;
    static readonly darkOakFence: BlockType;
    /**
     * @remarks
     * Represents a dark oak fence gate within Minecraft.
     *
     */
    static readonly darkOakFenceGate: BlockType;
    static readonly darkOakHangingSign: BlockType;
    static readonly darkOakLog: BlockType;
    /**
     * @remarks
     * Represents a dark oak pressure plate within Minecraft.
     *
     */
    static readonly darkOakPressurePlate: BlockType;
    /**
     * @remarks
     * Represents a set of dark oak stairs within Minecraft.
     *
     */
    static readonly darkOakStairs: BlockType;
    /**
     * @remarks
     * Represents a dark oak standing sign within Minecraft.
     *
     */
    static readonly darkoakStandingSign: BlockType;
    /**
     * @remarks
     * Represents a dark oak trapdoor within Minecraft.
     *
     */
    static readonly darkOakTrapdoor: BlockType;
    /**
     * @remarks
     * Represents a dark oak wall sign within Minecraft.
     *
     */
    static readonly darkoakWallSign: BlockType;
    /**
     * @remarks
     * Represents a set of dark prismarine stairs within Minecraft.
     *
     */
    static readonly darkPrismarineStairs: BlockType;
    /**
     * @remarks
     * Represents a daylight detector within Minecraft.
     *
     */
    static readonly daylightDetector: BlockType;
    /**
     * @remarks
     * Represents an inverted daylight detector within Minecraft.
     *
     */
    static readonly daylightDetectorInverted: BlockType;
    static readonly deadBrainCoral: BlockType;
    static readonly deadBubbleCoral: BlockType;
    /**
     * @remarks
     * Represents a dead bush within Minecraft.
     *
     */
    static readonly deadbush: BlockType;
    static readonly deadFireCoral: BlockType;
    static readonly deadHornCoral: BlockType;
    static readonly deadTubeCoral: BlockType;
    static readonly decoratedPot: BlockType;
    /**
     * @remarks
     * Represents a block of deepslate within Minecraft.
     *
     */
    static readonly deepslate: BlockType;
    /**
     * @remarks
     * Represents a double slab of deepslate brick within
     * Minecraft.
     *
     */
    static readonly deepslateBrickDoubleSlab: BlockType;
    /**
     * @remarks
     * Represents a block of deepslate bricks within Minecraft.
     *
     */
    static readonly deepslateBricks: BlockType;
    /**
     * @remarks
     * Represents a slab of deepslate brick within Minecraft.
     *
     */
    static readonly deepslateBrickSlab: BlockType;
    /**
     * @remarks
     * Represents a set of deepslate brick stairs within Minecraft.
     *
     */
    static readonly deepslateBrickStairs: BlockType;
    /**
     * @remarks
     * Represents a deepslate brick wall within Minecraft.
     *
     */
    static readonly deepslateBrickWall: BlockType;
    /**
     * @remarks
     * Represents a block of deepslate with embedded coal ore
     * within Minecraft.
     *
     */
    static readonly deepslateCoalOre: BlockType;
    /**
     * @remarks
     * Represents a block of deepslate with embedded copper ore
     * within Minecraft.
     *
     */
    static readonly deepslateCopperOre: BlockType;
    /**
     * @remarks
     * Represents a block of deepslate with embedded diamond ore
     * within Minecraft.
     *
     */
    static readonly deepslateDiamondOre: BlockType;
    /**
     * @remarks
     * Represents a block of deepslate with embedded emerald ore
     * within Minecraft.
     *
     */
    static readonly deepslateEmeraldOre: BlockType;
    /**
     * @remarks
     * Represents a block of deepslate with embedded gold ore
     * within Minecraft.
     *
     */
    static readonly deepslateGoldOre: BlockType;
    /**
     * @remarks
     * Represents a block of deepslate with embedded iron ore
     * within Minecraft.
     *
     */
    static readonly deepslateIronOre: BlockType;
    /**
     * @remarks
     * Represents a block of deepslate with embedded lapis lazuli
     * ore within Minecraft.
     *
     */
    static readonly deepslateLapisOre: BlockType;
    /**
     * @remarks
     * Represents a block of deepslate with embedded redstone ore
     * within Minecraft.
     *
     */
    static readonly deepslateRedstoneOre: BlockType;
    /**
     * @remarks
     * Represents a double slab of tiled deepslate within
     * Minecraft.
     *
     */
    static readonly deepslateTileDoubleSlab: BlockType;
    /**
     * @remarks
     * Represents a set of deepslate tiles within Minecraft.
     *
     */
    static readonly deepslateTiles: BlockType;
    /**
     * @remarks
     * Represents a slab of deepslate tiles within Minecraft.
     *
     */
    static readonly deepslateTileSlab: BlockType;
    /**
     * @remarks
     * Represents a set of deepslate tile stairs within Minecraft.
     *
     */
    static readonly deepslateTileStairs: BlockType;
    /**
     * @remarks
     * Represents a wall of deepslate tile within Minecraft.
     *
     */
    static readonly deepslateTileWall: BlockType;
    /**
     * @remarks
     * Represents a logical but generally invisible Deny logic
     * block within Minecraft.
     *
     */
    static readonly deny: BlockType;
    /**
     * @remarks
     * Represents a detector rail within Minecraft.
     *
     */
    static readonly detectorRail: BlockType;
    /**
     * @remarks
     * Represents a block of diamond within Minecraft.
     *
     */
    static readonly diamondBlock: BlockType;
    /**
     * @remarks
     * Represents a block with embedded diamond ore within
     * Minecraft.
     *
     */
    static readonly diamondOre: BlockType;
    /**
     * @remarks
     * Represents a set of diorite stairs within Minecraft.
     *
     */
    static readonly dioriteStairs: BlockType;
    /**
     * @remarks
     * Represents a block of dirt within Minecraft.
     *
     */
    static readonly dirt: BlockType;
    /**
     * @remarks
     * Represents a block of dirt with roots within Minecraft.
     *
     */
    static readonly dirtWithRoots: BlockType;
    /**
     * @remarks
     * Represents a dispenser within Minecraft.
     *
     */
    static readonly dispenser: BlockType;
    /**
     * @remarks
     * Represents a slab of double cut copper within Minecraft.
     *
     */
    static readonly doubleCutCopperSlab: BlockType;
    /**
     * @remarks
     * Represents a double plant within Minecraft.
     *
     */
    static readonly doublePlant: BlockType;
    static readonly doubleStoneBlockSlab: BlockType;
    static readonly doubleStoneBlockSlab2: BlockType;
    static readonly doubleStoneBlockSlab3: BlockType;
    static readonly doubleStoneBlockSlab4: BlockType;
    /**
     * @remarks
     * Represents a double slab of stone within Minecraft.
     *
     */
    static readonly doubleStoneSlab: BlockType;
    /**
     * @remarks
     * Represents an alternate double slab of stone (#2) within
     * Minecraft.
     *
     */
    static readonly doubleStoneSlab2: BlockType;
    /**
     * @remarks
     * Represents an alternate double slab of stone (#3) within
     * Minecraft.
     *
     */
    static readonly doubleStoneSlab3: BlockType;
    /**
     * @remarks
     * Represents an alternate double slab of stone (#4) within
     * Minecraft.
     *
     */
    static readonly doubleStoneSlab4: BlockType;
    /**
     * @remarks
     * Represents a double slab of wood within Minecraft.
     *
     */
    static readonly doubleWoodenSlab: BlockType;
    /**
     * @remarks
     * Represents a dragon egg within Minecraft.
     *
     */
    static readonly dragonEgg: BlockType;
    /**
     * @remarks
     * Represents a block of dried kelp within Minecraft.
     *
     */
    static readonly driedKelpBlock: BlockType;
    /**
     * @remarks
     * Represents a block of dripstone within Minecraft.
     *
     */
    static readonly dripstoneBlock: BlockType;
    /**
     * @remarks
     * Represents a dropper within Minecraft.
     *
     */
    static readonly dropper: BlockType;
    /**
     * @remarks
     * Represents an element in Minecraft Education experiences.
     *
     */
    static readonly element0: BlockType;
    /**
     * @remarks
     * Represents the hydrogen element in Minecraft Education
     * experiences.
     *
     */
    static readonly element1: BlockType;
    /**
     * @remarks
     * Represents the neon element in Minecraft Education
     * experiences.
     *
     */
    static readonly element10: BlockType;
    /**
     * @remarks
     * Represents the fermium element in Minecraft Education
     * experiences.
     *
     */
    static readonly element100: BlockType;
    /**
     * @remarks
     * Represents the mendelevium element in Minecraft Education
     * experiences.
     *
     */
    static readonly element101: BlockType;
    /**
     * @remarks
     * Represents the nobelium element in Minecraft Education
     * experiences.
     *
     */
    static readonly element102: BlockType;
    /**
     * @remarks
     * Represents the lawrencium element in Minecraft Education
     * experiences.
     *
     */
    static readonly element103: BlockType;
    /**
     * @remarks
     * Represents the rutherfordium element in Minecraft Education
     * experiences.
     *
     */
    static readonly element104: BlockType;
    /**
     * @remarks
     * Represents the dubnium element in Minecraft Education
     * experiences.
     *
     */
    static readonly element105: BlockType;
    /**
     * @remarks
     * Represents the seaborgium element in Minecraft Education
     * experiences.
     *
     */
    static readonly element106: BlockType;
    /**
     * @remarks
     * Represents the bohrium element in Minecraft Education
     * experiences.
     *
     */
    static readonly element107: BlockType;
    /**
     * @remarks
     * Represents the hassium element in Minecraft Education
     * experiences.
     *
     */
    static readonly element108: BlockType;
    /**
     * @remarks
     * Represents the meitnerium element in Minecraft Education
     * experiences.
     *
     */
    static readonly element109: BlockType;
    /**
     * @remarks
     * Represents the sodium element in Minecraft Education
     * experiences.
     *
     */
    static readonly element11: BlockType;
    /**
     * @remarks
     * Represents the darmstadtium element in Minecraft Education
     * experiences.
     *
     */
    static readonly element110: BlockType;
    /**
     * @remarks
     * Represents the roentgenium element in Minecraft Education
     * experiences.
     *
     */
    static readonly element111: BlockType;
    /**
     * @remarks
     * Represents the copernicium element in Minecraft Education
     * experiences.
     *
     */
    static readonly element112: BlockType;
    /**
     * @remarks
     * Represents the nihonium element in Minecraft Education
     * experiences.
     *
     */
    static readonly element113: BlockType;
    /**
     * @remarks
     * Represents the flerovium element in Minecraft Education
     * experiences.
     *
     */
    static readonly element114: BlockType;
    /**
     * @remarks
     * Represents the moscovium element in Minecraft Education
     * experiences.
     *
     */
    static readonly element115: BlockType;
    /**
     * @remarks
     * Represents the livermorium element in Minecraft Education
     * experiences.
     *
     */
    static readonly element116: BlockType;
    /**
     * @remarks
     * Represents the tennessine element in Minecraft Education
     * experiences.
     *
     */
    static readonly element117: BlockType;
    /**
     * @remarks
     * Represents the oganesson element in Minecraft Education
     * experiences.
     *
     */
    static readonly element118: BlockType;
    /**
     * @remarks
     * Represents the magnesium element in Minecraft Education
     * experiences.
     *
     */
    static readonly element12: BlockType;
    /**
     * @remarks
     * Represents the aluminum element in Minecraft Education
     * experiences.
     *
     */
    static readonly element13: BlockType;
    /**
     * @remarks
     * Represents the silicon element in Minecraft Education
     * experiences.
     *
     */
    static readonly element14: BlockType;
    /**
     * @remarks
     * Represents the phosphorus element in Minecraft Education
     * experiences.
     *
     */
    static readonly element15: BlockType;
    /**
     * @remarks
     * Represents the sulfur element in Minecraft Education
     * experiences.
     *
     */
    static readonly element16: BlockType;
    /**
     * @remarks
     * Represents the chlorine element in Minecraft Education
     * experiences.
     *
     */
    static readonly element17: BlockType;
    /**
     * @remarks
     * Represents the argon element in Minecraft Education
     * experiences.
     *
     */
    static readonly element18: BlockType;
    /**
     * @remarks
     * Represents the potassium element in Minecraft Education
     * experiences.
     *
     */
    static readonly element19: BlockType;
    /**
     * @remarks
     * Represents the helium element in Minecraft Education
     * experiences.
     *
     */
    static readonly element2: BlockType;
    /**
     * @remarks
     * Represents the calcium element in Minecraft Education
     * experiences.
     *
     */
    static readonly element20: BlockType;
    /**
     * @remarks
     * Represents the scandium element in Minecraft Education
     * experiences.
     *
     */
    static readonly element21: BlockType;
    /**
     * @remarks
     * Represents the titanium element in Minecraft Education
     * experiences.
     *
     */
    static readonly element22: BlockType;
    /**
     * @remarks
     * Represents the vanadium element in Minecraft Education
     * experiences.
     *
     */
    static readonly element23: BlockType;
    /**
     * @remarks
     * Represents the chromium element in Minecraft Education
     * experiences.
     *
     */
    static readonly element24: BlockType;
    /**
     * @remarks
     * Represents the manganese element in Minecraft Education
     * experiences.
     *
     */
    static readonly element25: BlockType;
    /**
     * @remarks
     * Represents the iron element in Minecraft Education
     * experiences.
     *
     */
    static readonly element26: BlockType;
    /**
     * @remarks
     * Represents the cobalt element in Minecraft Education
     * experiences.
     *
     */
    static readonly element27: BlockType;
    /**
     * @remarks
     * Represents the nickel element in Minecraft Education
     * experiences.
     *
     */
    static readonly element28: BlockType;
    /**
     * @remarks
     * Represents the copper element in Minecraft Education
     * experiences.
     *
     */
    static readonly element29: BlockType;
    /**
     * @remarks
     * Represents a lithium element in Minecraft Education
     * experiences.
     *
     */
    static readonly element3: BlockType;
    /**
     * @remarks
     * Represents the zinc element in Minecraft Education
     * experiences.
     *
     */
    static readonly element30: BlockType;
    /**
     * @remarks
     * Represents the gallium element in Minecraft Education
     * experiences.
     *
     */
    static readonly element31: BlockType;
    /**
     * @remarks
     * Represents a germanium element in Minecraft Education
     * experiences.
     *
     */
    static readonly element32: BlockType;
    /**
     * @remarks
     * Represents the arsenic element in Minecraft Education
     * experiences.
     *
     */
    static readonly element33: BlockType;
    /**
     * @remarks
     * Represents the selenium element in Minecraft Education
     * experiences.
     *
     */
    static readonly element34: BlockType;
    /**
     * @remarks
     * Represents the bromine element in Minecraft Education
     * experiences.
     *
     */
    static readonly element35: BlockType;
    /**
     * @remarks
     * Represents the krypton element in Minecraft Education
     * experiences.
     *
     */
    static readonly element36: BlockType;
    /**
     * @remarks
     * Represents the rubidium element in Minecraft Education
     * experiences.
     *
     */
    static readonly element37: BlockType;
    /**
     * @remarks
     * Represents the strontium element in Minecraft Education
     * experiences.
     *
     */
    static readonly element38: BlockType;
    /**
     * @remarks
     * Represents the yttrium element in Minecraft Education
     * experiences.
     *
     */
    static readonly element39: BlockType;
    /**
     * @remarks
     * Represents a beryllium element in Minecraft Education
     * experiences.
     *
     */
    static readonly element4: BlockType;
    /**
     * @remarks
     * Represents the zirconium element in Minecraft Education
     * experiences.
     *
     */
    static readonly element40: BlockType;
    /**
     * @remarks
     * Represents the niobium element in Minecraft Education
     * experiences.
     *
     */
    static readonly element41: BlockType;
    /**
     * @remarks
     * Represents the molybdenum element in Minecraft Education
     * experiences.
     *
     */
    static readonly element42: BlockType;
    /**
     * @remarks
     * Represents the technetium element in Minecraft Education
     * experiences.
     *
     */
    static readonly element43: BlockType;
    /**
     * @remarks
     * Represents the ruthenium element in Minecraft Education
     * experiences.
     *
     */
    static readonly element44: BlockType;
    /**
     * @remarks
     * Represents the rhodium element in Minecraft Education
     * experiences.
     *
     */
    static readonly element45: BlockType;
    /**
     * @remarks
     * Represents the palladium element in Minecraft Education
     * experiences.
     *
     */
    static readonly element46: BlockType;
    /**
     * @remarks
     * Represents the silver element in Minecraft Education
     * experiences.
     *
     */
    static readonly element47: BlockType;
    /**
     * @remarks
     * Represents the cadmium element in Minecraft Education
     * experiences.
     *
     */
    static readonly element48: BlockType;
    /**
     * @remarks
     * Represents the indium element in Minecraft Education
     * experiences.
     *
     */
    static readonly element49: BlockType;
    /**
     * @remarks
     * Represents the boron element in Minecraft Education
     * experiences.
     *
     */
    static readonly element5: BlockType;
    /**
     * @remarks
     * Represents the tin element in Minecraft Education
     * experiences.
     *
     */
    static readonly element50: BlockType;
    /**
     * @remarks
     * Represents the antimony element in Minecraft Education
     * experiences.
     *
     */
    static readonly element51: BlockType;
    /**
     * @remarks
     * Represents the tellurium element in Minecraft Education
     * experiences.
     *
     */
    static readonly element52: BlockType;
    /**
     * @remarks
     * Represents the iodine element in Minecraft Education
     * experiences.
     *
     */
    static readonly element53: BlockType;
    /**
     * @remarks
     * Represents the xenon element in Minecraft Education
     * experiences.
     *
     */
    static readonly element54: BlockType;
    /**
     * @remarks
     * Represents the cesium element in Minecraft Education
     * experiences.
     *
     */
    static readonly element55: BlockType;
    /**
     * @remarks
     * Represents the barium element in Minecraft Education
     * experiences.
     *
     */
    static readonly element56: BlockType;
    /**
     * @remarks
     * Represents the lanthanum element in Minecraft Education
     * experiences.
     *
     */
    static readonly element57: BlockType;
    /**
     * @remarks
     * Represents the cerium element in Minecraft Education
     * experiences.
     *
     */
    static readonly element58: BlockType;
    /**
     * @remarks
     * Represents the praseodymium element in Minecraft Education
     * experiences.
     *
     */
    static readonly element59: BlockType;
    /**
     * @remarks
     * Represents the carbon element in Minecraft Education
     * experiences.
     *
     */
    static readonly element6: BlockType;
    /**
     * @remarks
     * Represents the neodymium element in Minecraft Education
     * experiences.
     *
     */
    static readonly element60: BlockType;
    /**
     * @remarks
     * Represents the promethium element in Minecraft Education
     * experiences.
     *
     */
    static readonly element61: BlockType;
    /**
     * @remarks
     * Represents the samarium element in Minecraft Education
     * experiences.
     *
     */
    static readonly element62: BlockType;
    /**
     * @remarks
     * Represents the europium element in Minecraft Education
     * experiences.
     *
     */
    static readonly element63: BlockType;
    /**
     * @remarks
     * Represents the gadolinium element in Minecraft Education
     * experiences.
     *
     */
    static readonly element64: BlockType;
    /**
     * @remarks
     * Represents a terbium element in Minecraft Education
     * experiences.
     *
     */
    static readonly element65: BlockType;
    /**
     * @remarks
     * Represents the dysprosium element in Minecraft Education
     * experiences.
     *
     */
    static readonly element66: BlockType;
    /**
     * @remarks
     * Represents the holmium element in Minecraft Education
     * experiences.
     *
     */
    static readonly element67: BlockType;
    /**
     * @remarks
     * Represents the erbium element in Minecraft Education
     * experiences.
     *
     */
    static readonly element68: BlockType;
    /**
     * @remarks
     * Represents the thulium element in Minecraft Education
     * experiences.
     *
     */
    static readonly element69: BlockType;
    /**
     * @remarks
     * Represents the nitrogen element in Minecraft Education
     * experiences.
     *
     */
    static readonly element7: BlockType;
    /**
     * @remarks
     * Represents the ytterbium element in Minecraft Education
     * experiences.
     *
     */
    static readonly element70: BlockType;
    /**
     * @remarks
     * Represents the lutetium element in Minecraft Education
     * experiences.
     *
     */
    static readonly element71: BlockType;
    /**
     * @remarks
     * Represents a hafnium element in Minecraft Education
     * experiences.
     *
     */
    static readonly element72: BlockType;
    /**
     * @remarks
     * Represents the tantalum element in Minecraft Education
     * experiences.
     *
     */
    static readonly element73: BlockType;
    /**
     * @remarks
     * Represents the tungsten element in Minecraft Education
     * experiences.
     *
     */
    static readonly element74: BlockType;
    /**
     * @remarks
     * Represents the rhenium element in Minecraft Education
     * experiences.
     *
     */
    static readonly element75: BlockType;
    /**
     * @remarks
     * Represents the osmium element in Minecraft Education
     * experiences.
     *
     */
    static readonly element76: BlockType;
    /**
     * @remarks
     * Represents the iridium element in Minecraft Education
     * experiences.
     *
     */
    static readonly element77: BlockType;
    /**
     * @remarks
     * Represents the platinum element in Minecraft Education
     * experiences.
     *
     */
    static readonly element78: BlockType;
    /**
     * @remarks
     * Represents the gold element in Minecraft Education
     * experiences.
     *
     */
    static readonly element79: BlockType;
    /**
     * @remarks
     * Represents the oxygen element in Minecraft Education
     * experiences.
     *
     */
    static readonly element8: BlockType;
    /**
     * @remarks
     * Represents the mercury element in Minecraft Education
     * experiences.
     *
     */
    static readonly element80: BlockType;
    /**
     * @remarks
     * Represents the thallium element in Minecraft Education
     * experiences.
     *
     */
    static readonly element81: BlockType;
    /**
     * @remarks
     * Represents the lead element in Minecraft Education
     * experiences.
     *
     */
    static readonly element82: BlockType;
    /**
     * @remarks
     * Represents the bismuth element in Minecraft Education
     * experiences.
     *
     */
    static readonly element83: BlockType;
    /**
     * @remarks
     * Represents the polonium element in Minecraft Education
     * experiences.
     *
     */
    static readonly element84: BlockType;
    /**
     * @remarks
     * Represents the astatine element in Minecraft Education
     * experiences.
     *
     */
    static readonly element85: BlockType;
    /**
     * @remarks
     * Represents the radon element in Minecraft Education
     * experiences.
     *
     */
    static readonly element86: BlockType;
    /**
     * @remarks
     * Represents the francium element in Minecraft Education
     * experiences.
     *
     */
    static readonly element87: BlockType;
    /**
     * @remarks
     * Represents the radium element in Minecraft Education
     * experiences.
     *
     */
    static readonly element88: BlockType;
    /**
     * @remarks
     * Represents the actinium element in Minecraft Education
     * experiences.
     *
     */
    static readonly element89: BlockType;
    /**
     * @remarks
     * Represents the fluorine element in Minecraft Education
     * experiences.
     *
     */
    static readonly element9: BlockType;
    /**
     * @remarks
     * Represents the thorium element in Minecraft Education
     * experiences.
     *
     */
    static readonly element90: BlockType;
    /**
     * @remarks
     * Represents the protactinium element in Minecraft Education
     * experiences.
     *
     */
    static readonly element91: BlockType;
    /**
     * @remarks
     * Represents the uranium element in Minecraft Education
     * experiences.
     *
     */
    static readonly element92: BlockType;
    /**
     * @remarks
     * Represents the neptunium element in Minecraft Education
     * experiences.
     *
     */
    static readonly element93: BlockType;
    /**
     * @remarks
     * Represents the plutonium element in Minecraft Education
     * experiences.
     *
     */
    static readonly element94: BlockType;
    /**
     * @remarks
     * Represents the americium element in Minecraft Education
     * experiences.
     *
     */
    static readonly element95: BlockType;
    /**
     * @remarks
     * Represents the curium element in Minecraft Education
     * experiences.
     *
     */
    static readonly element96: BlockType;
    /**
     * @remarks
     * Represents the berkelium element in Minecraft Education
     * experiences.
     *
     */
    static readonly element97: BlockType;
    /**
     * @remarks
     * Represents the californium element in Minecraft Education
     * experiences.
     *
     */
    static readonly element98: BlockType;
    /**
     * @remarks
     * Represents the einsteinium element in Minecraft Education
     * experiences.
     *
     */
    static readonly element99: BlockType;
    /**
     * @remarks
     * Represents a block of emerald within Minecraft.
     *
     */
    static readonly emeraldBlock: BlockType;
    /**
     * @remarks
     * Represents a block with embedded emerald ore within
     * Minecraft.
     *
     */
    static readonly emeraldOre: BlockType;
    /**
     * @remarks
     * Represents an enchanting table within Minecraft.
     *
     */
    static readonly enchantingTable: BlockType;
    /**
     * @remarks
     * Represents an end bricks block within Minecraft.
     *
     */
    static readonly endBricks: BlockType;
    /**
     * @remarks
     * Represents a set of end brick stairs within Minecraft.
     *
     */
    static readonly endBrickStairs: BlockType;
    /**
     * @remarks
     * Represents an ender chest within Minecraft.
     *
     */
    static readonly enderChest: BlockType;
    /**
     * @remarks
     * Represents an end gateway within Minecraft.
     *
     */
    static readonly endGateway: BlockType;
    /**
     * @remarks
     * Represents an end portal block within Minecraft.
     *
     */
    static readonly endPortal: BlockType;
    /**
     * @remarks
     * Represents an end portal frame within Minecraft.
     *
     */
    static readonly endPortalFrame: BlockType;
    /**
     * @remarks
     * Represents an end rod within Minecraft.
     *
     */
    static readonly endRod: BlockType;
    /**
     * @remarks
     * Represents an end stone block within Minecraft.
     *
     */
    static readonly endStone: BlockType;
    /**
     * @remarks
     * Represents a block of exposed copper within Minecraft.
     *
     */
    static readonly exposedCopper: BlockType;
    /**
     * @remarks
     * Represents a block of exposed cut copper within Minecraft.
     *
     */
    static readonly exposedCutCopper: BlockType;
    /**
     * @remarks
     * Represents a slab of exposed cut copper within Minecraft.
     *
     */
    static readonly exposedCutCopperSlab: BlockType;
    /**
     * @remarks
     * Represents a set of exposed cut copper stairs within
     * Minecraft.
     *
     */
    static readonly exposedCutCopperStairs: BlockType;
    /**
     * @remarks
     * Represents a double slab of exposed cut copper within
     * Minecraft.
     *
     */
    static readonly exposedDoubleCutCopperSlab: BlockType;
    /**
     * @remarks
     * Represents a farmland block within Minecraft.
     *
     */
    static readonly farmland: BlockType;
    /**
     * @remarks
     * Represents a fence gate within Minecraft.
     *
     */
    static readonly fenceGate: BlockType;
    /**
     * @remarks
     * Represents a fire within Minecraft.
     *
     */
    static readonly fire: BlockType;
    static readonly fireCoral: BlockType;
    /**
     * @remarks
     * Represents a fletching table within Minecraft.
     *
     */
    static readonly fletchingTable: BlockType;
    /**
     * @remarks
     * Represents a flowering azalea plant within Minecraft.
     *
     */
    static readonly floweringAzalea: BlockType;
    /**
     * @remarks
     * Represents a flower pot within Minecraft.
     *
     */
    static readonly flowerPot: BlockType;
    /**
     * @remarks
     * Represents flowing lava within Minecraft.
     *
     */
    static readonly flowingLava: BlockType;
    /**
     * @remarks
     * Represents flowing water within Minecraft.
     *
     */
    static readonly flowingWater: BlockType;
    /**
     * @remarks
     * Represents a frame within Minecraft.
     *
     */
    static readonly frame: BlockType;
    static readonly frogSpawn: BlockType;
    /**
     * @remarks
     * Represents a frosted ice block within Minecraft.
     *
     */
    static readonly frostedIce: BlockType;
    /**
     * @remarks
     * Represents a furnace within Minecraft.
     *
     */
    static readonly furnace: BlockType;
    /**
     * @remarks
     * Represents a block of gilded blackstone within Minecraft.
     *
     */
    static readonly gildedBlackstone: BlockType;
    /**
     * @remarks
     * Represents a glass block within Minecraft.
     *
     */
    static readonly glass: BlockType;
    /**
     * @remarks
     * Represents a pane of glass within Minecraft.
     *
     */
    static readonly glassPane: BlockType;
    /**
     * @remarks
     * Represents a glowing frame within Minecraft.
     *
     */
    static readonly glowFrame: BlockType;
    /**
     * @remarks
     * Represents a glowing obsidian block within Minecraft.
     *
     */
    static readonly glowingobsidian: BlockType;
    /**
     * @remarks
     * Represents glow lichen within Minecraft.
     *
     */
    static readonly glowLichen: BlockType;
    /**
     * @remarks
     * Represents a block of glowstone within Minecraft.
     *
     */
    static readonly glowstone: BlockType;
    /**
     * @remarks
     * Represents a gold block within Minecraft.
     *
     */
    static readonly goldBlock: BlockType;
    /**
     * @remarks
     * Represents a golden rail element within Minecraft.
     *
     */
    static readonly goldenRail: BlockType;
    /**
     * @remarks
     * Represents a block with embedded gold ore within Minecraft.
     *
     */
    static readonly goldOre: BlockType;
    /**
     * @remarks
     * Represents a set of granite stairs within Minecraft.
     *
     */
    static readonly graniteStairs: BlockType;
    /**
     * @remarks
     * Represents a block of dirt and grass within Minecraft.
     *
     */
    static readonly grass: BlockType;
    /**
     * @remarks
     * Represents a block of dirt and grass with a path within
     * Minecraft.
     *
     */
    static readonly grassPath: BlockType;
    /**
     * @remarks
     * Represents a block of gravel within Minecraft.
     *
     */
    static readonly gravel: BlockType;
    /**
     * @remarks
     * Represents a gray-colored candle within Minecraft.
     *
     */
    static readonly grayCandle: BlockType;
    /**
     * @remarks
     * Represents a cake with gray-colored candle within Minecraft.
     *
     */
    static readonly grayCandleCake: BlockType;
    static readonly grayCarpet: BlockType;
    static readonly grayConcrete: BlockType;
    /**
     * @remarks
     * Represents a gray-colored block of glazed terracotta within
     * Minecraft.
     *
     */
    static readonly grayGlazedTerracotta: BlockType;
    static readonly grayShulkerBox: BlockType;
    static readonly grayWool: BlockType;
    /**
     * @remarks
     * Represents a green-colored candle within Minecraft.
     *
     */
    static readonly greenCandle: BlockType;
    /**
     * @remarks
     * Represents a green-colored candle cake within Minecraft.
     *
     */
    static readonly greenCandleCake: BlockType;
    static readonly greenCarpet: BlockType;
    static readonly greenConcrete: BlockType;
    /**
     * @remarks
     * Represents a green block of glazed terracotta within
     * Minecraft.
     *
     */
    static readonly greenGlazedTerracotta: BlockType;
    static readonly greenShulkerBox: BlockType;
    static readonly greenWool: BlockType;
    /**
     * @remarks
     * Represents a grindstone within Minecraft.
     *
     */
    static readonly grindstone: BlockType;
    /**
     * @remarks
     * Represents a set of hanging roots within Minecraft.
     *
     */
    static readonly hangingRoots: BlockType;
    /**
     * @remarks
     * Represents a block of hardened clay within Minecraft.
     *
     */
    static readonly hardenedClay: BlockType;
    /**
     * @remarks
     * Represents a block of hard glass within Minecraft.
     *
     */
    static readonly hardGlass: BlockType;
    /**
     * @remarks
     * Represents a pane of hard glass within Minecraft.
     *
     */
    static readonly hardGlassPane: BlockType;
    /**
     * @remarks
     * Represents a stained hard glass block within Minecraft.
     *
     */
    static readonly hardStainedGlass: BlockType;
    /**
     * @remarks
     * Represents a stained pane of hard glass within Minecraft.
     *
     */
    static readonly hardStainedGlassPane: BlockType;
    /**
     * @remarks
     * Represents a block of hay within Minecraft.
     *
     */
    static readonly hayBlock: BlockType;
    /**
     * @remarks
     * Represents a heavy weighted pressure plate within Minecraft.
     *
     */
    static readonly heavyWeightedPressurePlate: BlockType;
    /**
     * @remarks
     * Represents a block of honey within Minecraft.
     *
     */
    static readonly honeyBlock: BlockType;
    /**
     * @remarks
     * Represents a honeycomb block within Minecraft.
     *
     */
    static readonly honeycombBlock: BlockType;
    /**
     * @remarks
     * Represents a hopper within Minecraft.
     *
     */
    static readonly hopper: BlockType;
    static readonly hornCoral: BlockType;
    /**
     * @remarks
     * Represents a block of ice within Minecraft.
     *
     */
    static readonly ice: BlockType;
    /**
     * @remarks
     * Represents an infested block of deepslate within Minecraft.
     *
     */
    static readonly infestedDeepslate: BlockType;
    /**
     * @remarks
     * Represents an information update block within Minecraft.
     *
     */
    static readonly infoUpdate: BlockType;
    /**
     * @remarks
     * Represents an information update block within Minecraft.
     *
     */
    static readonly infoUpdate2: BlockType;
    /**
     * @remarks
     * Represents an invisible boundary bedrock block within
     * Minecraft.
     *
     */
    static readonly invisibleBedrock: BlockType;
    /**
     * @remarks
     * Represents iron bars within Minecraft.
     *
     */
    static readonly ironBars: BlockType;
    /**
     * @remarks
     * Represents a block of iron within Minecraft.
     *
     */
    static readonly ironBlock: BlockType;
    /**
     * @remarks
     * Represents an iron door within Minecraft.
     *
     */
    static readonly ironDoor: BlockType;
    /**
     * @remarks
     * Represents a block with embedded iron ore within Minecraft.
     *
     */
    static readonly ironOre: BlockType;
    /**
     * @remarks
     * Represents an iron trapdoor within Minecraft.
     *
     */
    static readonly ironTrapdoor: BlockType;
    /**
     * @remarks
     * Represents a jigsaw within Minecraft.
     *
     */
    static readonly jigsaw: BlockType;
    /**
     * @remarks
     * Represents a jukebox within Minecraft.
     *
     */
    static readonly jukebox: BlockType;
    /**
     * @remarks
     * Represents jungle wood button within Minecraft.
     *
     */
    static readonly jungleButton: BlockType;
    /**
     * @remarks
     * Represents a jungle wood door within Minecraft.
     *
     */
    static readonly jungleDoor: BlockType;
    static readonly jungleFence: BlockType;
    /**
     * @remarks
     * Represents a jungle wood fence gate within Minecraft.
     *
     */
    static readonly jungleFenceGate: BlockType;
    static readonly jungleHangingSign: BlockType;
    static readonly jungleLog: BlockType;
    /**
     * @remarks
     * Represents a jungle wood pressure plate within Minecraft.
     *
     */
    static readonly junglePressurePlate: BlockType;
    /**
     * @remarks
     * Represents a set of jungle wood stairs within Minecraft.
     *
     */
    static readonly jungleStairs: BlockType;
    /**
     * @remarks
     * Represents a jungle wood standing sign within Minecraft.
     *
     */
    static readonly jungleStandingSign: BlockType;
    /**
     * @remarks
     * Represents a jungle wood trapdoor within Minecraft.
     *
     */
    static readonly jungleTrapdoor: BlockType;
    /**
     * @remarks
     * Represents a jungle wood wall sign within Minecraft.
     *
     */
    static readonly jungleWallSign: BlockType;
    /**
     * @remarks
     * Represents a set of kelp within Minecraft.
     *
     */
    static readonly kelp: BlockType;
    /**
     * @remarks
     * Represents a ladder within Minecraft.
     *
     */
    static readonly ladder: BlockType;
    /**
     * @remarks
     * Represents a lantern within Minecraft.
     *
     */
    static readonly lantern: BlockType;
    /**
     * @remarks
     * Represents a block of lapis lazuli within Minecraft.
     *
     */
    static readonly lapisBlock: BlockType;
    /**
     * @remarks
     * Represents a block with embedded lapis lazuli within
     * Minecraft.
     *
     */
    static readonly lapisOre: BlockType;
    /**
     * @remarks
     * Represents a bud of large amethyst within Minecraft.
     *
     */
    static readonly largeAmethystBud: BlockType;
    /**
     * @remarks
     * Represents lava within Minecraft.
     *
     */
    static readonly lava: BlockType;
    /**
     * @remarks
     * Represents a set of leaves within Minecraft.
     *
     */
    static readonly leaves: BlockType;
    /**
     * @remarks
     * Represents an updated set of leaves within Minecraft.
     *
     */
    static readonly leaves2: BlockType;
    /**
     * @remarks
     * Represents a lectern within Minecraft.
     *
     */
    static readonly lectern: BlockType;
    /**
     * @remarks
     * Represents a lever within Minecraft.
     *
     */
    static readonly lever: BlockType;
    /**
     * @remarks
     * Represents a block of light within Minecraft.
     *
     */
    static readonly lightBlock: BlockType;
    /**
     * @remarks
     * Represents a light blue candle within Minecraft.
     *
     */
    static readonly lightBlueCandle: BlockType;
    /**
     * @remarks
     * Represents a light blue candle cake within Minecraft.
     *
     */
    static readonly lightBlueCandleCake: BlockType;
    static readonly lightBlueCarpet: BlockType;
    static readonly lightBlueConcrete: BlockType;
    /**
     * @remarks
     * Represents a light blue block of glazed terracotta within
     * Minecraft.
     *
     */
    static readonly lightBlueGlazedTerracotta: BlockType;
    static readonly lightBlueShulkerBox: BlockType;
    static readonly lightBlueWool: BlockType;
    /**
     * @remarks
     * Represents a light gray candle within Minecraft.
     *
     */
    static readonly lightGrayCandle: BlockType;
    /**
     * @remarks
     * Represents a light gray candle cake within Minecraft.
     *
     */
    static readonly lightGrayCandleCake: BlockType;
    static readonly lightGrayCarpet: BlockType;
    static readonly lightGrayConcrete: BlockType;
    static readonly lightGrayShulkerBox: BlockType;
    static readonly lightGrayWool: BlockType;
    /**
     * @remarks
     * Represents a lightning rod within Minecraft.
     *
     */
    static readonly lightningRod: BlockType;
    /**
     * @remarks
     * Represents a light weighted pressure plate within Minecraft.
     *
     */
    static readonly lightWeightedPressurePlate: BlockType;
    /**
     * @remarks
     * Represents a lime candle within Minecraft.
     *
     */
    static readonly limeCandle: BlockType;
    /**
     * @remarks
     * Represents a lime-colored candle cake within Minecraft.
     *
     */
    static readonly limeCandleCake: BlockType;
    static readonly limeCarpet: BlockType;
    static readonly limeConcrete: BlockType;
    /**
     * @remarks
     * Represents a lime-colored block of glazed terracotta within
     * Minecraft.
     *
     */
    static readonly limeGlazedTerracotta: BlockType;
    static readonly limeShulkerBox: BlockType;
    static readonly limeWool: BlockType;
    /**
     * @remarks
     * Represents a lit blast furnace within Minecraft.
     *
     */
    static readonly litBlastFurnace: BlockType;
    /**
     * @remarks
     * Represents lit deepslate redstone ore within Minecraft.
     *
     */
    static readonly litDeepslateRedstoneOre: BlockType;
    /**
     * @remarks
     * Represents a lit furnace within Minecraft.
     *
     */
    static readonly litFurnace: BlockType;
    /**
     * @remarks
     * Represents a lit pumpkin within Minecraft.
     *
     */
    static readonly litPumpkin: BlockType;
    /**
     * @remarks
     * Represents a lit redstone lamp within Minecraft.
     *
     */
    static readonly litRedstoneLamp: BlockType;
    /**
     * @remarks
     * Represents lit redstone ore within Minecraft.
     *
     */
    static readonly litRedstoneOre: BlockType;
    /**
     * @remarks
     * Represents a lit smoker within Minecraft.
     *
     */
    static readonly litSmoker: BlockType;
    /**
     * @remarks
     * Represents a lodestone within Minecraft.
     *
     */
    static readonly lodestone: BlockType;
    /**
     * @remarks
     * Represents a loom within Minecraft.
     *
     */
    static readonly loom: BlockType;
    /**
     * @remarks
     * Represents a magenta candle within Minecraft.
     *
     */
    static readonly magentaCandle: BlockType;
    /**
     * @remarks
     * Represents a magenta candle cake within Minecraft.
     *
     */
    static readonly magentaCandleCake: BlockType;
    static readonly magentaCarpet: BlockType;
    static readonly magentaConcrete: BlockType;
    /**
     * @remarks
     * Represents a block of magenta-colored glazed terracotta
     * within Minecraft.
     *
     */
    static readonly magentaGlazedTerracotta: BlockType;
    static readonly magentaShulkerBox: BlockType;
    static readonly magentaWool: BlockType;
    /**
     * @remarks
     * Represents magma within Minecraft.
     *
     */
    static readonly magma: BlockType;
    static readonly mangroveButton: BlockType;
    static readonly mangroveDoor: BlockType;
    static readonly mangroveDoubleSlab: BlockType;
    static readonly mangroveFence: BlockType;
    static readonly mangroveFenceGate: BlockType;
    static readonly mangroveHangingSign: BlockType;
    static readonly mangroveLeaves: BlockType;
    static readonly mangroveLog: BlockType;
    static readonly mangrovePlanks: BlockType;
    static readonly mangrovePressurePlate: BlockType;
    static readonly mangrovePropagule: BlockType;
    static readonly mangroveRoots: BlockType;
    static readonly mangroveSlab: BlockType;
    static readonly mangroveStairs: BlockType;
    static readonly mangroveStandingSign: BlockType;
    static readonly mangroveTrapdoor: BlockType;
    static readonly mangroveWallSign: BlockType;
    static readonly mangroveWood: BlockType;
    /**
     * @remarks
     * Represents a medium-sized bud of amethyst within Minecraft.
     *
     */
    static readonly mediumAmethystBud: BlockType;
    /**
     * @remarks
     * Represents a block of melon within Minecraft.
     *
     */
    static readonly melonBlock: BlockType;
    /**
     * @remarks
     * Represents a stem of melon within Minecraft.
     *
     */
    static readonly melonStem: BlockType;
    /**
     * @remarks
     * Represents a mob spawner within Minecraft.
     *
     */
    static readonly mobSpawner: BlockType;
    /**
     * @remarks
     * Represents a monster egg within Minecraft.
     *
     */
    static readonly monsterEgg: BlockType;
    /**
     * @remarks
     * Represents a block of moss within Minecraft.
     *
     */
    static readonly mossBlock: BlockType;
    /**
     * @remarks
     * Represents a carpet of moss within Minecraft.
     *
     */
    static readonly mossCarpet: BlockType;
    /**
     * @remarks
     * Represents a block of cobblestone with moss within
     * Minecraft.
     *
     */
    static readonly mossyCobblestone: BlockType;
    /**
     * @remarks
     * Represents a set of mossy cobblestone stairs within
     * Minecraft.
     *
     */
    static readonly mossyCobblestoneStairs: BlockType;
    /**
     * @remarks
     * Represents a set of mossy stone brick stairs within
     * Minecraft.
     *
     */
    static readonly mossyStoneBrickStairs: BlockType;
    static readonly movingBlock: BlockType;
    static readonly mud: BlockType;
    static readonly mudBrickDoubleSlab: BlockType;
    static readonly mudBricks: BlockType;
    static readonly mudBrickSlab: BlockType;
    static readonly mudBrickStairs: BlockType;
    static readonly mudBrickWall: BlockType;
    static readonly muddyMangroveRoots: BlockType;
    /**
     * @remarks
     * Represents a mycelium plant within Minecraft.
     *
     */
    static readonly mycelium: BlockType;
    /**
     * @remarks
     * Represents a nether brick block within Minecraft.
     *
     */
    static readonly netherBrick: BlockType;
    /**
     * @remarks
     * Represents a nether brick fence within Minecraft.
     *
     */
    static readonly netherBrickFence: BlockType;
    /**
     * @remarks
     * Represents a set of nether brick stairs within Minecraft.
     *
     */
    static readonly netherBrickStairs: BlockType;
    /**
     * @remarks
     * Represents a block of nether with embedded gold ore within
     * Minecraft.
     *
     */
    static readonly netherGoldOre: BlockType;
    /**
     * @remarks
     * Represents a block of netherite within Minecraft.
     *
     */
    static readonly netheriteBlock: BlockType;
    /**
     * @remarks
     * Represents a block of netherrack within Minecraft.
     *
     */
    static readonly netherrack: BlockType;
    /**
     * @remarks
     * Represents a nether rock within Minecraft.
     *
     */
    static readonly netherreactor: BlockType;
    /**
     * @remarks
     * Represents nether sprouts within Minecraft.
     *
     */
    static readonly netherSprouts: BlockType;
    /**
     * @remarks
     * Represents nether wart within Minecraft.
     *
     */
    static readonly netherWart: BlockType;
    /**
     * @remarks
     * Represents a block of nether wart within Minecraft.
     *
     */
    static readonly netherWartBlock: BlockType;
    /**
     * @remarks
     * Represents a standard set of stone stairs within Minecraft.
     *
     */
    static readonly normalStoneStairs: BlockType;
    /**
     * @remarks
     * Represents a note block within Minecraft.
     *
     */
    static readonly noteblock: BlockType;
    static readonly oakFence: BlockType;
    static readonly oakHangingSign: BlockType;
    static readonly oakLog: BlockType;
    /**
     * @remarks
     * Represents a set of oak stairs within Minecraft.
     *
     */
    static readonly oakStairs: BlockType;
    /**
     * @remarks
     * Represents an observer within Minecraft.
     *
     */
    static readonly observer: BlockType;
    /**
     * @remarks
     * Represents an obsidian block within Minecraft.
     *
     */
    static readonly obsidian: BlockType;
    static readonly ochreFroglight: BlockType;
    /**
     * @remarks
     * Represents an orange candle within Minecraft.
     *
     */
    static readonly orangeCandle: BlockType;
    /**
     * @remarks
     * Represents an orange candle cake within Minecraft.
     *
     */
    static readonly orangeCandleCake: BlockType;
    static readonly orangeCarpet: BlockType;
    static readonly orangeConcrete: BlockType;
    /**
     * @remarks
     * Represents a block of orange-colored glazed terracotta
     * within Minecraft.
     *
     */
    static readonly orangeGlazedTerracotta: BlockType;
    static readonly orangeShulkerBox: BlockType;
    static readonly orangeWool: BlockType;
    /**
     * @remarks
     * Represents a block of oxidized copper within Minecraft.
     *
     */
    static readonly oxidizedCopper: BlockType;
    /**
     * @remarks
     * Represents a block of oxidized cut copper within Minecraft.
     *
     */
    static readonly oxidizedCutCopper: BlockType;
    /**
     * @remarks
     * Represents a slab of oxidized cut copper within Minecraft.
     *
     */
    static readonly oxidizedCutCopperSlab: BlockType;
    /**
     * @remarks
     * Represents a set of oxidized cut copper stairs within
     * Minecraft.
     *
     */
    static readonly oxidizedCutCopperStairs: BlockType;
    /**
     * @remarks
     * Represents a double slab of oxidized cut copper within
     * Minecraft.
     *
     */
    static readonly oxidizedDoubleCutCopperSlab: BlockType;
    /**
     * @remarks
     * Represents a block of packed ice within Minecraft.
     *
     */
    static readonly packedIce: BlockType;
    static readonly packedMud: BlockType;
    static readonly pearlescentFroglight: BlockType;
    /**
     * @remarks
     * Represents a pink candle within Minecraft.
     *
     */
    static readonly pinkCandle: BlockType;
    /**
     * @remarks
     * Represents a pink candle cake within Minecraft.
     *
     */
    static readonly pinkCandleCake: BlockType;
    static readonly pinkCarpet: BlockType;
    static readonly pinkConcrete: BlockType;
    /**
     * @remarks
     * Represents a pink-colored block of glazed terracotta within
     * Minecraft.
     *
     */
    static readonly pinkGlazedTerracotta: BlockType;
    static readonly pinkPetals: BlockType;
    static readonly pinkShulkerBox: BlockType;
    static readonly pinkWool: BlockType;
    /**
     * @remarks
     * Represents a piston within Minecraft.
     *
     */
    static readonly piston: BlockType;
    static readonly pistonArmCollision: BlockType;
    static readonly pitcherCrop: BlockType;
    static readonly pitcherPlant: BlockType;
    /**
     * @remarks
     * Represents a set of planks within Minecraft.
     *
     */
    static readonly planks: BlockType;
    /**
     * @remarks
     * Represents podzol within Minecraft.
     *
     */
    static readonly podzol: BlockType;
    /**
     * @remarks
     * Represents pointed dripstone within Minecraft.
     *
     */
    static readonly pointedDripstone: BlockType;
    /**
     * @remarks
     * Represents a set of polished andesite stairs within
     * Minecraft.
     *
     */
    static readonly polishedAndesiteStairs: BlockType;
    /**
     * @remarks
     * Represents a block of polished basalt within Minecraft.
     *
     */
    static readonly polishedBasalt: BlockType;
    /**
     * @remarks
     * Represents a block of polished blackstone within Minecraft.
     *
     */
    static readonly polishedBlackstone: BlockType;
    /**
     * @remarks
     * Represents a double slab of polished blackstone brick within
     * Minecraft.
     *
     */
    static readonly polishedBlackstoneBrickDoubleSlab: BlockType;
    /**
     * @remarks
     * Represents a block of polished blackstone bricks within
     * Minecraft.
     *
     */
    static readonly polishedBlackstoneBricks: BlockType;
    /**
     * @remarks
     * Represents a slab of polished blackstone within Minecraft.
     *
     */
    static readonly polishedBlackstoneBrickSlab: BlockType;
    /**
     * @remarks
     * Represents a set of polished blackstone brick stairs within
     * Minecraft.
     *
     */
    static readonly polishedBlackstoneBrickStairs: BlockType;
    /**
     * @remarks
     * Represents a polished blackstone brick wall within
     * Minecraft.
     *
     */
    static readonly polishedBlackstoneBrickWall: BlockType;
    /**
     * @remarks
     * Represents a polished blackstone button within Minecraft.
     *
     */
    static readonly polishedBlackstoneButton: BlockType;
    /**
     * @remarks
     * Represents a double slab of polished blackstone within
     * Minecraft.
     *
     */
    static readonly polishedBlackstoneDoubleSlab: BlockType;
    /**
     * @remarks
     * Represents a polished blackstone pressure plate within
     * Minecraft.
     *
     */
    static readonly polishedBlackstonePressurePlate: BlockType;
    /**
     * @remarks
     * Represents a slab of polished blackstone within Minecraft.
     *
     */
    static readonly polishedBlackstoneSlab: BlockType;
    /**
     * @remarks
     * Represents a set of polished blackstone stairs within
     * Minecraft.
     *
     */
    static readonly polishedBlackstoneStairs: BlockType;
    /**
     * @remarks
     * Represents a polished blackstone wall within Minecraft.
     *
     */
    static readonly polishedBlackstoneWall: BlockType;
    /**
     * @remarks
     * Represents a block of polished deepslate within Minecraft.
     *
     */
    static readonly polishedDeepslate: BlockType;
    /**
     * @remarks
     * Represents a double slab of polished deepslate within
     * Minecraft.
     *
     */
    static readonly polishedDeepslateDoubleSlab: BlockType;
    /**
     * @remarks
     * Represents a slab of polished deepslate within Minecraft.
     *
     */
    static readonly polishedDeepslateSlab: BlockType;
    /**
     * @remarks
     * Represents a set of polished deepslate stairs within
     * Minecraft.
     *
     */
    static readonly polishedDeepslateStairs: BlockType;
    /**
     * @remarks
     * Represents a wall of polished deepslate within Minecraft.
     *
     */
    static readonly polishedDeepslateWall: BlockType;
    /**
     * @remarks
     * Represents a block of polished diorite within Minecraft.
     *
     */
    static readonly polishedDioriteStairs: BlockType;
    /**
     * @remarks
     * Represents a set of polished granite stairs within
     * Minecraft.
     *
     */
    static readonly polishedGraniteStairs: BlockType;
    /**
     * @remarks
     * Represents a portal within Minecraft.
     *
     */
    static readonly portal: BlockType;
    /**
     * @remarks
     * Represents a set of potatoes within Minecraft.
     *
     */
    static readonly potatoes: BlockType;
    /**
     * @remarks
     * Represents a block of powder snow within Minecraft.
     *
     */
    static readonly powderSnow: BlockType;
    /**
     * @remarks
     * Represents a powered comparator within Minecraft.
     *
     */
    static readonly poweredComparator: BlockType;
    /**
     * @remarks
     * Represents a powered repeater within Minecraft.
     *
     */
    static readonly poweredRepeater: BlockType;
    /**
     * @remarks
     * Represents a block of prismarine within Minecraft.
     *
     */
    static readonly prismarine: BlockType;
    /**
     * @remarks
     * Represents a set of prismarine brick stairs within
     * Minecraft.
     *
     */
    static readonly prismarineBricksStairs: BlockType;
    /**
     * @remarks
     * Represents a set of prismarine stairs within Minecraft.
     *
     */
    static readonly prismarineStairs: BlockType;
    /**
     * @remarks
     * Represents a pumpkin within Minecraft.
     *
     */
    static readonly pumpkin: BlockType;
    /**
     * @remarks
     * Represents a pumpkin stem within Minecraft.
     *
     */
    static readonly pumpkinStem: BlockType;
    /**
     * @remarks
     * Represents a purple candle within Minecraft.
     *
     */
    static readonly purpleCandle: BlockType;
    /**
     * @remarks
     * Represents a purple colored candle cake within Minecraft.
     *
     */
    static readonly purpleCandleCake: BlockType;
    static readonly purpleCarpet: BlockType;
    static readonly purpleConcrete: BlockType;
    /**
     * @remarks
     * Represents a purple-colored block of glazed terracotta
     * within Minecraft.
     *
     */
    static readonly purpleGlazedTerracotta: BlockType;
    static readonly purpleShulkerBox: BlockType;
    static readonly purpleWool: BlockType;
    /**
     * @remarks
     * Represents a purpur block within Minecraft.
     *
     */
    static readonly purpurBlock: BlockType;
    /**
     * @remarks
     * Represents a set of purpur stairs within Minecraft.
     *
     */
    static readonly purpurStairs: BlockType;
    /**
     * @remarks
     * Represents a block of solid quartz within Minecraft.
     *
     */
    static readonly quartzBlock: BlockType;
    /**
     * @remarks
     * Represents a block of solid quartz bricks within Minecraft.
     *
     */
    static readonly quartzBricks: BlockType;
    /**
     * @remarks
     * Represents a block with embedded quartz ore within
     * Minecraft.
     *
     */
    static readonly quartzOre: BlockType;
    /**
     * @remarks
     * Represents a set of quartz stairs within Minecraft.
     *
     */
    static readonly quartzStairs: BlockType;
    /**
     * @remarks
     * Represents a set of rails within Minecraft.
     *
     */
    static readonly rail: BlockType;
    /**
     * @remarks
     * Represents a block of raw copper within Minecraft.
     *
     */
    static readonly rawCopperBlock: BlockType;
    /**
     * @remarks
     * Represents a block of raw gold within Minecraft.
     *
     */
    static readonly rawGoldBlock: BlockType;
    /**
     * @remarks
     * Represents a block of raw iron within Minecraft.
     *
     */
    static readonly rawIronBlock: BlockType;
    /**
     * @remarks
     * Represents a red candle within Minecraft.
     *
     */
    static readonly redCandle: BlockType;
    /**
     * @remarks
     * Represents a red candle cake within Minecraft.
     *
     */
    static readonly redCandleCake: BlockType;
    static readonly redCarpet: BlockType;
    static readonly redConcrete: BlockType;
    /**
     * @remarks
     * Represents a red flower within Minecraft.
     *
     */
    static readonly redFlower: BlockType;
    /**
     * @remarks
     * Represents a red-colored block of glazed terracotta within
     * Minecraft.
     *
     */
    static readonly redGlazedTerracotta: BlockType;
    /**
     * @remarks
     * Represents a red mushroom within Minecraft.
     *
     */
    static readonly redMushroom: BlockType;
    /**
     * @remarks
     * Represents a block of red mushroom within Minecraft.
     *
     */
    static readonly redMushroomBlock: BlockType;
    /**
     * @remarks
     * Represents a block of red nether brick within Minecraft.
     *
     */
    static readonly redNetherBrick: BlockType;
    /**
     * @remarks
     * Represents a set of red nether brick stairs within
     * Minecraft.
     *
     */
    static readonly redNetherBrickStairs: BlockType;
    /**
     * @remarks
     * Represents a block of red sandstone within Minecraft.
     *
     */
    static readonly redSandstone: BlockType;
    /**
     * @remarks
     * Represents a set of red sandstone stairs within Minecraft.
     *
     */
    static readonly redSandstoneStairs: BlockType;
    static readonly redShulkerBox: BlockType;
    /**
     * @remarks
     * Represents a block of redstone within Minecraft.
     *
     */
    static readonly redstoneBlock: BlockType;
    /**
     * @remarks
     * Represents a redstone lamp within Minecraft.
     *
     */
    static readonly redstoneLamp: BlockType;
    /**
     * @remarks
     * Represents a block with embedded redstone ore within
     * Minecraft.
     *
     */
    static readonly redstoneOre: BlockType;
    /**
     * @remarks
     * Represents a redstone torch within Minecraft.
     *
     */
    static readonly redstoneTorch: BlockType;
    /**
     * @remarks
     * Represents a redstone wire within Minecraft.
     *
     */
    static readonly redstoneWire: BlockType;
    static readonly redWool: BlockType;
    /**
     * @remarks
     * Represents reeds within Minecraft.
     *
     */
    static readonly reeds: BlockType;
    static readonly reinforcedDeepslate: BlockType;
    /**
     * @remarks
     * Represents a repeating command block within Minecraft.
     *
     */
    static readonly repeatingCommandBlock: BlockType;
    /**
     * @remarks
     * Represents a reserved block within Minecraft.
     *
     */
    static readonly reserved6: BlockType;
    /**
     * @remarks
     * Represents a respawn anchor within Minecraft.
     *
     */
    static readonly respawnAnchor: BlockType;
    /**
     * @remarks
     * Represents a block of sand within Minecraft.
     *
     */
    static readonly sand: BlockType;
    /**
     * @remarks
     * Represents a block of sandstone within Minecraft.
     *
     */
    static readonly sandstone: BlockType;
    /**
     * @remarks
     * Represents a set of sandstone stairs within Minecraft.
     *
     */
    static readonly sandstoneStairs: BlockType;
    /**
     * @remarks
     * Represents a sapling within Minecraft.
     *
     */
    static readonly sapling: BlockType;
    /**
     * @remarks
     * Represents a set of scaffolding within Minecraft.
     *
     */
    static readonly scaffolding: BlockType;
    static readonly sculk: BlockType;
    static readonly sculkCatalyst: BlockType;
    /**
     * @remarks
     * Represents a sculk sensor within Minecraft.
     *
     */
    static readonly sculkSensor: BlockType;
    static readonly sculkShrieker: BlockType;
    static readonly sculkVein: BlockType;
    /**
     * @remarks
     * Represents seagrass within Minecraft.
     *
     */
    static readonly seagrass: BlockType;
    /**
     * @remarks
     * Represents a sealantern within Minecraft.
     *
     */
    static readonly seaLantern: BlockType;
    /**
     * @remarks
     * Represents a seapickle within Minecraft.
     *
     */
    static readonly seaPickle: BlockType;
    /**
     * @remarks
     * Represents a shroom light within Minecraft.
     *
     */
    static readonly shroomlight: BlockType;
    /**
     * @remarks
     * Represents a silver-colored block of glazed terracotta
     * within Minecraft.
     *
     */
    static readonly silverGlazedTerracotta: BlockType;
    /**
     * @remarks
     * Represents a skull within Minecraft.
     *
     */
    static readonly skull: BlockType;
    /**
     * @remarks
     * Represents slime within Minecraft.
     *
     */
    static readonly slime: BlockType;
    /**
     * @remarks
     * Represents a small bud of amethyst within Minecraft.
     *
     */
    static readonly smallAmethystBud: BlockType;
    /**
     * @remarks
     * Represents a small dripleaf block within Minecraft.
     *
     */
    static readonly smallDripleafBlock: BlockType;
    /**
     * @remarks
     * Represents a smithing table within Minecraft.
     *
     */
    static readonly smithingTable: BlockType;
    /**
     * @remarks
     * Represents a smoker within Minecraft.
     *
     */
    static readonly smoker: BlockType;
    /**
     * @remarks
     * Represents a block of smooth basalt within Minecraft.
     *
     */
    static readonly smoothBasalt: BlockType;
    /**
     * @remarks
     * Represents a set of smooth quartz stairs within Minecraft.
     *
     */
    static readonly smoothQuartzStairs: BlockType;
    /**
     * @remarks
     * Represents a set of smooth red sandstone stairs within
     * Minecraft.
     *
     */
    static readonly smoothRedSandstoneStairs: BlockType;
    /**
     * @remarks
     * Represents a set of smooth redstone stairs within Minecraft.
     *
     */
    static readonly smoothSandstoneStairs: BlockType;
    /**
     * @remarks
     * Represents a smooth stone block within Minecraft.
     *
     */
    static readonly smoothStone: BlockType;
    static readonly snifferEgg: BlockType;
    /**
     * @remarks
     * Represents snow within Minecraft.
     *
     */
    static readonly snow: BlockType;
    /**
     * @remarks
     * Represents a layer of snow within Minecraft.
     *
     */
    static readonly snowLayer: BlockType;
    /**
     * @remarks
     * Represents a soul campfire within Minecraft.
     *
     */
    static readonly soulCampfire: BlockType;
    /**
     * @remarks
     * Represents soul fire within Minecraft.
     *
     */
    static readonly soulFire: BlockType;
    /**
     * @remarks
     * Represents a soul lantern within Minecraft.
     *
     */
    static readonly soulLantern: BlockType;
    /**
     * @remarks
     * Represents a block of soul sand within Minecraft.
     *
     */
    static readonly soulSand: BlockType;
    /**
     * @remarks
     * Represents soul soil within Minecraft.
     *
     */
    static readonly soulSoil: BlockType;
    /**
     * @remarks
     * Represents a soul torch within Minecraft.
     *
     */
    static readonly soulTorch: BlockType;
    /**
     * @remarks
     * Represents a sponge within Minecraft.
     *
     */
    static readonly sponge: BlockType;
    /**
     * @remarks
     * Represents a spore blossom within Minecraft.
     *
     */
    static readonly sporeBlossom: BlockType;
    /**
     * @remarks
     * Represents a spruce wood button within Minecraft.
     *
     */
    static readonly spruceButton: BlockType;
    /**
     * @remarks
     * Represents a spruce wood door within Minecraft.
     *
     */
    static readonly spruceDoor: BlockType;
    static readonly spruceFence: BlockType;
    /**
     * @remarks
     * Represents a spruce wood fence gate within Minecraft.
     *
     */
    static readonly spruceFenceGate: BlockType;
    static readonly spruceHangingSign: BlockType;
    static readonly spruceLog: BlockType;
    /**
     * @remarks
     * Represents a spruce wood pressure plate within Minecraft.
     *
     */
    static readonly sprucePressurePlate: BlockType;
    /**
     * @remarks
     * Represents a set of spruce wood stairs within Minecraft.
     *
     */
    static readonly spruceStairs: BlockType;
    /**
     * @remarks
     * Represents a spruce wood standing sign within Minecraft.
     *
     */
    static readonly spruceStandingSign: BlockType;
    /**
     * @remarks
     * Represents a spruce wood trapdoor within Minecraft.
     *
     */
    static readonly spruceTrapdoor: BlockType;
    /**
     * @remarks
     * Represents a spruce wood wall sign within Minecraft.
     *
     */
    static readonly spruceWallSign: BlockType;
    /**
     * @remarks
     * Represents stained glass within Minecraft.
     *
     */
    static readonly stainedGlass: BlockType;
    /**
     * @remarks
     * Represents a pane of stained glass within Minecraft.
     *
     */
    static readonly stainedGlassPane: BlockType;
    /**
     * @remarks
     * Represents a block of stained hardened clay within
     * Minecraft.
     *
     */
    static readonly stainedHardenedClay: BlockType;
    /**
     * @remarks
     * Represents a standing banner within Minecraft.
     *
     */
    static readonly standingBanner: BlockType;
    /**
     * @remarks
     * Represents a standing sign within Minecraft.
     *
     */
    static readonly standingSign: BlockType;
    /**
     * @remarks
     * Represents a piston block with a sticky arm within
     * Minecraft.
     *
     */
    static readonly stickyPiston: BlockType;
    static readonly stickyPistonArmCollision: BlockType;
    /**
     * @remarks
     * Represents a block of stone within Minecraft.
     *
     */
    static readonly stone: BlockType;
    static readonly stoneBlockSlab: BlockType;
    static readonly stoneBlockSlab2: BlockType;
    static readonly stoneBlockSlab3: BlockType;
    static readonly stoneBlockSlab4: BlockType;
    /**
     * @remarks
     * Represents a block of stone brick within Minecraft.
     *
     */
    static readonly stonebrick: BlockType;
    /**
     * @remarks
     * Represents a set of stone brick stairs within Minecraft.
     *
     */
    static readonly stoneBrickStairs: BlockType;
    /**
     * @remarks
     * Represents a stone button within Minecraft.
     *
     */
    static readonly stoneButton: BlockType;
    /**
     * @remarks
     * Represents a stonecutter within Minecraft.
     *
     */
    static readonly stonecutter: BlockType;
    /**
     * @remarks
     * Represents a stonecutter block within Minecraft.
     *
     */
    static readonly stonecutterBlock: BlockType;
    /**
     * @remarks
     * Represents a stone pressure plate within Minecraft.
     *
     */
    static readonly stonePressurePlate: BlockType;
    /**
     * @remarks
     * Represents a slab of stone within Minecraft.
     *
     */
    static readonly stoneSlab: BlockType;
    /**
     * @remarks
     * Represents a variant of a slab of stone (#2) within
     * Minecraft.
     *
     */
    static readonly stoneSlab2: BlockType;
    /**
     * @remarks
     * Represents a slab of stone (variant #3) within Minecraft.
     *
     */
    static readonly stoneSlab3: BlockType;
    /**
     * @remarks
     * Represents a slab of stone (variant #4) within Minecraft.
     *
     */
    static readonly stoneSlab4: BlockType;
    /**
     * @remarks
     * Represents a set of stone stairs within Minecraft.
     *
     */
    static readonly stoneStairs: BlockType;
    /**
     * @remarks
     * Represents a stripped acacia log within Minecraft.
     *
     */
    static readonly strippedAcaciaLog: BlockType;
    static readonly strippedBambooBlock: BlockType;
    /**
     * @remarks
     * Represents a stripped birch log within Minecraft.
     *
     */
    static readonly strippedBirchLog: BlockType;
    static readonly strippedCherryLog: BlockType;
    static readonly strippedCherryWood: BlockType;
    /**
     * @remarks
     * Represents stripped crimson hyphae within Minecraft.
     *
     */
    static readonly strippedCrimsonHyphae: BlockType;
    /**
     * @remarks
     * Represents a stripped crimson stem within Minecraft.
     *
     */
    static readonly strippedCrimsonStem: BlockType;
    /**
     * @remarks
     * Represents a stripped dark oak log within Minecraft.
     *
     */
    static readonly strippedDarkOakLog: BlockType;
    /**
     * @remarks
     * Represents a stripped jungle log within Minecraft.
     *
     */
    static readonly strippedJungleLog: BlockType;
    static readonly strippedMangroveLog: BlockType;
    static readonly strippedMangroveWood: BlockType;
    /**
     * @remarks
     * Represents a stripped oak log within Minecraft.
     *
     */
    static readonly strippedOakLog: BlockType;
    /**
     * @remarks
     * Represents a stripped spruce log within Minecraft.
     *
     */
    static readonly strippedSpruceLog: BlockType;
    /**
     * @remarks
     * Represents stripped warped hyphae within Minecraft.
     *
     */
    static readonly strippedWarpedHyphae: BlockType;
    /**
     * @remarks
     * Represents stripped warped stem within Minecraft.
     *
     */
    static readonly strippedWarpedStem: BlockType;
    /**
     * @remarks
     * Represents a structure block, which provides for the saving
     * and loading of block structures, within Minecraft.
     *
     */
    static readonly structureBlock: BlockType;
    /**
     * @remarks
     * Represents a structure void within Minecraft.
     *
     */
    static readonly structureVoid: BlockType;
    static readonly suspiciousGravel: BlockType;
    static readonly suspiciousSand: BlockType;
    /**
     * @remarks
     * Represents a sweet berry bush within Minecraft.
     *
     */
    static readonly sweetBerryBush: BlockType;
    /**
     * @remarks
     * Represents tall grass within Minecraft.
     *
     */
    static readonly tallgrass: BlockType;
    /**
     * @remarks
     * Represents a target within Minecraft.
     *
     */
    static readonly target: BlockType;
    /**
     * @remarks
     * Represents tinted glass within Minecraft.
     *
     */
    static readonly tintedGlass: BlockType;
    /**
     * @remarks
     * Represents a block of TnT within Minecraft.
     *
     */
    static readonly tnt: BlockType;
    /**
     * @remarks
     * Represents a torch within Minecraft.
     *
     */
    static readonly torch: BlockType;
    static readonly torchflower: BlockType;
    static readonly torchflowerCrop: BlockType;
    /**
     * @remarks
     * Represents a trapdoor within Minecraft.
     *
     */
    static readonly trapdoor: BlockType;
    /**
     * @remarks
     * Represents a trapped chest within Minecraft.
     *
     */
    static readonly trappedChest: BlockType;
    static readonly tripWire: BlockType;
    /**
     * @remarks
     * Represents a tripwire hook within Minecraft.
     *
     */
    static readonly tripwireHook: BlockType;
    static readonly tubeCoral: BlockType;
    /**
     * @remarks
     * Represents a block of tuff within Minecraft.
     *
     */
    static readonly tuff: BlockType;
    /**
     * @remarks
     * Represents a turtle egg within Minecraft.
     *
     */
    static readonly turtleEgg: BlockType;
    /**
     * @remarks
     * Represents a set of twisting vines within Minecraft.
     *
     */
    static readonly twistingVines: BlockType;
    /**
     * @remarks
     * Represents an underwater torch within Minecraft.
     *
     */
    static readonly underwaterTorch: BlockType;
    /**
     * @remarks
     * Represents an undyed shulker box within Minecraft.
     *
     */
    static readonly undyedShulkerBox: BlockType;
    /**
     * @remarks
     * Represents an unknown block within Minecraft.
     *
     */
    static readonly unknown: BlockType;
    /**
     * @remarks
     * Represents an unlit redstone torch within Minecraft.
     *
     */
    static readonly unlitRedstoneTorch: BlockType;
    /**
     * @remarks
     * Represents an unpowered comparator within Minecraft.
     *
     */
    static readonly unpoweredComparator: BlockType;
    /**
     * @remarks
     * Represents an unpowered repeater within Minecraft.
     *
     */
    static readonly unpoweredRepeater: BlockType;
    static readonly verdantFroglight: BlockType;
    /**
     * @remarks
     * Represents a set of vines within Minecraft.
     *
     */
    static readonly vine: BlockType;
    /**
     * @remarks
     * Represents a wall banner within Minecraft.
     *
     */
    static readonly wallBanner: BlockType;
    /**
     * @remarks
     * Represents a wall sign within Minecraft.
     *
     */
    static readonly wallSign: BlockType;
    /**
     * @remarks
     * Represents a warped button within Minecraft.
     *
     */
    static readonly warpedButton: BlockType;
    /**
     * @remarks
     * Represents a warped door within Minecraft.
     *
     */
    static readonly warpedDoor: BlockType;
    /**
     * @remarks
     * Represents a double slab of warped within Minecraft.
     *
     */
    static readonly warpedDoubleSlab: BlockType;
    /**
     * @remarks
     * Represents a warped fence within Minecraft.
     *
     */
    static readonly warpedFence: BlockType;
    /**
     * @remarks
     * Represents a warped fence gate within Minecraft.
     *
     */
    static readonly warpedFenceGate: BlockType;
    /**
     * @remarks
     * Represents warped fungus within Minecraft.
     *
     */
    static readonly warpedFungus: BlockType;
    static readonly warpedHangingSign: BlockType;
    /**
     * @remarks
     * Represents warped hyphae within Minecraft.
     *
     */
    static readonly warpedHyphae: BlockType;
    /**
     * @remarks
     * Represents warped nylium within Minecraft.
     *
     */
    static readonly warpedNylium: BlockType;
    /**
     * @remarks
     * Represents warped planks within Minecraft.
     *
     */
    static readonly warpedPlanks: BlockType;
    /**
     * @remarks
     * Represents a warped pressure plate within Minecraft.
     *
     */
    static readonly warpedPressurePlate: BlockType;
    /**
     * @remarks
     * Represents a set of warped roots within Minecraft.
     *
     */
    static readonly warpedRoots: BlockType;
    /**
     * @remarks
     * Represents a slab of warped material within Minecraft.
     *
     */
    static readonly warpedSlab: BlockType;
    /**
     * @remarks
     * Represents a set of warped stairs within Minecraft.
     *
     */
    static readonly warpedStairs: BlockType;
    /**
     * @remarks
     * Represents a warped standing sign within Minecraft.
     *
     */
    static readonly warpedStandingSign: BlockType;
    /**
     * @remarks
     * Represents a warped stem within Minecraft.
     *
     */
    static readonly warpedStem: BlockType;
    /**
     * @remarks
     * Represents a warped trapdoor within Minecraft.
     *
     */
    static readonly warpedTrapdoor: BlockType;
    /**
     * @remarks
     * Represents a warped wall sign within Minecraft.
     *
     */
    static readonly warpedWallSign: BlockType;
    /**
     * @remarks
     * Represents a warped wart block within Minecraft.
     *
     */
    static readonly warpedWartBlock: BlockType;
    /**
     * @remarks
     * Represents water within Minecraft.
     *
     */
    static readonly water: BlockType;
    /**
     * @remarks
     * Represents a water lily within Minecraft.
     *
     */
    static readonly waterlily: BlockType;
    /**
     * @remarks
     * Represents a block of waxed copper within Minecraft.
     *
     */
    static readonly waxedCopper: BlockType;
    /**
     * @remarks
     * Represents a block of waxed cut copper within Minecraft.
     *
     */
    static readonly waxedCutCopper: BlockType;
    /**
     * @remarks
     * Represents a slab of waxed cut copper within Minecraft.
     *
     */
    static readonly waxedCutCopperSlab: BlockType;
    /**
     * @remarks
     * Represents a set of waxed cut copper stairs within
     * Minecraft.
     *
     */
    static readonly waxedCutCopperStairs: BlockType;
    /**
     * @remarks
     * Represents a double slab of waxed cut copper within
     * Minecraft.
     *
     */
    static readonly waxedDoubleCutCopperSlab: BlockType;
    /**
     * @remarks
     * Represents a block of waxed exposed copper within Minecraft.
     *
     */
    static readonly waxedExposedCopper: BlockType;
    /**
     * @remarks
     * Represents a block of waxed exposed cut copper within
     * Minecraft.
     *
     */
    static readonly waxedExposedCutCopper: BlockType;
    /**
     * @remarks
     * Represents a slab of waxed exposed cut copper within
     * Minecraft.
     *
     */
    static readonly waxedExposedCutCopperSlab: BlockType;
    /**
     * @remarks
     * Represents a set of waxed exposed cut copper stairs within
     * Minecraft.
     *
     */
    static readonly waxedExposedCutCopperStairs: BlockType;
    /**
     * @remarks
     * Represents a double slab of waxed exposed cut copper within
     * Minecraft.
     *
     */
    static readonly waxedExposedDoubleCutCopperSlab: BlockType;
    /**
     * @remarks
     * Represents a block of waxed oxidized copper within
     * Minecraft.
     *
     */
    static readonly waxedOxidizedCopper: BlockType;
    /**
     * @remarks
     * Represents a block of waxed oxidized cut copper within
     * Minecraft.
     *
     */
    static readonly waxedOxidizedCutCopper: BlockType;
    /**
     * @remarks
     * Represents a slab of waxed oxidized cut copper within
     * Minecraft.
     *
     */
    static readonly waxedOxidizedCutCopperSlab: BlockType;
    /**
     * @remarks
     * Represents a set of waxed oxidized cut copper stairs within
     * Minecraft.
     *
     */
    static readonly waxedOxidizedCutCopperStairs: BlockType;
    /**
     * @remarks
     * Represents a double slab of waxed oxidized cut copper within
     * Minecraft.
     *
     */
    static readonly waxedOxidizedDoubleCutCopperSlab: BlockType;
    /**
     * @remarks
     * Represents a block of waxed weathered copper within
     * Minecraft.
     *
     */
    static readonly waxedWeatheredCopper: BlockType;
    /**
     * @remarks
     * Represents a block of waxed weathered cut copper within
     * Minecraft.
     *
     */
    static readonly waxedWeatheredCutCopper: BlockType;
    /**
     * @remarks
     * Represents a slab of waxed weathered cut copper within
     * Minecraft.
     *
     */
    static readonly waxedWeatheredCutCopperSlab: BlockType;
    /**
     * @remarks
     * Represents a set of waxed weathered cut copper stairs within
     * Minecraft.
     *
     */
    static readonly waxedWeatheredCutCopperStairs: BlockType;
    /**
     * @remarks
     * Represents a double slab of waxed weathered cut copper
     * within Minecraft.
     *
     */
    static readonly waxedWeatheredDoubleCutCopperSlab: BlockType;
    /**
     * @remarks
     * Represents a block of weathered copper within Minecraft.
     *
     */
    static readonly weatheredCopper: BlockType;
    /**
     * @remarks
     * Represents a block of weathered cut copper within Minecraft.
     *
     */
    static readonly weatheredCutCopper: BlockType;
    /**
     * @remarks
     * Represents a slab of weathered cut copper within Minecraft.
     *
     */
    static readonly weatheredCutCopperSlab: BlockType;
    /**
     * @remarks
     * Represents a set of weathered cut copper stairs within
     * Minecraft.
     *
     */
    static readonly weatheredCutCopperStairs: BlockType;
    /**
     * @remarks
     * Represents a double slab of weathered cut copper within
     * Minecraft.
     *
     */
    static readonly weatheredDoubleCutCopperSlab: BlockType;
    /**
     * @remarks
     * Represents a web within Minecraft.
     *
     */
    static readonly web: BlockType;
    /**
     * @remarks
     * Represents a set of weeping vines within Minecraft.
     *
     */
    static readonly weepingVines: BlockType;
    /**
     * @remarks
     * Represents wheat within Minecraft.
     *
     */
    static readonly wheat: BlockType;
    /**
     * @remarks
     * Represents a white candle within Minecraft.
     *
     */
    static readonly whiteCandle: BlockType;
    /**
     * @remarks
     * Represents a white candle cake within Minecraft.
     *
     */
    static readonly whiteCandleCake: BlockType;
    static readonly whiteCarpet: BlockType;
    static readonly whiteConcrete: BlockType;
    /**
     * @remarks
     * Represents a block of white glazed terracotta within
     * Minecraft.
     *
     */
    static readonly whiteGlazedTerracotta: BlockType;
    static readonly whiteShulkerBox: BlockType;
    static readonly whiteWool: BlockType;
    /**
     * @remarks
     * Represents a wither rose within Minecraft.
     *
     */
    static readonly witherRose: BlockType;
    /**
     * @remarks
     * Represents a block of wood within Minecraft.
     *
     */
    static readonly wood: BlockType;
    /**
     * @remarks
     * Represents a wooden button within Minecraft.
     *
     */
    static readonly woodenButton: BlockType;
    /**
     * @remarks
     * Represents a wooden door within Minecraft.
     *
     */
    static readonly woodenDoor: BlockType;
    /**
     * @remarks
     * Represents a wooden pressure plate within Minecraft.
     *
     */
    static readonly woodenPressurePlate: BlockType;
    /**
     * @remarks
     * Represents a wooden slab within Minecraft.
     *
     */
    static readonly woodenSlab: BlockType;
    /**
     * @remarks
     * Represents a yellow candle within Minecraft.
     *
     */
    static readonly yellowCandle: BlockType;
    /**
     * @remarks
     * Represents a yellow candle cake within Minecraft.
     *
     */
    static readonly yellowCandleCake: BlockType;
    static readonly yellowCarpet: BlockType;
    static readonly yellowConcrete: BlockType;
    /**
     * @remarks
     * Represents a yellow flower within Minecraft.
     *
     */
    static readonly yellowFlower: BlockType;
    /**
     * @remarks
     * Represents a yellow block of glazed terracotta within
     * Minecraft.
     *
     */
    static readonly yellowGlazedTerracotta: BlockType;
    static readonly yellowShulkerBox: BlockType;
    static readonly yellowWool: BlockType;
    /**
     * @remarks
     * Returns a specific Minecraft block type given a type id.
     *
     */
    static get(typeName: string): BlockType;
    /**
     * @remarks
     * Returns an array of all block types within Minecraft.
     *
     */
    static getAllBlockTypes(): BlockType[];
}

/**
 * DEPRECATED
 * Use @minecraft/vanilla-data.MinecraftDimensionTypes
 * A collection of default Minecraft dimension types.
 */
export class MinecraftDimensionTypes {
    private constructor();
    /**
     * @remarks
     * The Nether is a collection of biomes separate from the
     * Overworld, including Soul Sand Valleys and Crimson forests.
     * Nether fortresses contain exclusive resources. Mobs such as
     * Blaze, Hoglins, Piglins, and Ghasts congregate here.
     *
     */
    static readonly nether = 'minecraft:nether';
    /**
     * @remarks
     * The overworld is a collection of biomes, including forests,
     * plains, jungles, mountains, deserts, taiga, and more. This
     * is the default starter dimension for Minecraft. Mobs such as
     * Axolotl, Cows, Creepers, and Zombies congregate here.
     *
     */
    static readonly overworld = 'minecraft:overworld';
    /**
     * @remarks
     * The End is separate from the Overworld and the Nether and is
     * generated whenever you create an End portal. Here, a giant
     * center island is surrounded by several smaller areas and
     * islands. You can find Endermen here. End midlands are larger
     * areas that transition you from the center to the outer edges
     * of the End. They contain Shulkers, Endermen, End gateway
     * portals, and End cities. End gateway portals are commonly
     * found at the outermost edge of the void. You usually find
     * End barrens toward the edges of the main areas or land in
     * the End.
     *
     */
    static readonly theEnd = 'minecraft:the_end';
}

/**
 * @beta
 * Contains definitions of standard Minecraft and Minecraft
 * Education Edition Entity types.
 */
export class MinecraftEntityTypes {
    private constructor();
    static readonly agent: EntityType;
    static readonly allay: EntityType;
    static readonly areaEffectCloud: EntityType;
    static readonly armorStand: EntityType;
    static readonly arrow: EntityType;
    static readonly axolotl: EntityType;
    static readonly bat: EntityType;
    static readonly bee: EntityType;
    static readonly blaze: EntityType;
    static readonly boat: EntityType;
    static readonly camel: EntityType;
    static readonly cat: EntityType;
    static readonly caveSpider: EntityType;
    static readonly chestBoat: EntityType;
    static readonly chestMinecart: EntityType;
    static readonly chicken: EntityType;
    static readonly cod: EntityType;
    static readonly commandBlockMinecart: EntityType;
    static readonly cow: EntityType;
    static readonly creeper: EntityType;
    static readonly dolphin: EntityType;
    static readonly donkey: EntityType;
    static readonly dragonFireball: EntityType;
    static readonly drowned: EntityType;
    static readonly egg: EntityType;
    static readonly elderGuardian: EntityType;
    static readonly enderCrystal: EntityType;
    static readonly enderDragon: EntityType;
    static readonly enderman: EntityType;
    static readonly endermite: EntityType;
    static readonly enderPearl: EntityType;
    static readonly evocationIllager: EntityType;
    static readonly eyeOfEnderSignal: EntityType;
    static readonly fireball: EntityType;
    static readonly fireworksRocket: EntityType;
    static readonly fishingHook: EntityType;
    static readonly fox: EntityType;
    static readonly frog: EntityType;
    static readonly ghast: EntityType;
    static readonly glowSquid: EntityType;
    static readonly goat: EntityType;
    static readonly guardian: EntityType;
    static readonly hoglin: EntityType;
    static readonly hopperMinecart: EntityType;
    static readonly horse: EntityType;
    static readonly husk: EntityType;
    static readonly ironGolem: EntityType;
    static readonly lightningBolt: EntityType;
    static readonly lingeringPotion: EntityType;
    static readonly llama: EntityType;
    static readonly llamaSpit: EntityType;
    static readonly magmaCube: EntityType;
    static readonly minecart: EntityType;
    static readonly mooshroom: EntityType;
    static readonly mule: EntityType;
    static readonly npc: EntityType;
    static readonly ocelot: EntityType;
    static readonly panda: EntityType;
    static readonly parrot: EntityType;
    static readonly phantom: EntityType;
    static readonly pig: EntityType;
    static readonly piglin: EntityType;
    static readonly piglinBrute: EntityType;
    static readonly pillager: EntityType;
    static readonly player: EntityType;
    static readonly polarBear: EntityType;
    static readonly pufferfish: EntityType;
    static readonly rabbit: EntityType;
    static readonly ravager: EntityType;
    static readonly salmon: EntityType;
    static readonly sheep: EntityType;
    static readonly shulker: EntityType;
    static readonly shulkerBullet: EntityType;
    static readonly silverfish: EntityType;
    static readonly skeleton: EntityType;
    static readonly skeletonHorse: EntityType;
    static readonly slime: EntityType;
    static readonly smallFireball: EntityType;
    static readonly sniffer: EntityType;
    static readonly snowball: EntityType;
    static readonly snowGolem: EntityType;
    static readonly spider: EntityType;
    static readonly splashPotion: EntityType;
    static readonly squid: EntityType;
    static readonly stray: EntityType;
    static readonly strider: EntityType;
    static readonly tadpole: EntityType;
    static readonly thrownTrident: EntityType;
    static readonly tnt: EntityType;
    static readonly tntMinecart: EntityType;
    static readonly traderLlama: EntityType;
    static readonly tripodCamera: EntityType;
    static readonly tropicalfish: EntityType;
    static readonly turtle: EntityType;
    static readonly vex: EntityType;
    static readonly villager: EntityType;
    static readonly villagerV2: EntityType;
    static readonly vindicator: EntityType;
    static readonly wanderingTrader: EntityType;
    static readonly warden: EntityType;
    static readonly witch: EntityType;
    static readonly wither: EntityType;
    static readonly witherSkeleton: EntityType;
    static readonly witherSkull: EntityType;
    static readonly witherSkullDangerous: EntityType;
    static readonly wolf: EntityType;
    static readonly xpBottle: EntityType;
    static readonly xpOrb: EntityType;
    static readonly zoglin: EntityType;
    static readonly zombie: EntityType;
    static readonly zombieHorse: EntityType;
    static readonly zombiePigman: EntityType;
    static readonly zombieVillager: EntityType;
    static readonly zombieVillagerV2: EntityType;
}

/**
 * @beta
 */
export class MinecraftItemTypes {
    private constructor();
    static readonly acaciaBoat: ItemType;
    static readonly acaciaButton: ItemType;
    static readonly acaciaChestBoat: ItemType;
    static readonly acaciaDoor: ItemType;
    static readonly acaciaFence: ItemType;
    static readonly acaciaFenceGate: ItemType;
    static readonly acaciaHangingSign: ItemType;
    static readonly acaciaLog: ItemType;
    static readonly acaciaPressurePlate: ItemType;
    static readonly acaciaSign: ItemType;
    static readonly acaciaStairs: ItemType;
    static readonly acaciaTrapdoor: ItemType;
    static readonly activatorRail: ItemType;
    static readonly allaySpawnEgg: ItemType;
    static readonly allow: ItemType;
    static readonly amethystBlock: ItemType;
    static readonly amethystCluster: ItemType;
    static readonly amethystShard: ItemType;
    static readonly ancientDebris: ItemType;
    static readonly andesiteStairs: ItemType;
    static readonly anglerPotterySherd: ItemType;
    static readonly anvil: ItemType;
    static readonly apple: ItemType;
    static readonly archerPotterySherd: ItemType;
    static readonly armorStand: ItemType;
    static readonly armsUpPotterySherd: ItemType;
    static readonly arrow: ItemType;
    static readonly axolotlBucket: ItemType;
    static readonly axolotlSpawnEgg: ItemType;
    static readonly azalea: ItemType;
    static readonly azaleaLeaves: ItemType;
    static readonly azaleaLeavesFlowered: ItemType;
    static readonly bakedPotato: ItemType;
    static readonly bamboo: ItemType;
    static readonly bambooBlock: ItemType;
    static readonly bambooButton: ItemType;
    static readonly bambooChestRaft: ItemType;
    static readonly bambooDoor: ItemType;
    static readonly bambooFence: ItemType;
    static readonly bambooFenceGate: ItemType;
    static readonly bambooHangingSign: ItemType;
    static readonly bambooMosaic: ItemType;
    static readonly bambooMosaicSlab: ItemType;
    static readonly bambooMosaicStairs: ItemType;
    static readonly bambooPlanks: ItemType;
    static readonly bambooPressurePlate: ItemType;
    static readonly bambooRaft: ItemType;
    static readonly bambooSign: ItemType;
    static readonly bambooSlab: ItemType;
    static readonly bambooStairs: ItemType;
    static readonly bambooTrapdoor: ItemType;
    static readonly banner: ItemType;
    static readonly bannerPattern: ItemType;
    static readonly barrel: ItemType;
    static readonly barrier: ItemType;
    static readonly basalt: ItemType;
    static readonly batSpawnEgg: ItemType;
    static readonly beacon: ItemType;
    static readonly bed: ItemType;
    static readonly bedrock: ItemType;
    static readonly beef: ItemType;
    static readonly beehive: ItemType;
    static readonly beeNest: ItemType;
    static readonly beeSpawnEgg: ItemType;
    static readonly beetroot: ItemType;
    static readonly beetrootSeeds: ItemType;
    static readonly beetrootSoup: ItemType;
    static readonly bell: ItemType;
    static readonly bigDripleaf: ItemType;
    static readonly birchBoat: ItemType;
    static readonly birchButton: ItemType;
    static readonly birchChestBoat: ItemType;
    static readonly birchDoor: ItemType;
    static readonly birchFence: ItemType;
    static readonly birchFenceGate: ItemType;
    static readonly birchHangingSign: ItemType;
    static readonly birchLog: ItemType;
    static readonly birchPressurePlate: ItemType;
    static readonly birchSign: ItemType;
    static readonly birchStairs: ItemType;
    static readonly birchTrapdoor: ItemType;
    static readonly blackCandle: ItemType;
    static readonly blackCarpet: ItemType;
    static readonly blackConcrete: ItemType;
    static readonly blackDye: ItemType;
    static readonly blackGlazedTerracotta: ItemType;
    static readonly blackShulkerBox: ItemType;
    static readonly blackstone: ItemType;
    static readonly blackstoneSlab: ItemType;
    static readonly blackstoneStairs: ItemType;
    static readonly blackstoneWall: ItemType;
    static readonly blackWool: ItemType;
    static readonly bladePotterySherd: ItemType;
    static readonly blastFurnace: ItemType;
    static readonly blazePowder: ItemType;
    static readonly blazeRod: ItemType;
    static readonly blazeSpawnEgg: ItemType;
    static readonly blueCandle: ItemType;
    static readonly blueCarpet: ItemType;
    static readonly blueConcrete: ItemType;
    static readonly blueDye: ItemType;
    static readonly blueGlazedTerracotta: ItemType;
    static readonly blueIce: ItemType;
    static readonly blueShulkerBox: ItemType;
    static readonly blueWool: ItemType;
    static readonly boat: ItemType;
    static readonly bone: ItemType;
    static readonly boneBlock: ItemType;
    static readonly boneMeal: ItemType;
    static readonly book: ItemType;
    static readonly bookshelf: ItemType;
    static readonly borderBlock: ItemType;
    static readonly bordureIndentedBannerPattern: ItemType;
    static readonly bow: ItemType;
    static readonly bowl: ItemType;
    static readonly brainCoral: ItemType;
    static readonly bread: ItemType;
    static readonly brewerPotterySherd: ItemType;
    static readonly brewingStand: ItemType;
    static readonly brick: ItemType;
    static readonly brickBlock: ItemType;
    static readonly brickStairs: ItemType;
    static readonly brownCandle: ItemType;
    static readonly brownCarpet: ItemType;
    static readonly brownConcrete: ItemType;
    static readonly brownDye: ItemType;
    static readonly brownGlazedTerracotta: ItemType;
    static readonly brownMushroom: ItemType;
    static readonly brownMushroomBlock: ItemType;
    static readonly brownShulkerBox: ItemType;
    static readonly brownWool: ItemType;
    static readonly brush: ItemType;
    static readonly bubbleCoral: ItemType;
    static readonly bucket: ItemType;
    static readonly buddingAmethyst: ItemType;
    static readonly burnPotterySherd: ItemType;
    static readonly cactus: ItemType;
    static readonly cake: ItemType;
    static readonly calcite: ItemType;
    static readonly calibratedSculkSensor: ItemType;
    static readonly camelSpawnEgg: ItemType;
    static readonly campfire: ItemType;
    static readonly candle: ItemType;
    static readonly carpet: ItemType;
    static readonly carrot: ItemType;
    static readonly carrotOnAStick: ItemType;
    static readonly cartographyTable: ItemType;
    static readonly carvedPumpkin: ItemType;
    static readonly catSpawnEgg: ItemType;
    static readonly cauldron: ItemType;
    static readonly caveSpiderSpawnEgg: ItemType;
    static readonly chain: ItemType;
    static readonly chainCommandBlock: ItemType;
    static readonly chainmailBoots: ItemType;
    static readonly chainmailChestplate: ItemType;
    static readonly chainmailHelmet: ItemType;
    static readonly chainmailLeggings: ItemType;
    static readonly charcoal: ItemType;
    static readonly cherryBoat: ItemType;
    static readonly cherryButton: ItemType;
    static readonly cherryChestBoat: ItemType;
    static readonly cherryDoor: ItemType;
    static readonly cherryFence: ItemType;
    static readonly cherryFenceGate: ItemType;
    static readonly cherryHangingSign: ItemType;
    static readonly cherryLeaves: ItemType;
    static readonly cherryLog: ItemType;
    static readonly cherryPlanks: ItemType;
    static readonly cherryPressurePlate: ItemType;
    static readonly cherrySapling: ItemType;
    static readonly cherrySign: ItemType;
    static readonly cherrySlab: ItemType;
    static readonly cherryStairs: ItemType;
    static readonly cherryTrapdoor: ItemType;
    static readonly cherryWood: ItemType;
    static readonly chest: ItemType;
    static readonly chestBoat: ItemType;
    static readonly chestMinecart: ItemType;
    static readonly chicken: ItemType;
    static readonly chickenSpawnEgg: ItemType;
    static readonly chiseledBookshelf: ItemType;
    static readonly chiseledDeepslate: ItemType;
    static readonly chiseledNetherBricks: ItemType;
    static readonly chiseledPolishedBlackstone: ItemType;
    static readonly chorusFlower: ItemType;
    static readonly chorusFruit: ItemType;
    static readonly chorusPlant: ItemType;
    static readonly clay: ItemType;
    static readonly clayBall: ItemType;
    static readonly clock: ItemType;
    static readonly coal: ItemType;
    static readonly coalBlock: ItemType;
    static readonly coalOre: ItemType;
    static readonly coastArmorTrimSmithingTemplate: ItemType;
    static readonly cobbledDeepslate: ItemType;
    static readonly cobbledDeepslateSlab: ItemType;
    static readonly cobbledDeepslateStairs: ItemType;
    static readonly cobbledDeepslateWall: ItemType;
    static readonly cobblestone: ItemType;
    static readonly cobblestoneWall: ItemType;
    static readonly cocoaBeans: ItemType;
    static readonly cod: ItemType;
    static readonly codBucket: ItemType;
    static readonly codSpawnEgg: ItemType;
    static readonly commandBlock: ItemType;
    static readonly commandBlockMinecart: ItemType;
    static readonly comparator: ItemType;
    static readonly compass: ItemType;
    static readonly composter: ItemType;
    static readonly concrete: ItemType;
    static readonly concretePowder: ItemType;
    static readonly conduit: ItemType;
    static readonly cookedBeef: ItemType;
    static readonly cookedChicken: ItemType;
    static readonly cookedCod: ItemType;
    static readonly cookedMutton: ItemType;
    static readonly cookedPorkchop: ItemType;
    static readonly cookedRabbit: ItemType;
    static readonly cookedSalmon: ItemType;
    static readonly cookie: ItemType;
    static readonly copperBlock: ItemType;
    static readonly copperIngot: ItemType;
    static readonly copperOre: ItemType;
    static readonly coral: ItemType;
    static readonly coralBlock: ItemType;
    static readonly coralFan: ItemType;
    static readonly coralFanDead: ItemType;
    static readonly cowSpawnEgg: ItemType;
    static readonly crackedDeepslateBricks: ItemType;
    static readonly crackedDeepslateTiles: ItemType;
    static readonly crackedNetherBricks: ItemType;
    static readonly crackedPolishedBlackstoneBricks: ItemType;
    static readonly craftingTable: ItemType;
    static readonly creeperBannerPattern: ItemType;
    static readonly creeperSpawnEgg: ItemType;
    static readonly crimsonButton: ItemType;
    static readonly crimsonDoor: ItemType;
    static readonly crimsonFence: ItemType;
    static readonly crimsonFenceGate: ItemType;
    static readonly crimsonFungus: ItemType;
    static readonly crimsonHangingSign: ItemType;
    static readonly crimsonHyphae: ItemType;
    static readonly crimsonNylium: ItemType;
    static readonly crimsonPlanks: ItemType;
    static readonly crimsonPressurePlate: ItemType;
    static readonly crimsonRoots: ItemType;
    static readonly crimsonSign: ItemType;
    static readonly crimsonSlab: ItemType;
    static readonly crimsonStairs: ItemType;
    static readonly crimsonStem: ItemType;
    static readonly crimsonTrapdoor: ItemType;
    static readonly crossbow: ItemType;
    static readonly cryingObsidian: ItemType;
    static readonly cutCopper: ItemType;
    static readonly cutCopperSlab: ItemType;
    static readonly cutCopperStairs: ItemType;
    static readonly cyanCandle: ItemType;
    static readonly cyanCarpet: ItemType;
    static readonly cyanConcrete: ItemType;
    static readonly cyanDye: ItemType;
    static readonly cyanGlazedTerracotta: ItemType;
    static readonly cyanShulkerBox: ItemType;
    static readonly cyanWool: ItemType;
    static readonly dangerPotterySherd: ItemType;
    static readonly darkOakBoat: ItemType;
    static readonly darkOakButton: ItemType;
    static readonly darkOakChestBoat: ItemType;
    static readonly darkOakDoor: ItemType;
    static readonly darkOakFence: ItemType;
    static readonly darkOakFenceGate: ItemType;
    static readonly darkOakHangingSign: ItemType;
    static readonly darkOakLog: ItemType;
    static readonly darkOakPressurePlate: ItemType;
    static readonly darkOakSign: ItemType;
    static readonly darkOakStairs: ItemType;
    static readonly darkOakTrapdoor: ItemType;
    static readonly darkPrismarineStairs: ItemType;
    static readonly daylightDetector: ItemType;
    static readonly deadBrainCoral: ItemType;
    static readonly deadBubbleCoral: ItemType;
    static readonly deadbush: ItemType;
    static readonly deadFireCoral: ItemType;
    static readonly deadHornCoral: ItemType;
    static readonly deadTubeCoral: ItemType;
    static readonly decoratedPot: ItemType;
    static readonly deepslate: ItemType;
    static readonly deepslateBricks: ItemType;
    static readonly deepslateBrickSlab: ItemType;
    static readonly deepslateBrickStairs: ItemType;
    static readonly deepslateBrickWall: ItemType;
    static readonly deepslateCoalOre: ItemType;
    static readonly deepslateCopperOre: ItemType;
    static readonly deepslateDiamondOre: ItemType;
    static readonly deepslateEmeraldOre: ItemType;
    static readonly deepslateGoldOre: ItemType;
    static readonly deepslateIronOre: ItemType;
    static readonly deepslateLapisOre: ItemType;
    static readonly deepslateRedstoneOre: ItemType;
    static readonly deepslateTiles: ItemType;
    static readonly deepslateTileSlab: ItemType;
    static readonly deepslateTileStairs: ItemType;
    static readonly deepslateTileWall: ItemType;
    static readonly deny: ItemType;
    static readonly detectorRail: ItemType;
    static readonly diamond: ItemType;
    static readonly diamondAxe: ItemType;
    static readonly diamondBlock: ItemType;
    static readonly diamondBoots: ItemType;
    static readonly diamondChestplate: ItemType;
    static readonly diamondHelmet: ItemType;
    static readonly diamondHoe: ItemType;
    static readonly diamondHorseArmor: ItemType;
    static readonly diamondLeggings: ItemType;
    static readonly diamondOre: ItemType;
    static readonly diamondPickaxe: ItemType;
    static readonly diamondShovel: ItemType;
    static readonly diamondSword: ItemType;
    static readonly dioriteStairs: ItemType;
    static readonly dirt: ItemType;
    static readonly dirtWithRoots: ItemType;
    static readonly discFragment5: ItemType;
    static readonly dispenser: ItemType;
    static readonly dolphinSpawnEgg: ItemType;
    static readonly donkeySpawnEgg: ItemType;
    static readonly doublePlant: ItemType;
    static readonly dragonBreath: ItemType;
    static readonly dragonEgg: ItemType;
    static readonly driedKelp: ItemType;
    static readonly driedKelpBlock: ItemType;
    static readonly dripstoneBlock: ItemType;
    static readonly dropper: ItemType;
    static readonly drownedSpawnEgg: ItemType;
    static readonly duneArmorTrimSmithingTemplate: ItemType;
    static readonly dye: ItemType;
    static readonly echoShard: ItemType;
    static readonly egg: ItemType;
    static readonly elderGuardianSpawnEgg: ItemType;
    static readonly elytra: ItemType;
    static readonly emerald: ItemType;
    static readonly emeraldBlock: ItemType;
    static readonly emeraldOre: ItemType;
    static readonly emptyMap: ItemType;
    static readonly enchantedBook: ItemType;
    static readonly enchantedGoldenApple: ItemType;
    static readonly enchantingTable: ItemType;
    static readonly endBricks: ItemType;
    static readonly endBrickStairs: ItemType;
    static readonly endCrystal: ItemType;
    static readonly enderChest: ItemType;
    static readonly enderDragonSpawnEgg: ItemType;
    static readonly enderEye: ItemType;
    static readonly endermanSpawnEgg: ItemType;
    static readonly endermiteSpawnEgg: ItemType;
    static readonly enderPearl: ItemType;
    static readonly endPortalFrame: ItemType;
    static readonly endRod: ItemType;
    static readonly endStone: ItemType;
    static readonly evokerSpawnEgg: ItemType;
    static readonly experienceBottle: ItemType;
    static readonly explorerPotterySherd: ItemType;
    static readonly exposedCopper: ItemType;
    static readonly exposedCutCopper: ItemType;
    static readonly exposedCutCopperSlab: ItemType;
    static readonly exposedCutCopperStairs: ItemType;
    static readonly eyeArmorTrimSmithingTemplate: ItemType;
    static readonly farmland: ItemType;
    static readonly feather: ItemType;
    static readonly fence: ItemType;
    static readonly fenceGate: ItemType;
    static readonly fermentedSpiderEye: ItemType;
    static readonly fieldMasonedBannerPattern: ItemType;
    static readonly filledMap: ItemType;
    static readonly fireCharge: ItemType;
    static readonly fireCoral: ItemType;
    static readonly fireworkRocket: ItemType;
    static readonly fireworkStar: ItemType;
    static readonly fishingRod: ItemType;
    static readonly fletchingTable: ItemType;
    static readonly flint: ItemType;
    static readonly flintAndSteel: ItemType;
    static readonly flowerBannerPattern: ItemType;
    static readonly floweringAzalea: ItemType;
    static readonly flowerPot: ItemType;
    static readonly foxSpawnEgg: ItemType;
    static readonly frame: ItemType;
    static readonly friendPotterySherd: ItemType;
    static readonly frogSpawn: ItemType;
    static readonly frogSpawnEgg: ItemType;
    static readonly frostedIce: ItemType;
    static readonly furnace: ItemType;
    static readonly ghastSpawnEgg: ItemType;
    static readonly ghastTear: ItemType;
    static readonly gildedBlackstone: ItemType;
    static readonly glass: ItemType;
    static readonly glassBottle: ItemType;
    static readonly glassPane: ItemType;
    static readonly glisteringMelonSlice: ItemType;
    static readonly globeBannerPattern: ItemType;
    static readonly glowBerries: ItemType;
    static readonly glowFrame: ItemType;
    static readonly glowInkSac: ItemType;
    static readonly glowLichen: ItemType;
    static readonly glowSquidSpawnEgg: ItemType;
    static readonly glowstone: ItemType;
    static readonly glowstoneDust: ItemType;
    static readonly goatHorn: ItemType;
    static readonly goatSpawnEgg: ItemType;
    static readonly goldBlock: ItemType;
    static readonly goldenApple: ItemType;
    static readonly goldenAxe: ItemType;
    static readonly goldenBoots: ItemType;
    static readonly goldenCarrot: ItemType;
    static readonly goldenChestplate: ItemType;
    static readonly goldenHelmet: ItemType;
    static readonly goldenHoe: ItemType;
    static readonly goldenHorseArmor: ItemType;
    static readonly goldenLeggings: ItemType;
    static readonly goldenPickaxe: ItemType;
    static readonly goldenRail: ItemType;
    static readonly goldenShovel: ItemType;
    static readonly goldenSword: ItemType;
    static readonly goldIngot: ItemType;
    static readonly goldNugget: ItemType;
    static readonly goldOre: ItemType;
    static readonly graniteStairs: ItemType;
    static readonly grass: ItemType;
    static readonly grassPath: ItemType;
    static readonly gravel: ItemType;
    static readonly grayCandle: ItemType;
    static readonly grayCarpet: ItemType;
    static readonly grayConcrete: ItemType;
    static readonly grayDye: ItemType;
    static readonly grayGlazedTerracotta: ItemType;
    static readonly grayShulkerBox: ItemType;
    static readonly grayWool: ItemType;
    static readonly greenCandle: ItemType;
    static readonly greenCarpet: ItemType;
    static readonly greenConcrete: ItemType;
    static readonly greenDye: ItemType;
    static readonly greenGlazedTerracotta: ItemType;
    static readonly greenShulkerBox: ItemType;
    static readonly greenWool: ItemType;
    static readonly grindstone: ItemType;
    static readonly guardianSpawnEgg: ItemType;
    static readonly gunpowder: ItemType;
    static readonly hangingRoots: ItemType;
    static readonly hardenedClay: ItemType;
    static readonly hayBlock: ItemType;
    static readonly heartbreakPotterySherd: ItemType;
    static readonly heartOfTheSea: ItemType;
    static readonly heartPotterySherd: ItemType;
    static readonly heavyWeightedPressurePlate: ItemType;
    static readonly hoglinSpawnEgg: ItemType;
    static readonly honeyBlock: ItemType;
    static readonly honeyBottle: ItemType;
    static readonly honeycomb: ItemType;
    static readonly honeycombBlock: ItemType;
    static readonly hopper: ItemType;
    static readonly hopperMinecart: ItemType;
    static readonly hornCoral: ItemType;
    static readonly horseSpawnEgg: ItemType;
    static readonly hostArmorTrimSmithingTemplate: ItemType;
    static readonly howlPotterySherd: ItemType;
    static readonly huskSpawnEgg: ItemType;
    static readonly ice: ItemType;
    static readonly infestedDeepslate: ItemType;
    static readonly inkSac: ItemType;
    static readonly ironAxe: ItemType;
    static readonly ironBars: ItemType;
    static readonly ironBlock: ItemType;
    static readonly ironBoots: ItemType;
    static readonly ironChestplate: ItemType;
    static readonly ironDoor: ItemType;
    static readonly ironGolemSpawnEgg: ItemType;
    static readonly ironHelmet: ItemType;
    static readonly ironHoe: ItemType;
    static readonly ironHorseArmor: ItemType;
    static readonly ironIngot: ItemType;
    static readonly ironLeggings: ItemType;
    static readonly ironNugget: ItemType;
    static readonly ironOre: ItemType;
    static readonly ironPickaxe: ItemType;
    static readonly ironShovel: ItemType;
    static readonly ironSword: ItemType;
    static readonly ironTrapdoor: ItemType;
    static readonly jigsaw: ItemType;
    static readonly jukebox: ItemType;
    static readonly jungleBoat: ItemType;
    static readonly jungleButton: ItemType;
    static readonly jungleChestBoat: ItemType;
    static readonly jungleDoor: ItemType;
    static readonly jungleFence: ItemType;
    static readonly jungleFenceGate: ItemType;
    static readonly jungleHangingSign: ItemType;
    static readonly jungleLog: ItemType;
    static readonly junglePressurePlate: ItemType;
    static readonly jungleSign: ItemType;
    static readonly jungleStairs: ItemType;
    static readonly jungleTrapdoor: ItemType;
    static readonly kelp: ItemType;
    static readonly ladder: ItemType;
    static readonly lantern: ItemType;
    static readonly lapisBlock: ItemType;
    static readonly lapisLazuli: ItemType;
    static readonly lapisOre: ItemType;
    static readonly largeAmethystBud: ItemType;
    static readonly lavaBucket: ItemType;
    static readonly lead: ItemType;
    static readonly leather: ItemType;
    static readonly leatherBoots: ItemType;
    static readonly leatherChestplate: ItemType;
    static readonly leatherHelmet: ItemType;
    static readonly leatherHorseArmor: ItemType;
    static readonly leatherLeggings: ItemType;
    static readonly leaves: ItemType;
    static readonly leaves2: ItemType;
    static readonly lectern: ItemType;
    static readonly lever: ItemType;
    static readonly lightBlock: ItemType;
    static readonly lightBlueCandle: ItemType;
    static readonly lightBlueCarpet: ItemType;
    static readonly lightBlueConcrete: ItemType;
    static readonly lightBlueDye: ItemType;
    static readonly lightBlueGlazedTerracotta: ItemType;
    static readonly lightBlueShulkerBox: ItemType;
    static readonly lightBlueWool: ItemType;
    static readonly lightGrayCandle: ItemType;
    static readonly lightGrayCarpet: ItemType;
    static readonly lightGrayConcrete: ItemType;
    static readonly lightGrayDye: ItemType;
    static readonly lightGrayShulkerBox: ItemType;
    static readonly lightGrayWool: ItemType;
    static readonly lightningRod: ItemType;
    static readonly lightWeightedPressurePlate: ItemType;
    static readonly limeCandle: ItemType;
    static readonly limeCarpet: ItemType;
    static readonly limeConcrete: ItemType;
    static readonly limeDye: ItemType;
    static readonly limeGlazedTerracotta: ItemType;
    static readonly limeShulkerBox: ItemType;
    static readonly limeWool: ItemType;
    static readonly lingeringPotion: ItemType;
    static readonly litPumpkin: ItemType;
    static readonly llamaSpawnEgg: ItemType;
    static readonly lodestone: ItemType;
    static readonly lodestoneCompass: ItemType;
    static readonly log: ItemType;
    static readonly log2: ItemType;
    static readonly loom: ItemType;
    static readonly magentaCandle: ItemType;
    static readonly magentaCarpet: ItemType;
    static readonly magentaConcrete: ItemType;
    static readonly magentaDye: ItemType;
    static readonly magentaGlazedTerracotta: ItemType;
    static readonly magentaShulkerBox: ItemType;
    static readonly magentaWool: ItemType;
    static readonly magma: ItemType;
    static readonly magmaCream: ItemType;
    static readonly magmaCubeSpawnEgg: ItemType;
    static readonly mangroveBoat: ItemType;
    static readonly mangroveButton: ItemType;
    static readonly mangroveChestBoat: ItemType;
    static readonly mangroveDoor: ItemType;
    static readonly mangroveFence: ItemType;
    static readonly mangroveFenceGate: ItemType;
    static readonly mangroveHangingSign: ItemType;
    static readonly mangroveLeaves: ItemType;
    static readonly mangroveLog: ItemType;
    static readonly mangrovePlanks: ItemType;
    static readonly mangrovePressurePlate: ItemType;
    static readonly mangrovePropagule: ItemType;
    static readonly mangroveRoots: ItemType;
    static readonly mangroveSign: ItemType;
    static readonly mangroveSlab: ItemType;
    static readonly mangroveStairs: ItemType;
    static readonly mangroveTrapdoor: ItemType;
    static readonly mangroveWood: ItemType;
    static readonly mediumAmethystBud: ItemType;
    static readonly melonBlock: ItemType;
    static readonly melonSeeds: ItemType;
    static readonly melonSlice: ItemType;
    static readonly milkBucket: ItemType;
    static readonly minecart: ItemType;
    static readonly minerPotterySherd: ItemType;
    static readonly mobSpawner: ItemType;
    static readonly mojangBannerPattern: ItemType;
    static readonly monsterEgg: ItemType;
    static readonly mooshroomSpawnEgg: ItemType;
    static readonly mossBlock: ItemType;
    static readonly mossCarpet: ItemType;
    static readonly mossyCobblestone: ItemType;
    static readonly mossyCobblestoneStairs: ItemType;
    static readonly mossyStoneBrickStairs: ItemType;
    static readonly mournerPotterySherd: ItemType;
    static readonly mud: ItemType;
    static readonly mudBricks: ItemType;
    static readonly mudBrickSlab: ItemType;
    static readonly mudBrickStairs: ItemType;
    static readonly mudBrickWall: ItemType;
    static readonly muddyMangroveRoots: ItemType;
    static readonly muleSpawnEgg: ItemType;
    static readonly mushroomStew: ItemType;
    static readonly musicDisc11: ItemType;
    static readonly musicDisc13: ItemType;
    static readonly musicDisc5: ItemType;
    static readonly musicDiscBlocks: ItemType;
    static readonly musicDiscCat: ItemType;
    static readonly musicDiscChirp: ItemType;
    static readonly musicDiscFar: ItemType;
    static readonly musicDiscMall: ItemType;
    static readonly musicDiscMellohi: ItemType;
    static readonly musicDiscOtherside: ItemType;
    static readonly musicDiscPigstep: ItemType;
    static readonly musicDiscRelic: ItemType;
    static readonly musicDiscStal: ItemType;
    static readonly musicDiscStrad: ItemType;
    static readonly musicDiscWait: ItemType;
    static readonly musicDiscWard: ItemType;
    static readonly mutton: ItemType;
    static readonly mycelium: ItemType;
    static readonly nameTag: ItemType;
    static readonly nautilusShell: ItemType;
    static readonly netherbrick: ItemType;
    static readonly netherBrick: ItemType;
    static readonly netherBrickFence: ItemType;
    static readonly netherBrickStairs: ItemType;
    static readonly netherGoldOre: ItemType;
    static readonly netheriteAxe: ItemType;
    static readonly netheriteBlock: ItemType;
    static readonly netheriteBoots: ItemType;
    static readonly netheriteChestplate: ItemType;
    static readonly netheriteHelmet: ItemType;
    static readonly netheriteHoe: ItemType;
    static readonly netheriteIngot: ItemType;
    static readonly netheriteLeggings: ItemType;
    static readonly netheritePickaxe: ItemType;
    static readonly netheriteScrap: ItemType;
    static readonly netheriteShovel: ItemType;
    static readonly netheriteSword: ItemType;
    static readonly netheriteUpgradeSmithingTemplate: ItemType;
    static readonly netherrack: ItemType;
    static readonly netherSprouts: ItemType;
    static readonly netherStar: ItemType;
    static readonly netherWart: ItemType;
    static readonly netherWartBlock: ItemType;
    static readonly normalStoneStairs: ItemType;
    static readonly noteblock: ItemType;
    static readonly oakBoat: ItemType;
    static readonly oakChestBoat: ItemType;
    static readonly oakFence: ItemType;
    static readonly oakHangingSign: ItemType;
    static readonly oakLog: ItemType;
    static readonly oakSign: ItemType;
    static readonly oakStairs: ItemType;
    static readonly observer: ItemType;
    static readonly obsidian: ItemType;
    static readonly ocelotSpawnEgg: ItemType;
    static readonly ochreFroglight: ItemType;
    static readonly orangeCandle: ItemType;
    static readonly orangeCarpet: ItemType;
    static readonly orangeConcrete: ItemType;
    static readonly orangeDye: ItemType;
    static readonly orangeGlazedTerracotta: ItemType;
    static readonly orangeShulkerBox: ItemType;
    static readonly orangeWool: ItemType;
    static readonly oxidizedCopper: ItemType;
    static readonly oxidizedCutCopper: ItemType;
    static readonly oxidizedCutCopperSlab: ItemType;
    static readonly oxidizedCutCopperStairs: ItemType;
    static readonly packedIce: ItemType;
    static readonly packedMud: ItemType;
    static readonly painting: ItemType;
    static readonly pandaSpawnEgg: ItemType;
    static readonly paper: ItemType;
    static readonly parrotSpawnEgg: ItemType;
    static readonly pearlescentFroglight: ItemType;
    static readonly phantomMembrane: ItemType;
    static readonly phantomSpawnEgg: ItemType;
    static readonly piglinBannerPattern: ItemType;
    static readonly piglinBruteSpawnEgg: ItemType;
    static readonly piglinSpawnEgg: ItemType;
    static readonly pigSpawnEgg: ItemType;
    static readonly pillagerSpawnEgg: ItemType;
    static readonly pinkCandle: ItemType;
    static readonly pinkCarpet: ItemType;
    static readonly pinkConcrete: ItemType;
    static readonly pinkDye: ItemType;
    static readonly pinkGlazedTerracotta: ItemType;
    static readonly pinkPetals: ItemType;
    static readonly pinkShulkerBox: ItemType;
    static readonly pinkWool: ItemType;
    static readonly piston: ItemType;
    static readonly pitcherPlant: ItemType;
    static readonly pitcherPod: ItemType;
    static readonly planks: ItemType;
    static readonly plentyPotterySherd: ItemType;
    static readonly podzol: ItemType;
    static readonly pointedDripstone: ItemType;
    static readonly poisonousPotato: ItemType;
    static readonly polarBearSpawnEgg: ItemType;
    static readonly polishedAndesiteStairs: ItemType;
    static readonly polishedBasalt: ItemType;
    static readonly polishedBlackstone: ItemType;
    static readonly polishedBlackstoneBricks: ItemType;
    static readonly polishedBlackstoneBrickSlab: ItemType;
    static readonly polishedBlackstoneBrickStairs: ItemType;
    static readonly polishedBlackstoneBrickWall: ItemType;
    static readonly polishedBlackstoneButton: ItemType;
    static readonly polishedBlackstonePressurePlate: ItemType;
    static readonly polishedBlackstoneSlab: ItemType;
    static readonly polishedBlackstoneStairs: ItemType;
    static readonly polishedBlackstoneWall: ItemType;
    static readonly polishedDeepslate: ItemType;
    static readonly polishedDeepslateSlab: ItemType;
    static readonly polishedDeepslateStairs: ItemType;
    static readonly polishedDeepslateWall: ItemType;
    static readonly polishedDioriteStairs: ItemType;
    static readonly polishedGraniteStairs: ItemType;
    static readonly poppedChorusFruit: ItemType;
    static readonly porkchop: ItemType;
    static readonly potato: ItemType;
    static readonly potion: ItemType;
    static readonly powderSnowBucket: ItemType;
    static readonly prismarine: ItemType;
    static readonly prismarineBricksStairs: ItemType;
    static readonly prismarineCrystals: ItemType;
    static readonly prismarineShard: ItemType;
    static readonly prismarineStairs: ItemType;
    static readonly prizePotterySherd: ItemType;
    static readonly pufferfish: ItemType;
    static readonly pufferfishBucket: ItemType;
    static readonly pufferfishSpawnEgg: ItemType;
    static readonly pumpkin: ItemType;
    static readonly pumpkinPie: ItemType;
    static readonly pumpkinSeeds: ItemType;
    static readonly purpleCandle: ItemType;
    static readonly purpleCarpet: ItemType;
    static readonly purpleConcrete: ItemType;
    static readonly purpleDye: ItemType;
    static readonly purpleGlazedTerracotta: ItemType;
    static readonly purpleShulkerBox: ItemType;
    static readonly purpleWool: ItemType;
    static readonly purpurBlock: ItemType;
    static readonly purpurStairs: ItemType;
    static readonly quartz: ItemType;
    static readonly quartzBlock: ItemType;
    static readonly quartzBricks: ItemType;
    static readonly quartzOre: ItemType;
    static readonly quartzStairs: ItemType;
    static readonly rabbit: ItemType;
    static readonly rabbitFoot: ItemType;
    static readonly rabbitHide: ItemType;
    static readonly rabbitSpawnEgg: ItemType;
    static readonly rabbitStew: ItemType;
    static readonly rail: ItemType;
    static readonly raiserArmorTrimSmithingTemplate: ItemType;
    static readonly ravagerSpawnEgg: ItemType;
    static readonly rawCopper: ItemType;
    static readonly rawCopperBlock: ItemType;
    static readonly rawGold: ItemType;
    static readonly rawGoldBlock: ItemType;
    static readonly rawIron: ItemType;
    static readonly rawIronBlock: ItemType;
    static readonly recoveryCompass: ItemType;
    static readonly redCandle: ItemType;
    static readonly redCarpet: ItemType;
    static readonly redConcrete: ItemType;
    static readonly redDye: ItemType;
    static readonly redFlower: ItemType;
    static readonly redGlazedTerracotta: ItemType;
    static readonly redMushroom: ItemType;
    static readonly redMushroomBlock: ItemType;
    static readonly redNetherBrick: ItemType;
    static readonly redNetherBrickStairs: ItemType;
    static readonly redSandstone: ItemType;
    static readonly redSandstoneStairs: ItemType;
    static readonly redShulkerBox: ItemType;
    static readonly redstone: ItemType;
    static readonly redstoneBlock: ItemType;
    static readonly redstoneLamp: ItemType;
    static readonly redstoneOre: ItemType;
    static readonly redstoneTorch: ItemType;
    static readonly redWool: ItemType;
    static readonly reinforcedDeepslate: ItemType;
    static readonly repeater: ItemType;
    static readonly repeatingCommandBlock: ItemType;
    static readonly respawnAnchor: ItemType;
    static readonly ribArmorTrimSmithingTemplate: ItemType;
    static readonly rottenFlesh: ItemType;
    static readonly saddle: ItemType;
    static readonly salmon: ItemType;
    static readonly salmonBucket: ItemType;
    static readonly salmonSpawnEgg: ItemType;
    static readonly sand: ItemType;
    static readonly sandstone: ItemType;
    static readonly sandstoneStairs: ItemType;
    static readonly sapling: ItemType;
    static readonly scaffolding: ItemType;
    static readonly sculk: ItemType;
    static readonly sculkCatalyst: ItemType;
    static readonly sculkSensor: ItemType;
    static readonly sculkShrieker: ItemType;
    static readonly sculkVein: ItemType;
    static readonly scute: ItemType;
    static readonly seagrass: ItemType;
    static readonly seaLantern: ItemType;
    static readonly seaPickle: ItemType;
    static readonly sentryArmorTrimSmithingTemplate: ItemType;
    static readonly shaperArmorTrimSmithingTemplate: ItemType;
    static readonly sheafPotterySherd: ItemType;
    static readonly shears: ItemType;
    static readonly sheepSpawnEgg: ItemType;
    static readonly shelterPotterySherd: ItemType;
    static readonly shield: ItemType;
    static readonly shroomlight: ItemType;
    static readonly shulkerBox: ItemType;
    static readonly shulkerShell: ItemType;
    static readonly shulkerSpawnEgg: ItemType;
    static readonly silenceArmorTrimSmithingTemplate: ItemType;
    static readonly silverfishSpawnEgg: ItemType;
    static readonly silverGlazedTerracotta: ItemType;
    static readonly skeletonHorseSpawnEgg: ItemType;
    static readonly skeletonSpawnEgg: ItemType;
    static readonly skull: ItemType;
    static readonly skullBannerPattern: ItemType;
    static readonly skullPotterySherd: ItemType;
    static readonly slime: ItemType;
    static readonly slimeBall: ItemType;
    static readonly slimeSpawnEgg: ItemType;
    static readonly smallAmethystBud: ItemType;
    static readonly smallDripleafBlock: ItemType;
    static readonly smithingTable: ItemType;
    static readonly smoker: ItemType;
    static readonly smoothBasalt: ItemType;
    static readonly smoothQuartzStairs: ItemType;
    static readonly smoothRedSandstoneStairs: ItemType;
    static readonly smoothSandstoneStairs: ItemType;
    static readonly smoothStone: ItemType;
    static readonly snifferEgg: ItemType;
    static readonly snifferSpawnEgg: ItemType;
    static readonly snortPotterySherd: ItemType;
    static readonly snoutArmorTrimSmithingTemplate: ItemType;
    static readonly snow: ItemType;
    static readonly snowball: ItemType;
    static readonly snowGolemSpawnEgg: ItemType;
    static readonly snowLayer: ItemType;
    static readonly soulCampfire: ItemType;
    static readonly soulLantern: ItemType;
    static readonly soulSand: ItemType;
    static readonly soulSoil: ItemType;
    static readonly soulTorch: ItemType;
    static readonly spawnEgg: ItemType;
    static readonly spiderEye: ItemType;
    static readonly spiderSpawnEgg: ItemType;
    static readonly spireArmorTrimSmithingTemplate: ItemType;
    static readonly splashPotion: ItemType;
    static readonly sponge: ItemType;
    static readonly sporeBlossom: ItemType;
    static readonly spruceBoat: ItemType;
    static readonly spruceButton: ItemType;
    static readonly spruceChestBoat: ItemType;
    static readonly spruceDoor: ItemType;
    static readonly spruceFence: ItemType;
    static readonly spruceFenceGate: ItemType;
    static readonly spruceHangingSign: ItemType;
    static readonly spruceLog: ItemType;
    static readonly sprucePressurePlate: ItemType;
    static readonly spruceSign: ItemType;
    static readonly spruceStairs: ItemType;
    static readonly spruceTrapdoor: ItemType;
    static readonly spyglass: ItemType;
    static readonly squidSpawnEgg: ItemType;
    static readonly stainedGlass: ItemType;
    static readonly stainedGlassPane: ItemType;
    static readonly stainedHardenedClay: ItemType;
    static readonly stick: ItemType;
    static readonly stickyPiston: ItemType;
    static readonly stone: ItemType;
    static readonly stoneAxe: ItemType;
    static readonly stoneBlockSlab: ItemType;
    static readonly stoneBlockSlab2: ItemType;
    static readonly stoneBlockSlab3: ItemType;
    static readonly stoneBlockSlab4: ItemType;
    static readonly stonebrick: ItemType;
    static readonly stoneBrickStairs: ItemType;
    static readonly stoneButton: ItemType;
    static readonly stonecutterBlock: ItemType;
    static readonly stoneHoe: ItemType;
    static readonly stonePickaxe: ItemType;
    static readonly stonePressurePlate: ItemType;
    static readonly stoneShovel: ItemType;
    static readonly stoneStairs: ItemType;
    static readonly stoneSword: ItemType;
    static readonly straySpawnEgg: ItemType;
    static readonly striderSpawnEgg: ItemType;
    static readonly 'string': ItemType;
    static readonly strippedAcaciaLog: ItemType;
    static readonly strippedBambooBlock: ItemType;
    static readonly strippedBirchLog: ItemType;
    static readonly strippedCherryLog: ItemType;
    static readonly strippedCherryWood: ItemType;
    static readonly strippedCrimsonHyphae: ItemType;
    static readonly strippedCrimsonStem: ItemType;
    static readonly strippedDarkOakLog: ItemType;
    static readonly strippedJungleLog: ItemType;
    static readonly strippedMangroveLog: ItemType;
    static readonly strippedMangroveWood: ItemType;
    static readonly strippedOakLog: ItemType;
    static readonly strippedSpruceLog: ItemType;
    static readonly strippedWarpedHyphae: ItemType;
    static readonly strippedWarpedStem: ItemType;
    static readonly structureBlock: ItemType;
    static readonly structureVoid: ItemType;
    static readonly sugar: ItemType;
    static readonly sugarCane: ItemType;
    static readonly suspiciousGravel: ItemType;
    static readonly suspiciousSand: ItemType;
    static readonly suspiciousStew: ItemType;
    static readonly sweetBerries: ItemType;
    static readonly tadpoleBucket: ItemType;
    static readonly tadpoleSpawnEgg: ItemType;
    static readonly tallgrass: ItemType;
    static readonly target: ItemType;
    static readonly tideArmorTrimSmithingTemplate: ItemType;
    static readonly tintedGlass: ItemType;
    static readonly tnt: ItemType;
    static readonly tntMinecart: ItemType;
    static readonly torch: ItemType;
    static readonly torchflower: ItemType;
    static readonly torchflowerSeeds: ItemType;
    static readonly totemOfUndying: ItemType;
    static readonly traderLlamaSpawnEgg: ItemType;
    static readonly trapdoor: ItemType;
    static readonly trappedChest: ItemType;
    static readonly trident: ItemType;
    static readonly tripwireHook: ItemType;
    static readonly tropicalFish: ItemType;
    static readonly tropicalFishBucket: ItemType;
    static readonly tropicalFishSpawnEgg: ItemType;
    static readonly tubeCoral: ItemType;
    static readonly tuff: ItemType;
    static readonly turtleEgg: ItemType;
    static readonly turtleHelmet: ItemType;
    static readonly turtleSpawnEgg: ItemType;
    static readonly twistingVines: ItemType;
    static readonly undyedShulkerBox: ItemType;
    static readonly verdantFroglight: ItemType;
    static readonly vexArmorTrimSmithingTemplate: ItemType;
    static readonly vexSpawnEgg: ItemType;
    static readonly villagerSpawnEgg: ItemType;
    static readonly vindicatorSpawnEgg: ItemType;
    static readonly vine: ItemType;
    static readonly wanderingTraderSpawnEgg: ItemType;
    static readonly wardArmorTrimSmithingTemplate: ItemType;
    static readonly wardenSpawnEgg: ItemType;
    static readonly warpedButton: ItemType;
    static readonly warpedDoor: ItemType;
    static readonly warpedFence: ItemType;
    static readonly warpedFenceGate: ItemType;
    static readonly warpedFungus: ItemType;
    static readonly warpedFungusOnAStick: ItemType;
    static readonly warpedHangingSign: ItemType;
    static readonly warpedHyphae: ItemType;
    static readonly warpedNylium: ItemType;
    static readonly warpedPlanks: ItemType;
    static readonly warpedPressurePlate: ItemType;
    static readonly warpedRoots: ItemType;
    static readonly warpedSign: ItemType;
    static readonly warpedSlab: ItemType;
    static readonly warpedStairs: ItemType;
    static readonly warpedStem: ItemType;
    static readonly warpedTrapdoor: ItemType;
    static readonly warpedWartBlock: ItemType;
    static readonly waterBucket: ItemType;
    static readonly waterlily: ItemType;
    static readonly waxedCopper: ItemType;
    static readonly waxedCutCopper: ItemType;
    static readonly waxedCutCopperSlab: ItemType;
    static readonly waxedCutCopperStairs: ItemType;
    static readonly waxedExposedCopper: ItemType;
    static readonly waxedExposedCutCopper: ItemType;
    static readonly waxedExposedCutCopperSlab: ItemType;
    static readonly waxedExposedCutCopperStairs: ItemType;
    static readonly waxedOxidizedCopper: ItemType;
    static readonly waxedOxidizedCutCopper: ItemType;
    static readonly waxedOxidizedCutCopperSlab: ItemType;
    static readonly waxedOxidizedCutCopperStairs: ItemType;
    static readonly waxedWeatheredCopper: ItemType;
    static readonly waxedWeatheredCutCopper: ItemType;
    static readonly waxedWeatheredCutCopperSlab: ItemType;
    static readonly waxedWeatheredCutCopperStairs: ItemType;
    static readonly wayfinderArmorTrimSmithingTemplate: ItemType;
    static readonly weatheredCopper: ItemType;
    static readonly weatheredCutCopper: ItemType;
    static readonly weatheredCutCopperSlab: ItemType;
    static readonly weatheredCutCopperStairs: ItemType;
    static readonly web: ItemType;
    static readonly weepingVines: ItemType;
    static readonly wheat: ItemType;
    static readonly wheatSeeds: ItemType;
    static readonly whiteCandle: ItemType;
    static readonly whiteCarpet: ItemType;
    static readonly whiteConcrete: ItemType;
    static readonly whiteDye: ItemType;
    static readonly whiteGlazedTerracotta: ItemType;
    static readonly whiteShulkerBox: ItemType;
    static readonly whiteWool: ItemType;
    static readonly wildArmorTrimSmithingTemplate: ItemType;
    static readonly witchSpawnEgg: ItemType;
    static readonly witherRose: ItemType;
    static readonly witherSkeletonSpawnEgg: ItemType;
    static readonly witherSpawnEgg: ItemType;
    static readonly wolfSpawnEgg: ItemType;
    static readonly wood: ItemType;
    static readonly woodenAxe: ItemType;
    static readonly woodenButton: ItemType;
    static readonly woodenDoor: ItemType;
    static readonly woodenHoe: ItemType;
    static readonly woodenPickaxe: ItemType;
    static readonly woodenPressurePlate: ItemType;
    static readonly woodenShovel: ItemType;
    static readonly woodenSlab: ItemType;
    static readonly woodenSword: ItemType;
    static readonly wool: ItemType;
    static readonly writableBook: ItemType;
    static readonly yellowCandle: ItemType;
    static readonly yellowCarpet: ItemType;
    static readonly yellowConcrete: ItemType;
    static readonly yellowDye: ItemType;
    static readonly yellowFlower: ItemType;
    static readonly yellowGlazedTerracotta: ItemType;
    static readonly yellowShulkerBox: ItemType;
    static readonly yellowWool: ItemType;
    static readonly zoglinSpawnEgg: ItemType;
    static readonly zombieHorseSpawnEgg: ItemType;
    static readonly zombiePigmanSpawnEgg: ItemType;
    static readonly zombieSpawnEgg: ItemType;
    static readonly zombieVillagerSpawnEgg: ItemType;
}

/**
 * @beta
 * Contains a set of additional variable values for further
 * defining how rendering and animations function.
 */
export class MolangVariableMap {
    /**
     * @remarks
     * Adds the following variables to Molang:
     * - `<variable_name>.r` - Red color value [0-1]
     * - `<variable_name>.g` - Green color value [0-1]
     * - `<variable_name>.b` - Blue color value [0-1]
     *
     */
    setColorRGB(variableName: string, color: Color): MolangVariableMap;
    /**
     * @remarks
     * Adds the following variables to Molang:
     * - `<variable_name>.r` - Red color value [0-1]
     * - `<variable_name>.g` - Green color value [0-1]
     * - `<variable_name>.b` - Blue color value [0-1]
     * - `<variable_name>.a` - Alpha (transparency) color value
     * [0-1]
     *
     */
    setColorRGBA(variableName: string, color: Color): MolangVariableMap;
    /**
     * @remarks
     * Adds the following variables to Molang:
     * - `<variable_name>.speed` - Speed number provided
     * - `<variable_name>.direction_x` - X value from the {@link
     * Vector3} provided
     * - `<variable_name>.direction_y` - Y value from the {@link
     * Vector3} provided
     * - `<variable_name>.direction_z` - Z value from the {@link
     * Vector3} provided
     *
     */
    setSpeedAndDirection(variableName: string, speed: number, direction: Vector3): MolangVariableMap;
    /**
     * @remarks
     * Adds the following variables to Molang:
     * - `<variable_name>.x` - X value from the {@link Vector3}
     * provided
     * - `<variable_name>.y` - Y value from the {@link Vector3}
     * provided
     * - `<variable_name>.z` - Z value from the {@link Vector3}
     * provided
     *
     */
    setVector3(variableName: string, vector: Vector3): MolangVariableMap;
}

/**
 * @beta
 * Contains data resulting from a navigation operation,
 * including whether the navigation is possible and the path of
 * navigation.
 */
export class NavigationResult {
    private constructor();
    /**
     * @remarks
     * Whether the navigation result contains a full path,
     * including to the requested destination.
     *
     */
    readonly isFullPath: boolean;
    /**
     * @remarks
     * A set of block locations that comprise the navigation route.
     *
     */
    getPath(): Vector3[];
}

/**
 * @beta
 * Contains information related to changes to a piston
 * expanding or retracting.
 */
// @ts-ignore Class inheritance allowed for native defined classes
export class PistonActivateAfterEvent extends BlockEvent {
    private constructor();
    /**
     * @remarks
     * True if the piston is the process of expanding.
     *
     */
    readonly isExpanding: boolean;
    /**
     * @remarks
     * Contains additional properties and details of the piston.
     *
     */
    readonly piston: BlockPistonComponent;
}

/**
 * @beta
 * Manages callbacks that are connected to piston activations.
 */
// @ts-ignore Class inheritance allowed for native defined classes
export class PistonActivateAfterEventSignal extends IPistonActivateAfterEventSignal {
    private constructor();
}

/**
 * @beta
 * Contains information related to changes before a piston
 * expands or retracts.
 */
// @ts-ignore Class inheritance allowed for native defined classes
export class PistonActivateBeforeEvent extends BlockEvent {
    private constructor();
    /**
     * @remarks
     * If this is set to true within an event handler, the piston
     * activation is canceled.
     *
     */
    cancel: boolean;
    /**
     * @remarks
     * True if the piston is the process of expanding.
     *
     */
    readonly isExpanding: boolean;
    /**
     * @remarks
     * Contains additional properties and details of the piston.
     *
     */
    readonly piston: BlockPistonComponent;
}

/**
 * @beta
 * Manages callbacks that are connected to an event that fires
 * before a piston is activated.
 */
// @ts-ignore Class inheritance allowed for native defined classes
export class PistonActivateBeforeEventSignal extends IPistonActivateBeforeEventSignal {
    private constructor();
}

/**
 * Represents a player within the world.
 */
// @ts-ignore Class inheritance allowed for native defined classes
export class Player extends Entity {
    private constructor();
    /**
     * @beta
     * @remarks
     * Whether the player is flying. For example, in Creative or
     * Spectator mode.
     *
     * @throws This property can throw when used.
     */
    readonly isFlying: boolean;
    /**
     * @beta
     * @remarks
     * Whether the player is gliding with Elytra.
     *
     * @throws This property can throw when used.
     */
    readonly isGliding: boolean;
    /**
     * @beta
     * @remarks
     * Whether the player is jumping. This will remain true while
     * the player is holding the jump action.
     *
     * @throws This property can throw when used.
     */
    readonly isJumping: boolean;
    /**
     * @beta
     * @remarks
     * The current overall level for the player, based on their
     * experience.
     *
     * @throws This property can throw when used.
     */
    readonly level: number;
    /**
     * @remarks
     * Name of the player.
     *
     * @throws This property can throw when used.
     */
    readonly name: string;
    /**
     * @beta
     * @remarks
     * Contains methods for manipulating the on-screen display of a
     * Player.
     *
     * @throws This property can throw when used.
     */
    readonly onScreenDisplay: ScreenDisplay;
    /**
     * @beta
     * @remarks
     * Manages the selected slot in the player's hotbar.
     *
     * This property can't be edited in read-only mode.
     *
     */
    selectedSlot: number;
    /**
     * @beta
     * @remarks
     * The overall total set of experience needed to achieve the
     * next level for a player.
     *
     * @throws This property can throw when used.
     */
    readonly totalXpNeededForNextLevel: number;
    /**
     * @beta
     * @remarks
     * The current set of experience achieved for the player.
     *
     * @throws This property can throw when used.
     */
    readonly xpEarnedAtCurrentLevel: number;
    /**
     * @beta
     * @remarks
     * Adds/removes experience to/from the Player and returns the
     * current experience of the Player.
     *
     * This function can't be called in read-only mode.
     *
     * @param amount
     * Amount of experience to add. Note that this can be negative.
     * @returns
     * Returns the current experience of the Player.
     * @throws This function can throw errors.
     */
    addExperience(amount: number): number;
    /**
     * @beta
     * @remarks
     * Adds/removes level to/from the Player and returns the
     * current level of the Player.
     *
     * This function can't be called in read-only mode.
     *
     * @param amount
     * Amount to add to the player.
     * @returns
     * Returns the current level of the Player.
     * @throws This function can throw errors.
     */
    addLevels(amount: number): number;
    /**
     * @beta
     * @remarks
     * Gets the current item cooldown time for a particular
     * cooldown category.
     *
     * @param itemCategory
     * Specifies the cooldown category to retrieve the current
     * cooldown for.
     * @throws This function can throw errors.
     */
    getItemCooldown(itemCategory: string): number;
    /**
     * @beta
     * @remarks
     * Gets the current spawn point of the player.
     *
     * @throws This function can throw errors.
     */
    getSpawnPoint(): DimensionLocation | undefined;
    /**
     * @beta
     * @remarks
     *  Gets the total experience of the Player.
     *
     * @throws This function can throw errors.
     */
    getTotalXp(): number;
    /**
     * @beta
     * @remarks
     * Returns true if this player has operator-level permissions.
     *
     * @throws This function can throw errors.
     */
    isOp(): boolean;
    /**
     * @remarks
     * Plays a sound that only this particular player can hear.
     *
     * This function can't be called in read-only mode.
     *
     * @param soundID
     * Identifier of the sound to play.
     * @param soundOptions
     * Additional optional options for the sound.
     * @throws This function can throw errors.
     * @example playMusicAndSound.ts
     * ```typescript
     *   let players = mc.world.getPlayers();
     *
     *   const musicOptions: mc.MusicOptions = {
     *     fade: 0.5,
     *     loop: true,
     *     volume: 1.0,
     *   };
     *   mc.world.playMusic("music.menu", musicOptions);
     *
     *   const worldSoundOptions: mc.WorldSoundOptions = {
     *     pitch: 0.5,
     *     volume: 4.0,
     *   };
     *   mc.world.playSound("ambient.weather.thunder", targetLocation, worldSoundOptions);
     *
     *   const playerSoundOptions: mc.PlayerSoundOptions = {
     *     pitch: 1.0,
     *     volume: 1.0,
     *   };
     *
     *   players[0].playSound("bucket.fill_water", playerSoundOptions);
     * ```
     */
    playSound(soundID: string, soundOptions?: PlayerSoundOptions): void;
    /**
     * @beta
     * @remarks
     * This is an internal-facing method for posting a system
     * message to downstream clients.
     *
     * This function can't be called in read-only mode.
     *
     * @throws This function can throw errors.
     */
    postClientMessage(id: string, value: string): void;
    /**
     * @beta
     * @remarks
     * Resets the level of the player.
     *
     * This function can't be called in read-only mode.
     *
     * @throws This function can throw errors.
     */
    resetLevel(): void;
    /**
     * @remarks
     * Sends a message to the player.
     *
     * @param message
     * The message to be displayed.
     * @throws
     * This method can throw if the provided {@link RawMessage} is
     * in an invalid format. For example, if an empty `name` string
     * is provided to `score`.
     * @example nestedTranslation.ts
     * ```typescript
     * // Displays "Apple or Coal"
     * let rawMessage = {
     *   translate: "accessibility.list.or.two",
     *   with: { rawtext: [{ translate: "item.apple.name" }, { translate: "item.coal.name" }] },
     * };
     * player.sendMessage(rawMessage);
     * ```
     * @example scoreWildcard.ts
     * ```typescript
     * // Displays the player's score for objective "obj". Each player will see their own score.
     * const rawMessage = { score: { name: "*", objective: "obj" } };
     * world.sendMessage(rawMessage);
     * ```
     * @example sendBasicMessage.ts
     * ```typescript
     *   let players = mc.world.getPlayers();
     *
     *   players[0].sendMessage("Hello World!");
     * ```
     * @example sendTranslatedMessage.ts
     * ```typescript
     *   let players = mc.world.getPlayers();
     *
     *   players[0].sendMessage({ translate: "authentication.welcome", with: ["Amazing Player 1"] });
     * ```
     * @example simpleString.ts
     * ```typescript
     * // Displays "Hello, world!"
     * world.sendMessage("Hello, world!");
     * ```
     * @example translation.ts
     * ```typescript
     * // Displays "First or Second"
     * const rawMessage = { translate: "accessibility.list.or.two", with: ["First", "Second"] };
     * player.sendMessage(rawMessage);
     * ```
     */
    sendMessage(message: (RawMessage | string)[] | RawMessage | string): void;
    /**
     * @beta
     * @remarks
     * Will change the specified players permissions, and whether
     * they are operator or not.
     *
     * This function can't be called in read-only mode.
     *
     * @throws This function can throw errors.
     */
    setOp(isOp: boolean): void;
    /**
     * @beta
     * @remarks
     * Sets the current starting spawn point for this particular
     * player.
     *
     * This function can't be called in read-only mode.
     *
     * @throws This function can throw errors.
     */
    setSpawnPoint(spawnPoint?: DimensionLocation): void;
    /**
     * @beta
     * @remarks
     * Sets the item cooldown time for a particular cooldown
     * category.
     *
     * This function can't be called in read-only mode.
     *
     * @param itemCategory
     * Specifies the cooldown category to retrieve the current
     * cooldown for.
     * @param tickDuration
     * Duration in ticks of the item cooldown.
     * @throws This function can throw errors.
     */
    startItemCooldown(itemCategory: string, tickDuration: number): void;
}

/**
 * @beta
 * This type is usable for iterating over a set of players.
 * This means it can be used in statements like for...of
 * statements, Array.from(iterator), and more.
 */
export class PlayerIterator implements Iterable<Player> {
    private constructor();
    /**
     * @remarks
     * This function can't be called in read-only mode.
     *
     */
    [Symbol.iterator](): Iterator<Player>;
    /**
     * @remarks
     * Retrieves the next item in this iteration. The resulting
     * IteratorResult contains .done and .value properties which
     * can be used to see the next Player in the iteration.
     *
     * This function can't be called in read-only mode.
     *
     */
    next(): IteratorResult<Player>;
}

/**
 * Contains information regarding a player that has joined.
 * See the playerSpawn event for more detailed information that
 * could be returned after the first time a player has spawned
 * within the game.
 */
export class PlayerJoinAfterEvent {
    private constructor();
    /**
     * @remarks
     * Opaque string identifier of the player that joined the game.
     *
     */
    readonly playerId: string;
    /**
     * @remarks
     * Name of the player that has joined.
     *
     */
    readonly playerName: string;
}

/**
 * Manages callbacks that are connected to a player joining the
 * world.
 */
// @ts-ignore Class inheritance allowed for native defined classes
export class PlayerJoinAfterEventSignal extends IPlayerJoinAfterEventSignal {
    private constructor();
}

/**
 * Contains information regarding a player that has left the
 * world.
 */
export class PlayerLeaveAfterEvent {
    private constructor();
    /**
     * @remarks
     * Opaque string identifier of the player that has left the
     * event.
     *
     */
    readonly playerId: string;
    /**
     * @remarks
     * Player that has left the world.
     *
     */
    readonly playerName: string;
}

/**
 * Manages callbacks that are connected to a player leaving the
 * world.
 */
// @ts-ignore Class inheritance allowed for native defined classes
export class PlayerLeaveAfterEventSignal extends IPlayerLeaveAfterEventSignal {
    private constructor();
}

/**
 * An event that contains more information about a player
 * spawning.
 */
export class PlayerSpawnAfterEvent {
    private constructor();
    /**
     * @remarks
     * If true, this is the initial spawn of a player after joining
     * the game.
     *
     * This property can't be edited in read-only mode.
     *
     */
    initialSpawn: boolean;
    /**
     * @remarks
     * Object that represents the player that joined the game.
     *
     * This property can't be edited in read-only mode.
     *
     */
    player: Player;
}

/**
 * Registers an event when a player is spawned (or re-spawned
 * after death) and fully ready within the world.
 */
// @ts-ignore Class inheritance allowed for native defined classes
export class PlayerSpawnAfterEventSignal extends IPlayerSpawnAfterEventSignal {
    private constructor();
}

/**
 * @beta
 * Contains information related to changes to a pressure plate
 * pop.
 */
// @ts-ignore Class inheritance allowed for native defined classes
export class PressurePlatePopAfterEvent extends BlockEvent {
    private constructor();
    /**
     * @remarks
     * The redstone power of the pressure plate before it was
     * popped.
     *
     */
    readonly previousRedstonePower: number;
    /**
     * @remarks
     * The redstone power of the pressure plate at the time of the
     * pop.
     *
     */
    readonly redstonePower: number;
}

/**
 * @beta
 * Manages callbacks that are connected to when a pressure
 * plate is popped.
 */
// @ts-ignore Class inheritance allowed for native defined classes
export class PressurePlatePopAfterEventSignal extends IPressurePlatePopAfterEventSignal {
    private constructor();
}

/**
 * @beta
 * Contains information related to changes to a pressure plate
 * push.
 */
// @ts-ignore Class inheritance allowed for native defined classes
export class PressurePlatePushAfterEvent extends BlockEvent {
    private constructor();
    /**
     * @remarks
     * The redstone power of the pressure plate before it was
     * pushed.
     *
     */
    readonly previousRedstonePower: number;
    /**
     * @remarks
     * The redstone power of the pressure plate at the time of the
     * push.
     *
     */
    readonly redstonePower: number;
    /**
     * @remarks
     * Source that triggered the pressure plate push.
     *
     */
    readonly source: Entity;
}

/**
 * @beta
 * Manages callbacks that are connected to when a pressure
 * plate is pushed.
 */
// @ts-ignore Class inheritance allowed for native defined classes
export class PressurePlatePushAfterEventSignal extends IPressurePlatePushAfterEventSignal {
    private constructor();
}

/**
 * @beta
 */
export class ProjectileHitAfterEvent {
    private constructor();
    readonly dimension: Dimension;
    readonly hitVector: Vector3;
    readonly location: Vector3;
    readonly projectile: Entity;
    readonly source: Entity;
    /**
     * @remarks
     * This function can't be called in read-only mode.
     *
     */
    getBlockHit(): BlockHitInformation | undefined;
    /**
     * @remarks
     * This function can't be called in read-only mode.
     *
     */
    getEntityHit(): EntityHitInformation | undefined;
}

/**
 * @beta
 */
// @ts-ignore Class inheritance allowed for native defined classes
export class ProjectileHitAfterEventSignal extends IProjectileHitAfterEventSignal {
    private constructor();
}

/**
 * @beta
 * Provides methods that should be used within the World
 * Initialize event to register dynamic properties that can be
 * used and stored within Minecraft.
 */
export class PropertyRegistry {
    private constructor();
    /**
     * @remarks
     * Registers a dynamic property for a particular entity type
     * (e.g., a minecraft:skeleton.).
     *
     * This function can't be called in read-only mode.
     *
     * @throws This function can throw errors.
     */
    registerEntityTypeDynamicProperties(
        propertiesDefinition: DynamicPropertiesDefinition,
        entityType: EntityType,
    ): void;
    /**
     * @remarks
     * Registers a globally available dynamic property for a world.
     *
     * This function can't be called in read-only mode.
     *
     * @throws This function can throw errors.
     */
    registerWorldDynamicProperties(propertiesDefinition: DynamicPropertiesDefinition): void;
}

/**
 * @beta
 * Contains objectives and participants for the scoreboard.
 */
export class Scoreboard {
    private constructor();
    /**
     * @remarks
     * Adds a new objective to the scoreboard.
     *
     * This function can't be called in read-only mode.
     *
     * @throws This function can throw errors.
     */
    addObjective(objectiveId: string, displayName: string): ScoreboardObjective;
    /**
     * @remarks
     * Clears the objective that occupies a display slot.
     *
     * This function can't be called in read-only mode.
     *
     * @throws This function can throw errors.
     */
    clearObjectiveAtDisplaySlot(displaySlotId: DisplaySlotId): ScoreboardObjective;
    /**
     * @remarks
     * Returns a specific objective (by id).
     *
     * @param objectiveId
     * Identifier of the objective.
     * @throws This function can throw errors.
     */
    getObjective(objectiveId: string): ScoreboardObjective;
    /**
     * @remarks
     * Returns an objective that occupies the specified display
     * slot.
     *
     * @throws This function can throw errors.
     */
    getObjectiveAtDisplaySlot(displaySlotId: DisplaySlotId): ScoreboardObjectiveDisplayOptions;
    /**
     * @remarks
     * Returns all defined objectives.
     *
     * @throws This function can throw errors.
     */
    getObjectives(): ScoreboardObjective[];
    /**
     * @remarks
     * Returns all defined scoreboard identities.
     *
     * @throws This function can throw errors.
     */
    getParticipants(): ScoreboardIdentity[];
    /**
     * @remarks
     * Removes an objective from the scoreboard.
     *
     * This function can't be called in read-only mode.
     *
     * @throws This function can throw errors.
     */
    removeObjective(objectiveId: ScoreboardObjective | string): boolean;
    /**
     * @remarks
     * Sets an objective into a display slot with specified
     * additional display settings.
     *
     * This function can't be called in read-only mode.
     *
     * @throws This function can throw errors.
     */
    setObjectiveAtDisplaySlot(
        displaySlotId: DisplaySlotId,
        objectiveDisplaySetting: ScoreboardObjectiveDisplayOptions,
    ): ScoreboardObjective;
}

/**
 * @beta
 * Contains an identity of the scoreboard item.
 */
export class ScoreboardIdentity {
    private constructor();
    /**
     * @remarks
     * Returns the player-visible name of this identity.
     *
     */
    readonly displayName: string;
    /**
     * @remarks
     * Identifier of the scoreboard identity.
     *
     */
    readonly id: number;
    /**
     * @remarks
     * Type of the scoreboard identity.
     *
     */
    readonly 'type': ScoreboardIdentityType;
    /**
     * @remarks
     * If the scoreboard identity is an entity or player, returns
     * the entity that this scoreboard item corresponds to.
     *
     * @throws This function can throw errors.
     */
    getEntity(): Entity;
    isValid(): boolean;
}

/**
 * @beta
 * Contains objectives and participants for the scoreboard.
 */
export class ScoreboardObjective {
    private constructor();
    /**
     * @remarks
     * Returns the player-visible name of this scoreboard
     * objective.
     *
     * @throws This property can throw when used.
     */
    readonly displayName: string;
    /**
     * @remarks
     * Identifier of the scoreboard objective.
     *
     * @throws This property can throw when used.
     */
    readonly id: string;
    /**
     * @remarks
     * Returns all objective participant identities.
     *
     * @throws This function can throw errors.
     */
    getParticipants(): ScoreboardIdentity[];
    /**
     * @remarks
     * Returns a specific score for a participant.
     *
     * @param participant
     * Identifier of the participant to retrieve a score for.
     * @throws This function can throw errors.
     */
    getScore(participant: Entity | ScoreboardIdentity | string): number | undefined;
    /**
     * @remarks
     * Returns specific scores for this objective for all
     * participants.
     *
     * @throws This function can throw errors.
     */
    getScores(): ScoreboardScoreInfo[];
    /**
     * @remarks
     * Returns if the specified identity is a participant of the
     * scoreboard objective.
     *
     * @throws This function can throw errors.
     */
    hasParticipant(participant: Entity | ScoreboardIdentity | string): boolean;
    isValid(): boolean;
    /**
     * @remarks
     * Removes a participant from this scoreboard objective.
     *
     * This function can't be called in read-only mode.
     *
     * @param participant
     * Participant to remove from being tracked with this
     * objective.
     * @throws This function can throw errors.
     */
    removeParticipant(participant: Entity | ScoreboardIdentity | string): boolean;
    /**
     * @remarks
     * Sets a score for a participant.
     *
     * This function can't be called in read-only mode.
     *
     * @param participant
     * Identity of the participant.
     * @param score
     * New value of the score.
     * @throws This function can throw errors.
     */
    setScore(participant: Entity | ScoreboardIdentity | string, score: number): void;
}

/**
 * @beta
 * Contains a pair of a scoreboard participant and its
 * respective score.
 */
export class ScoreboardScoreInfo {
    private constructor();
    /**
     * @remarks
     * This scoreboard participant for this score.
     *
     */
    readonly participant: ScoreboardIdentity;
    /**
     * @remarks
     * Score value of the identity for this objective.
     *
     */
    readonly score: number;
}

/**
 * @beta
 * Contains information about user interface elements that are
 * showing up on the screen.
 */
export class ScreenDisplay {
    private constructor();
    /**
     * @remarks
     * Returns true if the current reference to this screen display
     * manager object is valid and functional.
     *
     */
    isValid(): boolean;
    /**
     * @remarks
     * Set the action bar text - a piece of text that displays
     * beneath the title and above the hot-bar.
     *
     * This function can't be called in read-only mode.
     *
     * @param text
     * New value for the action bar text.
     * @throws This function can throw errors.
     */
    setActionBar(text: (RawMessage | string)[] | RawMessage | string): void;
    /**
     * @remarks
     * Will cause a title to show up on the player's on screen
     * display. Will clear the title if set to empty string. You
     * can optionally specify an additional subtitle as well as
     * fade in, stay and fade out times.
     *
     * This function can't be called in read-only mode.
     *
     * @throws This function can throw errors.
     * @example countdown.ts
     * ```typescript
     *   let players = mc.world.getPlayers();
     *
     *   players[0].onScreenDisplay.setTitle("Get ready!", {
     *     stayDuration: 220,
     *     fadeInDuration: 2,
     *     fadeOutDuration: 4,
     *     subtitle: "10",
     *   });
     *
     *   let countdown = 10;
     *
     *   let intervalId = mc.system.runInterval(() => {
     *     countdown--;
     *     players[0].onScreenDisplay.updateSubtitle(countdown.toString());
     *
     *     if (countdown == 0) {
     *       mc.system.clearRun(intervalId);
     *     }
     *   }, 20);
     * ```
     * @example setTitle.ts
     * ```typescript
     *   let players = mc.world.getPlayers();
     *
     *   players[0].onScreenDisplay.setTitle("§o§6Fancy Title§r");
     * ```
     * @example setTitleAndSubtitle.ts
     * ```typescript
     *   let players = mc.world.getPlayers();
     *
     *   players[0].onScreenDisplay.setTitle("Chapter 1", {
     *     stayDuration: 100,
     *     fadeInDuration: 2,
     *     fadeOutDuration: 4,
     *     subtitle: "Trouble in Block Town",
     *   });
     * ```
     */
    setTitle(title: (RawMessage | string)[] | RawMessage | string, options?: TitleDisplayOptions): void;
    /**
     * @remarks
     * Updates the subtitle if the subtitle was previously
     * displayed via the setTitle method.
     *
     * This function can't be called in read-only mode.
     *
     * @throws This function can throw errors.
     */
    updateSubtitle(subtitle: (RawMessage | string)[] | RawMessage | string): void;
}

/**
 * @beta
 * Returns additional data about a /scriptevent command
 * invocation.
 */
export class ScriptEventCommandMessageAfterEvent {
    private constructor();
    /**
     * @remarks
     * Identifier of this ScriptEvent command message.
     *
     */
    readonly id: string;
    /**
     * @remarks
     * If this command was initiated via an NPC, returns the entity
     * that initiated the NPC dialogue.
     *
     */
    readonly initiator: Entity;
    /**
     * @remarks
     * Optional additional data passed in with the script event
     * command.
     *
     */
    readonly message: string;
    /**
     * @remarks
     * Source block if this command was triggered via a block
     * (e.g., a commandblock.)
     *
     */
    readonly sourceBlock: Block;
    /**
     * @remarks
     * Source entity if this command was triggered by an entity
     * (e.g., a NPC).
     *
     */
    readonly sourceEntity: Entity;
    /**
     * @remarks
     * Returns the type of source that fired this command.
     *
     */
    readonly sourceType: ScriptEventSource;
}

/**
 * @beta
 * Allows for registering an event handler that responds to
 * inbound /scriptevent commands.
 */
// @ts-ignore Class inheritance allowed for native defined classes
export class ScriptEventCommandMessageAfterEventSignal extends IScriptEventCommandMessageAfterEventSignal {
    private constructor();
}

/**
 * @beta
 * Describes a particular seating position on this rideable
 * entity.
 */
export class Seat {
    private constructor();
    /**
     * @remarks
     * If specified, contains a forced rotation that the riders in
     * this seat are facing.
     *
     */
    readonly lockRiderRotation: number;
    /**
     * @remarks
     * A maximum number of riders that this seat can support.
     *
     */
    readonly maxRiderCount: number;
    /**
     * @remarks
     * A minimum number of riders that can be placed in this seat
     * position, if this seat is to be filled.
     *
     */
    readonly minRiderCount: number;
    /**
     * @remarks
     * Physical location of this seat, relative to the entity's
     * location.
     *
     */
    readonly position: Vector3;
}

/**
 * @beta
 * Manages callbacks that are message passing to a server. This
 * event is not currently fully implemented, and should not be
 * used.
 */
// @ts-ignore Class inheritance allowed for native defined classes
export class ServerMessageAfterEventSignal extends IServerMessageAfterEventSignal {
    private constructor();
}

/**
 * A class that provides system-level events and functions.
 */
export class System {
    private constructor();
    /**
     * @beta
     * @remarks
     * Returns a collection of after-events for system-level
     * operations.
     *
     */
    readonly afterEvents: SystemAfterEvents;
    /**
     * @beta
     * @remarks
     * Returns a collection of before-events for system-level
     * operations.
     *
     */
    readonly beforeEvents: SystemBeforeEvents;
    /**
     * @remarks
     * Represents the current world tick of the server.
     *
     */
    readonly currentTick: number;
    /**
     * @remarks
     * Cancels the execution of a function run that was previously
     * scheduled via the `run` function.
     *
     */
    clearRun(runId: number): void;
    /**
     * @remarks
     * Runs a specified function at a future time. This is
     * frequently used to implement delayed behaviors and game
     * loops.
     *
     * @param callback
     * Function callback to run when the tickDelay time criteria is
     * met.
     * @returns
     * An opaque identifier that can be used with the `clearRun`
     * function to cancel the execution of this run.
     * @example trapTick.ts
     * ```typescript
     *   const overworld = mc.world.getDimension("overworld");
     *
     *   try {
     *     // Minecraft runs at 20 ticks per second.
     *     if (mc.system.currentTick % 1200 === 0) {
     *       mc.world.sendMessage("Another minute passes...");
     *     }
     *   } catch (e) {
     *     console.warn("Error: " + e);
     *   }
     *
     *   mc.system.run(trapTick);
     * ```
     */
    run(callback: () => void): number;
    /**
     * @remarks
     * Runs a set of code on an interval.
     *
     * @param callback
     * Functional code that will run when this interval occurs.
     * @param tickInterval
     * An interval of every N ticks that the callback will be
     * called upon.
     * @returns
     * An opaque handle that can be used with the clearRun method
     * to stop the run of this function on an interval.
     * @example every30Seconds.ts
     * ```typescript
     *   let intervalRunIdentifier = Math.floor(Math.random() * 10000);
     *
     *   mc.system.runInterval(() => {
     *     mc.world.sendMessage("This is an interval run " + intervalRunIdentifier + " sending a message every 30 seconds.");
     *   }, 600);
     * ```
     */
    runInterval(callback: () => void, tickInterval?: number): number;
    /**
     * @remarks
     * Runs a set of code at a future time specified by tickDelay.
     *
     * @param callback
     * Functional code that will run when this timeout occurs.
     * @param tickDelay
     * Amount of time, in ticks, before the interval will be
     * called.
     * @returns
     * An opaque handle that can be used with the clearRun method
     * to stop the run of this function on an interval.
     */
    runTimeout(callback: () => void, tickDelay?: number): number;
}

/**
 * @beta
 * Provides a set of events that fire within the broader
 * scripting system within Minecraft.
 */
export class SystemAfterEvents {
    private constructor();
    /**
     * @remarks
     * An event that fires when a /scriptevent command is set. This
     * provides a way for commands and other systems to trigger
     * behavior within script.
     *
     */
    readonly scriptEventReceive: ScriptEventCommandMessageAfterEventSignal;
}

/**
 * @beta
 * A set of events that fire before an actual action occurs. In
 * most cases, you can potentially cancel or modify the
 * impending event. Note that in before events any APIs that
 * modify gameplay state will not function and will throw an
 * error.
 */
export class SystemBeforeEvents {
    private constructor();
    /**
     * @remarks
     * Fires when the scripting watchdog shuts down the server. The
     * can be due to using too much memory, or by causing
     * significant slowdown or hang.
     * To prevent shutdown, set the event's cancel property to
     * true.
     *
     */
    readonly watchdogTerminate: WatchdogTerminateBeforeEventSignal;
}

/**
 * @beta
 * Contains information related to changes to a target block
 * hit.
 */
// @ts-ignore Class inheritance allowed for native defined classes
export class TargetBlockHitAfterEvent extends BlockEvent {
    private constructor();
    /**
     * @remarks
     * The position where the source hit the block.
     *
     */
    readonly hitVector: Vector3;
    /**
     * @remarks
     * The redstone power before the block is hit.
     *
     */
    readonly previousRedstonePower: number;
    /**
     * @remarks
     * The redstone power at the time the block is hit.
     *
     */
    readonly redstonePower: number;
    /**
     * @remarks
     * Optional source that hit the target block.
     *
     */
    readonly source: Entity;
}

/**
 * @beta
 * Manages callbacks that are connected to when a target block
 * is hit.
 */
// @ts-ignore Class inheritance allowed for native defined classes
export class TargetBlockHitAfterEventSignal extends ITargetBlockHitAfterEventSignal {
    private constructor();
}

/**
 * @beta
 * Represents a trigger for firing an event.
 */
export class Trigger {
    /**
     * @remarks
     * Event name of the trigger.
     *
     */
    eventName: string;
    /**
     * @remarks
     * Creates a new trigger.
     *
     */
    constructor(eventName: string);
}

/**
 * @beta
 * Contains information related to changes to a trip wire trip.
 */
// @ts-ignore Class inheritance allowed for native defined classes
export class TripWireTripAfterEvent extends BlockEvent {
    private constructor();
    /**
     * @remarks
     * Whether or not the block has redstone power.
     *
     */
    readonly isPowered: boolean;
    /**
     * @remarks
     * The sources that triggered the trip wire to trip.
     *
     */
    readonly sources: Entity[];
}

/**
 * @beta
 * Manages callbacks that are connected to when a trip wire is
 * tripped.
 */
// @ts-ignore Class inheritance allowed for native defined classes
export class TripWireTripAfterEventSignal extends ITripWireTripAfterEventSignal {
    private constructor();
}

/**
 * @beta
 * Contains a description of a vector.
 */
export class Vector {
    /**
     * @remarks
     * X component of this vector.
     *
     */
    x: number;
    /**
     * @remarks
     * Y component of this vector.
     *
     */
    y: number;
    /**
     * @remarks
     * Z component of this vector.
     *
     */
    z: number;
    /**
     * @remarks
     * A constant vector that represents (0, 0, -1).
     *
     */
    static readonly back: Vector;
    /**
     * @remarks
     * A constant vector that represents (0, -1, 0).
     *
     */
    static readonly down: Vector;
    /**
     * @remarks
     * A constant vector that represents (0, 0, 1).
     *
     */
    static readonly forward: Vector;
    /**
     * @remarks
     * A constant vector that represents (-1, 0, 0).
     *
     */
    static readonly left: Vector;
    /**
     * @remarks
     * A constant vector that represents (1, 1, 1).
     *
     */
    static readonly one: Vector;
    /**
     * @remarks
     * A constant vector that represents (1, 0, 0).
     *
     */
    static readonly right: Vector;
    /**
     * @remarks
     * A constant vector that represents (0, 1, 0).
     *
     */
    static readonly up: Vector;
    /**
     * @remarks
     * A constant vector that represents (0, 0, 0).
     *
     */
    static readonly zero: Vector;
    /**
     * @remarks
     * Creates a new instance of an abstract vector.
     *
     * @param x
     * X component of the vector.
     * @param y
     * Y component of the vector.
     * @param z
     * Z component of the vector.
     */
    constructor(x: number, y: number, z: number);
    /**
     * @remarks
     * Compares this vector and another vector to one another.
     *
     * @param other
     * Other vector to compare this vector to.
     * @returns
     * True if the two vectors are equal.
     */
    equals(other: Vector): boolean;
    /**
     * @remarks
     * Returns the length of this vector.
     *
     */
    length(): number;
    /**
     * @remarks
     * Returns the squared length of this vector.
     *
     */
    lengthSquared(): number;
    /**
     * @remarks
     * Returns this vector as a normalized vector.
     *
     */
    normalized(): Vector;
    /**
     * @remarks
     * Returns the addition of these vectors.
     *
     */
    static add(a: Vector3, b: Vector3): Vector;
    /**
     * @remarks
     * Returns the cross product of these two vectors.
     *
     */
    static cross(a: Vector3, b: Vector3): Vector;
    /**
     * @remarks
     * Returns the distance between two vectors.
     *
     */
    static distance(a: Vector3, b: Vector3): number;
    /**
     * @remarks
     * Returns the component-wise division of these vectors.
     *
     * @throws This function can throw errors.
     */
    static divide(a: Vector3, b: number | Vector3): Vector;
    /**
     * @remarks
     * Returns the linear interpolation between a and b using t as
     * the control.
     *
     */
    static lerp(a: Vector3, b: Vector3, t: number): Vector;
    /**
     * @remarks
     * Returns a vector that is made from the largest components of
     * two vectors.
     *
     */
    static max(a: Vector3, b: Vector3): Vector;
    /**
     * @remarks
     * Returns a vector that is made from the smallest components
     * of two vectors.
     *
     */
    static min(a: Vector3, b: Vector3): Vector;
    /**
     * @remarks
     * Returns the component-wise product of these vectors.
     *
     */
    static multiply(a: Vector3, b: number | Vector3): Vector;
    /**
     * @remarks
     * Returns the spherical linear interpolation between a and b
     * using s as the control.
     *
     */
    static slerp(a: Vector3, b: Vector3, s: number): Vector;
    /**
     * @remarks
     * Returns the subtraction of these vectors.
     *
     */
    static subtract(a: Vector3, b: Vector3): Vector;
}

/**
 * @beta
 * Contains information related to a script watchdog
 * termination.
 */
export class WatchdogTerminateBeforeEvent {
    private constructor();
    /**
     * @remarks
     * If set to true, cancels the termination of the script
     * runtime. Note that depending on server configuration
     * settings, cancellation of the termination may not be
     * allowed.
     *
     */
    cancel: boolean;
    /**
     * @remarks
     * Contains the reason why a script runtime is to be
     * terminated.
     *
     */
    readonly terminateReason: WatchdogTerminateReason;
}

/**
 * @beta
 * Manages callbacks that are connected to a callback that will
 * be called when a script runtime is being terminated due to a
 * violation of the performance watchdog system.
 */
// @ts-ignore Class inheritance allowed for native defined classes
export class WatchdogTerminateBeforeEventSignal extends IWatchdogTerminateBeforeEventSignal {
    private constructor();
}

/**
 * @beta
 * Contains information related to changes in weather in the
 * environment.
 */
export class WeatherChangeAfterEvent {
    private constructor();
    /**
     * @remarks
     * Dimension in which the weather has changed.
     *
     */
    readonly dimension: string;
    /**
     * @remarks
     * Whether it is lightning after the change in weather.
     *
     */
    readonly lightning: boolean;
    /**
     * @remarks
     * Whether it is raining after the change in weather.
     *
     */
    readonly raining: boolean;
}

/**
 * @beta
 * Manages callbacks that are connected to weather changing.
 */
// @ts-ignore Class inheritance allowed for native defined classes
export class WeatherChangeAfterEventSignal extends IWeatherChangeAfterEventSignal {
    private constructor();
}

/**
 * A class that wraps the state of a world - a set of
 * dimensions and the environment of Minecraft.
 */
export class World {
    private constructor();
    /**
     * @beta
     * @remarks
     * Contains a set of events that are applicable to the entirety
     * of the world.  Event callbacks are called in a deferred
     * manner. Event callbacks are executed in read-write mode.
     *
     */
    readonly afterEvents: WorldAfterEvents;
    /**
     * @beta
     * @remarks
     * Contains a set of events that are applicable to the entirety
     * of the world. Event callbacks are called immediately. Event
     * callbacks are executed in read-only mode.
     *
     */
    readonly beforeEvents: WorldBeforeEvents;
    /**
     * @beta
     * @remarks
     * Returns the general global scoreboard that applies to the
     * world.
     *
     */
    readonly scoreboard: Scoreboard;
    /**
     * @beta
     * @remarks
     * A method that is internal-only, used for broadcasting
     * specific messages between client and server.
     *
     * This function can't be called in read-only mode.
     *
     * @param id
     * The message identifier.
     * @param value
     * The message.
     */
    broadcastClientMessage(id: string, value: string): void;
    /**
     * @beta
     * @remarks
     * Returns the absolute time since the start of the world.
     *
     */
    getAbsoluteTime(): number;
    /**
     * @remarks
     * Returns an array of all active players within the world.
     *
     * @throws This function can throw errors.
     */
    getAllPlayers(): Player[];
    /**
     * @beta
     * @remarks
     * Returns the current day.
     *
     * @returns
     * The current day, determined by the world time divided by the
     * number of ticks per day. New worlds start at day 0.
     */
    getDay(): number;
    /**
     * @beta
     * @remarks
     * Returns the default Overworld spawn location.
     *
     * @returns
     * The default Overworld spawn location. By default, the Y
     * coordinate is 32767, indicating a player's spawn height is
     * not fixed and will be determined by surrounding blocks.
     */
    getDefaultSpawnLocation(): Vector3;
    /**
     * @remarks
     * Returns a dimension object.
     *
     * @param dimensionId
     * The name of the dimension. For example, "overworld",
     * "nether" or "the_end".
     * @returns
     * The requested dimension
     * @throws
     * Throws if the given dimension name is invalid
     */
    getDimension(dimensionId: string): Dimension;
    /**
     * @beta
     * @remarks
     * Returns a property value.
     *
     * @param identifier
     * The property identifier.
     * @returns
     * Returns the value for the property, or undefined if the
     * property has not been set.
     * @throws
     * Throws if the given dynamic property identifier is not
     * defined.
     * @example incrementProperty.ts
     * ```typescript
     *   let number = mc.world.getDynamicProperty("samplelibrary:number");
     *
     *   log("Current value is: " + number);
     *
     *   if (number === undefined) {
     *     number = 0;
     *   }
     *
     *   if (typeof number !== "number") {
     *     log("Number is of an unexpected type.");
     *     return -1;
     *   }
     *
     *   mc.world.setDynamicProperty("samplelibrary:number", number + 1);
     * ```
     * @example incrementPropertyInJsonBlob.ts
     * ```typescript
     *   let paintStr = mc.world.getDynamicProperty("samplelibrary:longerjson");
     *   let paint: { color: string; intensity: number } | undefined = undefined;
     *
     *   log("Current value is: " + paintStr);
     *
     *   if (paintStr === undefined) {
     *     paint = {
     *       color: "purple",
     *       intensity: 0,
     *     };
     *   } else {
     *     if (typeof paintStr !== "string") {
     *       log("Paint is of an unexpected type.");
     *       return -1;
     *     }
     *
     *     try {
     *       paint = JSON.parse(paintStr);
     *     } catch (e) {
     *       log("Error parsing serialized struct.");
     *       return -1;
     *     }
     *   }
     *
     *   if (!paint) {
     *     log("Error parsing serialized struct.");
     *     return -1;
     *   }
     *
     *   paint.intensity++;
     *   paintStr = JSON.stringify(paint); // be very careful to ensure your serialized JSON str cannot exceed limits
     *   mc.world.setDynamicProperty("samplelibrary:longerjson", paintStr);
     * ```
     */
    getDynamicProperty(identifier: string): boolean | number | string | undefined;
    /**
     * @beta
     * @remarks
     * Returns an entity based on the provided id.
     *
     * @param id
     * The id of the entity.
     * @returns
     * The requested entity object.
     * @throws
     * Throws if the given entity id is invalid.
     */
    getEntity(id: string): Entity | undefined;
    /**
     * @remarks
     * Returns a set of players based on a set of conditions
     * defined via the EntityQueryOptions set of filter criteria.
     *
     * @param options
     * Additional options that can be used to filter the set of
     * players returned.
     * @returns
     * A player array.
     * @throws
     * Throws if the provided EntityQueryOptions are invalid.
     */
    getPlayers(options?: EntityQueryOptions): Player[];
    /**
     * @beta
     * @remarks
     * Returns the time of day.
     *
     * @returns
     * The time of day, in ticks, between 0 and 24000.
     */
    getTimeOfDay(): number;
    /**
     * @remarks
     * Plays a particular music track for all players.
     *
     * This function can't be called in read-only mode.
     *
     * @throws This function can throw errors.
     * @example playMusicAndSound.ts
     * ```typescript
     *   let players = mc.world.getPlayers();
     *
     *   const musicOptions: mc.MusicOptions = {
     *     fade: 0.5,
     *     loop: true,
     *     volume: 1.0,
     *   };
     *   mc.world.playMusic("music.menu", musicOptions);
     *
     *   const worldSoundOptions: mc.WorldSoundOptions = {
     *     pitch: 0.5,
     *     volume: 4.0,
     *   };
     *   mc.world.playSound("ambient.weather.thunder", targetLocation, worldSoundOptions);
     *
     *   const playerSoundOptions: mc.PlayerSoundOptions = {
     *     pitch: 1.0,
     *     volume: 1.0,
     *   };
     *
     *   players[0].playSound("bucket.fill_water", playerSoundOptions);
     * ```
     */
    playMusic(trackID: string, musicOptions?: MusicOptions): void;
    /**
     * @remarks
     * Plays a sound for all players.
     *
     * This function can't be called in read-only mode.
     *
     * @throws
     * An error will be thrown if volume is less than 0.0.
     * An error will be thrown if fade is less than 0.0.
     * An error will be thrown if pitch is less than 0.01.
     * An error will be thrown if volume is less than 0.0.
     * @example playMusicAndSound.ts
     * ```typescript
     *   let players = mc.world.getPlayers();
     *
     *   const musicOptions: mc.MusicOptions = {
     *     fade: 0.5,
     *     loop: true,
     *     volume: 1.0,
     *   };
     *   mc.world.playMusic("music.menu", musicOptions);
     *
     *   const worldSoundOptions: mc.WorldSoundOptions = {
     *     pitch: 0.5,
     *     volume: 4.0,
     *   };
     *   mc.world.playSound("ambient.weather.thunder", targetLocation, worldSoundOptions);
     *
     *   const playerSoundOptions: mc.PlayerSoundOptions = {
     *     pitch: 1.0,
     *     volume: 1.0,
     *   };
     *
     *   players[0].playSound("bucket.fill_water", playerSoundOptions);
     * ```
     */
    playSound(soundID: string, location: Vector3, soundOptions?: WorldSoundOptions): void;
    /**
     * @remarks
     * Queues an additional music track for players. If a track is
     * not playing, a music track will play.
     *
     * This function can't be called in read-only mode.
     *
     * @throws
     * An error will be thrown if volume is less than 0.0.
     * An error will be thrown if fade is less than 0.0.
     *
     */
    queueMusic(trackID: string, musicOptions?: MusicOptions): void;
    /**
     * @beta
     * @remarks
     * Removes a specified property.
     *
     * This function can't be called in read-only mode.
     *
     * @throws This function can throw errors.
     */
    removeDynamicProperty(identifier: string): boolean;
    /**
     * @remarks
     * Sends a message to all players.
     *
     * @param message
     * The message to be displayed.
     * @throws
     * This method can throw if the provided {@link RawMessage} is
     * in an invalid format. For example, if an empty `name` string
     * is provided to `score`.
     * @example nestedTranslation.ts
     * ```typescript
     * // Displays "Apple or Coal"
     * let rawMessage = {
     *   translate: "accessibility.list.or.two",
     *   with: { rawtext: [{ translate: "item.apple.name" }, { translate: "item.coal.name" }] },
     * };
     * world.sendMessage(rawMessage);
     * ```
     * @example scoreWildcard.ts
     * ```typescript
     * // Displays the player's score for objective "obj". Each player will see their own score.
     * const rawMessage = { score: { name: "*", objective: "obj" } };
     * world.sendMessage(rawMessage);
     * ```
     * @example simpleString.ts
     * ```typescript
     * // Displays "Hello, world!"
     * world.sendMessage("Hello, world!");
     * ```
     * @example translation.ts
     * ```typescript
     * // Displays "First or Second"
     * const rawMessage = { translate: "accessibility.list.or.two", with: ["First", "Second"] };
     * world.sendMessage(rawMessage);
     * ```
     */
    sendMessage(message: (RawMessage | string)[] | RawMessage | string): void;
    /**
     * @beta
     * @remarks
     * Sets the world time.
     *
     * This function can't be called in read-only mode.
     *
     * @param absoluteTime
     * The world time, in ticks.
     */
    setAbsoluteTime(absoluteTime: number): void;
    /**
     * @beta
     * @remarks
     * Sets a default spawn location for all players.
     *
     * This function can't be called in read-only mode.
     *
     * @param spawnLocation
     * Location of the spawn point. Note that this is assumed to be
     * within the overworld dimension.
     * @throws
     * Throws if the provided spawn location is out of bounds.
     */
    setDefaultSpawnLocation(spawnLocation: Vector3): void;
    /**
     * @beta
     * @remarks
     * Sets a specified property to a value.
     *
     * This function can't be called in read-only mode.
     *
     * @param identifier
     * The property identifier.
     * @param value
     * Data value of the property to set.
     * @throws
     * Throws if the given dynamic property identifier is not
     * defined.
     * @example incrementProperty.ts
     * ```typescript
     *   let number = mc.world.getDynamicProperty("samplelibrary:number");
     *
     *   log("Current value is: " + number);
     *
     *   if (number === undefined) {
     *     number = 0;
     *   }
     *
     *   if (typeof number !== "number") {
     *     log("Number is of an unexpected type.");
     *     return -1;
     *   }
     *
     *   mc.world.setDynamicProperty("samplelibrary:number", number + 1);
     * ```
     * @example incrementPropertyInJsonBlob.ts
     * ```typescript
     *   let paintStr = mc.world.getDynamicProperty("samplelibrary:longerjson");
     *   let paint: { color: string; intensity: number } | undefined = undefined;
     *
     *   log("Current value is: " + paintStr);
     *
     *   if (paintStr === undefined) {
     *     paint = {
     *       color: "purple",
     *       intensity: 0,
     *     };
     *   } else {
     *     if (typeof paintStr !== "string") {
     *       log("Paint is of an unexpected type.");
     *       return -1;
     *     }
     *
     *     try {
     *       paint = JSON.parse(paintStr);
     *     } catch (e) {
     *       log("Error parsing serialized struct.");
     *       return -1;
     *     }
     *   }
     *
     *   if (!paint) {
     *     log("Error parsing serialized struct.");
     *     return -1;
     *   }
     *
     *   paint.intensity++;
     *   paintStr = JSON.stringify(paint); // be very careful to ensure your serialized JSON str cannot exceed limits
     *   mc.world.setDynamicProperty("samplelibrary:longerjson", paintStr);
     * ```
     */
    setDynamicProperty(identifier: string, value: boolean | number | string): void;
    /**
     * @beta
     * @remarks
     * Sets the time of day.
     *
     * This function can't be called in read-only mode.
     *
     * @param timeOfDay
     * The time of day, in ticks, between 0 and 24000.
     * @throws
     * Throws if the provided time of day is not within the valid
     * range.
     */
    setTimeOfDay(timeOfDay: number | TimeOfDay): void;
    /**
     * @remarks
     * Stops any music tracks from playing.
     *
     * This function can't be called in read-only mode.
     *
     */
    stopMusic(): void;
}

/**
 * Contains a set of events that are available across the scope
 * of the World.
 */
export class WorldAfterEvents {
    private constructor();
    /**
     * @beta
     * @remarks
     * This event fires for a block that is broken by a player.
     *
     */
    readonly blockBreak: BlockBreakAfterEventSignal;
    /**
     * @beta
     * @remarks
     * This event fires for each BlockLocation destroyed by an
     * explosion. It is fired after the blocks have already been
     * destroyed.
     *
     */
    readonly blockExplode: BlockExplodeAfterEventSignal;
    /**
     * @beta
     * @remarks
     * This event fires for a block that is placed by a player.
     *
     */
    readonly blockPlace: BlockPlaceAfterEventSignal;
    /**
     * @remarks
     * This event fires when a button is pushed.
     *
     */
    readonly buttonPush: ButtonPushAfterEventSignal;
    /**
     * @beta
     * @remarks
     * This event is triggered after a chat message has been
     * broadcast or sent to players.
     *
     */
    readonly chatSend: ChatSendAfterEventSignal;
    /**
     * @beta
     * @remarks
     * This event is fired when an entity event has been triggered
     * that will update the component definition state of an
     * entity.
     *
     */
    readonly dataDrivenEntityTriggerEvent: DataDrivenEntityTriggerAfterEventSignal;
    /**
     * @beta
     * @remarks
     * This event fires when an effect, like poisoning, is added to
     * an entity.
     *
     */
    readonly effectAdd: EffectAddAfterEventSignal;
    /**
     * @beta
     * @remarks
     * This event fires when an entity dies.
     *
     */
    readonly entityDie: EntityDieAfterEventSignal;
    /**
     * @beta
     */
    readonly entityHealthChanged: EntityHealthChangedAfterEventSignal;
    /**
     * @beta
     */
    readonly entityHitBlock: EntityHitBlockAfterEventSignal;
    /**
     * @beta
     */
    readonly entityHitEntity: EntityHitEntityAfterEventSignal;
    /**
     * @beta
     * @remarks
     * This event fires when an entity is hurt (takes damage).
     *
     */
    readonly entityHurt: EntityHurtAfterEventSignal;
    /**
     * @beta
     */
    readonly entityRemoved: EntityRemovedAfterEventSignal;
    /**
     * @beta
     * @remarks
     * This event fires when an entity is spawned.
     *
     */
    readonly entitySpawn: EntitySpawnAfterEventSignal;
    /**
     * @beta
     * @remarks
     * This event is fired after an explosion occurs.
     *
     */
    readonly explosion: ExplosionAfterEventSignal;
    /**
     * @beta
     */
    readonly itemCompleteUse: ItemCompleteUseAfterEventSignal;
    /**
     * @beta
     * @remarks
     * For custom items, this event is triggered when the
     * fundamental set of defined components for the item change.
     * Note that this event is only fired for custom data-driven
     * items.
     *
     */
    readonly itemDefinitionEvent: ItemDefinitionAfterEventSignal;
    /**
     * @beta
     */
    readonly itemReleaseUse: ItemReleaseUseAfterEventSignal;
    /**
     * @beta
     */
    readonly itemStartUse: ItemStartUseAfterEventSignal;
    /**
     * @beta
     * @remarks
     * This event fires when a player successfully uses an item or
     * places a block by pressing the Use Item / Place Block
     * button. If multiple blocks are placed, this event will only
     * occur once at the beginning of the block placement. Note:
     * This event cannot be used with Hoe or Axe items.
     *
     */
    readonly itemStartUseOn: ItemStartUseOnAfterEventSignal;
    /**
     * @beta
     */
    readonly itemStopUse: ItemStopUseAfterEventSignal;
    /**
     * @beta
     * @remarks
     * This event fires when a player releases the Use Item / Place
     * Block button after successfully using an item. Note: This
     * event cannot be used with Hoe or Axe items.
     *
     */
    readonly itemStopUseOn: ItemStopUseOnAfterEventSignal;
    /**
     * @beta
     * @remarks
     * This event fires when an item is successfully used by a
     * player.
     *
     */
    readonly itemUse: ItemUseAfterEventSignal;
    /**
     * @beta
     * @remarks
     * This event fires when an item is used on a block by a
     * player.
     *
     */
    readonly itemUseOn: ItemUseOnAfterEventSignal;
    readonly leverAction: LeverActionAfterEventSignal;
    /**
     * @beta
     * @remarks
     * This event is an internal implementation detail, and is
     * otherwise not currently functional.
     *
     */
    readonly messageReceive: ServerMessageAfterEventSignal;
    /**
     * @beta
     * @remarks
     * This event fires when a piston expands or retracts.
     *
     */
    readonly pistonActivate: PistonActivateAfterEventSignal;
    /**
     * @remarks
     * This event fires when a player joins a world.  See also
     * playerSpawn for another related event you can trap for when
     * a player is spawned the first time within a world.
     *
     */
    readonly playerJoin: PlayerJoinAfterEventSignal;
    /**
     * @remarks
     * This event fires when a player leaves a world.
     *
     */
    readonly playerLeave: PlayerLeaveAfterEventSignal;
    /**
     * @remarks
     * This event fires when a player spawns or respawns. Note that
     * an additional flag within this event will tell you whether
     * the player is spawning right after join vs. a respawn.
     *
     */
    readonly playerSpawn: PlayerSpawnAfterEventSignal;
    /**
     * @beta
     */
    readonly pressurePlatePop: PressurePlatePopAfterEventSignal;
    /**
     * @beta
     */
    readonly pressurePlatePush: PressurePlatePushAfterEventSignal;
    /**
     * @beta
     */
    readonly projectileHit: ProjectileHitAfterEventSignal;
    /**
     * @beta
     */
    readonly targetBlockHit: TargetBlockHitAfterEventSignal;
    /**
     * @beta
     */
    readonly tripWireTrip: TripWireTripAfterEventSignal;
    /**
     * @beta
     * @remarks
     * This event will be triggered when the weather changes within
     * Minecraft.
     *
     */
    readonly weatherChange: WeatherChangeAfterEventSignal;
    /**
     * @beta
     * @remarks
     * This event fires when the script environment is initialized
     * on a World. In addition, you can register dynamic properties
     * within the scope of a world Initialize event.
     *
     */
    readonly worldInitialize: WorldInitializeAfterEventSignal;
}

/**
 * @beta
 * A set of events that fire before an actual action occurs. In
 * most cases, you can potentially cancel or modify the
 * impending event. Note that in before events any APIs that
 * modify gameplay state will not function and will throw an
 * error. (e.g., dimension.spawnEntity)
 */
export class WorldBeforeEvents {
    private constructor();
    /**
     * @remarks
     * This event is triggered after a chat message has been
     * broadcast or sent to players.
     *
     */
    readonly chatSend: ChatSendBeforeEventSignal;
    /**
     * @remarks
     * This event is fired when an entity event has been triggered
     * that will update the component definition state of an
     * entity.
     *
     */
    readonly dataDrivenEntityTriggerEvent: DataDrivenEntityTriggerBeforeEventSignal;
    /**
     * @remarks
     * This event is fired after an explosion occurs.
     *
     */
    readonly explosion: ExplosionBeforeEventSignal;
    /**
     * @remarks
     * For custom items, this event is triggered when the
     * fundamental set of defined components for the item change.
     * Note that this event is only fired for custom data-driven
     * items.
     *
     */
    readonly itemDefinitionEvent: ItemDefinitionBeforeEventSignal;
    /**
     * @remarks
     * This event fires when an item is successfully used by a
     * player.
     *
     */
    readonly itemUse: ItemUseBeforeEventSignal;
    /**
     * @remarks
     * This event fires when an item is used on a block by a
     * player.
     *
     */
    readonly itemUseOn: ItemUseOnBeforeEventSignal;
    /**
     * @remarks
     * This event fires when a piston expands or retracts.
     *
     */
    readonly pistonActivate: PistonActivateBeforeEventSignal;
}

/**
 * @beta
 * Contains information and methods that can be used at the
 * initialization of the scripting environment for a World.
 * Also, use the supplied propertyRegistry object to register
 * any dynamic properties, within the scope of the World
 * Initialize execution.
 */
export class WorldInitializeAfterEvent {
    private constructor();
    /**
     * @remarks
     * Contains methods for scripts to initialize and register
     * dynamic properties they may wish to use within a world.
     *
     * @example propertyRegistration.js
     * ```typescript
     * import { DynamicPropertiesDefinition, EntityTypes, world } from '@minecraft/server';
     * import { MinecraftEntityTypes } from '@minecraft/vanilla-data';
     *
     * world.afterEvents.worldInitialize.subscribe(e => {
     *     let def = new DynamicPropertiesDefinition();
     *
     *     def.defineNumber('rpgStrength');
     *     def.defineString('rpgRole', 16);
     *     def.defineBoolean('rpgIsHero');
     *
     *     e.propertyRegistry.registerEntityTypeDynamicProperties(def, EntityTypes.get(MinecraftEntityTypes.Skeleton));
     * });
     * ```
     */
    readonly propertyRegistry: PropertyRegistry;
}

/**
 * @beta
 * Manages callbacks that are run at the initialization of the
 * scripting environment for a World. Do note that this event
 * may run multiple times within a session in the case that the
 * /reload command is used.
 */
// @ts-ignore Class inheritance allowed for native defined classes
export class WorldInitializeAfterEventSignal extends IWorldInitializeAfterEventSignal {
    private constructor();
}

/**
 * @beta
 * Contains additional options for a block fill operation.
 */
export interface BlockFillOptions {
    /**
     * @remarks
     * When specified, the fill operation will only apply to blocks
     * that match this description.
     *
     */
    matchingBlock?: BlockPermutation;
}

/**
 * @beta
 * Contains more information for events where a block is hit.
 */
export interface BlockHitInformation {
    /**
     * @remarks
     * Block that was hit.
     *
     */
    block: Block;
    /**
     * @remarks
     * Face of the block that was hit.
     *
     */
    face: Direction;
    /**
     * @remarks
     * Location relative to the bottom north-west corner of the
     * block.
     *
     */
    faceLocation: Vector3;
}

/**
 * @beta
 * Contains information for block raycast hit results.
 */
export interface BlockRaycastHit {
    /**
     * @remarks
     * Block that was hit.
     *
     */
    block: Block;
    /**
     * @remarks
     * Face of the block that was hit.
     *
     */
    face: Direction;
    /**
     * @remarks
     * Hit location relative to the bottom north-west corner of the
     * block.
     *
     */
    faceLocation: Vector3;
}

/**
 * @beta
 * Contains additional options for configuring a block raycast
 * query.
 */
export interface BlockRaycastOptions {
    /**
     * @remarks
     * If true, liquid blocks will be considered as blocks that
     * 'stop' the raycast.
     *
     */
    includeLiquidBlocks?: boolean;
    /**
     * @remarks
     * If true, passable blocks like vines and flowers will be
     * considered as blocks that 'stop' the raycast.
     *
     */
    includePassableBlocks?: boolean;
    /**
     * @remarks
     * Maximum distance, in blocks, to process the raycast.
     *
     */
    maxDistance?: number;
}

/**
 * @beta
 * A BlockVolume is a simple interface to an object which
 * represents a 3D rectangle of a given size (in blocks) at a
 * world block location.
 * Note that these are not analogous to "min" and "max" values,
 * in that the vector components are not guaranteed to be in
 * any order.
 * In addition, these vector positions are not interchangeable
 * with BlockLocation.
 * If you want to get this volume represented as range of of
 * BlockLocations, you can use the getBoundingBox utility
 * function.
 * This volume class will maintain the ordering of the corner
 * indexes as initially set. imagine that each corner is
 * assigned in Editor - as you move the corner around
 * (potentially inverting the min/max relationship of the
 * bounds) - what
 * you had originally selected as the top/left corner would
 * traditionally become the bottom/right.
 * When manually editing these kinds of volumes, you need to
 * maintain the identity of the corner as you edit - the
 * BlockVolume utility functions do this.
 *
 * Important to note that this measures block sizes (to/from) -
 * a normal AABB (0,0,0) to (0,0,0) would traditionally be of
 * size (0,0,0)
 * However, because we're measuring blocks - the size or span
 * of a BlockVolume would actually be (1,1,1)
 *
 */
export interface BlockVolume {
    /**
     * @remarks
     * A world block location that represents a corner in a 3D
     * rectangle
     *
     */
    from: Vector3;
    /**
     * @remarks
     * A world block location that represents the opposite corner
     * in a 3D rectangle
     *
     */
    to: Vector3;
}

/**
 * @beta
 * A BoundingBox is an interface to an object which represents
 * an AABB aligned rectangle.
 * The BoundingBox assumes that it was created in a valid state
 * (min <= max) but cannot guarantee it (unless it was created
 * using the associated {@link
 * @minecraft-server.BoundingBoxUtils} utility functions.
 * The min/max coordinates represent the diametrically opposite
 * corners of the rectangle.
 * The BoundingBox is not a representation of blocks - it has
 * no association with any type, it is just a mathematical
 * construct - so a rectangle with
 * ( 0,0,0 ) -> ( 0,0,0 )
 * has a size of ( 0,0,0 ) (unlike the very similar {@link
 * BlockVolume} object)
 */
export interface BoundingBox {
    /**
     * @remarks
     * A {@link @minecraft-server.Vector3} that represents the
     * largest corner of the rectangle
     *
     */
    max: Vector3;
    /**
     * @remarks
     * A {@link @minecraft-server.Vector3} that represents the
     * smallest corner of the rectangle
     *
     */
    min: Vector3;
}

/**
 * @beta
 */
export interface Color {
    alpha: number;
    blue: number;
    green: number;
    red: number;
}

/**
 * @beta
 * This interface defines an entry into the {@link
 * @minecraft-server/CompoundBlockVolume} which represents a
 * volume of positive or negative space.
 *
 */
export interface CompoundBlockVolumeItem {
    /**
     * @remarks
     * The 'action' defines how the block volume is represented in
     * the compound block volume stack.
     * 'Add' creates a block volume which is positively selected
     * 'Subtract' creates a block volume which represents a hole or
     * negative space in the overall compound block volume.
     *
     */
    action: CompoundBlockVolumeAction;
    /**
     * @remarks
     * The volume of space
     *
     */
    volume: BlockVolume;
}

/**
 * @beta
 * An exact coordinate within the world, including its
 * dimension and location.
 */
export interface DimensionLocation {
    /**
     * @remarks
     * The dimension.
     *
     */
    dimension: Dimension;
    /**
     * @remarks
     * The x coordinate.
     *
     */
    x: number;
    /**
     * @remarks
     * The y coordinate.
     *
     */
    y: number;
    /**
     * @remarks
     * The z coordinate.
     *
     */
    z: number;
}

/**
 * Additional options for when damage has been applied via a
 * projectile.
 */
export interface EntityApplyDamageByProjectileOptions {
    /**
     * @remarks
     * Optional entity that fired the projectile.
     *
     */
    damagingEntity?: Entity;
    /**
     * @remarks
     * Projectile that caused damage.
     *
     */
    damagingProjectile: Entity;
}

/**
 * Additional descriptions and metadata for a damage event.
 */
export interface EntityApplyDamageOptions {
    /**
     * @remarks
     * Underlying cause of the damage.
     *
     */
    cause: EntityDamageCause;
    /**
     * @remarks
     * Optional entity that caused the damage.
     *
     */
    damagingEntity?: Entity;
}

/**
 * @beta
 * Provides information about how damage has been applied to an
 * entity.
 */
export interface EntityDamageSource {
    /**
     * @remarks
     * Cause enumeration of damage.
     *
     */
    cause: EntityDamageCause;
    /**
     * @remarks
     * Optional entity that caused the damage.
     *
     */
    damagingEntity?: Entity;
    /**
     * @remarks
     * Optional projectile that may have caused damage.
     *
     */
    damagingProjectile?: Entity;
}

/**
 * @beta
 * Specifies additional filters that are used in registering a
 * data driven trigger event for entities.
 */
export interface EntityDataDrivenTriggerEventOptions {
    /**
     * @remarks
     * If this value is set, this event will only fire for entities
     * that match the entities within this collection.
     *
     */
    entities?: Entity[];
    /**
     * @remarks
     * If this value is set, this event will only fire if the
     * impacted entities' type matches this parameter.
     *
     */
    entityTypes?: string[];
    /**
     * @remarks
     * If this value is set, this event will only fire if the
     * impacted triggered event matches one of the events listed in
     * this parameter.
     *
     */
    eventTypes?: string[];
}

/**
 * Contains additional options for entity effects.
 */
export interface EntityEffectOptions {
    /**
     * @remarks
     * The strength of the effect.
     *
     */
    amplifier?: number;
    /**
     * @remarks
     * If true, will show particles when effect is on the entity.
     *
     */
    showParticles?: boolean;
}

/**
 * @beta
 * Contains optional parameters for registering an entity
 * event.
 */
export interface EntityEventOptions {
    /**
     * @remarks
     * If this value is set, this event will only fire for entities
     * that match the entities within this collection.
     *
     */
    entities?: Entity[];
    /**
     * @remarks
     * If this value is set, this event will only fire if the
     * impacted entities' type matches this parameter.
     *
     */
    entityTypes?: string[];
}

/**
 * @beta
 * Contains additional information about an entity that was
 * hit.
 */
export interface EntityHitInformation {
    /**
     * @remarks
     * Entity that was hit.
     *
     */
    entity: Entity;
}

/**
 * Contains options for selecting entities within an area.
 */
export interface EntityQueryOptions {
    /**
     * @remarks
     * Limits the number of entities to return, opting for the
     * closest N entities as specified by this property. The
     * location value must also be specified on the query options
     * object.
     *
     */
    closest?: number;
    /**
     * @remarks
     * Excludes entities that match one or more of the specified
     * families.
     *
     */
    excludeFamilies?: string[];
    /**
     * @remarks
     * Excludes entities if have a specific gamemode that matches
     * the specified gamemode.
     *
     */
    excludeGameModes?: GameMode[];
    /**
     * @remarks
     * Excludes entities that have a name that match one of the
     * specified values.
     *
     */
    excludeNames?: string[];
    /**
     * @remarks
     * Excludes entities with a tag that matches one of the
     * specified values.
     *
     */
    excludeTags?: string[];
    /**
     * @remarks
     * Excludes entities if they are one of the specified types.
     *
     */
    excludeTypes?: string[];
    /**
     * @remarks
     * If specified, includes entities that match all of the
     * specified families.
     *
     */
    families?: string[];
    /**
     * @remarks
     * Limits the number of entities to return, opting for the
     * farthest N entities as specified by this property. The
     * location value must also be specified on the query options
     * object.
     *
     */
    farthest?: number;
    /**
     * @remarks
     * If specified, includes entities with a gamemode that matches
     * the specified gamemode.
     *
     */
    gameMode?: GameMode;
    /**
     * @remarks
     * Adds a seed location to the query that is used in
     * conjunction with closest, farthest, limit, volume, and
     * distance properties.
     *
     */
    location?: Vector3;
    /**
     * @remarks
     * If specified, includes entities that are less than this
     * distance away from the location specified in the location
     * property.
     *
     */
    maxDistance?: number;
    /**
     * @remarks
     * If specified, will only include entities that have at most
     * this horizontal rotation.
     *
     */
    maxHorizontalRotation?: number;
    /**
     * @remarks
     * If defined, only players that have at most this level are
     * returned.
     *
     */
    maxLevel?: number;
    /**
     * @remarks
     * If specified, only entities that have at most this vertical
     * rotation are returned.
     *
     */
    maxVerticalRotation?: number;
    /**
     * @remarks
     * If specified, includes entities that are least this distance
     * away from the location specified in the location property.
     *
     */
    minDistance?: number;
    /**
     * @remarks
     * If specified, will only include entities that have at a
     * minimum this horizontal rotation.
     *
     */
    minHorizontalRotation?: number;
    /**
     * @remarks
     * If defined, only players that have at least this level are
     * returned.
     *
     */
    minLevel?: number;
    /**
     * @remarks
     * If specified, will only include entities that have at least
     * this vertical rotation.
     *
     */
    minVerticalRotation?: number;
    /**
     * @remarks
     * Includes entities with the specified name.
     *
     */
    name?: string;
    /**
     * @remarks
     * Gets/sets a collection of EntityQueryScoreOptions objects
     * with filters for specific scoreboard objectives.
     *
     */
    scoreOptions?: EntityQueryScoreOptions[];
    /**
     * @remarks
     * Includes entities that match all of the specified tags.
     *
     */
    tags?: string[];
    /**
     * @remarks
     * If defined, entities that match this type are included.
     *
     */
    type?: string;
    /**
     * @beta
     * @remarks
     * In conjunction with location, specified a cuboid volume of
     * entities to include.
     *
     */
    volume?: BlockAreaSize;
}

/**
 * Contains additional options for filtering players based on
 * their score for an objective.
 */
export interface EntityQueryScoreOptions {
    /**
     * @remarks
     * If set to true, entities and players within this score range
     * are excluded from query results.
     *
     */
    exclude?: boolean;
    /**
     * @remarks
     * If defined, only players that have a score equal to or under
     * maxScore are included.
     *
     */
    maxScore?: number;
    /**
     * @remarks
     * If defined, only players that have a score equal to or over
     * minScore are included.
     *
     */
    minScore?: number;
    /**
     * @remarks
     * Identifier of the scoreboard objective to filter on.
     *
     */
    objective?: string;
}

/**
 * @beta
 * Contains information for entity raycast hit results.
 */
export interface EntityRaycastHit {
    /**
     * @remarks
     * Distance from ray origin to entity bounds.
     *
     */
    distance: number;
    /**
     * @remarks
     * Entity that was hit.
     *
     */
    entity: Entity;
}

/**
 * @beta
 * Contains additional options for an entity raycast operation.
 */
export interface EntityRaycastOptions {
    /**
     * @remarks
     * Maximum distance, in blocks, to process the raycast.
     *
     */
    maxDistance?: number;
}

/**
 * @beta
 * Additional configuration options for the {@link
 * Dimension.createExplosion} method.
 */
export interface ExplosionOptions {
    /**
     * @remarks
     * Whether parts of the explosion also impact underwater.
     *
     */
    allowUnderwater?: boolean;
    /**
     * @remarks
     * Whether the explosion will break blocks within the blast
     * radius.
     *
     */
    breaksBlocks?: boolean;
    /**
     * @remarks
     * If true, the explosion is accompanied by fires within or
     * near the blast radius.
     *
     */
    causesFire?: boolean;
    /**
     * @remarks
     * Optional source of the explosion.
     *
     */
    source?: Entity;
}

/**
 * Additional configuration options for {@link
 * World.playMusic}/{@link World.queueMusic} methods.
 */
export interface MusicOptions {
    /**
     * @remarks
     * Specifies a fade overlap for music at the end of play.
     *
     */
    fade?: number;
    /**
     * @remarks
     * If set to true, this music track will play repeatedly.
     *
     */
    loop?: boolean;
    /**
     * @remarks
     * Relative volume level of the music.
     *
     */
    volume?: number;
}

/**
 * @beta
 * Represents a min/max structure for expressing a potential
 * range of numbers.
 */
export interface NumberRange {
    /**
     * @remarks
     * Maximum value within a range.
     *
     */
    max: number;
    /**
     * @remarks
     * Minimum value within a range.
     *
     */
    min: number;
}

/**
 * @beta
 * Contains additional options for how an animation is played.
 */
export interface PlayAnimationOptions {
    /**
     * @remarks
     * Amount of time to fade out after an animation stops.
     *
     */
    blendOutTime?: number;
    /**
     * @remarks
     * Specifies a controller to use that has been defined on the
     * entity.
     *
     */
    controller?: string;
    /**
     * @remarks
     * Specifies the state to transition to.
     *
     */
    nextState?: string;
    /**
     * @remarks
     * Specifies a Molang expression for when this animation should
     * complete.
     *
     */
    stopExpression?: string;
}

/**
 * Additional options for how a sound plays for a player.
 */
export interface PlayerSoundOptions {
    /**
     * @remarks
     * Location of the sound; if not specified, the sound is played
     * near a player.
     *
     */
    location?: Vector3;
    /**
     * @remarks
     * Optional pitch of the sound.
     *
     */
    pitch?: number;
    /**
     * @remarks
     * Optional volume of the sound.
     *
     */
    volume?: number;
}

/**
 * Defines a JSON structure that is used for more flexible
 */
export interface RawMessage {
    rawtext?: RawMessage[];
    /**
     * @remarks
     * Provides a token that will get replaced with the value of a
     * score.
     *
     */
    score?: RawMessageScore;
    /**
     * @remarks
     * Provides a string literal value to use.
     *
     */
    text?: string;
    /**
     * @remarks
     * Provides a translation token where, if the client has an
     * available resource in the players' language which matches
     * the token, will get translated on the client.
     *
     */
    translate?: string;
    with?: string[] | RawMessage;
}

/**
 * Provides a description of a score token to use within a raw
 * message.
 */
export interface RawMessageScore {
    /**
     * @remarks
     * Name of the score value to match.
     *
     */
    name?: string;
    /**
     * @remarks
     * Name of the score value to match.
     *
     */
    objective?: string;
}

/**
 * @beta
 * A `RawMessage` with only the `rawtext` property. When a
 * `RawMessage` is serialized the contents are put into a
 * rawtext property, so this is useful when reading saved
 * RawMessages. See `BlockSignComponent.setText` and
 * `BlockSignComponent.getRawText` for examples.
 */
export interface RawText {
    rawtext?: RawMessage[];
}

/**
 * @beta
 * Contains additional options for how a scoreboard should be
 * displayed within its display slot.
 */
export interface ScoreboardObjectiveDisplayOptions {
    /**
     * @remarks
     * Objective to be displayed.
     *
     */
    objective: ScoreboardObjective;
    /**
     * @remarks
     * The sort order to display the objective items within.
     *
     */
    sortOrder?: ObjectiveSortOrder;
}

/**
 * @beta
 * Contains additional options for registering a script event
 * event callback.
 */
export interface ScriptEventMessageFilterOptions {
    /**
     * @remarks
     * Optional list of namespaces to filter inbound script event
     * messages.
     *
     */
    namespaces: string[];
}

/**
 * Contains additional options for teleporting an entity.
 */
export interface TeleportOptions {
    /**
     * @remarks
     * Whether to check whether blocks will block the entity after
     * teleport.
     *
     */
    checkForBlocks?: boolean;
    /**
     * @remarks
     * Dimension to potentially move the entity to.  If not
     * specified, the entity is teleported within the dimension
     * that they reside.
     *
     */
    dimension?: Dimension;
    /**
     * @remarks
     * Location that the entity should be facing after teleport.
     *
     */
    facingLocation?: Vector3;
    /**
     * @remarks
     * Whether to retain the entities velocity after teleport.
     *
     */
    keepVelocity?: boolean;
    /**
     * @remarks
     * Rotation of the entity after teleport.
     *
     */
    rotation?: Vector2;
}

/**
 * @beta
 * Contains additional options for displaying a title and
 * optional subtitle.
 */
export interface TitleDisplayOptions {
    /**
     * @remarks
     * Fade-in duration for the title and subtitle, in ticks. There
     * are 20 ticks per second. Use {@link TicksPerSecond} constant
     * to convert between ticks and seconds.
     *
     */
    fadeInDuration: number;
    /**
     * @remarks
     * Fade-out time for the title and subtitle, in ticks. There
     * are 20 ticks per second. Use {@link TicksPerSecond} constant
     * to convert between ticks and seconds.
     *
     */
    fadeOutDuration: number;
    /**
     * @remarks
     * Amount of time for the title and subtitle to stay in place,
     * in ticks. There are 20 ticks per second. Use {@link
     * TicksPerSecond} constant to convert between ticks and
     * seconds.
     *
     */
    stayDuration: number;
    /**
     * @remarks
     * Optional subtitle text.
     *
     */
    subtitle?: (RawMessage | string)[] | RawMessage | string;
}

/**
 * Represents a two-directional vector.
 */
export interface Vector2 {
    /**
     * @remarks
     * X component of the two-dimensional vector.
     *
     */
    x: number;
    /**
     * @remarks
     * Y component of the two-dimensional vector.
     *
     */
    y: number;
}

/**
 * Contains a description of a vector.
 */
export interface Vector3 {
    /**
     * @remarks
     * X component of this vector.
     *
     */
    x: number;
    /**
     * @remarks
     * Y component of this vector.
     *
     */
    y: number;
    /**
     * @remarks
     * Z component of this vector.
     *
     */
    z: number;
}

/**
 * Contains additional options for a world-level playSound
 * occurrence.
 */
export interface WorldSoundOptions {
    /**
     * @remarks
     * Pitch of the sound played at the world level.
     *
     */
    pitch?: number;
    /**
     * @remarks
     * Relative volume and space by which this sound is heard.
     *
     */
    volume?: number;
}

/**
 * @beta
 */
// @ts-ignore Class inheritance allowed for native defined classes
export class CommandError extends Error {
    private constructor();
}

/**
 * @beta
 */
// @ts-ignore Class inheritance allowed for native defined classes
export class PositionInUnloadedChunkError extends Error {
    private constructor();
}

/**
 * @beta
 */
// @ts-ignore Class inheritance allowed for native defined classes
export class PositionOutOfWorldBoundariesError extends Error {
    private constructor();
}

/**
 * @beta
 */
export const TicksPerDay = 24000;
/**
 * @beta
 * @remarks
 * How many times the server ticks per second of real time.
 *
 */
export const TicksPerSecond = 20;
/**
 * @remarks
 * A class that provides system-level events and functions.
 *
 */
export const system: System;
/**
 * @remarks
 * A class that wraps the state of a world - a set of
 * dimensions and the environment of Minecraft.
 *
 */
export const world: World;
