export default {
  "system": {
    "notify": {
      "onFlag": true,
      "onPunishment": false,
      "onStop": true,
    },
    "punishment": {
      "ban": {
        "defaultTime": 300000,
        "BanBy": 'nokararos',
        "Reason": 'Unfair Cheating',
        "AppealAt": `discord.gg`
      }
    }
  },
  "modules": {
    "autoclickerA": {
      "state": true,
      "cpsLimit": 22,
      "VL": 3,
      "punishment": 'default'
    },
    "autoclickerB": {
      "state": true,
      "cpsLimit": 22,
      "VL": 3,
      "punishment": 'default'
    },
    "nukerA": {
      "state": true,
      "maxBreakInTick": 4,
      "validTime": 1000,
      "punishment": 'default'
    },
    "cbeA": {
      "state": true,
      "VL": undefined,
      "punishment": undefined,
      "tempkickNearest": true
    },
    "cbeB": {
      "state": false,
      "VL": undefined,
      "punishment": undefined,
      "tempkickNearest": true
    },
    "speedA": {
      "state": true,
      "maxSpeed": 200,
      "punishment": 'default',
      "VL": 3
    },
    "nofallA": {
      "state": true,
      "VL": 1,
      "punishment": 'default'
    },
    "killauraA": {
      "state": true,
      "maxHit": 1,
      "VL": 1,
      "punishment": 'default'
    },
    "killauraB": {
      "state": true,
      "maxAngle": 95,
      "VL": 0,
      "punishment": 'default'
    },
    "killauraC": {
      "state": true,
      "VL": 0,
      "punishment": 'default'
    },
    "killauraD": {
      "state": true,
      "VL": 0,
      "punishment": 'default'
    },
    "killauraE": {
      "state": true,
      "VL": 0,
      "punishment": 'default'
    },
    "killauraF": {
      "state": true,
      "VL": 1,
      "punishment": 'default'
    },
/*
    "killauraG": {
      "state": true,
      "VL": 1,
      "attackerMove": true,
      "targetMove": false,
      "gotCheck": 3,
      "maxDelay": 1000,
      "punishment": 'default'
    },
*/
    "surroundA": {
      "state": true,
      "maxAngle": 95,
      "VL": 0,
      "punishment": 'default'
    },
    "surroundB": {
      "state": true,
      "maxAngle": 95,
      "VL": 0,
      "punishment": 'default'
    },
    "movementA": {
      "state": true,
      "punishment": 'default',
      "VL": 3
    },
    "scaffoldA": {
      "state": true,
      "VL": 2,
      "punishment": 'default'
    },
    "scaffoldB": {
      "state": true,
      "VL": 2,
      "punishment": 'default'
    },
    "scaffoldC": {
      "state": true,
      "VL": 2,
      "angle": 45,
      "punishment": 'default'
    },
    "scaffoldD": {
      "state": true,
      "VL": 2,
      "maxBlockPlacePerSecond": 5,
      "timer": 500,
      "punishment": 'default'
    },
    "auraA": {
      "state": true,
      "VL": 1,
      "punishment": 'default'
    },
    "auraB": {
      "state": true,
      "VL": 1,
      "punishment": 'default'
    },
    "reachA": {
      "state": true,
      "maxdistance": 5.1,
      "VL": 1,
      "punishment": 'default'
    },
    "reachB": {
      "state": false,
      "maxdistance": 4.1,
      "VL": 1,
      "punishment": 'default'
    },
    "reachC": {
      "state": false,
      "maxdistance": 4.6,
      "VL": 1,
      "punishment": 'default'
    },
    "spamA": {
      "state": true,
      "minSendDelay": 3000
    },
    "spamB": {
      "state": true,
      "deleteMark": true
    },
    "spamC": {
      "state": true,
      "maxLength": 128
    },
    "spammerA": {
      "state": true,
      "VL": 1,
      "punishment": 'default'
    },
    "spammerB": {
      "state": true,
      "VL": 1,
      "punishment": 'default'
    },
    "spammerC": {
      "state": true,
      "VL": 1,
      "punishment": 'default'
    },
    "spammerD": {
      "state": true,
      "VL": 1,
      "punishment": 'default'
    },
    "invaildSprintA": {
      "state": true,
      "VL": 2,
      "punishment": 'default'
    },
    "invaildSprintB": {
      "state": true,
      "VL": 2,
      "punishment": 'default'
    },
    "invaildSprintC": {
      "state": true,
      "VL": 2,
      "punishment": 'default'
    },
    "fastThrowA": {
      "state": true,
      "VL": 2,
      "punishment": 'default',
      "minThrowTime": 150
    },
    "crasherA": {
      "state": true,
      "punishment": 'default',
      "VL": undefined
    },
    "crasherB": {
      "state": true,
      "punishment": 'default',
      "VL": undefined
    },
    "crasherC": {
      "state": true,
      "maxSummonLimitInTick": 32,
      "writeList": ["minecraft:item","minecraft:player"],
      "safeCause": ["Spawned","Born"]
    },
    "items": {
      "overallState": false,
      "illegalItemA": {
        "state": true,
        "punishment": 'default',
        "VL": undefined,
        "illegal": [
          "minecraft:end_gateway",
          "minecraft:bubble_column",
          "minecraft:end_portal",
          "minecraft:piston_arm_collision",
          "minecraft:sticky_piston_arm_collision",
          "minecraft:moving_block",
          "minecraft:portal",
          "minecraft:frosted_ice",
          "minecraft:invisible_bedrock",
          "minecraft:reserved6",
          "minecraft:allow",
          "minecraft:deny",
          "minecraft:barrier",
          "minecraft:command_block_minecart",
          "minecraft:command_block",
          "minecraft:chain_command_block",
          "minecraft:repeating_command_block",
          "minecraft:flowing_water",
          "minecraft:water",
          "minecraft:flowing_lava",
          "minecraft:lava",
          "minecraft:structure_block",
          "minecraft:structure_void",
          "minecraft:chemistry_table",
          "minecraft:camera",
          "minecraft:portfolio",
          "minecraft:chalkboard",
          "minecraft:photo_item"
        ]
      },
      "illegalItemB": {
        "state": false,
        "allowbucket": false,
        "bucketWhiteList": ['minecraft:water_bucket','minecraft:lava_bucket'],
        "allowbee": false,
        "punishment": 'default',
        "VL": undefined
      },
      "illegalItemC": {
        "state": false,
        "punishment": 'default',
        "whiteList": ['here to add your white list'],
        "VL": undefined
      },
      "illegalItemD": {
        "state": false,
        "punishment": 'default',
        "maxLoreLength": 0,
        "VL": undefined
      },
      "illegalItemE": {
        "state": false,
        "punishment": 'default',
        "removetag": false,
        "VL": undefined
      },
      "illegalItemF": {
        "state": false,
        "punishment": 'default',
        "VL": undefined,
        "whiteList": {
          "offhand": [
            "minecraft:totem_of_undying",
            "minecraft:minecraft:shield",
            "minecraft:arrow",
            "minecraft:filled_map",
            "minecraft:nautilus_shell"
          ],
          "head": [
            "minecraft:skull"
          ],
          "chest": [
            "here to add your white list"
          ],
          "legs": [
            "here to add your white list"
          ],
          "feet": [
            "here to add your white list"
          ]
        }
      },
      "illegalItemG": {
        "state": false,
        "punishment": 'default',
        "deleteName": false,
        "maxNameLength": 31,
        "VL": undefined
      },
      "illegalItemH": {
        "state": false,
        "punishment": 'default',
        "allowCanPlace": false,
        "allowCanBreak": false,
        "blockType": 0,
        "cleartag": false,
        "VL": undefined
      },
      "illegalItemI": {
        "state": false,
        "punishment": 'default',
        "VL": undefined
      },
      "illegalItemJ": {
        "state": false,
        "punishment": 'default',
        "VL": undefined
      },
      "BadEnchantA": {
        "state": false,
        "clearitem": false,
        "punishment": 'default'
      },
      "BadEnchantB": {
        "state": false,
        "punishment": 'default',
        "VL": undefined,
        "writeList": [
          "_helmet",
          "_chestplate",
          "_leggings",
          "_boots",
          "_sword",
          "_shovel",
          "_axe",
          "_hoe",
          "fishing_rod",
          "bow",
          "trident",
          "shield",
          "_on_a_stick",
          "brush",
          "compass",
          "crossbow"
        ]
      }
    },
    "aimbotA": {
      "state": true,
      "punishment": 'default',
      "VL": 3
    },
    "aimbotB": {
      "state": true,
      "punishment": 'default',
      "VL": 1,
      "buffer": 3
    },
    "towerA": {
      "state": true,
      "punishment": 'default',
      "VL": 2,
      "maxLocationDeff": 0.8
    },
    "flyA": {
      "state": false,
      "VL": undefined,
      "punishment": 'default'
    },
    "flyB": {
      "state": true,
      "VL": 2,
      "punishment": 'default'
    },
    "flyC": {
      "state": true,
      "VL": 2,
      "punishment": 'default'
    },
    "flyD": {
      "state": true,
      "maxAirTime": 4000,
      "VL": 2,
      "punishment": 'default'
    },
    "placementA": {
      "state": false,
      "punishment": 'default',
      "VL": undefined,
      "containerblock": [
        "minecraft:chest",
        "minecraft:trapped_chest",
        "minecraft:barrel",
        "minecraft:hopper",
        "minecraft:furnace",
        "minecraft:smoker",
        "minecraft:blast_furnace"
      ]
    },
    "placementB": {
      "state": false,
      "VL": undefined,
      "punishment": 'default'
    },
    "placementC": {
      "state": false,
      "VL": undefined,
      "punishment": 'default'
    },
    "placementD": {
      "state": false,
      "VL": undefined,
      "punishment": 'default'
    },
    "autototemA": {
      "state": true,
      "VL": 2,
      "punishment": 'default'
    },
    "autototemB": {
      "state": true,
      "VL": 2,
      "punishment": 'default'
    },
    "autototemC": {
      "state": true,
      "VL": 2,
      "punishment": 'default'
    },
    "autoshieldA": {
      "state": true,
      "VL": 2,
      "punishment": 'default'
    },
    "autoshieldB": {
      "state": true,
      "VL": 2,
      "punishment": 'default'
    },
    "autoshieldC": {
      "state": true,
      "VL": 2,
      "punishment": 'default'
    },
    "insteabreakA": {
      "state": false,
      "punishment": 'default',
      "unbreakable": [
        "minecraft:bedrock",
        "minecraft:barrier",
        "minecraft:command_block",
        "minecraft:chain_command_block",
        "minecraft:repeating_command_block",
        "minecraft:structure_block",
        "minecraft:structure_void"
      ]
    },
//invalid module
    "insteabreakB": {
      "state": true,
      "punishment": 'default',
      "minEffect": 1,
      "minLevelOfAxe": 3,
      "minLevelOfHoe": 2,
      "minLevelOfPickaxe": 3,
      "minLevelOfShovel": 2,
      "minLevelOfCutter": 1,
      "miscType": [
        "_stair",
        "_slab",
        "_fence",
        "_fence_gate",
        "_door",
        "_trapdoor",
        "_button",
        "_pressure_plate",
        "_sign",
        "_table",
      ],
      "woodType": [
        "minecraft:oak",
        "minecraft:spruce",
        "minecraft:birch",
        "minecraft:jungle",
        "minecraft:dark_oak",
        "minecraft:mangrove",
        "minecraft:cherry",
        "minecraft:bamboo",
        "minecraft:bamboo_mosaic",
        "minecraft:crimson",
        "minecraft:warped"
      ],
      "breakByAxe": [
        //minecraft: *_log *_wood
        "minecraft:bamboo_block",
        "minecraft:stripped_bamboo_block",
        "minecraft:pumpkin",
        "minecraft:carved_pumpkin",
        "minecraft:composter",
        "minecraft:lectern",
        "minecraft:chest",
        "minecraft:trapped_chest",
        "minecraft:noteblock",
        "minecraft:jukebox",
        "minecraft:bee_nest",
        "minecraft:beehive",
        "minecraft:campfire",
        "minecraft:soul_campfire",
        "minecraft:bookshelf",
        "minecraft:chiseled_bookshelf"
      ],
      "breakBySword": [
        //minecraft: *_leaves
        "minecraft:pumpkin",
        "minecraft:carved_pumpkin",
        "minecraft:lit_pumpkin",
        "minecraft:melon_block",
        "minecraft:bamboo",
        "minecraft:cocoa",
        "minecraft:hay_block",
        "minecraft:web"
      ],
      "breakByHoe": [
        //minecraft: *_leaves sculk_*
        "minecraft:hay_block",
        "minecraft:dried_kelp_block",
        "minecraft:target",
        "minecraft:moss_block",
        "minecraft:nether_wart_block",
        "minecraft:warped_wart_block"
      ],
      "breakByPickaxe": [
        //minecraft: *_ore
        "minecraft:ancient_debris",
        "minecraft:obsidian",
        "minecraft:end_stone",
        "minecraft:stone",
        "minecraft:diamond_block",
        "minecraft:gold_block",
        "minecraft:iron_block",
        "minecraft:netherite_block",
        "minecraft:coal_block",
        "minecraft:copper_block"
      ],
      "breakByCutter": [
        //*_wool
      ],
      "breakByShovel": [
        "minecraft:dirt",
        "minecraft:sand"
      ]
    },
    "knockbackA": {
      "state": true,
      "magnitude": -0.078,
      "VL": 2,
      "punishment": 'default'
    },
    "namespoofA": {
      "state": true,
      "punishment": undefined,
      "VL": undefined
    },
    "namespoofB": {
      "state": true,
      "strings": /[^\x00-\x7F]|[/:\\*?"<>]|^\.$|\.$/gu,
      "punishment": undefined,
      "VL": undefined
    },
    "autotoolA": {
      "state": true,
      "punishment": 'default',
      "VL": 2,
    },
    "autotoolB": {
      "state": true,
      "minBuffer": 3,
      "punishment": 'default',
      "VL": 2,
    },
    "autotoolC": {
      "state": true,
      "punishment": 'default',
      "VL": 2,
    },
    "phaseA": {
      "state": true,
      "VL": 1,
      "passableBlock": [
        "sand",
        "gravel",
        "concrete_powder",
        "soul_sand"
      ],
      "punishment": 'default'
    },
    "spiderA": {
      "state": true,
      "VL": 2,
      "punishment": 'default'
    },
    "jesusA": {
      "state": true,
      "VL": 2,
      "maxTimeLength": 15, //Present in Tick
      "punishment": 'default'
    }
  }
}