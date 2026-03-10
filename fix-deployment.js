const fs = require('fs');
const path = require('path');

console.log('🔧 Comprehensive path fix for GitHub Pages...');

const htmlFiles = ['index.html', '404.html', '_not-found.html'];

htmlFiles.forEach(filename => {
    const filePath = path.join(__dirname, 'out', filename);
    
    if (!fs.existsSync(filePath)) {
        console.log(`⚠️  ${filename} not found, skipping`);
        return;
    }
    
    let html = fs.readFileSync(filePath, 'utf8');
    const original = html;
    
    // Fix ALL paths that start with /
    // 1. Manifest
    html = html.replace(/href=\s*['"]\/manifest\.json['"]/g, 'href="/rome/manifest.json"');
    html = html.replace(/['"]\/manifest\.json['"]/g, '"/rome/manifest.json"');
    
    // 2. Icons
    html = html.replace(/href=\s*['"]\/icon-(192|512)\.png['"]/g, 'href="/rome/icon-$1.png"');
    html = html.replace(/['"]\/icon-(192|512)\.png['"]/g, '"/rome/icon-$1.png"');
    
    // 3. _next/static paths (comprehensive)
    html = html.replace(/(['"\s])\/(_next\/static\/[^'"\s>]*)/g, '$1/rome/$2');
    
    // 4. Any other /_next/ paths
    html = html.replace(/(['"\s])\/(_next\/[^'"\s>]*)/g, '$1/rome/$2');
    
    // 5. Inline script content
    html = html.replace(/\/(_next\/[^'"\s>]*\.(js|css|woff2|png|jpg|jpeg|gif|svg))/g, '/rome/$1');
    
    // 6. JSON strings in scripts
    html = html.replace(/\"\/(_next\/[^\"]*)\"/g, '\"/rome/$1\"');
    
    if (html !== original) {
        fs.writeFileSync(filePath, html, 'utf8');
        console.log(`✅ Fixed paths in ${filename}`);
    } else {
        console.log(`ℹ️  No changes needed for ${filename}`);
    }
});

console.log('✅ Comprehensive fix complete!');
