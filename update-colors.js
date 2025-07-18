const fs = require('fs');

const filePath = '/Users/aj/Projects/001AJPLAYGROUND ME/aj-playground/frontend-playground/src/components/BudgetBalancer.tsx';
let content = fs.readFileSync(filePath, 'utf8');

// Define the color mappings based on your specifications
const colorMappings = [
  // Input and form backgrounds
  {
    old: /bg-white dark:bg-gray-700/g,
    new: 'bg-white dark:bg-[hsl(240,4%,16%)]'
  },
  {
    old: /bg-white dark:bg-gray-600/g,
    new: 'bg-white dark:bg-[hsl(240,4%,16%)]'
  },
  // Text colors
  {
    old: /text-gray-900 dark:text-white/g,
    new: 'text-[hsl(0,0%,4%)] dark:text-[hsl(0,0%,98%)]'
  },
  {
    old: /text-gray-700 dark:text-gray-300/g,
    new: 'text-[hsl(0,0%,4%)] dark:text-[hsl(0,0%,98%)]'
  },
  {
    old: /text-gray-600 dark:text-gray-300/g,
    new: 'text-[hsl(0,0%,4%)] dark:text-[hsl(0,0%,98%)]'
  },
  // Border colors
  {
    old: /border-gray-300 dark:border-gray-600/g,
    new: 'border-[hsl(0,0%,89%)] dark:border-[hsl(240,4%,16%)]'
  },
  {
    old: /border-gray-300 dark:border-gray-500/g,
    new: 'border-[hsl(0,0%,89%)] dark:border-[hsl(240,4%,16%)]'
  },
  // Muted backgrounds
  {
    old: /bg-gray-50 dark:bg-gray-700/g,
    new: 'bg-[hsl(0,0%,96%)] dark:bg-[hsl(240,4%,16%)]'
  },
  {
    old: /bg-gray-100 dark:bg-gray-800/g,
    new: 'bg-[hsl(0,0%,96%)] dark:bg-[hsl(240,4%,16%)]'
  },
  // Button hover states - keep original functional colors but update backgrounds
  {
    old: /bg-blue-500 hover:bg-blue-600/g,
    new: 'bg-[hsl(207,90%,54%)] hover:bg-[hsl(207,90%,48%)]'
  },
  {
    old: /bg-green-500 hover:bg-green-600/g,
    new: 'bg-[hsl(142,71%,45%)] hover:bg-[hsl(142,71%,40%)]'
  },
  {
    old: /bg-red-500 hover:bg-red-600/g,
    new: 'bg-[hsl(0,84%,60%)] hover:bg-[hsl(0,84%,55%)]'
  },
  // Focus ring colors
  {
    old: /focus:ring-blue-500 focus:border-blue-500/g,
    new: 'focus:ring-[hsl(207,90%,54%)] focus:border-[hsl(207,90%,54%)]'
  },
  // Text muted colors
  {
    old: /text-gray-500 dark:text-gray-400/g,
    new: 'text-[hsl(0,0%,60%)] dark:text-[hsl(0,0%,70%)]'
  },
  {
    old: /text-gray-800 dark:text-gray-200/g,
    new: 'text-[hsl(0,0%,4%)] dark:text-[hsl(0,0%,98%)]'
  }
];

// Apply all the color replacements
colorMappings.forEach(mapping => {
  content = content.replace(mapping.old, mapping.new);
});

// Write the updated content back to the file
fs.writeFileSync(filePath, content, 'utf8');
console.log('Color scheme updated successfully!');
