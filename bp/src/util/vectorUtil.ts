import { Block, Dimension, Direction, Vector3 } from "@minecraft/server";
export function safeGetBlock (dimension: Dimension, pos: Vector3) {
    if (!isBlockLocationValid(dimension, pos)) return undefined;
    return dimension.getBlock(pos);
}
const directionVectors: Record<Direction, [number, number, number]> = {
    [Direction.Down]: [0, -1, 0],
    [Direction.Up]: [0, 1, 0],
    [Direction.East]: [1, 0, 0],
    [Direction.West]: [-1, 0, 0],
    [Direction.South]: [0, 0, 1],
    [Direction.North]: [0, 0, -1],
};
export function safeGetBlockNear(block: Block, direction: Direction) {
    const { dimension, location } = block;
    const vector = directionVectors[direction];
    if (!vector) return undefined;

    const newLocation = deltaVector(location, ...vector);
    if (!isBlockLocationValid(dimension, newLocation)) return undefined;
    const blockMethod: Record<Direction, () => Block | undefined> = {
        [Direction.Down]: () => block.below(),
        [Direction.Up]: () => block.above(),
        [Direction.East]: () => block.east(),
        [Direction.West]: () => block.west(),
        [Direction.South]: () => block.south(),
        [Direction.North]: () => block.north(),
    };
    return blockMethod[direction]();
}
export function deltaVector({ x, y, z }: Vector3, dx: number, dy: number, dz: number): Vector3 {
    return {
        x: x + dx,
        y: y + dy,
        z: z + dz,
    }
}
export function floorVector({ x, y, z }: Vector3) {
    return {
        x: Math.floor(x),
        y: Math.floor(y),
        z: Math.floor(z)
    }
}
export function correctY (pos: Vector3) {
    const yDecimal = Math.abs(pos.y % 1);
    if (yDecimal > 0.999) pos.y = pos.y - yDecimal + 1;
    return pos;
}
function isBlockLocationValid (dimension: Dimension, pos: Vector3) {
    const { max, min } = dimension.heightRange;
    return pos.y >= min && pos.y < max// && dimension.isChunkLoaded(pos); --- We should add this next API version
}