export function getAbsoluteGcd (current: number, last: number) {
    const EXPANDER = 1.6777216E7; // Adjusted to the provided value

    let currentExpanded = Math.floor(current * EXPANDER);
    let lastExpanded = Math.floor(last * EXPANDER);

    return gcd(currentExpanded, lastExpanded);
}

export function gcd (a: number, b: number) {
    if (a < b) {
        return gcd(b, a);
    }
    if (Math.abs(b) < 0.001) {
        return a;
    } else {
        return gcd(b, a - Math.floor(a / b) * b);
    }
}
export const EXPANDER = Math.pow(2, 24);

export function arrayToList(arr: Array<any>) {
    const list = []
    
    for (const item of arr) {
      	list.push(item);
    }
    
    return list;
}

export function getAverageDifference(arr: number[]) {
    let sum = 0;
    for (let i = 1; i < arr.length; i++) {
        sum += arr[i] - arr[i - 1];
    }
    return sum / (arr.length - 1);
}