const fs = require('fs');
const path = require('path');
const outDir = path.join(__dirname, 'out');

// 1. Create .nojekyll file (CRITICAL for GitHub Pages)
fs.writeFileSync(path.join(outDir, '.nojekyll'), '');
console.log('Created .nojekyll file');

// 2. Fix manifest path: '/manifest.json' → '/rome/manifest.json'
// 3. Fix icon paths: '/icon-*.png' → '/rome/icon-*.png'
// 4. Fix logo path: '/logo.svg' → '/rome/logo.svg'

// Read index.html
const indexPath = path.join(outDir, 'index.html');
if (!fs.existsSync(indexPath)) {
    console.error('index.html not found in out directory');
    process.exit(1);
}

let html = fs.readFileSync(indexPath, 'utf8');

// Replace manifest.json path
html = html.replace(/href="\/manifest\.json"/g, 'href="/rome/manifest.json"');

// Replace icon paths
html = html.replace(/href="\/icon-(\d+)\.png"/g, 'href="/rome/icon-$1.png"');

// Replace logo.svg path
html = html.replace(/src="\/logo\.svg"/g, 'src="/rome/logo.svg"');

// Write updated HTML
fs.writeFileSync(indexPath, html);
console.log('Updated paths in index.html');

// Also update _not-found.html if it exists
const notFoundPath = path.join(outDir, '_not-found.html');
if (fs.existsSync(notFoundPath)) {
    let notFoundHtml = fs.readFileSync(notFoundPath, 'utf8');
    notFoundHtml = notFoundHtml.replace(/href="\/manifest\.json"/g, 'href="/rome/manifest.json"');
    notFoundHtml = notFoundHtml.replace(/href="\/icon-(\d+)\.png"/g, 'href="/rome/icon-$1.png"');
    notFoundHtml = notFoundHtml.replace(/src="\/logo\.svg"/g, 'src="/rome/logo.svg"');
    fs.writeFileSync(notFoundPath, notFoundHtml);
    console.log('Updated paths in _not-found.html');
}

console.log('fix-deployment.js completed successfully');
