import { punishmentType } from "./class.js";

export default {
  settings: {
    defaultPunishment: 'kick'
  },
  notify: {
    flagMsg: true
  },
  moduleTypes: {
    flyChecks: true,
    scaffold: true,
  },
  modules: {
    flyA: {
      class: {
        name: 'Fly/A',
        state: true,
        minVL: 2,
        punishment: 'default' as punishmentType
      }
    },
    flyB: {
      class: {
        name: 'Fly/B',
        state: true,
        minVL: 2,
        punishment: 'default' as punishmentType
      }
    },
    scaffoldA: {
      class: {
        name: 'Scaffold/A',
        state: true,
        minVL: 3,
        punishment: 'default' as punishmentType
      }
    },
    scaffoldB: {
      class: {
        name: 'Scaffold/B',
        state: true,
        minVL: 3,
        punishment: 'default' as punishmentType
      }
    },
    scaffoldC: {
      class: {
        name: 'Scaffold/B',
        state: true,
        minVL: 3,
        punishment: 'default' as punishmentType
      }
    }
  }
}