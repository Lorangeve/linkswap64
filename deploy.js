#!/usr/bin/env node

import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync, statSync } from 'fs';
import { execSync } from 'child_process';
import { join } from 'path';

console.log('🚀 Starting GitHub Pages deployment (SSG mode)...');

// 1. Build the project
console.log('📦 Building project with SSG...');
execSync('bun run build', { stdio: 'inherit' });

// 2. Clean docs folder
console.log('🧹 Cleaning docs folder...');
if (existsSync('docs')) {
  execSync('rm -rf docs');
}
mkdirSync('docs', { recursive: true });

// 3. Copy files from .output directory
console.log('📁 Copying files to docs folder...');
execSync('cp -r .output/public/* docs/');

// 4. Fix paths in all HTML files for GitHub Pages
console.log('🔧 Fixing paths for GitHub Pages...');

function fixPathsInFile(filePath) {
  let content = readFileSync(filePath, 'utf-8');
  
  // Replace absolute paths with relative paths
  content = content.replace(/href="\//g, 'href="./');
  content = content.replace(/src="\//g, 'src="./');
  content = content.replace(/href="\/_build\//g, 'href="./_build/');
  content = content.replace(/src="\/_build\//g, 'src="./_build/');
  
  // Fix manifest paths
  content = content.replace(/output":"\//g, 'output":"./');
  content = content.replace(/href":"\//g, 'href":"./');
  content = content.replace(/key":"\//g, 'key":"./');
  
  writeFileSync(filePath, content);
}

// Fix paths in all HTML files
function processDirectory(dir) {
  const files = readdirSync(dir);
  
  for (const file of files) {
    const filePath = join(dir, file);
    const stats = statSync(filePath);
    
    if (stats.isDirectory()) {
      processDirectory(filePath);
    } else if (file.endsWith('.html')) {
      fixPathsInFile(filePath);
    }
  }
}

processDirectory('docs');

// 5. Create a .nojekyll file to bypass Jekyll processing
console.log('📝 Creating .nojekyll file...');
writeFileSync('docs/.nojekyll', '');

// 6. Create 404.html for GitHub Pages
console.log('🔧 Creating 404.html for GitHub Pages...');
if (existsSync('docs/404.html')) {
  console.log('✅ 404.html already exists');
} else if (existsSync('docs/index.html')) {
  // Copy index.html as 404.html for SPA fallback
  const indexContent = readFileSync('docs/index.html', 'utf-8');
  writeFileSync('docs/404.html', indexContent);
  console.log('✅ Created 404.html from index.html');
}

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