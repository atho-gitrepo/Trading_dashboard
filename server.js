import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 8080;  // Changed to 3000

const distPath = path.join(__dirname, 'dist');
console.log(`📁 Looking for dist at: ${distPath}`);

if (fs.existsSync(distPath)) {
  console.log('✅ dist folder found');
  const files = fs.readdirSync(distPath);
  console.log(`📄 Files in dist: ${files.join(', ')}`);
} else {
  console.log('❌ dist folder NOT found!');
}

// Log all requests
app.use((req, res, next) => {
  console.log(`📥 ${req.method} ${req.url}`);
  next();
});

// Serve static files with proper MIME types
app.use(express.static(distPath, {
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.js')) {
      res.setHeader('Content-Type', 'application/javascript');
    } else if (filePath.endsWith('.css')) {
      res.setHeader('Content-Type', 'text/css');
    }
  }
}));

// Handle SPA routing - serve index.html for all non-static routes
app.get('*', (req, res) => {
  // Skip API routes
  if (req.path === '/health') {
    return res.status(200).send('OK');
  }
  
  const indexPath = path.join(distPath, 'index.html');
  console.log(`📄 Serving SPA: ${indexPath}`);
  
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    console.log('❌ index.html not found!');
    res.status(404).send('index.html not found');
  }
});

// Health check
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running on http://0.0.0.0:${PORT}`);
  console.log(`📁 Serving from: ${distPath}`);
  console.log(`🔍 Health check: http://0.0.0.0:${PORT}/health`);
});

app.on('error', (error) => {
  console.error('❌ Server error:', error);
});