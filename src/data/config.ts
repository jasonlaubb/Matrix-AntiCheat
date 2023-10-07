export default {
  settings: {
    defaultPunishment: 'kick'
  },
  notify: {
    flagMsg: true
  },
  commands: {
    setting: {
      prefix: '-' //Prefix Length may not higher than 1
    },
    class: {
      OWO: {
        needTag: null,
        needAdmin: false,
        description: 'The test command for debug?'
      },
      OWO2: {
        needTag: null,
        needAdmin: false,
        description: 'The test command for debug?'
      }
    }
  },
  /* Detect Modules */
  moduleTypes: {
    flyChecks: true,
    scaffold: true,
    killaura: true,
    movement: true,
  },
  modules: {
    /* fly */
    flyA: {
      class: {
        name: 'Fly/A',
        state: true,
        minVL: 2,
        punishment: 'default'
      }
    },
    flyB: {
      class: {
        name: 'Fly/B',
        state: true,
        minVL: 2,
        punishment: 'default'
      }
    },
    /* scaffold */
    scaffoldA: {
      class: {
        name: 'Scaffold/A',
        state: true,
        minVL: 3,
        punishment: 'default'
      }
    },
    scaffoldB: {
      class: {
        name: 'Scaffold/B',
        state: true,
        minVL: 3,
        punishment: 'default'
      }
    },
    scaffoldC: {
      class: {
        name: 'Scaffold/B',
        state: true,
        minVL: 3,
        punishment: 'default'
      }
    },
    scaffoldD: {
      class: {
        name: 'Scaffold/C',
        state: true,
        minVL: 3,
        punishment: 'default'
      }
    },
    /* killaura */
    killauraA: {
      class: {
        name: 'KillAura/A',
        state: true,
        minVL: 3,
        punishment: 'default'
      },
      setting: {
        maxAttackAngle: 95,
      }
    },
    killauraB: {
      class: {
        name: 'KillAura/B',
        state: true,
        minVL: 3,
        punishment: 'default'
      },
      setting: {
        maxAttackInTick: 2,
        validTime: 50
      }
    },
    /* movement */
    fallDamageA: {
      class: {
        name: 'FallDamage/A',
        state: true,
        minVL: 3,
        punishment: 'default'
      }
    },
    nofallA: {
      class: {
        name: 'NoFall/A',
        state: true,
        minVL: 3,
        punishment: 'default'
      }
    },
    antiVoidA: {
      class: {
        name: 'AntiVoid/A',
        state: true,
        minVL: 3,
        punishment: 'default'
      },
      setting: {
        maxYdiff: 5,
        minYdiff: 0.8,
        maxDistance: 3.5
      }
    }
  }
}