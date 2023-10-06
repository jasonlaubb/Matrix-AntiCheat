/* punishment type */
export class punishmentType {
  none?: string;
  tempkick?: string;
  kick?: string;
  ban?: string;
  default?: string;
};

/* module type when flag */
export class ModuleClass {
  name: string;
  punishment: punishmentType;
  minVL: number;
};

export var console: any;