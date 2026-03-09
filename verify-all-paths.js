const fs = require('fs');
const html = fs.readFileSync('out/index.html', 'utf8');

console.log('🔍 Verifying all asset paths...');

// Check for any asset paths without /rome/
const assetRegex = /"\/([^"]*\.(js|css|woff2|png|jpg|jpeg|gif|svg))"/g;
const matches = [];
let match;
while ((match = assetRegex.exec(html)) !== null) {
    matches.push(match[0]);
}

console.log(`Found ${matches.length} asset paths in HTML`);

const wrongPaths = matches.filter(path => !path.includes('/rome/'));
if (wrongPaths.length > 0) {
    console.log(`❌ Found ${wrongPaths.length} paths missing /rome/ prefix:`);
    wrongPaths.slice(0, 10).forEach(p => console.log(`  ${p}`));
} else {
    console.log('✅ All asset paths include /rome/ prefix');
}

// Check manifest
if (html.includes('href="/manifest.json"') || html.includes('"/manifest.json"')) {
    console.log('❌ Manifest path missing /rome/ prefix');
} else if (html.includes('href="/rome/manifest.json"') || html.includes('"/rome/manifest.json"')) {
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

// Check for any /_next/ references without /rome/
const nextRefs = html.match(/\/_next\/[^\s"'<>]*/g) || [];
console.log(`\nFound ${nextRefs.length} /_next/ references`);
const wrongNextRefs = nextRefs.filter(ref => !ref.startsWith('/rome/_next/'));
if (wrongNextRefs.length > 0) {
    console.log(`❌ Found ${wrongNextRefs.length} /_next/ references missing /rome/:`);
    wrongNextRefs.slice(0, 10).forEach(ref => console.log(`  ${ref}`));
} else {
    console.log('✅ All /_next/ references include /rome/');
}
