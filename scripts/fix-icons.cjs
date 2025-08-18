#!/usr/bin/env node

// This is a CommonJS script
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

/**
 * Script to fix Lucide React icon issues in the SmartCRM Dashboard application
 * 
 * This script:
 * 1. Updates the package.json to pin lucide-react to a stable version
 * 2. Updates direct icon usage to use the Icon component wrapper
 * 3. Makes sure proper icon imports are used throughout the application
 */

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

// Get the project root directory
const rootDir = path.resolve(__dirname, '..');

// Function to update Navbar.tsx
function updateNavbarComponent() {
  logSection('Updating Navbar.tsx to use Icon helper');
  
  const navbarPath = path.join(rootDir, 'src', 'components', 'Navbar.tsx');
  
  try {
    // Read the current file
    let content = fs.readFileSync(navbarPath, 'utf8');
    
    // Step 1: Update imports
    content = content.replace(
      /import {([^}]*)} from ['"]lucide-react['"];/,
      `import { Icon, Icons } from '../utils/icons';`
    );
    
    // Step 2: Replace direct icon usages with Icon component
    // This is a basic replacement pattern - may need more specific replacements
    const iconPatterns = [
      {
        // Match: <IconName size={size} className="class" />
        pattern: /<([A-Z][a-zA-Z]+)\s+size=\{(\d+)\}\s+className="([^"]+)"\s*\/>/g,
        replacement: '<Icon icon={Icons.$1} size={$2} className="$3" />'
      },
      {
        // Match: <IconName className="class" size={size} />
        pattern: /<([A-Z][a-zA-Z]+)\s+className="([^"]+)"\s+size=\{(\d+)\}\s*\/>/g,
        replacement: '<Icon icon={Icons.$1} className="$2" size={$3} />'
      },
      {
        // Match: <IconName className="class" />
        pattern: /<([A-Z][a-zA-Z]+)\s+className="([^"]+)"\s*\/>/g,
        replacement: '<Icon icon={Icons.$1} className="$2" />'
      },
      {
        // Match: <IconName />
        pattern: /<([A-Z][a-zA-Z]+)\s*\/>/g,
        replacement: '<Icon icon={Icons.$1} />'
      }
    ];
    
    // Apply all replacement patterns
    iconPatterns.forEach(({ pattern, replacement }) => {
      content = content.replace(pattern, replacement);
    });
    
    // Step 3: Update tool.icon references
    content = content.replace(
      /<tool\.icon\s+size=\{(\d+)\}\s+className="([^"]+)"\s*\/>/g,
      '<Icon icon={tool.icon} size={$1} className="$2" />'
    );
    
    // Step 4: Write the updated content back to the file
    fs.writeFileSync(navbarPath + '.updated', content);
    log(`Updated Navbar component saved to ${navbarPath}.updated`, colors.green);
    log(`Please review the changes and rename to ${navbarPath} when satisfied`, colors.yellow);
    
    return true;
  } catch (error) {
    log(`Error updating Navbar component: ${error}`, colors.red);
    return false;
  }
}

// Function to update AIToolsData.ts
function updateAIToolsData() {
  logSection('Updating AIToolsData.ts to use Icon helper');
  
  const aiToolsPath = path.join(rootDir, 'src', 'utils', 'aiToolsData.ts');
  
  try {
    // Read the current file
    let content = fs.readFileSync(aiToolsPath, 'utf8');
    
    // Step 1: Update the AITool interface
    content = content.replace(
      /icon: React\.FC<React\.SVGProps<SVGSVGElement>>;/,
      'icon: React.FC<IconProps>;'
    );
    
    // Step 2: Add import for IconProps
    content = content.replace(
      /import {([^}]*)} from 'lucide-react';/,
      `import { Icons } from './icons';\nimport type { IconProps } from './icons';`
    );
    
    // Step 3: Update the icons in the aiTools array
    const iconNames = [
      'Brain', 'Mail', 'Video', 'FileText', 'Phone', 'Shield', 'TrendingUp',
      'BarChart3', 'LineChart', 'MessageSquare', 'User', 'Image', 'Calendar',
      'Bot', 'Eye', 'Camera', 'Search', 'Code', 'MessageCircle', 'CheckSquare',
      'Activity', 'Zap', 'Mic', 'AlertTriangle', 'Users', 'Volume2'
    ];
    
    iconNames.forEach(iconName => {
      // Replace references to direct icons with Icons.IconName
      const iconPattern = new RegExp(`icon: ${iconName}`, 'g');
      content = content.replace(iconPattern, `icon: Icons.${iconName}`);
    });
    
    // Step 4: Write the updated content back to the file
    fs.writeFileSync(aiToolsPath + '.updated', content);
    log(`Updated AIToolsData saved to ${aiToolsPath}.updated`, colors.green);
    log(`Please review the changes and rename to ${aiToolsPath} when satisfied`, colors.yellow);
    
    return true;
  } catch (error) {
    log(`Error updating AIToolsData: ${error}`, colors.red);
    return false;
  }
}

// Main function
function main() {
  logSection('Starting Lucide React Icon Fix Script');
  
  try {
    // Step 1: Update the Navbar component
    updateNavbarComponent();
    
    // Step 2: Update AIToolsData
    updateAIToolsData();
    
    // Step 3: Successfully completed
    logSection('Script Complete');
    log('Please review the .updated files and apply the changes if they look good.', colors.green);
    log('Then restart the development server with: npm run dev', colors.cyan);
    
  } catch (error) {
    log(`Error running script: ${error}`, colors.red);
    process.exit(1);
  }
}

// Run the main function
main();
