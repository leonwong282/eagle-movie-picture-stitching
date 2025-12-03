/**
 * Deploy script to copy built files to Eagle plugins directory
 * 
 * Key difference between dev and deploy:
 * - Development: manifest.json points to "dist/index.html" and "public/logo.png"
 * - Deployment: manifest.json points to "index.html" and "logo.png" (files at root)
 * 
 * This script transforms the paths during deployment.
 */

import { existsSync, cpSync, mkdirSync, rmSync, readFileSync, writeFileSync } from 'fs';
import { join, resolve } from 'path';
import { homedir, platform } from 'os';

const PLUGIN_NAME = 'eagle-react-template';

// Determine Eagle plugins directory based on platform
function getEaglePluginsDir() {
  const os = platform();
  
  if (os === 'darwin') {
    return join(homedir(), 'Library', 'Application Support', 'Eagle', 'plugins');
  } else if (os === 'win32') {
    return join(process.env.APPDATA || '', 'Eagle', 'plugins');
  } else {
    console.error('Unsupported platform:', os);
    process.exit(1);
  }
}

/**
 * Transform manifest.json paths for deployment
 * - "dist/index.html" → "index.html"
 * - "public/logo.png" → "logo.png"
 */
function transformManifestForDeploy(manifest) {
  const transformed = { ...manifest };
  
  // Transform main.url: "dist/index.html" → "index.html"
  if (transformed.main && transformed.main.url) {
    transformed.main = { ...transformed.main };
    transformed.main.url = transformed.main.url.replace(/^dist\//, '');
  }
  
  // Transform logo: "public/logo.png" → "logo.png"
  if (transformed.logo) {
    transformed.logo = transformed.logo.replace(/^public\//, '');
  }
  // Remove "devTools": true, if exists
  if (transformed.devTools) {
    delete transformed.devTools;
  }
  
  return transformed;
}

function main() {
  const rootDir = resolve(process.cwd());
  const distDir = join(rootDir, 'dist');
  const pluginsDir = getEaglePluginsDir();
  const targetDir = join(pluginsDir, PLUGIN_NAME);

  console.log('🚀 Deploying Eagle React Template...\n');

  // Check if dist exists
  if (!existsSync(distDir)) {
    console.error('❌ dist/ folder not found. Run "npm run build" first.');
    process.exit(1);
  }

  // Check if Eagle plugins directory exists
  if (!existsSync(pluginsDir)) {
    console.error('❌ Eagle plugins directory not found:', pluginsDir);
    console.error('   Make sure Eagle is installed.');
    process.exit(1);
  }

  // Remove existing plugin folder if exists
  if (existsSync(targetDir)) {
    console.log('🗑️  Removing existing plugin...');
    rmSync(targetDir, { recursive: true, force: true });
  }

  // Create target directory
  mkdirSync(targetDir, { recursive: true });

  // Copy dist contents directly to root (no /dist subfolder)
  console.log('📦 Copying build files...');
  cpSync(distDir, targetDir, { recursive: true });

  // Read, transform, and write manifest.json
  console.log('📝 Transforming manifest.json for deployment...');
  const manifestPath = join(rootDir, 'manifest.json');
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf-8'));
  const deployManifest = transformManifestForDeploy(manifest);
  writeFileSync(
    join(targetDir, 'manifest.json'),
    JSON.stringify(deployManifest, null, 2),
    'utf-8'
  );
  console.log('   ✓ main.url: "dist/index.html" → "index.html"');
  console.log('   ✓ logo: "public/logo.png" → "logo.png"');

  // Copy _locales
  console.log('📁 Copying _locales...');
  cpSync(join(rootDir, '_locales'), join(targetDir, '_locales'), { recursive: true });

  // Copy public assets if they exist (logo.png, etc.)
  const publicDir = join(rootDir, 'public');
  if (existsSync(publicDir)) {
    console.log('📁 Copying public assets...');
    cpSync(publicDir, targetDir, { recursive: true });
  }

  console.log('\n✅ Deployment complete!');
  console.log('📍 Plugin installed to:', targetDir);
  console.log('\n📋 Next steps:');
  console.log('   Restart Eagle to load the plugin automatically.');
}

main();
