#!/usr/bin/env node

const path = require('path');

const args = process.argv.slice(2);

if (args.length === 0) {
    console.error('Please provide the path to your translations folder');
    console.error('Usage: npx i18next-ai-translator ./myLocalesFolder');
    process.exit(1);
}

const localesFolder = args[0];
const absolutePath = path.resolve(localesFolder);

console.log('i18next AI Translator');
console.log('========================');
console.log(`Analyzing folder: ${absolutePath}`);