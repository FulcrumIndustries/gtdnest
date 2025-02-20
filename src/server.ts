const express = require('express');
const { join } = require('path');
const { exec } = require('child_process');

const app = express();
const port = process.env.PORT || 3000;

// Get the correct asset path whether running from source or packaged
const distPath = (process as any).pkg ? join(process.execPath, '..', 'dist') : join(__dirname, './dist');

// Serve static files from the dist directory
app.use(express.static(distPath));

// Serve index.html for all routes
app.get('*', (req, res) => {
    res.sendFile(join(distPath, 'index.html'));
});

// Listen on all network interfaces
app.listen(port, '0.0.0.0', () => {
    console.log(`GTD Nest is running at:`);
    console.log(`  • Local:   http://localhost:${port}`);
    console.log(`  • Network: http://0.0.0.0:${port}`);

    // Open browser using platform-specific command
    const start = process.platform === 'darwin' ? 'open' : process.platform === 'win32' ? 'start' : 'xdg-open';
    exec(`${start} http://localhost:${port}`);
}); 