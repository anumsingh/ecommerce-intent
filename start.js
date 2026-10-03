/**
 * OmniPrice MERN + ML Platform Unified Runner
 * Spawns:
 * 1. Python ML & Scraper Microservice (Port 5001)
 * 2. Node.js / Express Backend with MongoDB (Port 5000)
 * 3. React Vite Frontend (Port 3000)
 */

const { spawn } = require('child_process');
const path = require('path');

const ROOT = __dirname;
const isWin = process.platform === 'win32';
const npmCmd = isWin ? 'npm.cmd' : 'npm';
const pythonCmd = 'python';

console.log('='.repeat(70));
console.log(' Starting OmniPrice E-Commerce Platform (MERN + Real-Time ML Intent)');
console.log('='.repeat(70));

// 1. Start Python ML Microservice
const mlProcess = spawn(pythonCmd, ['ml_service/service.py'], {
  cwd: ROOT,
  stdio: 'inherit',
  shell: true
});

// 2. Start Node.js Express Server
const serverProcess = spawn(npmCmd, ['start'], {
  cwd: path.join(ROOT, 'server'),
  stdio: 'inherit',
  shell: true
});

// 3. Start React Vite Dev Server
const clientProcess = spawn(npmCmd, ['run', 'dev'], {
  cwd: path.join(ROOT, 'client'),
  stdio: 'inherit',
  shell: true
});

// Graceful shutdown handling
const cleanup = () => {
  console.log('\nStopping all services...');
  mlProcess.kill();
  serverProcess.kill();
  clientProcess.kill();
  process.exit();
};

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
