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
    
    // Fix 1: All /_next/ paths
    html = html.replace(/"\/(_next\/[^"]*)"/g, '"/rome/$1"');
    
    // Fix 2: All /static/ paths (some might be referenced differently)
    html = html.replace(/"\/static\/([^"]*)"/g, '"/rome/static/$1"');
    
    // Fix 3: Manifest path
    html = html.replace(/"\/manifest\.json"/g, '"/rome/manifest.json"');
    html = html.replace(/href="\/manifest\.json"/g, 'href="/rome/manifest.json"');
    
    // Fix 4: Icon paths
    html = html.replace(/"\/icon-(192|512)\.png"/g, '"/rome/icon-$1.png"');
    html = html.replace(/href="\/icon-(192|512)\.png"/g, 'href="/rome/icon-$1.png"');
    
    // Fix 5: Any other asset references without quotes
    html = html.replace(/\/(_next\/[^\s"'<>]*\.(js|css|woff2|png|jpg|jpeg|gif|svg))/g, '/rome/$1');
    
    // Fix 6: Inline script paths
    html = html.replace(/src="\/([^"]*\.js)"/g, (match, p1) => {
        if (p1.startsWith('_next/')) {
            return `src="/rome/${p1}"`;
        }
        return match;
    });
    
    // Fix 7: CSS paths in style tags or attributes
    html = html.replace(/url\(\s*'\/([^']*)'\s*\)/g, (match, p1) => {
        if (p1.startsWith('_next/')) {
            return `url('/rome/${p1}')`;
        }
        return match;
    });
    
    html = html.replace(/url\(\s*"\/([^"]*)"\s*\)/g, (match, p1) => {
        if (p1.startsWith('_next/')) {
            return `url("/rome/${p1}")`;
        }
        return match;
    });
    
    // Write back
    fs.writeFileSync(filePath, html);
    console.log(`✅ Fixed ALL paths in ${filename}`);
});

console.log('🎉 All HTML files updated with correct /rome/ base path');
