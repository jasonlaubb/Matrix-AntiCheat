export default {
    settings: {
        defaultPunishment: 'kick'
    },
    notify: {
        flagMsg: true
    },
    encryption: {
        password: 'Password123', //set it to undefined when no need
        TwoFA: true //Need to enter password before setop or setdeop
    },
    commands: {
        setting: {
            prefix: '-' //Prefix Length may not higher than 1
        },
        class: {
            OWO: {
                needTag: null,
                needOp: false,
                needAdmin: false,
                description: 'The test command for debug?',
                usage: ['OWO'],
            },
            OWO2: {
                needTag: null,
                needAdmin: true,
                needOp: false,
                description: 'The test command for debug? 2.0',
                usage: ['OWO2']
            },
            op: {
                needTag: null,
                needAdmin: false,
                needOp: true,
                description: 'Let yourself be an Admin',
                usage: ['op [password]']
            },
            setop: {
                needTag: null,
                needAdmin: true,
                needOp: false,
                description: 'Let someone be an Admin',
                usage: ['setop @<player> [password]']
            },
            deop: {
                needTag: null,
                needAdmin: true,
                needOp: false,
                description: 'Remove yourself from Admin',
                usage: ['deop']
            },
            setdeop: {
                needTag: null,
                needAdmin: true,
                needOp: false,
                description: 'Remove someone from Admin',
                usage: ['setdeop @<player> [password]']
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
        /* Gobal Ban */
        gobalBan: {
            class: {
                state: true
            },
            setting: {
                scythe: true,
                paradox: true,
                mbs: true
            }
        },
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
            },
            setting: {
                maxPlaceAngle: 95,
                distance: 2
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
        /*antiVoidA: {
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
        },*/
        /* misc */
        nukerA: {
            class: {
                name: 'Nuker/A',
                state: true,
                minVL: 1,
                punishment: 'default'
            },
            setting: {
                maxBreakInTick: 6,
                validTime: 50,
            }
        }
    }
};
