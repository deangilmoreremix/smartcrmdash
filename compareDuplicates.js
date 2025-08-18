#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

const PAGES_DIR = path.join(process.cwd(), 'client', 'src', 'pages');

// Pairs of files to compare (original vs copies)
const comparisons = [
  {
    name: 'AITools',
    files: ['AITools.tsx', 'AITools copy.tsx', 'AITools copy copy.tsx']
  },
  {
    name: 'Appointments', 
    files: ['Appointments.tsx', 'Appointments copy.tsx']
  },
  {
    name: 'CircleProspecting',
    files: ['CircleProspecting.tsx', 'CircleProspecting copy.tsx']
  },
  {
    name: 'ContactDetail',
    files: ['ContactDetail.tsx', 'ContactDetail copy.tsx'] 
  },
  {
    name: 'Contacts',
    files: ['Contacts.tsx', 'Contacts copy.tsx', 'Contacts copy copy.tsx']
  },
  {
    name: 'Dashboard',
    files: ['Dashboard.tsx', 'Dashboard copy.tsx', 'Dashboard copy copy.tsx']
  },
  {
    name: 'FAQ',
    files: ['FAQ.tsx', 'FAQ copy.tsx']
  },
  {
    name: 'FormPublic',
    files: ['FormPublic.tsx', 'FormPublic copy.tsx']
  },
  {
    name: 'FormsAndSurveys',
    files: ['FormsAndSurveys.tsx', 'FormsAndSurveys copy.tsx']
  },
  {
    name: 'Invoicing',
    files: ['Invoicing.tsx', 'Invoicing copy.tsx']
  },
  {
    name: 'LeadAutomation',
    files: ['LeadAutomation.tsx', 'LeadAutomation copy.tsx']
  },
  {
    name: 'PartnerManagementPage',
    files: ['PartnerManagementPage.tsx', 'PartnerManagementPage copy.tsx']
  },
  {
    name: 'PhoneSystem',
    files: ['PhoneSystem.tsx', 'PhoneSystem copy.tsx']
  },
  {
    name: 'Pipeline',
    files: ['Pipeline.tsx', 'Pipeline copy.tsx', 'Pipeline copy copy.tsx']
  },
  {
    name: 'SalesTools',
    files: ['SalesTools.tsx', 'SalesTools copy.tsx']
  },
  {
    name: 'Settings',
    files: ['Settings.tsx', 'Settings copy.tsx']
  },
  {
    name: 'TaskCalendarView',
    files: ['TaskCalendarView.tsx', 'TaskCalendarView copy.tsx']
  },
  {
    name: 'Tasks',
    files: ['Tasks.tsx', 'Tasks copy.tsx', 'Tasks copy copy.tsx']
  },
  {
    name: 'TextMessages',
    files: ['TextMessages.tsx', 'TextMessages copy.tsx']
  },
  {
    name: 'VideoEmail',
    files: ['VideoEmail.tsx', 'VideoEmail copy.tsx']
  }
];

function getFileStats(filePath) {
  try {
    const stats = fs.statSync(filePath);
    const content = fs.readFileSync(filePath, 'utf-8');
    return {
      exists: true,
      size: stats.size,
      lines: content.split('\n').length,
      modifiedTime: stats.mtime,
      preview: content.substring(0, 500) + (content.length > 500 ? '...' : '')
    };
  } catch (error) {
    return {
      exists: false,
      error: error.message
    };
  }
}

function extractKeyInfo(content) {
  const lines = content.split('\n').slice(0, 50); // First 50 lines
  const imports = lines.filter(line => line.trim().startsWith('import'));
  const components = lines.filter(line => line.includes('const ') && line.includes('React.FC'));
  const functions = lines.filter(line => line.trim().startsWith('const ') && line.includes('=>'));
  
  return {
    importCount: imports.length,
    mainImports: imports.slice(0, 5).map(imp => imp.trim()),
    componentName: components[0]?.trim() || 'Not found',
    functionCount: functions.length
  };
}

console.log('🔍 DUPLICATE FILES COMPARISON\n');
console.log('==========================================\n');

for (const comparison of comparisons) {
  console.log(`📄 ${comparison.name}`);
  console.log('─'.repeat(40));
  
  for (let i = 0; i < comparison.files.length; i++) {
    const fileName = comparison.files[i];
    const filePath = path.join(PAGES_DIR, fileName);
    const stats = getFileStats(filePath);
    
    if (stats.exists) {
      const keyInfo = extractKeyInfo(stats.preview);
      const isOriginal = !fileName.includes('copy');
      const status = isOriginal ? '🟢 ORIGINAL' : '🔵 COPY';
      
      console.log(`\n${status} ${fileName}`);
      console.log(`   Size: ${stats.size} bytes | Lines: ${stats.lines} | Modified: ${stats.modifiedTime.toISOString().slice(0, 19)}`);
      console.log(`   Imports: ${keyInfo.importCount} | Functions: ${keyInfo.functionCount}`);
      console.log(`   Component: ${keyInfo.componentName}`);
      
      if (keyInfo.mainImports.length > 0) {
        console.log(`   Key imports:`);
        keyInfo.mainImports.forEach(imp => {
          console.log(`     ${imp}`);
        });
      }
      
      // Show first few lines of actual content
      const contentLines = stats.preview.split('\n').slice(0, 10);
      console.log(`   Preview:`);
      contentLines.forEach((line, idx) => {
        if (line.trim()) {
          console.log(`     ${idx + 1}: ${line.trim()}`);
        }
      });
    } else {
      console.log(`\n❌ ${fileName} - File not found`);
    }
  }
  
  console.log('\n' + '='.repeat(50) + '\n');
}

console.log('SUMMARY:');
console.log(`Found ${comparisons.length} groups of duplicate files.`);
console.log('Please review each group and decide which version to keep.');
console.log('Look for differences in:');
console.log('- File size and line count');
console.log('- Number of imports and complexity');
console.log('- Component structure and functionality');
console.log('- Recent modifications');