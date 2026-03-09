const fs = require('fs');
const html = fs.readFileSync('out/index.html', 'utf8');

// Find all asset paths
const assetMatches = html.match(/"\/([^"]*\.(js|css|woff2|png))"/g) || [];
console.log(`Found ${assetMatches.length} asset paths in HTML`);

// Check which ones don't have /rome/
const wrongPaths = assetMatches.filter(path => !path.includes('/rome/'));
if (wrongPaths.length > 0) {
    console.log(`❌ Found ${wrongPaths.length} paths missing /rome/ prefix:`);
    wrongPaths.slice(0, 10).forEach(p => console.log(`  ${p}`));
} else {
    console.log('✅ All asset paths include /rome/ prefix');
}

// Check manifest
if (html.includes('href="/manifest.json"')) {
    console.log('❌ Manifest path missing /rome/ prefix');
} else if (html.includes('href="/rome/manifest.json"')) {
    console.log('✅ Manifest path includes /rome/ prefix');
}

// Check icons
const iconMatches = html.match(/href="[^"]*icon[^"]*\.png"/gi) || [];
console.log(`\nFound ${iconMatches.length} icon paths`);
const wrongIcons = iconMatches.filter(icon => !icon.includes('/rome/'));
if (wrongIcons.length > 0) {
    console.log(`❌ Found ${wrongIcons.length} icon paths missing /rome/`);
} else {
    console.log('✅ All icon paths include /rome/');
}
