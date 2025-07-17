import { world, VectorXZ, Vector3, Block, Dimension, BlockVolume } from "@minecraft/server";
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
        "diamond_ore",
        "iron_ore",
        "gold_ore",
        "redstone_ore",
        "copper_ore",
        "lapis_ore",
    ][Math.floor(Math.random() * 7)];
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

    const iterator1 = dimension.getBlocks(
      new BlockVolume(
        { x: startX, y: -63, z: startZ },
        { x: endX, y: 32, z: endZ }
      ),
      { includeTypes },
      true
    ).getBlockLocationIterator();

    const iterator2 = dimension.getBlocks(
      new BlockVolume(
        { x: startX, y: 33, z: startZ },
        { x: endX, y: 64, z: endZ }
      ),
      { includeTypes },
      true
    ).getBlockLocationIterator();

    const blocks = [...iterator1, ...iterator2];
    let move = 0;

    function recordModification(pos: Vector3, from: string) {
      const key = `b:${pos.x},${pos.y},${pos.z}`;
      const rawId = from.replace("minecraft:", ""); // Strip namespace
      world.setDynamicProperty(key, rawId);
    }

    for (const position of blocks) {
      const block = dimension.getBlock(position);
      if (!block || !block.isValid) continue;

      const key = `b:${position.x},${position.y},${position.z}`;
      const raw = world.getDynamicProperty(key) as string;

      if (raw && block.typeId !== `minecraft:${raw}` && !block.isAir) {
        block.setType(`minecraft:${raw}`);
        move++;
        continue;
      }

      if (raw && !block.isSolid) {
        world.setDynamicProperty(key); // Clean up
        continue;
      }

      if (["minecraft:stone", "minecraft:deepslate"].includes(block.typeId)) {
        if (draw(0.15) && fastSurround(block)) {
          recordModification(position, block.typeId);
          block.setType("minecraft:" + (block.typeId === "minecraft:deepslate" ? "deepslate_" : "") + randomOre());
          move++;
        }
      } else if (fastSurround(block)) {
        recordModification(position, block.typeId);
        block.setType(block.typeId.startsWith("minecraft:deepslate_") ? "minecraft:deepslate" : "minecraft:stone");
        move++;
      }

      if (move >= 20) {
        yield;
      }
    }
  }

  return generator();
}