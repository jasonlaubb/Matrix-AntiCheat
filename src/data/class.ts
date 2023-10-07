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
  punishment: string | punishmentType
  minVL: number;
};

export class Console {
  static log (value: string) {
    //@ts-expect-error
    console.log(value);
  };

  static warn (value: string) {
    //@ts-expect-error
    console.warn(value);
  };
}