import { world } from "@minecraft/server";
import property from "../data/property";
import { detectionList } from "../command/detection";
export function setUpProperty() {
    const propertyIds = world.getDynamicPropertyIds().filter((id) => id.startsWith("database:"));
    const keys = Object.keys(property);
    propertyIds.forEach((v) => {
        if (!keys.includes(v.slice(9))) return world.setDynamicProperty(v);
    });
}
export function get(id: keyof typeof property): any {
    return world.getDynamicProperty("database:" + id) ?? property[id].value;
}
const detectionRelated = new Set(Object.values(detectionList).map(({ property }) => property).concat(["worldBorder", "oreAlert", "endLock", "netherLock", "antiGma", "antiGmc", "antiGms", "antiGmsp"]));
export function isReadonly (valueId: string) {
    return detectionRelated.has(valueId);
}