export type Root = {
  configVersion: number
  language: string
  flagMode: string
  lockdowncode: string
  passwordCold: number
  slient: boolean
  commands: {
    password: string
    prefix: string
    example: {
      enabled: boolean
      adminOnly: boolean
      requireTag: Array<string>
    }
    help: {
      enabled: boolean
      adminOnly: boolean
      requireTag: Array<any>
    }
    toggles: {
      enabled: boolean
      adminOnly: boolean
      requireTag: Array<any>
    }
    toggle: {
      enabled: boolean
      adminOnly: boolean
      requireTag: Array<any>
    }
    op: {
      enabled: boolean
      adminOnly: boolean
      requireTag: Array<any>
    }
    deop: {
      enabled: boolean
      adminOnly: boolean
      requireTag: Array<any>
    }
    passwords: {
      enabled: boolean
      adminOnly: boolean
      requireTag: Array<any>
    }
    flagmode: {
      enabled: boolean
      adminOnly: boolean
      requireTag: Array<any>
    }
    rank: {
      enabled: boolean
      adminOnly: boolean
      requireTag: Array<any>
    }
    rankclear: {
      enabled: boolean
      adminOnly: boolean
      requireTag: Array<any>
    }
    defaultrank: {
      enabled: boolean
      adminOnly: boolean
      requireTag: Array<any>
    }
    showallrank: {
      enabled: boolean
      adminOnly: boolean
      requireTag: Array<any>
    }
    ban: {
      enabled: boolean
      adminOnly: boolean
      requireTag: Array<any>
    }
    unban: {
      enabled: boolean
      adminOnly: boolean
      requireTag: Array<any>
    }
    unbanremove: {
      enabled: boolean
      adminOnly: boolean
      requireTag: Array<any>
    }
    unbanlist: {
      enabled: boolean
      adminOnly: boolean
      requireTag: Array<any>
    }
    freeze: {
      enabled: boolean
      adminOnly: boolean
      requireTag: Array<any>
    }
    unfreeze: {
      enabled: boolean
      adminOnly: boolean
      requireTag: Array<any>
    }
    mute: {
      enabled: boolean
      adminOnly: boolean
      requireTag: Array<any>
    }
    unmute: {
      enabled: boolean
      adminOnly: boolean
      requireTag: Array<any>
    }
    vanish: {
      enabled: boolean
      adminOnly: boolean
      requireTag: Array<any>
    }
    unvanish: {
      enabled: boolean
      adminOnly: boolean
      requireTag: Array<any>
    }
    invcopy: {
      enabled: boolean
      adminOnly: boolean
      requireTag: Array<any>
    }
    invsee: {
      enabled: boolean
      adminOnly: boolean
      requireTag: Array<any>
    }
    echestwipe: {
      enabled: boolean
      adminOnly: boolean
      requireTag: Array<any>
    }
    lockdowncode: {
      enabled: boolean
      adminOnly: boolean
      requireTag: Array<any>
    }
    lockdown: {
      enabled: boolean
      adminOnly: boolean
      requireTag: Array<any>
    }
    unlock: {
      enabled: boolean
      adminOnly: boolean
      requireTag: Array<any>
    }
    adminchat: {
      enabled: boolean
      adminOnly: boolean
      requireTag: Array<any>
    }
    lang: {
      enabled: boolean
      adminOnly: boolean
      requireTag: Array<any>
    }
    langlist: {
      enabled: boolean
      adminOnly: boolean
      requireTag: Array<any>
    }
  }
  punishment_kick: {
    reason: string
  }
  punishment_ban: {
    minutes: number
    reason: string
  }
  example_anticheat_module: {
    enabled: boolean
    punishment: string
  }
  chatRank: {
    enabled: boolean
    defaultRank: string
    showAllRank: boolean
  }
  dimensionLock: {
    enabled: boolean
  }
  antiAutoClicker: {
    enabled: boolean
    maxClicksPerSecond: number
    timeout: number
    punishment: string
    maxVL: number
  }
  antiKillAura: {
    enabled: boolean
    minAngle: number
    timeout: number
    maxEntityHit: number
    punishment: string
    maxVL: number
  }
  antiReach: {
    enabled: boolean
    maxReach: number
    maxYReach: number
    punishment: string
    maxVL: number
  }
  antiFly: {
    enabled: boolean
    punishment: string
    maxVL: number
  }
  antiMotion: {
    enabled: boolean
    minRelativeY: number
    fallingDuration: number
    punishment: string
    maxVL: number
  }
  antiPhase: {
    enabled: boolean
    punishment: string
    maxVL: number
  }
  antiSpeed: {
    enabled: boolean
    mphThreshold: number
    punishment: string
    maxVL: number
  }
  antiNuker: {
    enabled: boolean
    maxBreakPerTick: number
    timeout: number
    punishment: string
    maxVL: number
  }
  antiScaffold: {
    enabled: boolean
    timeout: number
    maxAngle: number
    factor: number
    minRotation: number
    maxBPS: number
    punishment: string
    maxVL: number
  }
  antiNoSlow: {
    enabled: boolean
    maxSpeedTherehold: number
    maxUsingItemTherehold: number
    itemUseTime: number
    maxNoSlowBuff: number
    timeout: number
    punishment: string
    maxVL: number
  }
  antiBreaker: {
    enabled: boolean
    timeout: number
    writeList: Array<string>
    punishment: string
    maxVL: number
  }
  antiSpam: {
    enabled: boolean
    maxMessagesPerSecond: number
    timer: number
    maxCharacterLimit: number
    kickThreshold: number
    timeout: number
  }
  antiSpammer: {
    enabled: boolean
    punishment: string
    maxVL: number
  }
  antiBlockReach: {
    enabled: boolean
    maxPlaceDistance: number
    maxBreakDistance: number
    timeout: number
    punishment: string
    maxVL: number
  }
  antiAim: {
    enabled: boolean
    maxRotSpeed: number
    timeout: number
    punishment: string
    maxVL: number
  }
  antiTower: {
    enabled: boolean
    minDelay: number
    timeout: number
    punishment: string
    maxVL: number
  }
  antiGameMode: {
    enabled: boolean
    bannedGameMode: Array<number>
    returnDefault: boolean
    returnGameMode: number
    punishment: string
    maxVL: number
  }
  antiNameSpoof: {
    enabled: boolean
    punishment: string
  }
  antiIllegalItem: {
    enabled: boolean
    illegalItem: Array<string>
    state: {
      typeCheck: {
        enabled: boolean
        punishment: string
      }
      nameLength: {
        enabled: boolean
        punishment: string
        maxItemNameLength: number
      }
      itemTag: {
        enabled: boolean
        punishment: string
        maxAllowedTag: number
      }
      loreCheck: {
        enabled: boolean
        punishment: string
      }
      itemAmount: {
        enabled: boolean
        punishment: string
      }
      enchantLevel: {
        enabled: boolean
        punishment: string
        whiteList: Array<any>
      }
      enchantConflict: {
        enabled: boolean
        punishment: string
        whitList: Array<any>
      }
      enchantAble: {
        enabled: boolean
        punishment: string
        whiteList: Array<any>
      }
      enchantRepeat: {
        enabled: boolean
        punishment: string
      }
    }
    checkCreativeMode: boolean
    timeout: number
  }
  antiSurrond: {
    enabled: boolean
    maxBlocksPer2Tick: number
    timeout: number
    punishment: string
    maxVL: number
  }
  antiMovement: {
    enabled: boolean
    maxDifferent: number
    maxHorizontalVelocity: number
    maxVL: number
    punishment: string
  }
  antiTimer: {
    enabled: boolean
    punishment: string
    absError: number
    maxVL: number
  }
  antiBlink: {
    enabled: boolean
    punishment: string
    maxVL: number
  }
  antiFastUse: {
    enabled: boolean
    minUseTime: number
    timeout: number
    punishment: string
    maxVL: number
  }
  antiAuto: {
    enabled: boolean
    punishment: string
    maxVL: number
  }
  antiOperator: {
    enabled: boolean
    punishment: string
  }
  antiCommandBlockExplolit: {
    enabled: boolean
    punishment: string
    maxVL: number
  }
  chatFilter: Array<string>
  blacklistedMessages: Array<string>
}
