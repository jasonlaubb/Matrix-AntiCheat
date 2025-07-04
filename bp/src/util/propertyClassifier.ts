import property from "../data/property";
const stringValue: string[] = [];
const numberValue: string[] = [];
const booleanValue: string[] = [];
export function classifyProperty() {
    Object.entries(property).forEach(([key, { type }]) => {
        switch (type) {
            case "string": {
                stringValue.push(key);
                break;
            }
            case "number": {
                numberValue.push(key);
                break;
            }
            case "boolean": {
                booleanValue.push(key);
                break;
            }
        }
    });
}
export function getPropertyType() {
    return { stringValue, numberValue, booleanValue };
}
