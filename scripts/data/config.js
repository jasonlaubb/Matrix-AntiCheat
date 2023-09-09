export default {
  "system": {
    "notify": true
  },
  "modules": {
    "autoclickerA": {
      "state": true,
      "cpsLimit": 30,
      "VL": 3,
      "punishment": 'default'
    },
    "autoclickerB": {
      "state": true,
      "cpsLimit": 26,
      "VL": 3,
      "punishment": 'default'
    },
    "nukerA": {
      "state": true,
      "maxBreakInTick": 4,
      "punishment": 'default'
    },
    "speedA": {
      "state": true,
      "maxSpeed": 0.55,
      "punishment": 'default',
      "MaxWarnTime": 3,
      "VL": 2,
    },
    "speedB": {
      "state": true,
      "maxPosDeff": 8,
      "MaxWarnTime": 3,
      "VL": 2,
      "punishment": 'default'
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
      "MaxWarnTime": 5,
      "VL": 1,
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
      "state": true,
      "maxdistance": 4.1,
      "VL": 1,
      "punishment": 'default'
    },
    "reachC": {
      "state": true,
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
    }
  }
}