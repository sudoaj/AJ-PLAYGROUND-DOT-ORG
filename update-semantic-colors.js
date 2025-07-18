const fs = require('fs');

const filePath = '/Users/aj/Projects/001AJPLAYGROUND ME/aj-playground/frontend-playground/src/components/BudgetBalancer.tsx';
let content = fs.readFileSync(filePath, 'utf8');

// Update semantic colors to use your exact HSL values
const semanticColorMappings = [
  // Blue accents
  {
    old: /text-blue-500/g,
    new: 'text-[hsl(207,90%,54%)]'
  },
  // Green success/money colors
  {
    old: /text-green-500/g,
    new: 'text-[hsl(142,71%,45%)]'
  },
  // Red destructive colors
  {
    old: /text-red-500/g,
    new: 'text-[hsl(0,84%,60%)]'
  },
  {
    old: /hover:text-red-400/g,
    new: 'hover:text-[hsl(0,84%,55%)]'
  },
  // Yellow/warning colors
  {
    old: /text-yellow-500/g,
    new: 'text-[hsl(45,93%,47%)]'
  },
  // Teal colors (keep for variety)
  {
    old: /text-teal-500/g,
    new: 'text-[hsl(174,71%,45%)]'
  }
];

// Apply semantic color replacements
semanticColorMappings.forEach(mapping => {
  content = content.replace(mapping.old, mapping.new);
});

// Write the updated content back to the file
fs.writeFileSync(filePath, content, 'utf8');
console.log('Semantic colors updated successfully!');
