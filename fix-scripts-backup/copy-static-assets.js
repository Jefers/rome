const fs = require('fs');
const path = require('path');

console.log('📦 Copying static assets from .next/static to out/_next/static...');

// Ensure out/_next/static directory exists
const outStaticDir = path.join(__dirname, 'out/_next/static');
if (!fs.existsSync(outStaticDir)) {
    fs.mkdirSync(outStaticDir, { recursive: true });
}

// Copy from .next/static to out/_next/static
const sourceDir = path.join(__dirname, '.next/static');

if (!fs.existsSync(sourceDir)) {
    console.error('❌ Source directory .next/static does not exist!');
    process.exit(1);
}

// Copy recursively
function copyRecursive(source, target) {
    if (!fs.existsSync(target)) {
        fs.mkdirSync(target, { recursive: true });
    }
    
    const items = fs.readdirSync(source);
    
    for (const item of items) {
        const sourcePath = path.join(source, item);
        const targetPath = path.join(target, item);
        
        const stat = fs.statSync(sourcePath);
        
        if (stat.isDirectory()) {
            copyRecursive(sourcePath, targetPath);
        } else {
            fs.copyFileSync(sourcePath, targetPath);
        }
    }
}

copyRecursive(sourceDir, outStaticDir);
console.log('✅ Copied static assets from .next/static to out/_next/static');
