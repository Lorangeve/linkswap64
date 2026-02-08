#!/usr/bin/env node

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { execSync } from 'child_process';

console.log('🚀 Starting GitHub Pages deployment...');

// 1. Build the project
console.log('📦 Building project...');
execSync('bun run build', { stdio: 'inherit' });

// 2. Clean docs folder
console.log('🧹 Cleaning docs folder...');
if (existsSync('docs')) {
  execSync('rm -rf docs');
}
mkdirSync('docs', { recursive: true });

// 3. Copy files
console.log('📁 Copying files to docs folder...');
execSync('cp -r .output/public/* docs/');

// 4. Fix paths in index.html for GitHub Pages
console.log('🔧 Fixing paths for GitHub Pages...');
const indexPath = 'docs/index.html';
let html = readFileSync(indexPath, 'utf-8');

// Replace absolute paths with relative paths
html = html.replace(/href="\//g, 'href="./');
html = html.replace(/src="\//g, 'src="./');
html = html.replace(/href="\/_build\//g, 'href="./_build/');
html = html.replace(/src="\/_build\//g, 'src="./_build/');

// Fix manifest paths
html = html.replace(/output":"\//g, 'output":"./');
html = html.replace(/href":"\//g, 'href":"./');
html = html.replace(/key":"\//g, 'key":"./');

writeFileSync(indexPath, html);

// 5. Create a .nojekyll file to bypass Jekyll processing
console.log('📝 Creating .nojekyll file...');
writeFileSync('docs/.nojekyll', '');

// 6. Create CNAME file if needed (for custom domain)
// Uncomment and modify if using custom domain
// writeFileSync('docs/CNAME', 'yourdomain.com');

console.log('✅ Deployment files ready in docs folder!');
console.log('📁 Files in docs/:');
execSync('ls -la docs/', { stdio: 'inherit' });

console.log('\n📋 Next steps:');
console.log('1. git add docs/');
console.log('2. git commit -m "Deploy to GitHub Pages"');
console.log('3. git push');
console.log('4. Go to GitHub repo Settings > Pages');
console.log('   - Source: Deploy from a branch');
console.log('   - Branch: main, Folder: /docs');
console.log('\n🌐 Your site will be at: https://lorangeve.github.io/linkswap64/');