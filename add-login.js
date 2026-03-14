const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, 'public');
const files = fs.readdirSync(publicDir)
  .filter(f => f.endsWith('.html'))
  .map(f => path.join(publicDir, f));

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  const target = '<li><a href="/about.html" class="nav-link">Hakkımızda</a></li>';
  const replacement = '<li><a href="/about.html" class="nav-link">Hakkımızda</a></li>\n        <li><a href="/admin/login.html" class="nav-link btn-outline-white" style="padding: 0.3rem 0.8rem; border-radius: 5px; margin-left:10px;">👤 Giriş Yap</a></li>';
  
  if (content.includes(target) && !content.includes('Giriş Yap</a></li>')) {
    content = content.replace(target, replacement);
    fs.writeFileSync(file, content, 'utf8');
    console.log('Updated', file);
  }
});
