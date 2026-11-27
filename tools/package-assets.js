#!/usr/bin/env node
// Packages the custom artwork into deliverables/dataforge-assets.zip with its README.
// The website never reads the ZIP; it uses the extracted files in assets/.
'use strict';
const fs = require('fs');
const path = require('path');
const os = require('os');
const { execFileSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const FOLDERS = ['hero', 'data-engineering', 'ai-ml', 'automation', 'analytics', 'projects', 'diagrams', 'backgrounds', 'icons'];
const stage = fs.mkdtempSync(path.join(os.tmpdir(), 'df-zip-'));
const top = path.join(stage, 'DATAFORGE-ASSETS');
fs.mkdirSync(top);
for (const f of FOLDERS) fs.cpSync(path.join(ROOT, 'assets', f), path.join(top, f), { recursive: true });
fs.copyFileSync(path.join(ROOT, 'assets/og.jpg'), path.join(top, 'og.jpg'));
fs.copyFileSync(path.join(ROOT, 'assets/README.md'), path.join(top, 'README.md'));

const dest = path.join(ROOT, 'deliverables/dataforge-assets.zip');
fs.mkdirSync(path.dirname(dest), { recursive: true });
if (fs.existsSync(dest)) fs.rmSync(dest);
// -X leaves out extra file attributes
execFileSync('zip', ['-r', '-q', '-X', '-9', dest, 'DATAFORGE-ASSETS'], { cwd: stage });
fs.rmSync(stage, { recursive: true, force: true });
console.log('wrote deliverables/dataforge-assets.zip', fs.statSync(dest).size, 'bytes');
