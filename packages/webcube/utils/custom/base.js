const path = require('path');
const fs = require('fs');
const { ensureFileSync } = require('fs-extra');
const { merge } = require('lodash');
const changeCase = require('change-case');
const cosmiconfig = require('cosmiconfig');
const logger = require('../logger');

const projectPath = process.cwd();

let custom = {};
const pkg = require(path.join(projectPath, `package.json`));
const projectName = pkg.name;
const { config: browserslist } = cosmiconfig('browserslist').searchSync() || {};
const { config: customConfig } = cosmiconfig('webcube').searchSync() || {};
custom = merge(custom, customConfig);

// https://medium.com/webpack/webpack-4-mode-and-optimization-5423a6bc597a
const mode =
  process.env.NODE_ENV === 'production' ? 'production' : 'development';
const isProductionEnv = process.env.NODE_ENV === 'production';
const webcubePath = custom.webcubePath
  ? path.resolve(projectPath, custom.webcubePath)
  : path.join(__dirname, '../../');
const srcRoot = path.join(projectPath, custom.srcRoot || 'src');
const configRoot = path.join(projectPath, custom.configRoot || 'config');
let entryFileName = ['index.js', 'index.ts'];
if (custom.entryFileName) {
  entryFileName = Array.isArray(custom.entryFileName)
    ? custom.entryFileName
    : [custom.entryFileName];
}
let ssrEntryFileName = [
  'Entry.jsx',
  'Entry.js',
  'App.jsx',
  'App.js',
  'Entry.tsx',
  'Entry.ts',
  'App.tsx',
  'App.ts',
];
if (custom.ssrEntryFileName) {
  ssrEntryFileName = Array.isArray(custom.ssrEntryFileName)
    ? custom.ssrEntryFileName
    : [custom.ssrEntryFileName];
}
const entryFileTemplate = custom.entryFileTemplate
  ? path.join(configRoot, custom.entryFileTemplate)
  : path.join(webcubePath, 'boilerplate/entry.js');
const config = {
  mode,
  isProductionEnv,
  projectName,
  projectPath,
  webcubePath,
  srcRoot,
  configRoot,
  entryFileName,
};

// https://github.com/browserslist/browserslist
config.browserslist = (browserslist && browserslist.length && browserslist) ||
  (custom.browserslist &&
    custom.browserslist.length &&
    custom.browserslist) || [
    // http://getbootstrap.com/docs/4.1/getting-started/browsers-devices/#supported-browsers
    // https://reactjs.org/blog/2016/01/12/discontinuing-ie8-support.html
    'last 1 major version',
    '>= 1%',
    'Explorer >= 10',
    'iOS >= 9',
    'Android >= 4.4',
    'not dead',
  ];

const entryNameToId = name => {
  const letters = name.split(/[-_]/);
  if (letters.length === 1) {
    return letters.join('');
  }
  return changeCase.pascalCase(letters.join(' '));
};
const entryFileTemplateContent = fs.readFileSync(entryFileTemplate);
const exportsFileTemplateContent = fs.readFileSync(
  path.join(webcubePath, 'boilerplate/exports.js')
);

config.entries = {};
fs.readdirSync(srcRoot).forEach(name => {
  config.entries[name] = path.join(srcRoot, name);
});
merge(config.entries, custom.entries);

const entries = {};
const ssrEntries = {};
Object.keys(config.entries).forEach(name => {
  const fullPath = config.entries[name];
  let isFullPathOk = false;
  try {
    isFullPathOk = fs.statSync(fullPath).isDirectory();
  } catch (ex) {}
  if (!isFullPathOk) {
    return;
  }
  let entryFilePath;
  ssrEntryFileName.forEach(fileName => {
    const tryPath = path.join(fullPath, fileName);
    try {
      fs.accessSync(tryPath);
      if (!entryFilePath) {
        entryFilePath = tryPath;
      }
    } catch (ex) {}
  });
  if (!entryFilePath) {
    entryFileName.forEach(fileName => {
      const tryPath = path.join(fullPath, fileName);
      try {
        fs.accessSync(tryPath);
        if (!entryFilePath) {
          entryFilePath = tryPath;
        }
      } catch (ex) {}
    });
    if (entryFilePath) {
      entries[name] = entryFilePath;
    }
    return;
  }
  const entryId = entryNameToId(name);
  const internalEntryFileName = path.join(
    projectPath,
    `node_modules/.webcube/boilerplate/${entryId}.js`
  );
  ensureFileSync(internalEntryFileName);
  fs.writeFileSync(
    internalEntryFileName,
    entryFileTemplateContent
      .toString()
      .replace(/WebcubePlaceholderForEntryApp/gi, entryId)
      .replace(
        /WebcubePlaceholderForEntryPath/gi,
        path.relative(path.dirname(internalEntryFileName), entryFilePath)
      )
      .replace(
        /WebcubePlaceholderForBaseUrl/gi,
        JSON.stringify(name === projectName ? '' : `/${name}`)
      )
  );
  entries[name] = internalEntryFileName;
  const internalExportsFileName = path.join(
    projectPath,
    `node_modules/.webcube/boilerplate/exports_${entryId}.js`
  );
  ensureFileSync(internalExportsFileName);
  fs.writeFileSync(
    internalExportsFileName,
    exportsFileTemplateContent
      .toString()
      .replace(/WebcubePlaceholderForEntryApp/gi, entryId)
      .replace(
        /WebcubePlaceholderForEntryPath/gi,
        path.relative(path.dirname(internalEntryFileName), entryFilePath)
      )
  );
  ssrEntries[name] = internalExportsFileName;
});
config.entries = entries;
config.ssrEntries = ssrEntries;

if (!Object.keys(entries).length) {
  logger.fail(
    `Cannot find valid entry in source code directory (\`srcRoot\`). Try to create a './src/entry-name/index.js' or './src/ssr-entry-name/App.jsx' in your project`
  );
}

Object.keys(entries).forEach(entry => {
  if (!/^[a-zA-Z][a-zA-Z0-9-_]*$/.test(entry)) {
    logger.fail(
      `Invalid entry name "${entry}". It must be a dash separated string, underscore separated string, camel case string or pascal case string, the first character must be an ASCII letter`
    );
  }
});

module.exports = { config, custom, entryNameToId };
