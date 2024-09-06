import fs from 'fs';
import path from 'path';
import obfuscator from 'javascript-obfuscator';
import progressBar from 'progress';

const directoryPath = './generated-package/Matrix-anti_BP/scripts';

async function traverseDirectory(directoryPath) {
  const files = await fs.promises.readdir(directoryPath, { withFileTypes: true });

  for (const file of files) {
    const filePath = path.join(directoryPath, file.name);
    if (file.isDirectory()) {
      if (file.path.includes('node_modules') || file.path.includes('Data')) continue;
      await traverseDirectory(filePath);
    } else if (file.isFile() && file.name.endsWith('.js')) {
      bar.tick({ file: file.name });
      bar.render();
      await obfuscateFile(filePath);
    }
  }
}

async function obfuscateFile(filePath) {
  const fileContent = await fs.promises.readFile(filePath, 'utf8');
  const obfuscatedCode = obfuscator.obfuscate(fileContent, {
    compact: true,
    controlFlowFlattening: true,
    deadCodeInjection: true,
    debugProtection: false,
    disableConsoleOutput: false,
    identifierNamesGenerator: 'mangled',
    log: false,
    numbersToExpressions: true,
    simplify: true,
    splitStrings: true,
    stringArray: true,
    stringArrayEncoding: ['base64'],
    stringArrayThreshold: 0.75,
    transformObjectKeys: true,
    unicodeEscapeSequence: false
  });

  await fs.promises.writeFile(filePath, obfuscatedCode.getObfuscatedCode());
}
let bar;
async function onStart () {
  const count = await countLoopIterations(directoryPath);
  bar = new progressBar('Anti-Edit: [:bar] :percent :file', {
    complete: '=',
    incomplete: '.',
    width: 30,
    total: count
  });  
  await traverseDirectory(directoryPath);
  console.log('\nAnti-Edit: Obfuscation process finished.');
}
onStart();

async function countLoopIterations(directoryPath) {
  const files = await fs.promises.readdir(directoryPath, { withFileTypes: true });
  let count = 0;

  for (const file of files) {
    const filePath = path.join(directoryPath, file.name);

    if (file.isDirectory()) {
      if (file.path.includes('node_modules') || file.path.includes('Data')) continue;
      count += await countLoopIterations(filePath);
    } else if (file.isFile() && file.name.endsWith('.js')) {
      count++;
    }
  }

  return count; // +1 for the current directory
}