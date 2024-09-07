import fs from 'fs';
import path from 'path';
import obfuscator from 'javascript-obfuscator';
import progressBar from 'progress';

const directoryPath = './generated-package/Matrix-anti_BP/scripts';
const whiteList = [
  'Default.js',
  'Config.js',
  'ChatFilterData.js',
  'RegexBasedFilter.js',
  'FastBrokenBlocks.js',
  'EducationItemList.js',
  'EnumData.js',
  'FastBrokenBlocks.js',
  'OperatorItemList.js',
  'ValidPlayerProperty.js',
]
async function traverseDirectory(directoryPath) {
  const files = await fs.promises.readdir(directoryPath, { withFileTypes: true });

  for (const file of files) {
    const filePath = path.join(directoryPath, file.name);
    if (file.isDirectory()) {
      if (file.name.includes('node_modules')) continue;
      await traverseDirectory(filePath);
    } else if (file.isFile() && file.name.endsWith('.js') && !whiteList.includes(file.name)) {
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
    simplify: true,
    stringArray: true,
    stringArrayThreshold: 0.75,
    target: 'node',
    renameGlobals: true,
    renameProperties: true,
    deadCodeInjection: true,
    deadCodeInjectionThreshold: 0.7,
    renamePropertiesMode: 'safe',
    stringArrayIndexesType: ['hexadecimal-number'],
    stringArrayWrappersCount: 5,
    selfDefending: true,
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
      if (file.name.includes('node_modules')) continue;
      count += await countLoopIterations(filePath);
    } else if (file.isFile() && file.name.endsWith('.js') && !whiteList.includes(file.name)) {
      count++;
    }
  }

  return count; // +1 for the current directory
}