const fs = require('fs');
const path = require('path');
const outDir = path.join(__dirname, 'out');

// 1. Create .nojekyll file (CRITICAL for GitHub Pages)
fs.writeFileSync(path.join(outDir, '.nojekyll'), '');
console.log('Created .nojekyll file');

// 2. Fix manifest.json paths
const manifestPath = path.join(outDir, 'manifest.json');
if (fs.existsSync(manifestPath)) {
    let manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    
    // Update start_url
    if (manifest.start_url === '/') {
        manifest.start_url = '/rome/';
    }
    
    // Update icon paths
    if (manifest.icons && Array.isArray(manifest.icons)) {
        manifest.icons = manifest.icons.map(icon => ({
            ...icon,
            src: icon.src.replace(/^\//, '/rome/')
        }));
    }
    
    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
    console.log('Updated manifest.json with /rome/ prefix');
}

// 3. Fix HTML files
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

// Also update 404.html if it exists
const fourOhFourPath = path.join(outDir, '404.html');
if (fs.existsSync(fourOhFourPath)) {
    let fourOhFourHtml = fs.readFileSync(fourOhFourPath, 'utf8');
    fourOhFourHtml = fourOhFourHtml.replace(/href="\/manifest\.json"/g, 'href="/rome/manifest.json"');
    fourOhFourHtml = fourOhFourHtml.replace(/href="\/icon-(\d+)\.png"/g, 'href="/rome/icon-$1.png"');
    fourOhFourHtml = fourOhFourHtml.replace(/src="\/logo\.svg"/g, 'src="/rome/logo.svg"');
    fs.writeFileSync(fourOhFourPath, fourOhFourHtml);
    console.log('Updated paths in 404.html');
}

console.log('fix-deployment.js completed successfully');
