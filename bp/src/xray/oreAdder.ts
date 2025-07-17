import { world, VectorXZ, Vector3, Block, Dimension, BlockVolume } from "@minecraft/server";
export interface ModifyData {
    pos: Vector3;
    from: string;
}
function fastSurround(block: Block) {
    return [block.above(), block.below(), block.north(), block.east(), block.west(), block.south()].every((b) => b?.isSolid);
}
export function returnSurroundSolid(block: Block) {
    return [block.above(), block.below(), block.north(), block.east(), block.west(), block.south()].filter(block => block?.isSolid) as Block[];
}
export function getChunkOrigin({ x, z }: VectorXZ) {
    const chunkX = Math.floor(x / 16) * 16;
    const chunkZ = Math.floor(z / 16) * 16;
    return { x: chunkX, z: chunkZ };
}
function draw(probability: number): boolean {
    return Math.random() < probability;
}
function randomOre() {
    return [
        "diamond_ore",
        "iron_ore",
        "gold_ore",
    ][Math.floor(Math.random() * 3)];
}
function posKey(pos: Vector3): string {
    return `${pos.x},${pos.y},${pos.z}`;
}
export function posKeyXZ({ x, z }: VectorXZ) {
    return `${x},${z}`;
}
export const includeTypes = [
    "minecraft:diamond_ore",
    "minecraft:deepslate_diamond_ore",
    "minecraft:iron_ore",
    "minecraft:deepslate_iron_ore",
            "minecraft:gold_ore",
            "minecraft:deepslate_gold_ore",
            "minecraft:redstone_ore",
            "minecraft:deepslate_redstone_ore",
            "minecraft:lapis_ore",
            "minecraft:deepslate_lapis_ore",
            "minecraft:coal_ore",
            "minecraft:deepslate_coal_ore",
            "minecraft:copper_ore",
            "minecraft:deepslate_copper_ore",
            "minecraft:stone",
            "minecraft:deepslate"
];
// Min y: -63
// Max y: 32
export function replaceArea(dimension: Dimension, { x: startX, z: startZ }: VectorXZ): Generator<void, void, void> {
    function* generator() {
    const endX = startX + 15, endZ = startZ + 15;
    const blocks = dimension.getBlocks(new BlockVolume(
        { x: startX, y: -63, z: startZ },
        { x: endX, y: 32, z: endZ },
    ), {
        includeTypes
    }, true).getBlockLocationIterator();
    let move = 0;
    const textData = world.getDynamicProperty("chunkdata:" + posKeyXZ({ x: startX, z: startZ })) as string;
    const lastModified: ModifyData[] = textData ? JSON.parse(textData) : [];
    const lastMap = new Map<string, ModifyData>();
    for (const entry of lastModified) {
        lastMap.set(posKey(entry.pos), entry); // Convert to map
    }
    const modified: ModifyData[] = [];
    function recordModification(pos: Vector3, from: string) {
        modified.push({ pos, from });
    }
    for (const position of blocks) {
        const block = dimension.getBlock(position);
        if (!block) continue;
        const last = lastMap.get(posKey(position));
        if (last) {
            if (!block.isValid) {
                recordModification(last.pos, last.from);
                continue;
            }
            if (block.typeId !== last.from) {
                block.setType(last.from);
                move++;
            }
        }
        if (!block.isValid) continue;
        if (["minecraft:stone", "minecraft:deepslate"].includes(block.typeId)) {
            if (draw(0.15) && fastSurround(block)) {
                recordModification(position, block.typeId);
                block.setType("minecraft:" + (block.typeId === "minecraft:deepslate" ? "deepslate_" : "") + randomOre());
                move++;
            }
        } else {
            if (block.typeId.startsWith("minecraft:deepslate_")) {
                block.setType("minecraft:deepslate");
            } else {
                block.setType("minecraft:stone");
            }
            move++;
            recordModification(position, block.typeId);
        }
        if (move >= 20) {
            yield; // Save for next tick
        }
    }
    world.setDynamicProperty("chunkdata:" + posKeyXZ({ x: startX, z: startZ }), JSON.stringify(modified));
    
}
return generator();
}