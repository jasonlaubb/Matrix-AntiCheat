export default {
  "system": {
    "notify": true,
    "default": 'tempkick'
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
      "punishment": 'default'
    },
    "cbeA": {
      "state": true,
      "tempkickNearest": true
    },
    "cbeB": {
      "state": false,
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
      "maxBlockBreakPerSecond": 5,
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
      "punishment": 'default'
    },
    "crasherB": {
      "state": true,
      "punishment": 'default'
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
        "punishment": 'default'
      },
      "illegalItemC": {
        "state": false,
        "punishment": 'default',
        "whiteList": ['here to add your white list']
      },
      "illegalItemD": {
        "state": false,
        "punishment": 'default',
        "maxLoreLength": 0
      },
      "illegalItemE": {
        "state": false,
        "punishment": 'default',
        "removetag": false
      },
      "illegalItemF": {
        "state": false,
        "punishment": 'default',
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
        "maxNameLength": 31
      },
      "illegalItemH": {
        "state": false,
        "punishment": 'default',
        "allowCanPlace": false,
        "allowCanBreak": false,
        "blockType": 0,
        "cleartag": false
      },
      "illegalItemI": {
        "state": false,
        "punishment": 'default'
      },
      "illegalItemJ": {
        "state": false,
        "punishment": 'default'
      },
      "BadEnchantA": {
        "state": false,
        "clearitem": false,
        "punishment": 'default'
      },
      "BadEnchantB": {
        "state": false,
        "punishment": 'default',
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
    "towerA": {
      "state": true,
      "punishment": 'default',
      "VL": 2,
      "maxLocationDeff": 0.8
    },
    "flyA": {
      "state": false,
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
      "punishment": 'default'
    },
    "placementC": {
      "state": false,
      "punishment": 'default'
    },
    "placementD": {
      "state": false,
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
    "knockbackA": {
      "state": true,
      "magnitude": -0.078,
      "VL": 2,
      "punishment": 'default'
    },
    "namespoofA": {
      "state": true
    },
    "namespoofB": {
      "state": true,
      "strings": /[^\x00-\x7F]|[/:\\*?"<>]|^\.$|\.$/gu
    },
    "autotoolA": {
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