import { world, VectorXZ, Vector3, Block, Dimension, BlockVolume, system } from "@minecraft/server";
import { get } from "../util/database";
function fastSurround(block: Block) {
    return [block.above(), block.below(), block.north(), block.east(), block.west(), block.south()].every((b) => b?.isSolid);
}
function returnSurroundSolid(block: Block) {
    return [block.above(), block.below(), block.north(), block.east(), block.west(), block.south()].filter((block) => block?.isSolid) as Block[];
}
function getChunkOrigin({ x, z }: VectorXZ) {
    const chunkX = Math.floor(x / 16) * 16;
    const chunkZ = Math.floor(z / 16) * 16;
    return { x: chunkX, z: chunkZ };
}
function draw(probability: number): boolean {
    if (probability === 0) return false;
    if (probability === 1) return true;
    return Math.random() < probability;
}
function randomOre() {
    return ["diamond_ore", "diamond_ore", "iron_ore", "gold_ore", "redstone_ore", "copper_ore", "lapis_ore", "emerald_ore"][Math.floor(Math.random() * 8)];
}
function posKeyXZ({ x, z }: VectorXZ) {
    return `${x},${z}`;
}

function saveChunkData(keyPrefix: string, data: Record<string, string>) {
  const entries = Object.entries(data);
  let part = 0;
  let buffer: Record<string, string> = {};
  let size = 0;

  for (const [pos, rawId] of entries) {
    const entrySize = pos.length + rawId.length + 6;
    if (size + entrySize > 32000) {
      world.setDynamicProperty(`${keyPrefix}:${part}`, JSON.stringify(buffer));
      part++;
      buffer = {};
      size = 0;
    }
    buffer[pos] = rawId;
    size += entrySize;
  }

  if (Object.keys(buffer).length > 0) {
    world.setDynamicProperty(`${keyPrefix}:${part}`, JSON.stringify(buffer));
  }

  let cleanupPart = part + 1;
  while (world.getDynamicProperty(`${keyPrefix}:${cleanupPart}`)) {
    world.setDynamicProperty(`${keyPrefix}:${cleanupPart}`); // delete
    cleanupPart++;
  }
}

function loadChunkData(keyPrefix: string): Record<string, string> {
  const data: Record<string, string> = {};
  let part = 0;

  while (true) {
    const raw = world.getDynamicProperty(`${keyPrefix}:${part}`) as string;
    if (!raw) break;
    Object.assign(data, JSON.parse(raw));
    part++;
  }

  return data;
}

const includeTypes = [
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
    "minecraft:deepslate",
    "minecraft:emerald_ore",
    "minecraft:deepslate_emerald_ore",
];
export function replaceArea(dimension: Dimension, { x: startX, z: startZ }: VectorXZ): Generator<void, void, void> {
  function* generator() {
    const endX = startX + 15, endZ = startZ + 15;
    const density = get("antiXrayGhostBlockDensity");
    const maxMove = get("antiXrayMaxChangeInTick");
    const iterator1 = dimension.getBlocks(
      new BlockVolume({ x: startX, y: -63, z: startZ }, { x: endX, y: 32, z: endZ }),
      { includeTypes },
      true
    ).getBlockLocationIterator();

    const iterator2 = dimension.getBlocks(
      new BlockVolume({ x: startX, y: 33, z: startZ }, { x: endX, y: 84, z: endZ }),
      { includeTypes },
      true
    ).getBlockLocationIterator();

    const blocks = [...iterator1, ...iterator2];
    let move = 0;
        const chunkPrefix = `k:${Math.floor(startX / 16) * 16},${Math.floor(startZ / 16) * 16}`;
    const chunkData = loadChunkData(chunkPrefix);

    function recordModification(pos: Vector3, from: string) {
      const rawId = from.replace("minecraft:", "");
      chunkData[`${pos.x},${pos.y},${pos.z}`] = rawId;
    }
        for (const position of blocks) {
      const block = dimension.getBlock(position);
      if (!block || !block.isValid) continue;

      const key = `${position.x},${position.y},${position.z}`;
      const raw = chunkData[key];

      if (raw && block.typeId !== `minecraft:${raw}` && !block.isAir) {
        block.setType(`minecraft:${raw}`);
        move++;
      }

      if (raw && !block.isSolid) {
        delete chunkData[key];
        continue;
      }

      if (["minecraft:stone", "minecraft:deepslate"].includes(block.typeId)) {
        if (draw(density) && fastSurround(block)) {
          recordModification(position, block.typeId);
          block.setType("minecraft:" + (block.typeId === "minecraft:deepslate" ? "deepslate_" : "") + randomOre());
          move++;
        }
      } else if (fastSurround(block)) {
        recordModification(position, block.typeId);
        block.setType(block.typeId.startsWith("minecraft:deepslate_") ? "minecraft:deepslate" : "minecraft:stone");
        move++;
      }

      if (move >= maxMove) {
        yield;
      }
    }

    saveChunkData(chunkPrefix, chunkData);
  }

  return generator();
}
const netherIncludeTypes = ["minecraft:nether_gold_ore", "minecraft:quartz_ore", "minecraft:netherrack", "minecraft:blackstone"];
function replaceNetherArea(dimension: Dimension, { x: startX, z: startZ }: VectorXZ): Generator<void, void, void> {
  function* generator() {
    const endX = startX + 15, endZ = startZ + 15;
    const density = get("antiXrayGhostBlockDensity");
    const maxMove = get("antiXrayMaxChangeInTick");
    const iterator1 = dimension.getBlocks(
      new BlockVolume({ x: startX, y: 0, z: startZ }, { x: endX, y: 64, z: endZ }),
      { includeTypes: netherIncludeTypes },
      true
    ).getBlockLocationIterator();

    const iterator2 = dimension.getBlocks(
      new BlockVolume({ x: startX, y: 65, z: startZ }, { x: endX, y: 128, z: endZ }),
      { includeTypes: netherIncludeTypes },
      true
    ).getBlockLocationIterator();

    const blocks = [...iterator1, ...iterator2];
    let move = 0;

    const chunkPrefix = `bn:${Math.floor(startX / 16) * 16},${Math.floor(startZ / 16) * 16}`;
    const chunkData = loadChunkData(chunkPrefix);

    function recordModification(pos: Vector3, from: string) {
      const rawId = from.replace("minecraft:", "");
      chunkData[`${pos.x},${pos.y},${pos.z}`] = rawId;
    }

    function randomNetherOre(): string {
      return ["nether_gold_ore", "quartz_ore"][Math.floor(Math.random() * 4)];
    }

    for (const position of blocks) {
      const block = dimension.getBlock(position);
      if (!block || !block.isValid) continue;

      const key = `${position.x},${position.y},${position.z}`;
      const raw = chunkData[key];

      if (raw && block.typeId !== `minecraft:${raw}` && !block.isAir) {
        block.setType(`minecraft:${raw}`);
        move++;
      }

      if (raw && !block.isSolid) {
        delete chunkData[key];
        continue;
      }

      if (["minecraft:netherrack", "minecraft:blackstone"].includes(block.typeId)) {
        if (draw(density) && fastSurround(block)) {
          recordModification(position, block.typeId);
          block.setType("minecraft:" + randomNetherOre());
          move++;
        }
      } else if (fastSurround(block)) {
        recordModification(position, block.typeId);
        block.setType("minecraft:netherrack");
        move++;
      }

      if (move >= maxMove) {
        yield;
      }
    }

    saveChunkData(chunkPrefix, chunkData);
  }

  return generator();
}

world.beforeEvents.explosion.subscribe((event) => {
  if (event.dimension.id !== "minecraft:overworld" || get("banXrayHandler")) return;

  const impacted = event.getImpactedBlocks();
  const newImpacted: Block[] = [];

  for (const block of impacted) {
    const chunkPrefix = `k:${Math.floor(block.location.x / 16) * 16},${Math.floor(block.location.z / 16) * 16}`;
    const chunkData = loadChunkData(chunkPrefix);
    const key = `${block.location.x},${block.location.y},${block.location.z}`;
    const raw = chunkData[key];

    if (includeTypes.includes(block.typeId) && raw) {
      system.run(() => {
        block.setType("minecraft:" + raw);
        delete chunkData[key];
        saveChunkData(chunkPrefix, chunkData);
      });
    } else {
      newImpacted.push(block);
    }

    const neighbors = [block.above(), block.below(), block.north(), block.south(), block.east(), block.west()];
    for (const neighbor of neighbors) {
      if (!neighbor || !neighbor.isValid) continue;

      const neighborChunk = `k:${Math.floor(neighbor.location.x / 16) * 16},${Math.floor(neighbor.location.z / 16) * 16}`;
      const neighborData = loadChunkData(neighborChunk);
      const neighborKey = `${neighbor.location.x},${neighbor.location.y},${neighbor.location.z}`;
      const neighborRaw = neighborData[neighborKey];

      if (!neighborRaw) continue;

      system.run(() => {
        neighbor.setType("minecraft:" + neighborRaw);
        delete neighborData[neighborKey];
        saveChunkData(neighborChunk, neighborData);
      });
    }
  }

  event.setImpactedBlocks(newImpacted);
});
world.beforeEvents.explosion.subscribe((event) => {
  if (event.dimension.id !== "minecraft:nether" || get("banXrayHandler")) return;

  const impacted = event.getImpactedBlocks();
  const newImpacted: Block[] = [];

  for (const block of impacted) {
    const chunkPrefix = `bn:${Math.floor(block.location.x / 16) * 16},${Math.floor(block.location.z / 16) * 16}`;
    const chunkData = loadChunkData(chunkPrefix);
    const key = `${block.location.x},${block.location.y},${block.location.z}`;
    const raw = chunkData[key];

    if (raw) {
      system.run(() => {
        block.setType("minecraft:" + raw);
        delete chunkData[key];
        saveChunkData(chunkPrefix, chunkData);
      });
    } else {
      newImpacted.push(block);
    }

    const neighbors = [block.above(), block.below(), block.north(), block.south(), block.east(), block.west()];
    for (const neighbor of neighbors) {
      if (!neighbor || !neighbor.isValid) continue;

      const neighborChunk = `bn:${Math.floor(neighbor.location.x / 16) * 16},${Math.floor(neighbor.location.z / 16) * 16}`;
      const neighborData = loadChunkData(neighborChunk);
      const neighborKey = `${neighbor.location.x},${neighbor.location.y},${neighbor.location.z}`;
      const neighborRaw = neighborData[neighborKey];

      if (!neighborRaw) continue;

      system.run(() => {
        neighbor.setType("minecraft:" + neighborRaw);
        delete neighborData[neighborKey];
        saveChunkData(neighborChunk, neighborData);
      });
    }
  }

  event.setImpactedBlocks(newImpacted);
});
function getSurroundingChunks(center: VectorXZ): VectorXZ[] {
    const chunks: VectorXZ[] = [];
    for (let dx = -1; dx <= 1; dx++) {
        for (let dz = -1; dz <= 1; dz++) {
            chunks.push({
                x: center.x + dx * 16,
                z: center.z + dz * 16,
            });
        }
    }
    return chunks;
}
const netherXrayCooldown = new Map<string, number>();

world.beforeEvents.playerBreakBlock.subscribe((event) => {
  if (event.dimension.id !== "minecraft:nether") return;

  const solid = event.block.isSolid;
  const chunk = getChunkOrigin(event.block.location);
  const now = Date.now();

  if (get("antiXray")) {
    const targets = get("antiXrayEnhancedGeneration") ? getSurroundingChunks(chunk) : [chunk];

    for (const targetChunk of targets) {
      const key = posKeyXZ(targetChunk);
      const cooldown = netherXrayCooldown.get(key) ?? 0;

      if (now - cooldown > get("antiXrayGenerateCooldown")) {
        netherXrayCooldown.set(key, now);
        system.runJob(replaceNetherArea(event.block.dimension, targetChunk));
      }
    }
  }

  if (!solid || get("banXrayHandler")) return;

  const surrounds = returnSurroundSolid(event.block);

  system.run(() => {
    const chunkMap = new Map<string, Record<string, string>>();

    surrounds.forEach((block) => {
      const chunkPrefix = `bn:${Math.floor(block.location.x / 16) * 16},${Math.floor(block.location.z / 16) * 16}`;
      const key = `${block.location.x},${block.location.y},${block.location.z}`;

      if (!chunkMap.has(chunkPrefix)) {
        chunkMap.set(chunkPrefix, loadChunkData(chunkPrefix));
      }

      const chunkData = chunkMap.get(chunkPrefix)!;
      const raw = chunkData[key];
      if (!raw) return;

      block.setType("minecraft:" + raw);
      delete chunkData[key];
    });

    for (const [chunkPrefix, chunkData] of chunkMap.entries()) {
      saveChunkData(chunkPrefix, chunkData);
    }
  });
});
const xrayCooldown = new Map<string, number>();

world.beforeEvents.playerBreakBlock.subscribe((event) => {
  if (event.dimension.id !== "minecraft:overworld") return;

  const solid = event.block.isSolid;
  const chunk = getChunkOrigin(event.block.location);
  const now = Date.now();

  if (get("antiXray")) {
    const targets = get("antiXrayEnhancedGeneration") ? getSurroundingChunks(chunk) : [chunk];

    for (const targetChunk of targets) {
      const key = posKeyXZ(targetChunk);
      const cooldown = xrayCooldown.get(key) ?? 0;

      if (now - cooldown > get("antiXrayGenerateCooldown")) {
        xrayCooldown.set(key, now);
        system.runJob(replaceArea(event.block.dimension, targetChunk));
      }
    }
  }

  if (!solid || get("banXrayHandler")) return;

  const surrounds = returnSurroundSolid(event.block);

  system.run(() => {
    const chunkMap = new Map<string, Record<string, string>>();

    surrounds.forEach((block) => {
      const chunkPrefix = `k:${Math.floor(block.location.x / 16) * 16},${Math.floor(block.location.z / 16) * 16}`;
      const key = `${block.location.x},${block.location.y},${block.location.z}`;

      if (!chunkMap.has(chunkPrefix)) {
        chunkMap.set(chunkPrefix, loadChunkData(chunkPrefix));
      }

      const chunkData = chunkMap.get(chunkPrefix)!;
      const raw = chunkData[key];
      if (!raw) return;

      block.setType("minecraft:" + raw);
      delete chunkData[key];
    });

    for (const [chunkPrefix, chunkData] of chunkMap.entries()) {
      saveChunkData(chunkPrefix, chunkData);
    }
  });
});
system.beforeEvents.watchdogTerminate.subscribe((event) => {
    event.cancel = true;
});