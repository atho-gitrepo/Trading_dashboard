import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Debug: Check if dist exists
const distPath = path.join(__dirname, 'dist');
console.log(`📁 Looking for dist at: ${distPath}`);

if (fs.existsSync(distPath)) {
  console.log('✅ dist folder found');
  const files = fs.readdirSync(distPath);
  console.log(`📄 Files in dist: ${files.join(', ')}`);
} else {
  console.log('❌ dist folder NOT found!');
  console.log('📂 Current directory contents:', fs.readdirSync(__dirname).join(', '));
}

// Serve static files
app.use(express.static(distPath));

// Handle SPA routing
app.get('*', (req, res) => {
  const indexPath = path.join(distPath, 'index.html');
  console.log(`📄 Serving: ${indexPath}`);
  
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    console.log('❌ index.html not found!');
    res.status(404).send('index.html not found');
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running on http://0.0.0.0:${PORT}`);
});

app.on('error', (error) => {
  console.error('❌ Server error:', error);
});