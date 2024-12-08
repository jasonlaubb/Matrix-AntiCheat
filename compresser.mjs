import fs from 'fs';
import path from 'path';
import obfuscator from 'javascript-obfuscator';
import progressBar from 'progress';
/**
 * @author jasonlaubb
 * @contributors https://github.com/jasonlaubb/Matrix-AntiCheat?tab=readme-ov-file#developers
 * @license AGPLv3
 * @link https://github.com/jasonlaubb/Matrix-AntiCheat
 */
const directoryPath = './Matrix_BP/scripts';
const whiteList = ['',]
async function traverseDirectory(directoryPath) {
    const files = await fs.promises.readdir(directoryPath, {
        withFileTypes: true
    });
    for (const file of files) {
        const filePath = path.join(directoryPath, file.name);
        if (file.isDirectory()) {
            if (file.name.includes('node_modules') || file.name.includes('data')) continue;
            await traverseDirectory(filePath);
        } else if (file.isFile() && file.name.endsWith('.js') && !whiteList.includes(file.name)) {
            bar.tick({
                file: file.name
            });
            bar.render();
            await obfuscateFile(filePath);
        }
    }
}
async function obfuscateFile(filePath) {
    const fileContent = await fs.promises.readFile(filePath, 'utf8');
    // Only do dead code injection to prevent slow running
    const obfuscatedCode = obfuscator.obfuscate(fileContent, {
        compact: true,
        stringArray: false,
        deadCodeInjection: false,
        renameProperties: false,
        renameGlobals: true,
        stringArrayIndexShift: false,
        selfDefending: true,
        identifierNamesGenerator: 'hexadecimal',
        numbersToExpressions: false,
    });
    await fs.promises.writeFile(filePath, obfuscatedCode.getObfuscatedCode());
}
let bar;
async function onStart() {
    const count = await countLoopIterations(directoryPath);
    bar = new progressBar('Compresser: [:bar] :percent :file', {
        complete: '=',
        incomplete: '.',
        width: 30,
        total: count
    });
    await traverseDirectory(directoryPath);
    console.log('\nCompresser: Obfuscation process finished.');
}
onStart();
async function countLoopIterations(directoryPath) {
    const files = await fs.promises.readdir(directoryPath, {
        withFileTypes: true
    });
    let count = 0;
    for (const file of files) {
        const filePath = path.join(directoryPath, file.name);
        if (file.isDirectory()) {
            if (file.name.includes('node_modules')) continue;
            count += await countLoopIterations(filePath);
        } else if (file.isFile() && file.name.endsWith('.js') && !whiteList.includes(file.name)) {
            count++;
        }
    }
    return count; // +1 for the current directory
}