const fs = require('fs');
const path = require('path');

console.log('🔧 Fixing HTML paths for GitHub Pages...');

const htmlFiles = ['index.html', '404.html', '_not-found.html'];

htmlFiles.forEach(filename => {
    const filePath = path.join(__dirname, 'out', filename);
    
    if (!fs.existsSync(filePath)) {
        console.log(`⚠️  ${filename} not found, skipping`);
        return;
    }
    
    let html = fs.readFileSync(filePath, 'utf8');
    
    // Fix manifest.json path
    html = html.replace(/href="\/manifest\.json"/g, 'href="/rome/manifest.json"');
    
    // Fix icon paths
    html = html.replace(/href="\/icon-(192|512)\.png"/g, 'href="/rome/icon-$1.png"');
    
    // Also fix apple-touch-icon
    html = html.replace(/href="\/icon-192\.png"/g, 'href="/rome/icon-192.png"');
    
    // Write back
    fs.writeFileSync(filePath, html);
    console.log(`✅ Fixed paths in ${filename}`);
});

console.log('🎉 All HTML files updated with correct /rome/ base path');
