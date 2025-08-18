#!/usr/bin/env node

/**
 * Script to fix Lucide React icon loading issues
 * This script:
 * 1. Updates the package.json to pin lucide-react to a stable version
 * 2. Creates a properly structured index.js for icon imports
 * 3. Clears the node_modules cache related to lucide-react
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

// Log with colors
function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

// Log section header
function logSection(title) {
  console.log('\n' + colors.bright + colors.blue + '▶ ' + title + colors.reset + '\n');
}

// Execute a command and return the result
function execute(command) {
  try {
    return execSync(command, { stdio: 'inherit' });
  } catch (error) {
    log(`Error executing command: ${command}`, colors.red);
    log(error.toString(), colors.red);
    return null;
  }
}

// Start the fix
logSection('Starting Lucide React Icons Fix Script');

// 1. Update package.json to use a specific version of lucide-react
logSection('Updating package.json');
try {
  const packageJsonPath = path.join(process.cwd(), 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  
  // Save the current version before updating
  const currentVersion = packageJson.dependencies['lucide-react'] || 'Not installed';
  log(`Current lucide-react version: ${currentVersion}`, colors.yellow);
  
  // Update to a stable version (0.263.1)
  packageJson.dependencies['lucide-react'] = '^0.263.1';
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  log(`Updated lucide-react version to: ^0.263.1`, colors.green);
} catch (error) {
  log(`Error updating package.json: ${error}`, colors.red);
}

// 2. Create a helper file to normalize icon imports
logSection('Creating icons helper file');
try {
  const iconsHelperDir = path.join(process.cwd(), 'src/utils');
  const iconsHelperPath = path.join(iconsHelperDir, 'icons.tsx');
  
  // Create directory if it doesn't exist
  if (!fs.existsSync(iconsHelperDir)) {
    fs.mkdirSync(iconsHelperDir, { recursive: true });
  }

  // Create helper file content
  const helperContent = `import React from 'react';
import * as LucideIcons from 'lucide-react';

// Type for icon props
export type IconProps = React.SVGProps<SVGSVGElement> & {
  size?: number | string;
  className?: string;
};

// Wrapper component to handle size prop correctly
export const Icon = ({ 
  icon: IconComponent, 
  size = 24, 
  className = "",
  ...props 
}: { 
  icon: React.FC<IconProps>;
  size?: number | string;
  className?: string;
} & React.SVGProps<SVGSVGElement>) => {
  return (
    <IconComponent 
      width={size}
      height={size}
      className={className}
      {...props}
    />
  );
};

// Re-export all Lucide icons
export const Icons = LucideIcons;

// Helper function to get icon by name (useful for dynamic icons)
export function getIconByName(name: string): React.FC<IconProps> | null {
  return (LucideIcons as Record<string, React.FC<IconProps>>)[name] || null;
}
`;
  fs.writeFileSync(iconsHelperPath, helperContent);
  log(`Created icons helper file at: ${iconsHelperPath}`, colors.green);
} catch (error) {
  log(`Error creating icons helper file: ${error}`, colors.red);
}

// 3. Reinstall dependencies
logSection('Reinstalling dependencies');
execute('npm ci');

// 4. Clean cache (optional but often helpful)
logSection('Cleaning cache');
execute('npm cache clean --force');

// 5. Remove node_modules/.vite to force rebuild of dependencies
try {
  const viteDir = path.join(process.cwd(), 'node_modules/.vite');
  if (fs.existsSync(viteDir)) {
    log('Removing Vite cache...', colors.yellow);
    fs.rmSync(viteDir, { recursive: true, force: true });
    log('Vite cache removed successfully', colors.green);
  } else {
    log('No Vite cache found - skipping', colors.cyan);
  }
} catch (error) {
  log(`Error removing Vite cache: ${error}`, colors.red);
}

// Success message
logSection('Fix Complete!');
log('To use the fixed icons in your components:', colors.cyan);
log(`
import { Icon, Icons } from '../utils/icons';

// Example usage:
<Icon icon={Icons.ChevronDown} size={16} className="text-blue-500" />
`, colors.bright);
log('Run "npm run dev" to restart the development server.', colors.green);
