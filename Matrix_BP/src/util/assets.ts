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
    return arr.slice(1).reduce((sum, current, index) => sum + (current - arr[index]), 0) / (arr.length - 1);
}
  
export function fastAverage(arr: number[]) {
    return arr.reduce((sum, current) => sum + current, 0) / arr.length;
}
import { fastSqrt } from "./fastmath";
export function getStandardDeviation (numbers: number[]) {
    const n = numbers.length;
    if (n === 0) return 0;

    let sum = 0;
    let sumSqr = 0;
    
    for (const num of numbers) {
        sum += num;
        sumSqr += num * num;
    }

    const mean = sum / n;
    const variance = (sumSqr - sum * mean) / (n - 1);
    
    return fastSqrt(variance);
}