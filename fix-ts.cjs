const fs = require('fs');
const path = require('path');

function getFiles(dir, files = []) {
  const fileList = fs.readdirSync(dir);
  for (const file of fileList) {
    const name = `${dir}/${file}`;
    if (fs.statSync(name).isDirectory()) {
      getFiles(name, files);
    } else {
      if (name.endsWith('.tsx') || name.endsWith('.ts')) {
        files.push(name);
      }
    }
  }
  return files;
}

const files = getFiles('src');

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  // Fix casing for UI components
  content = content.replace(/['"]\.\.\/components\/ui\/Button['"]/g, "'../components/ui/button'");
  content = content.replace(/['"]\.\.\/\.\.\/components\/ui\/button['"]/g, "'../../components/ui/button'");
  content = content.replace(/['"]\.\.\/components\/ui\/Card['"]/g, "'../components/ui/card'");
  content = content.replace(/['"]\.\.\/ui\/button['"]/g, "'../ui/button'");

  // Unused React
  content = content.replace(/import React from 'react';\r?\n/g, '');
  content = content.replace(/import React, {/g, 'import {');
  content = content.replace(/import React from "react";\r?\n/g, '');
  
  // Specific file fixes
  if (file.endsWith('Profile.tsx')) {
    content = content.replace(/\{userData\.age\} yrs • /g, '');
    content = content.replace(/, type UserData/g, '');
    content = content.replace(/Key, /g, '');
  }
  if (file.endsWith('AssessmentWizard.tsx')) {
    content = content.replace(/Utensils, /g, '');
    content = content.replace(/Bike, /g, '');
    content = content.replace(/Footprints, /g, '');
    content = content.replace(/type GoalType/g, '');
  }
  if (file.endsWith('Dashboard.tsx')) {
    content = content.replace(/Activity, /g, '');
    content = content.replace(/Plus, /g, '');
    content = content.replace(/const dietPlan = await fetch/g, 'await fetch'); 
  }
  if (file.endsWith('DietPlan.tsx')) {
    content = content.replace(/, GlassCard/g, '');
    content = content.replace(/<GlassCard/g, '<Card glass');
    content = content.replace(/<\/GlassCard>/g, '</Card>');
  }
  if (file.endsWith('store.tsx')) {
    content = content.replace(/ReactNode/g, 'type ReactNode');
    content = content.replace(/import type ReactNode, {/g, 'import {');
  }

  if (content !== original) {
    fs.writeFileSync(file, content);
  }
}
