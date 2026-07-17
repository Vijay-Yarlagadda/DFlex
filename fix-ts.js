const fs = require('fs');

const fixFile = (path, replacements) => {
  if (!fs.existsSync(path)) return;
  let content = fs.readFileSync(path, 'utf8');
  for (const {from, to} of replacements) {
    content = content.replace(from, to);
  }
  fs.writeFileSync(path, content);
};

// Landing.tsx
fixFile('src/pages/Landing.tsx', [
  {from: /import React from 'react';\r?\n/, to: ''},
  {from: /import React, {[^}]+} from 'react';\r?\n/, to: (m) => m.replace('React, ', '')}
]);

// LandingPage.tsx
fixFile('src/pages/LandingPage.tsx', [
  {from: /import React from 'react';\r?\n/, to: ''},
  {from: /import React, {[^}]+} from 'react';\r?\n/, to: (m) => m.replace('React, ', '')},
  {from: /'\.\.\/components\/ui\/Button'/g, to: "'../components/ui/button'"}
]);

// Profile.tsx
fixFile('src/pages/Profile.tsx', [
  {from: /import React, { useState } from 'react';/, to: "import { useState } from 'react';"},
  {from: /import { useAppStore, type GoalType, type UserData } from '\.\.\/lib\/store';/, to: "import { useAppStore, type GoalType } from '../lib/store';"},
  {from: /'\.\.\/components\/ui\/Button'/g, to: "'../components/ui/button'"},
  {from: /'\.\.\/components\/ui\/Card'/g, to: "'../components/ui/card'"},
  {from: /import { User, Target, Scale, LogOut, Key, Settings2 } from 'lucide-react';/, to: "import { User, Target, Scale, LogOut, Settings2 } from 'lucide-react';"},
  {from: /\{userData\.age\} yrs • /g, to: ""} 
]);

// Progress.tsx
fixFile('src/pages/Progress.tsx', [
  {from: /import React from 'react';\r?\n/, to: ''},
  {from: /import React, {[^}]+} from 'react';\r?\n/, to: (m) => m.replace('React, ', '')},
  {from: /'\.\.\/components\/ui\/Card'/g, to: "'../components/ui/card'"}
]);

// WaterTracker.tsx
fixFile('src/pages/WaterTracker.tsx', [
  {from: /import React, {[^}]+} from 'react';\r?\n/, to: (m) => m.replace('React, ', '')},
  {from: /import React from 'react';\r?\n/, to: ''},
  {from: /'\.\.\/components\/ui\/Button'/g, to: "'../components/ui/button'"}
]);

// DietPlan.tsx
fixFile('src/pages/DietPlan.tsx', [
  {from: /import React from 'react';\r?\n/, to: ''},
  {from: /import React, {[^}]+} from 'react';\r?\n/, to: (m) => m.replace('React, ', '')},
  {from: /import { Card, GlassCard } from '\.\.\/components\/ui\/card';/, to: "import { Card } from '../components/ui/card';"},
  {from: /<GlassCard/g, to: "<Card glass"},
  {from: /<\/GlassCard>/g, to: "</Card>"}
]);
