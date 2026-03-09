const fs = require('fs');
const path = require('path');

console.log('🔧 Fixing ALL asset paths for GitHub Pages...');

const htmlFiles = ['index.html', '404.html', '_not-found.html'];

htmlFiles.forEach(filename => {
    const filePath = path.join(__dirname, 'out', filename);
    
    if (!fs.existsSync(filePath)) {
        console.log(`⚠️  ${filename} not found, skipping`);
        return;
    }
    
    let html = fs.readFileSync(filePath, 'utf8');
    
    // Fix ALL asset paths that start with /_next/
    html = html.replace(/"\/(_next\/[^"]*)"/g, '"/rome/$1"');
    
    // Fix manifest.json path
    html = html.replace(/"\/manifest\.json"/g, '"/rome/manifest.json"');
    
    // Fix icon paths
    html = html.replace(/"\/icon-(192|512)\.png"/g, '"/rome/icon-$1.png"');
    
    // Also fix any other /static/ paths
    html = html.replace(/"\/static\/([^"]*)"/g, '"/rome/static/$1"');
    
    // Write back
    fs.writeFileSync(filePath, html);
    console.log(`✅ Fixed ALL paths in ${filename}`);
});

console.log('🎉 All HTML files updated with correct /rome/ base path');
