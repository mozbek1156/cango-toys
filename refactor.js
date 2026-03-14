const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, 'public');

function getAllFiles(dirPath, arrayOfFiles) {
  const files = fs.readdirSync(dirPath);
  arrayOfFiles = arrayOfFiles || [];

  files.forEach(function(file) {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
    } else {
      if (file.endsWith('.html') || file.endsWith('.css') || file.endsWith('.js')) {
        arrayOfFiles.push(path.join(dirPath, "/", file));
      }
    }
  });
  return arrayOfFiles;
}

const files = getAllFiles(publicDir);

const replacements = [
  { regex: /--yellow-light/g, replacement: '--brand-green-light' },
  { regex: /--yellow-dark/g, replacement: '--brand-green-dark' },
  { regex: /--yellow/g, replacement: '--brand-green' },
  { regex: /--coral-dark/g, replacement: '--brand-blue-dark' },
  { regex: /--coral/g, replacement: '--brand-blue' },
  { regex: /text-yellow/g, replacement: 'text-brand-green' },
  { regex: /text-coral/g, replacement: 'text-brand-blue' },
  { regex: /badge-yellow/g, replacement: 'badge-brand-green' },
  { regex: /badge-coral/g, replacement: 'badge-brand-blue' },
  { regex: /badge-red/g, replacement: 'badge-brand-purple' },
  { regex: /--red/g, replacement: '--brand-purple' },
  { regex: /btn-red/g, replacement: 'btn-brand-purple' },
  { regex: /stat-icon-yellow/g, replacement: 'stat-icon-green' },
  { regex: /stat-icon-coral/g, replacement: 'stat-icon-blue' },
  { regex: /stat-icon-orange/g, replacement: 'stat-icon-teal' },
  // HTML inline styles color fixes
  { regex: /color:\s*#FF6B35/g, replacement: 'color: var(--brand-blue)' },
  { regex: /color:\s*#FFCC00/g, replacement: 'color: var(--brand-green)' },
  { regex: /color:\s*#F44336/g, replacement: 'color: var(--brand-purple)' },
  { regex: /color:\s*var\(--red\)/g, replacement: 'color: var(--brand-purple)' },
  { regex: /background:\s*#FFEBEE/g, replacement: 'background: rgba(156,39,176,0.1)' }
];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;
  
  replacements.forEach(r => {
    content = content.replace(r.regex, r.replacement);
  });

  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    console.log('Updated', file);
  }
});

console.log('Done refactoring variables.');
