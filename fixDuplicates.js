#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

const PAGES_DIR = path.join(process.cwd(), 'client', 'src', 'pages');

// Files where the "copy" version is more complete and should replace the original
const replacements = [
  {
    original: 'Dashboard.tsx',
    betterVersion: 'Dashboard copy copy.tsx',
    reason: 'Original is just 175 bytes (simple wrapper), copy has full dashboard (35,438 bytes)'
  },
  {
    original: 'ContactDetail.tsx', 
    betterVersion: 'ContactDetail copy.tsx',
    reason: 'Copy version has better store integration and CustomizableAIToolbar'
  },
  {
    original: 'Contacts.tsx',
    betterVersion: 'Contacts copy copy.tsx', 
    reason: 'Copy version is much more complete (40,116 vs 22,128 bytes)'
  },
  {
    original: 'Settings.tsx',
    betterVersion: 'Settings copy.tsx',
    reason: 'Copy version is much more complete (25,877 vs 6,270 bytes)'
  },
  {
    original: 'Tasks.tsx',
    betterVersion: 'Tasks copy copy.tsx',
    reason: 'Copy version is more complete (34,340 vs 33,186 bytes)'
  },
  {
    original: 'Pipeline.tsx',
    betterVersion: 'Pipeline copy copy.tsx',
    reason: 'Copy version is much more complete (34,786 vs 7,053 bytes)'
  }
];

// Files to delete (all remaining copy files)
const filesToDelete = [
  'AITools copy.tsx',
  'AITools copy copy.tsx',
  'Appointments copy.tsx',
  'CircleProspecting copy.tsx',
  'Dashboard copy.tsx', // Keep copy copy, delete this one
  'FAQ copy.tsx',
  'FormPublic copy.tsx',
  'FormsAndSurveys copy.tsx',
  'Invoicing copy.tsx',
  'LeadAutomation copy.tsx',
  'PartnerManagementPage copy.tsx',
  'PhoneSystem copy.tsx',
  'Pipeline copy.tsx', // Keep copy copy, delete this one
  'SalesTools copy.tsx',
  'TaskCalendarView copy.tsx',
  'TextMessages copy.tsx',
  'VideoEmail copy.tsx',
  'Contacts copy.tsx' // Keep copy copy, delete this one
];

console.log('🔄 FIXING DUPLICATE FILES\n');

// Step 1: Replace files where copy version is better
for (const replacement of replacements) {
  const originalPath = path.join(PAGES_DIR, replacement.original);
  const betterPath = path.join(PAGES_DIR, replacement.betterVersion);
  
  if (fs.existsSync(originalPath) && fs.existsSync(betterPath)) {
    console.log(`✅ Replacing ${replacement.original} with ${replacement.betterVersion}`);
    console.log(`   Reason: ${replacement.reason}\n`);
    
    // Backup original first
    const backupPath = `${originalPath}.backup`;
    fs.copyFileSync(originalPath, backupPath);
    
    // Replace original with better version
    fs.copyFileSync(betterPath, originalPath);
    
    // Delete the copy file since it's now the main file
    fs.unlinkSync(betterPath);
  }
}

// Step 2: Delete remaining copy files
console.log('\n🗑️  CLEANING UP REMAINING COPY FILES\n');

for (const fileName of filesToDelete) {
  const filePath = path.join(PAGES_DIR, fileName);
  if (fs.existsSync(filePath)) {
    console.log(`🗑️  Deleting ${fileName}`);
    fs.unlinkSync(filePath);
  }
}

console.log('\n✅ CLEANUP COMPLETE!\n');
console.log('Summary of actions:');
console.log(`- Replaced ${replacements.length} files with their better copy versions`);
console.log(`- Deleted ${filesToDelete.length} duplicate copy files`);
console.log('- Backup files created with .backup extension for replaced files');