const fs = require('fs');
const path = require('path');

console.log('🔧 Final path fix for GitHub Pages...');

const htmlFiles = ['index.html', '404.html', '_not-found.html'];

htmlFiles.forEach(filename => {
    const filePath = path.join(__dirname, 'out', filename);
    
    if (!fs.existsSync(filePath)) {
        console.log(`⚠️  ${filename} not found, skipping`);
        return;
    }
    
    let html = fs.readFileSync(filePath, 'utf8');
    
    // First, fix any triple or double /rome/ prefixes
    html = html.replace(/\/rome\/rome\/rome\//g, '/rome/');
    html = html.replace(/\/rome\/rome\//g, '/rome/');
    
    // Now ensure all _next/ paths have /rome/ prefix
    // Match /_next/ but not /rome/_next/
    html = html.replace(/([\s"'])\/_next\//g, '$1/rome/_next/');
    
    // Fix manifest
    html = html.replace(/href=["']\/manifest\.json["']/g, 'href="/rome/manifest.json"');
    html = html.replace(/["']\/manifest\.json["']/g, '"/rome/manifest.json"');
    
    // Fix icons
    html = html.replace(/href=["']\/icon-(192|512)\.png["']/g, 'href="/rome/icon-$1.png"');
    html = html.replace(/["']\/icon-(192|512)\.png["']/g, '"/rome/icon-$1.png"');
    
    // Fix inline JSON paths
    html = html.replace(/\"\/_next\/([^\"]+)\"/g, '\"/rome/_next/$1\"');
    
    fs.writeFileSync(filePath, html, 'utf8');
    console.log(`✅ Fixed ${filename}`);
});

console.log('✅ All paths fixed!');

// Verify
console.log('\n🔍 Verifying paths...');
const html = fs.readFileSync(path.join(__dirname, 'out', 'index.html'), 'utf8');

const doubleRome = (html.match(/\/rome\/rome\//g) || []).length;
if (doubleRome > 0) {
    console.log(`❌ Found ${doubleRome} double /rome/ prefixes`);
} else {
    console.log('✅ No double /rome/ prefixes');
}

const missingRome = (html.match(/[\s"']\/_next\//g) || []).length;
if (missingRome > 0) {
    console.log(`❌ Found ${missingRome} _next/ paths missing /rome/`);
} else {
    console.log('✅ All _next/ paths have /rome/');
}

if (html.includes('href="/rome/manifest.json"')) {
    console.log('✅ Manifest has correct path');
} else {
    console.log('❌ Manifest path incorrect');
}

const iconMatches = html.match(/href=["'][^"']*icon-[^"']*["']/g) || [];
let correctIcons = 0;
iconMatches.forEach(icon => {
    if (icon.includes('/rome/icon-')) {
        correctIcons++;
    }
});
console.log(`✅ ${correctIcons}/${iconMatches.length} icons have correct path`);
