import { world, VectorXZ, Vector3, Block, Dimension, BlockVolume, system } from "@minecraft/server";
import { get } from "../util/database";
function fastSurround(block: Block) {
    return [block.above(), block.below(), block.north(), block.east(), block.west(), block.south()].every((b) => b?.isSolid);
}
function returnSurroundSolid(block: Block) {
    return [block.above(), block.below(), block.north(), block.east(), block.west(), block.south()].filter(block => block?.isSolid) as Block[];
}
function getChunkOrigin({ x, z }: VectorXZ) {
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
        "emerald_ore",
    ][Math.floor(Math.random() * 8)];
}
function posKeyXZ({ x, z }: VectorXZ) {
    return `${x},${z}`;
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
function replaceArea(dimension: Dimension, { x: startX, z: startZ }: VectorXZ): Generator<void, void, void> {
  function* generator() {
    const endX = startX + 15, endZ = startZ + 15;
    const density = get("antiXrayGhostBlockDensity");
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
        { x: endX, y: 84, z: endZ }
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
      }

      if (raw && !block.isSolid) {
        world.setDynamicProperty(key); // Clean up
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

      if (move >= 20) {
        yield;
      }
    }
  }

  return generator();
}
const netherIncludeTypes = [
      "minecraft:nether_gold_ore",
      "minecraft:quartz_ore",
      "minecraft:netherrack",
      "minecraft:blackstone"
    ];
function replaceNetherArea(dimension: Dimension, { x: startX, z: startZ }: VectorXZ): Generator<void, void, void> {
  function* generator() {
    const endX = startX + 15, endZ = startZ + 15;
    const density = get("antiXrayGhostBlockDensity");

    const iterator1 = dimension.getBlocks(
      new BlockVolume(
        { x: startX, y: 0, z: startZ },
        { x: endX, y: 64, z: endZ }
      ),
      { includeTypes: netherIncludeTypes },
      true
    ).getBlockLocationIterator();

    const iterator2 = dimension.getBlocks(
      new BlockVolume(
        { x: startX, y: 65, z: startZ },
        { x: endX, y: 128, z: endZ }
      ),
      { includeTypes: netherIncludeTypes },
      true
    ).getBlockLocationIterator();

    const blocks = [...iterator1, ...iterator2];
    let move = 0;

    function recordModification(pos: Vector3, from: string) {
      const key = `bn:${pos.x},${pos.y},${pos.z}`;
      const rawId = from.replace("minecraft:", "");
      world.setDynamicProperty(key, rawId);
    }

    function randomNetherOre(): string {
      return [
        "nether_gold_ore",
        "quartz_ore",
        "ancient_debris",
        "ancient_debris",
      ][Math.floor(Math.random() * 4)];
    }

    for (const position of blocks) {
      const block = dimension.getBlock(position);
      if (!block || !block.isValid) continue;

      const key = `bn:${position.x},${position.y},${position.z}`;
      const raw = world.getDynamicProperty(key) as string;

      if (raw && block.typeId !== `minecraft:${raw}` && !block.isAir) {
        block.setType(`minecraft:${raw}`);
        move++;
      }

      if (raw && !block.isSolid) {
        world.setDynamicProperty(key); // Clean up
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

      if (move >= 20) {
        yield;
      }
    }
  }

  return generator();
}

world.beforeEvents.explosion.subscribe((event) => {
    if (event.dimension.id !== "minecraft:overworld" || get("banXrayHandler")) return;
  const impacted = event.getImpactedBlocks();
  const newImpacted: Block[] = [];

  for (const block of impacted) {
    const key = `b:${block.location.x},${block.location.y},${block.location.z}`;
    const raw = world.getDynamicProperty(key) as string;

    if (includeTypes.includes(block.typeId) && raw) {
      system.run(() => {
        block.setType("minecraft:" + raw);
        world.setDynamicProperty(key); // Clean up
      });
    } else {
      newImpacted.push(block); // Keep block in explosion list
    }

    // Extra check: restore adjacent blocks
    const neighbors = [
      block.above(),
      block.below(),
      block.north(),
      block.south(),
      block.east(),
      block.west()
    ];

    for (const neighbor of neighbors) {
      if (!neighbor || !neighbor.isValid) continue;

      const neighborKey = `b:${neighbor.location.x},${neighbor.location.y},${neighbor.location.z}`;
      const neighborRaw = world.getDynamicProperty(neighborKey) as string;
      if (!neighborRaw) continue;

      system.run(() => {
        neighbor.setType("minecraft:" + neighborRaw);
        world.setDynamicProperty(neighborKey); // Clean up
      });
    }
  }

  event.setImpactedBlocks(newImpacted);
});
const xrayCooldown = new Map<string, number>();
world.beforeEvents.playerBreakBlock.subscribe((event) => {
    if (event.dimension.id !== "minecraft:overworld") return;
  const solid = event.block.isSolid;
  const chunk = getChunkOrigin(event.block.location);
  const chunkKey = posKeyXZ(chunk);

  if (get("antiXray")) {
    const cooldown = xrayCooldown.get(chunkKey) ?? 0;
    const now = Date.now();

    if (now - cooldown > get("antiXrayGenerateCooldown")) {
      xrayCooldown.set(chunkKey, now);
      //@ts-expect-error
      console.log("AntiXray: chunk encrypting" + chunkKey);
      system.runJob(replaceArea(event.block.dimension, chunk));
    }
  }

  if (!solid || get("banXrayHandler")) return;

  const surrounds = returnSurroundSolid(event.block);

  system.run(() => {
    surrounds.forEach((block) => {
      const key = `b:${block.location.x},${block.location.y},${block.location.z}`;
      const raw = world.getDynamicProperty(key) as string;
      if (!raw) return;

      block.setType("minecraft:" + raw);
      world.setDynamicProperty(key); // Clean up
    });
  });
});
world.beforeEvents.explosion.subscribe((event) => {
  if (event.dimension.id !== "minecraft:nether" || get("banXrayHandler")) return;

  const impacted = event.getImpactedBlocks();
  const newImpacted: Block[] = [];

  for (const block of impacted) {
    const key = `bn:${block.location.x},${block.location.y},${block.location.z}`;
    const raw = world.getDynamicProperty(key) as string;

    if (raw) {
      system.run(() => {
        block.setType("minecraft:" + raw);
        world.setDynamicProperty(key); // Clean up
      });
    } else {
      newImpacted.push(block); // Keep block in explosion list
    }

    // 🔍 Extra check: restore adjacent blocks
    const neighbors = [
      block.above(),
      block.below(),
      block.north(),
      block.south(),
      block.east(),
      block.west()
    ];

    for (const neighbor of neighbors) {
      if (!neighbor || !neighbor.isValid) continue;

      const neighborKey = `bn:${neighbor.location.x},${neighbor.location.y},${neighbor.location.z}`;
      const neighborRaw = world.getDynamicProperty(neighborKey) as string;
      if (!neighborRaw) continue;

      system.run(() => {
        neighbor.setType("minecraft:" + neighborRaw);
        world.setDynamicProperty(neighborKey); // Clean up
      });
    }
  }

  event.setImpactedBlocks(newImpacted);
});
const netherXrayCooldown = new Map<string, number>();
world.beforeEvents.playerBreakBlock.subscribe((event) => {
  if (event.dimension.id !== "minecraft:nether") return;

  const solid = event.block.isSolid;
  const chunk = getChunkOrigin(event.block.location);
  const chunkKey = posKeyXZ(chunk);

  if (get("antiXray")) {
    const cooldown = netherXrayCooldown.get(chunkKey) ?? 0;
    const now = Date.now();

    if (now - cooldown > get("antiXrayGenerateCooldown")) {
      netherXrayCooldown.set(chunkKey, now);
      //@ts-expect-error
      console.log("AntiXray: chunk (nether) encrypting" + chunkKey);
      system.runJob(replaceNetherArea(event.block.dimension, chunk));
    }
  }

  if (!solid || get("banXrayHandler")) return;

  const surrounds = returnSurroundSolid(event.block);

  system.run(() => {
    surrounds.forEach((block) => {
      const key = `bn:${block.location.x},${block.location.y},${block.location.z}`;
      const raw = world.getDynamicProperty(key) as string;
      if (!raw) return;

      block.setType("minecraft:" + raw);
      world.setDynamicProperty(key); // Clean up
    });
  });
});