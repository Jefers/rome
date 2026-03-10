const fs = require('fs');
const path = require('path');

console.log('🔧 Fixing asset paths (avoiding double prefix)...');

const htmlFiles = ['index.html', '404.html', '_not-found.html'];

htmlFiles.forEach(filename => {
    const filePath = path.join(__dirname, 'out', filename);
    
    if (!fs.existsSync(filePath)) {
        console.log(`⚠️  ${filename} not found, skipping`);
        return;
    }
    
    let html = fs.readFileSync(filePath, 'utf8');
    const original = html;
    
    // Fix 1: Manifest - only if not already /rome/
    html = html.replace(/(href=["'])\/manifest\.json(["'])/g, '$1/rome/manifest.json$2');
    html = html.replace(/(["'])\/manifest\.json(["'])/g, '$1/rome/manifest.json$2');
    
    // Fix 2: Icons - only if not already /rome/
    html = html.replace(/(href=["'])\/icon-(192|512)\.png(["'])/g, '$1/rome/icon-$2.png$3');
    html = html.replace(/(["'])\/icon-(192|512)\.png(["'])/g, '$1/rome/icon-$2.png$3');
    
    // Fix 3: _next/ paths - only if not already /rome/
    // Match /_next/ but not /rome/_next/
    html = html.replace(/([\s"'])\/_next\/([^\s"'>]+)/g, function(match, p1, p2) {
        // Check if this is already part of /rome/_next/
        const before = html.substring(0, html.indexOf(match));
        if (before.endsWith('/rome')) {
            return match; // Already has /rome/ prefix
        }
        return p1 + '/rome/_next/' + p2;
    });
    
    // Fix 4: Inline JSON strings
    html = html.replace(/\"\/_next\/([^\"]+)\"/g, '\"/rome/_next/$1\"');
    
    if (html !== original) {
        fs.writeFileSync(filePath, html, 'utf8');
        console.log(`✅ Fixed paths in ${filename}`);
        
        // Show what was fixed
        const lines = html.split('\n');
        const originalLines = original.split('\n');
        for (let i = 0; i < Math.min(lines.length, originalLines.length); i++) {
            if (lines[i] !== originalLines[i]) {
                console.log(`  Line ${i+1}: ${originalLines[i].substring(0, 50)}... → ${lines[i].substring(0, 50)}...`);
                break;
            }
        }
    } else {
        console.log(`ℹ️  No changes needed for ${filename}`);
    }
});

console.log('✅ Fix complete!');
