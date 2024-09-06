import fs from 'fs';
import path from 'path';
import obfuscator from 'javascript-obfuscator';

const directoryPath = './generated-package/Matrix-anti_BP/scripts';

async function traverseDirectory(directoryPath) {
  const files = await fs.promises.readdir(directoryPath, { withFileTypes: true });

  for (const file of files) {
    const filePath = path.join(directoryPath, file.name);

    if (file.isDirectory()) {
      await traverseDirectory(filePath);
    } else if (file.isFile() && file.name.endsWith('.js') && file.name !== 'Default.js' && file.name !== 'Config.js') {
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

traverseDirectory(directoryPath);