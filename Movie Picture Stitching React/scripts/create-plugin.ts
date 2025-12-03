#!/usr/bin/env node
/**
 * Eagle Plugin Scaffolding Tool
 *
 * Interactive CLI for creating new Eagle plugins from the template.
 * Handles UUID generation, manifest updates, and locale file customization.
 *
 * Usage:
 *   npm run create-plugin
 *   # Or from another directory:
 *   npx tsx path/to/scripts/create-plugin.ts
 */

import * as p from '@clack/prompts';
import { randomUUID } from 'crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync, cpSync, readdirSync } from 'fs';
import { resolve, dirname, join } from 'path';
import { fileURLToPath } from 'url';
import pc from 'picocolors';

// ESM __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const TEMPLATE_DIR = resolve(__dirname, '..');

// Supported languages
const SUPPORTED_LANGUAGES = [
  { value: 'en', label: 'English', hint: 'Required' },
  { value: 'zh_CN', label: '简体中文 (Simplified Chinese)' },
  { value: 'zh_TW', label: '繁體中文 (Traditional Chinese)' },
  { value: 'ja_JP', label: '日本語 (Japanese)' },
  { value: 'ko_KR', label: '한국어 (Korean)' },
  { value: 'de_DE', label: 'Deutsch (German)' },
  { value: 'es_ES', label: 'Español (Spanish)' },
  { value: 'ru_RU', label: 'Русский (Russian)' },
];

// Files and directories to copy
const FILES_TO_COPY = [
  'index.html',
  'manifest.json',
  'package.json',
  'postcss.config.js',
  'tailwind.config.js',
  'tsconfig.json',
  'tsconfig.node.json',
  'vite.config.ts',
  'vitest.config.ts',
  'eslint.config.js',
  '.prettierrc',
  '.prettierignore',
  '.editorconfig',
  'components.json',
];

const DIRS_TO_COPY = ['src', 'public', 'scripts', '_locales', '.vscode'];

// Files to skip in directories
const SKIP_FILES = [
  'node_modules',
  'dist',
  'coverage',
  '.git',
  'pnpm-lock.yaml',
  'package-lock.json',
  'yarn.lock',
];

interface PluginConfig {
  projectName: string;
  displayName: string;
  description: string;
  author: string;
  languages: string[];
  pluginId: string;
}

async function main(): Promise<void> {
  console.clear();

  p.intro(pc.bgCyan(pc.black(' 🦅 Create Eagle Plugin ')));

  // Check if running from template directory
  const isTemplateDir = existsSync(resolve(TEMPLATE_DIR, 'manifest.json'));
  if (!isTemplateDir) {
    p.cancel('This script must be run from the eagle-react-template directory.');
    process.exit(1);
  }

  // Gather project information
  const config = await gatherConfig();

  if (!config) {
    p.cancel('Operation cancelled.');
    process.exit(0);
  }

  // Confirm before proceeding
  const confirmed = await p.confirm({
    message: `Create plugin "${config.displayName}" at ../${config.projectName}?`,
  });

  if (p.isCancel(confirmed) || !confirmed) {
    p.cancel('Operation cancelled.');
    process.exit(0);
  }

  // Create the plugin
  const spinner = p.spinner();
  spinner.start('Creating plugin...');

  try {
    await createPlugin(config);
    spinner.stop('Plugin created successfully!');

    // Next steps
    p.note(`cd ../${config.projectName}\nnpm install\nnpm run dev`, 'Next steps');

    p.outro(pc.green('✨ Happy coding!'));
  } catch (error) {
    spinner.stop('Failed to create plugin');
    p.cancel(`Error: ${error instanceof Error ? error.message : String(error)}`);
    process.exit(1);
  }
}

async function gatherConfig(): Promise<PluginConfig | null> {
  const group = await p.group(
    {
      projectName: () =>
        p.text({
          message: 'Project directory name:',
          placeholder: 'my-eagle-plugin',
          validate: (value) => {
            if (!value) return 'Project name is required';
            if (!/^[a-z0-9-]+$/.test(value)) {
              return 'Use lowercase letters, numbers, and hyphens only';
            }
            const targetDir = resolve(TEMPLATE_DIR, '..', value);
            if (existsSync(targetDir)) {
              return `Directory "${value}" already exists`;
            }
            return undefined;
          },
        }),

      displayName: () =>
        p.text({
          message: 'Plugin display name (English):',
          placeholder: 'My Awesome Plugin',
          validate: (value) => {
            if (!value) return 'Display name is required';
            if (value.length > 50) return 'Display name too long (max 50 chars)';
            return undefined;
          },
        }),

      description: () =>
        p.text({
          message: 'Plugin description (English):',
          placeholder: 'A plugin that does awesome things',
          validate: (value) => {
            if (!value) return 'Description is required';
            if (value.length > 200) return 'Description too long (max 200 chars)';
            return undefined;
          },
        }),

      author: () =>
        p.text({
          message: 'Author name:',
          placeholder: 'Your Name',
        }),

      languages: () =>
        p.multiselect({
          message: 'Select additional languages (English is always included):',
          options: SUPPORTED_LANGUAGES.slice(1).map((lang) => ({
            value: lang.value,
            label: lang.label,
          })),
          required: false,
        }),
    },
    {
      onCancel: () => {
        return null;
      },
    }
  );

  if (!group.projectName) return null;

  return {
    projectName: group.projectName as string,
    displayName: group.displayName as string,
    description: group.description as string,
    author: (group.author as string) || '',
    languages: ['en', ...(group.languages as string[])],
    pluginId: randomUUID(),
  };
}

async function createPlugin(config: PluginConfig): Promise<void> {
  const targetDir = resolve(TEMPLATE_DIR, '..', config.projectName);

  // Create target directory
  mkdirSync(targetDir, { recursive: true });

  // Copy individual files
  for (const file of FILES_TO_COPY) {
    const src = resolve(TEMPLATE_DIR, file);
    const dest = resolve(targetDir, file);
    if (existsSync(src)) {
      cpSync(src, dest);
    }
  }

  // Copy directories
  for (const dir of DIRS_TO_COPY) {
    const src = resolve(TEMPLATE_DIR, dir);
    const dest = resolve(targetDir, dir);
    if (existsSync(src)) {
      copyDirRecursive(src, dest);
    }
  }

  // Update manifest.json
  updateManifest(targetDir, config);

  // Update package.json
  updatePackageJson(targetDir, config);

  // Update locale files
  updateLocaleFiles(targetDir, config);
}

function copyDirRecursive(src: string, dest: string): void {
  mkdirSync(dest, { recursive: true });

  const entries = readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    if (SKIP_FILES.includes(entry.name)) continue;

    const srcPath = join(src, entry.name);
    const destPath = join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDirRecursive(srcPath, destPath);
    } else {
      cpSync(srcPath, destPath);
    }
  }
}

function updateManifest(targetDir: string, config: PluginConfig): void {
  const manifestPath = resolve(targetDir, 'manifest.json');
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf-8'));

  manifest.id = config.pluginId;
  manifest.version = '1.0.0';
  manifest.languages = config.languages;

  writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n');
}

function updatePackageJson(targetDir: string, config: PluginConfig): void {
  const packagePath = resolve(targetDir, 'package.json');
  const pkg = JSON.parse(readFileSync(packagePath, 'utf-8'));

  pkg.name = config.projectName;
  pkg.version = '1.0.0';
  pkg.description = config.description;
  if (config.author) {
    pkg.author = config.author;
  }

  writeFileSync(packagePath, JSON.stringify(pkg, null, 2) + '\n');
}

function updateLocaleFiles(targetDir: string, config: PluginConfig): void {
  const localesDir = resolve(targetDir, '_locales');

  // Update English locale (always present)
  const enPath = resolve(localesDir, 'en.json');
  if (existsSync(enPath)) {
    const en = JSON.parse(readFileSync(enPath, 'utf-8'));
    en.manifest = en.manifest || {};
    en.manifest.app = en.manifest.app || {};
    en.manifest.app.name = config.displayName;

    en.app = en.app || {};
    en.app.title = config.displayName;
    en.app.description = config.description;

    writeFileSync(enPath, JSON.stringify(en, null, 2) + '\n');
  }

  // Remove locale files for unselected languages
  const allLanguages = SUPPORTED_LANGUAGES.map((l) => l.value);
  for (const lang of allLanguages) {
    if (!config.languages.includes(lang)) {
      const langPath = resolve(localesDir, `${lang}.json`);
      if (existsSync(langPath)) {
        // Keep the file but update with English values as placeholder
        const langData = JSON.parse(readFileSync(langPath, 'utf-8'));
        langData.manifest = langData.manifest || {};
        langData.manifest.app = langData.manifest.app || {};
        langData.manifest.app.name = config.displayName;

        langData.app = langData.app || {};
        langData.app.title = config.displayName;
        langData.app.description = config.description;

        writeFileSync(langPath, JSON.stringify(langData, null, 2) + '\n');
      }
    }
  }

  // Update selected language files with placeholder
  for (const lang of config.languages) {
    if (lang === 'en') continue;

    const langPath = resolve(localesDir, `${lang}.json`);
    if (existsSync(langPath)) {
      const langData = JSON.parse(readFileSync(langPath, 'utf-8'));
      langData.manifest = langData.manifest || {};
      langData.manifest.app = langData.manifest.app || {};
      langData.manifest.app.name = `${config.displayName} (${lang})`;

      langData.app = langData.app || {};
      langData.app.title = `${config.displayName} (${lang})`;
      langData.app.description = `[${lang}] ${config.description}`;

      writeFileSync(langPath, JSON.stringify(langData, null, 2) + '\n');
    }
  }
}

// Run main
main().catch((error) => {
  console.error('Unexpected error:', error);
  process.exit(1);
});
