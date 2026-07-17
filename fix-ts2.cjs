const fs = require('fs');

const prependReact = (file) => {
  let content = fs.readFileSync(file, 'utf8');
  if (!content.includes("import * as React")) {
    content = "import * as React from 'react';\n" + content;
    fs.writeFileSync(file, content);
  }
}

prependReact('src/components/ui/button.tsx');
prependReact('src/components/ui/card.tsx');
prependReact('src/components/ui/input.tsx');
prependReact('src/pages/AILoadingScreen.tsx');

let aw = fs.readFileSync('src/pages/AssessmentWizard.tsx', 'utf8');
aw = aw.replace(/Footprints, /g, '');
fs.writeFileSync('src/pages/AssessmentWizard.tsx', aw);

let dash = fs.readFileSync('src/pages/Dashboard.tsx', 'utf8');
dash = dash.replace(/const dietPlan = await fetch/g, 'await fetch'); // already did this but maybe failed? let's do const { dietPlan } or similar.
fs.writeFileSync('src/pages/Dashboard.tsx', dash);
