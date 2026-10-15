const fs = require('fs');
const path = require('path');

function copyDir(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      try {
        if (fs.existsSync(destPath)) {
          fs.chmodSync(destPath, 0o666);
        }
        fs.copyFileSync(srcPath, destPath);
      } catch (err) {
        console.warn(`Warning copying ${srcPath} -> ${destPath}:`, err.message);
      }
    }
  }
}

const srcDir = path.join(__dirname, 'public');
const destDir = path.join(__dirname, 'docs');

console.log(`Copying from ${srcDir} to ${destDir}...`);
copyDir(srcDir, destDir);
console.log('Docs folder synchronized successfully!');
