export function toCamelCase (...str: string[]) {
    return str.map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join("");
}