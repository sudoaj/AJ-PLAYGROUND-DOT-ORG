
'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Search, 
  Copy, 
  Check, 
  Code, 
  Database, 
  Globe, 
  Terminal,
  Smartphone,
  Cpu,
  ArrowLeft,
  Book,
  Zap,
  Settings
} from 'lucide-react';
import Link from 'next/link';

interface CheatItem {
  title: string;
  description: string;
  code: string;
  category: string;
  tags: string[];
}

interface CheatCategory {
  id: string;
  name: string;
  icon: React.ReactNode;
  items: CheatItem[];
}

export default function DeveloperCheatsheet() {
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedItem, setCopiedItem] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('javascript');

  const cheatData: CheatCategory[] = [
    {
      id: 'javascript',
      name: 'JavaScript',
      icon: <Code className="w-4 h-4" />,
      items: [
        {
          title: 'Array Methods',
          description: 'Common array manipulation methods',
          code: `// Map, Filter, Reduce
const numbers = [1, 2, 3, 4, 5];

// Map - transform each element
const doubled = numbers.map(n => n * 2);

// Filter - select elements
const evens = numbers.filter(n => n % 2 === 0);

// Reduce - accumulate values
const sum = numbers.reduce((acc, n) => acc + n, 0);

// Find - get first match
const found = numbers.find(n => n > 3);

// Some/Every - boolean checks
const hasEven = numbers.some(n => n % 2 === 0);
const allPositive = numbers.every(n => n > 0);`,
          category: 'arrays',
          tags: ['arrays', 'methods', 'functional']
        },
        {
          title: 'Promises & Async/Await',
          description: 'Handling asynchronous operations',
          code: `// Promise syntax
function fetchData() {
  return new Promise((resolve, reject) => {
    setTimeout(() => resolve('Data loaded'), 1000);
  });
}

// Async/Await
async function loadData() {
  try {
    const data = await fetchData();
    console.log(data);
  } catch (error) {
    console.error('Error:', error);
  }
}

// Promise.all for parallel execution
const promises = [fetch('/api/1'), fetch('/api/2')];
const results = await Promise.all(promises);

// Promise.allSettled for error handling
const settled = await Promise.allSettled(promises);`,
          category: 'async',
          tags: ['promises', 'async', 'await', 'fetch']
        },
        {
          title: 'Destructuring',
          description: 'Extract values from arrays and objects',
          code: `// Object destructuring
const user = { name: 'John', age: 30, city: 'NYC' };
const { name, age, ...rest } = user;

// Array destructuring
const [first, second, ...others] = [1, 2, 3, 4, 5];

// Function parameter destructuring
function greet({ name, age }) {
  return \`Hello \${name}, you are \${age} years old\`;
}

// Nested destructuring
const data = { user: { profile: { email: 'test@example.com' }}};
const { user: { profile: { email }}} = data;

// Default values
const { country = 'USA' } = user;`,
          category: 'syntax',
          tags: ['destructuring', 'objects', 'arrays', 'es6']
        },
        {
          title: 'ES6+ Features',
          description: 'Modern JavaScript features',
          code: `// Template literals
const message = \`Hello \${name}, today is \${new Date().toDateString()}\`;

// Arrow functions
const add = (a, b) => a + b;
const square = x => x * x;

// Spread operator
const arr1 = [1, 2, 3];
const arr2 = [...arr1, 4, 5];
const merged = { ...obj1, ...obj2 };

// Optional chaining
const email = user?.profile?.email;

// Nullish coalescing
const username = user.name ?? 'Anonymous';

// Classes
class Person {
  constructor(name) {
    this.name = name;
  }
  
  greet() {
    return \`Hello, I'm \${this.name}\`;
  }
}`,
          category: 'modern',
          tags: ['es6', 'arrow-functions', 'classes', 'spread', 'optional-chaining']
        }
      ]
    },
    {
      id: 'react',
      name: 'React',
      icon: <Globe className="w-4 h-4" />,
      items: [
        {
          title: 'Component Patterns',
          description: 'Common React component structures',
          code: `// Functional Component with Hooks
import { useState, useEffect } from 'react';

function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      try {
        const response = await fetch(\`/api/users/\${userId}\`);
        const userData = await response.json();
        setUser(userData);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, [userId]);

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>User not found</div>;

  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
    </div>
  );
}`,
          category: 'components',
          tags: ['components', 'hooks', 'usestate', 'useeffect']
        },
        {
          title: 'Custom Hooks',
          description: 'Reusable stateful logic',
          code: `// Custom hook for API calls
function useApi(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const response = await fetch(url);
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [url]);

  return { data, loading, error };
}

// Usage
function UserList() {
  const { data: users, loading, error } = useApi('/api/users');

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <ul>
      {users.map(user => <li key={user.id}>{user.name}</li>)}
    </ul>
  );
}`,
          category: 'hooks',
          tags: ['custom-hooks', 'api', 'reusable', 'state']
        },
        {
          title: 'Context API',
          description: 'State management with Context',
          code: `// Create Context
const ThemeContext = createContext();

// Provider Component
function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Custom hook for using context
function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}

// Using the context
function Header() {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <header className={\`header \${theme}\`}>
      <button onClick={toggleTheme}>
        Switch to {theme === 'light' ? 'dark' : 'light'} mode
      </button>
    </header>
  );
}`,
          category: 'state',
          tags: ['context', 'state-management', 'provider', 'global-state']
        }
      ]
    },
    {
      id: 'css',
      name: 'CSS',
      icon: <Settings className="w-4 h-4" />,
      items: [
        {
          title: 'Flexbox',
          description: 'Flexible box layout properties',
          code: `/* Container properties */
.flex-container {
  display: flex;
  flex-direction: row; /* row, column, row-reverse, column-reverse */
  justify-content: center; /* flex-start, flex-end, center, space-between, space-around, space-evenly */
  align-items: center; /* flex-start, flex-end, center, stretch, baseline */
  flex-wrap: wrap; /* nowrap, wrap, wrap-reverse */
  gap: 1rem; /* shorthand for row-gap and column-gap */
}

/* Item properties */
.flex-item {
  flex: 1; /* shorthand for flex-grow, flex-shrink, flex-basis */
  flex-grow: 1; /* how much to grow */
  flex-shrink: 1; /* how much to shrink */
  flex-basis: auto; /* initial size */
  align-self: center; /* override container's align-items */
}

/* Common patterns */
.center-all {
  display: flex;
  justify-content: center;
  align-items: center;
}

.space-between {
  display: flex;
  justify-content: space-between;
  align-items: center;
}`,
          category: 'layout',
          tags: ['flexbox', 'layout', 'responsive', 'alignment']
        },
        {
          title: 'Grid Layout',
          description: 'CSS Grid for 2D layouts',
          code: `/* Basic grid setup */
.grid-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* 3 equal columns */
  grid-template-rows: auto 1fr auto; /* header, main, footer */
  grid-gap: 1rem; /* gap between items */
  height: 100vh;
}

/* Named grid areas */
.layout-grid {
  display: grid;
  grid-template-areas:
    "header header header"
    "sidebar main main"
    "footer footer footer";
  grid-template-columns: 200px 1fr;
  grid-template-rows: auto 1fr auto;
}

.header { grid-area: header; }
.sidebar { grid-area: sidebar; }
.main { grid-area: main; }
.footer { grid-area: footer; }

/* Responsive grid */
.responsive-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

/* Grid item positioning */
.item {
  grid-column: 1 / 3; /* span columns 1-2 */
  grid-row: 2 / 4; /* span rows 2-3 */
}`,
          category: 'layout',
          tags: ['grid', 'layout', '2d', 'responsive', 'areas']
        },
        {
          title: 'Animations & Transitions',
          description: 'CSS animations and transitions',
          code: `/* Transitions */
.button {
  background-color: blue;
  transition: all 0.3s ease-in-out;
}

.button:hover {
  background-color: darkblue;
  transform: scale(1.05);
}

/* Keyframe animations */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-in {
  animation: fadeIn 0.5s ease-out;
}

/* Loading spinner */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.spinner {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
}

/* Hover effects */
.card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0,0,0,0.1);
}`,
          category: 'animations',
          tags: ['animations', 'transitions', 'keyframes', 'hover', 'effects']
        }
      ]
    },
    {
      id: 'python',
      name: 'Python',
      icon: <Cpu className="w-4 h-4" />,
      items: [
        {
          title: 'List Comprehensions',
          description: 'Pythonic way to create lists',
          code: `# Basic list comprehension
numbers = [1, 2, 3, 4, 5]
squares = [x**2 for x in numbers]

# With condition
evens = [x for x in numbers if x % 2 == 0]

# Nested comprehension
matrix = [[i*j for j in range(3)] for i in range(3)]

# Dictionary comprehension
word_lengths = {word: len(word) for word in ['hello', 'world', 'python']}

# Set comprehension
unique_squares = {x**2 for x in numbers}

# Generator expression (memory efficient)
squares_gen = (x**2 for x in range(1000000))

# Complex example with multiple conditions
filtered_data = [
    x.upper() 
    for x in strings 
    if len(x) > 3 and x.startswith('a')
]

# Flattening nested lists
nested = [[1, 2], [3, 4], [5, 6]]
flattened = [item for sublist in nested for item in sublist]`,
          category: 'syntax',
          tags: ['comprehensions', 'lists', 'pythonic', 'functional']
        },
        {
          title: 'Decorators',
          description: 'Function and class decorators',
          code: `# Simple decorator
def timer(func):
    import time
    def wrapper(*args, **kwargs):
        start = time.time()
        result = func(*args, **kwargs)
        end = time.time()
        print(f"{func.__name__} took {end - start:.2f} seconds")
        return result
    return wrapper

@timer
def slow_function():
    time.sleep(1)
    return "Done"

# Decorator with parameters
def repeat(times):
    def decorator(func):
        def wrapper(*args, **kwargs):
            for _ in range(times):
                result = func(*args, **kwargs)
            return result
        return wrapper
    return decorator

@repeat(3)
def greet(name):
    print(f"Hello, {name}!")

# Class decorator
def add_method(cls):
    def new_method(self):
        return "Added method"
    cls.new_method = new_method
    return cls

@add_method
class MyClass:
    pass

# Property decorator
class Circle:
    def __init__(self, radius):
        self._radius = radius
    
    @property
    def radius(self):
        return self._radius
    
    @radius.setter
    def radius(self, value):
        if value < 0:
            raise ValueError("Radius cannot be negative")
        self._radius = value
    
    @property
    def area(self):
        return 3.14159 * self._radius ** 2`,
          category: 'advanced',
          tags: ['decorators', 'functions', 'classes', 'metaprogramming']
        },
        {
          title: 'Context Managers',
          description: 'Managing resources with with statements',
          code: `# Built-in context managers
with open('file.txt', 'r') as f:
    content = f.read()
# File automatically closed

# Custom context manager (class-based)
class DatabaseConnection:
    def __enter__(self):
        self.connection = create_connection()
        return self.connection
    
    def __exit__(self, exc_type, exc_val, exc_tb):
        self.connection.close()
        if exc_type is not None:
            print(f"Exception occurred: {exc_val}")
        return False  # Don't suppress exceptions

# Usage
with DatabaseConnection() as db:
    db.execute("SELECT * FROM users")

# Context manager using contextlib
from contextlib import contextmanager

@contextmanager
def temporary_setting(setting, value):
    old_value = get_setting(setting)
    set_setting(setting, value)
    try:
        yield
    finally:
        set_setting(setting, old_value)

# Usage
with temporary_setting('debug', True):
    # Code runs with debug=True
    pass
# debug setting restored

# Multiple context managers
with open('input.txt') as infile, open('output.txt', 'w') as outfile:
    outfile.write(infile.read().upper())`,
          category: 'advanced',
          tags: ['context-managers', 'resources', 'with', 'cleanup']
        }
      ]
    },
    {
      id: 'sql',
      name: 'SQL',
      icon: <Database className="w-4 h-4" />,
      items: [
        {
          title: 'Query Basics',
          description: 'Essential SQL query patterns',
          code: `-- Basic SELECT
SELECT column1, column2 FROM table_name;
SELECT * FROM users WHERE age > 25;

-- Filtering and sorting
SELECT name, email FROM users 
WHERE age BETWEEN 18 AND 65 
AND city IN ('New York', 'London', 'Tokyo')
ORDER BY name ASC, age DESC
LIMIT 10 OFFSET 20;

-- Aggregations
SELECT 
    department,
    COUNT(*) as employee_count,
    AVG(salary) as avg_salary,
    MAX(salary) as max_salary,
    MIN(salary) as min_salary
FROM employees 
GROUP BY department
HAVING COUNT(*) > 5;

-- CASE statements
SELECT 
    name,
    salary,
    CASE 
        WHEN salary > 100000 THEN 'High'
        WHEN salary > 50000 THEN 'Medium'
        ELSE 'Low'
    END as salary_category
FROM employees;`,
          category: 'basics',
          tags: ['select', 'where', 'group-by', 'aggregate', 'case']
        },
        {
          title: 'Joins',
          description: 'Combining data from multiple tables',
          code: `-- INNER JOIN (only matching records)
SELECT u.name, p.title, p.created_at
FROM users u
INNER JOIN posts p ON u.id = p.user_id;

-- LEFT JOIN (all records from left table)
SELECT u.name, COUNT(p.id) as post_count
FROM users u
LEFT JOIN posts p ON u.id = p.user_id
GROUP BY u.id, u.name;

-- RIGHT JOIN (all records from right table)
SELECT u.name, p.title
FROM users u
RIGHT JOIN posts p ON u.id = p.user_id;

-- FULL OUTER JOIN (all records from both tables)
SELECT u.name, p.title
FROM users u
FULL OUTER JOIN posts p ON u.id = p.user_id;

-- Self JOIN (table joined with itself)
SELECT 
    e1.name as employee,
    e2.name as manager
FROM employees e1
LEFT JOIN employees e2 ON e1.manager_id = e2.id;

-- Multiple JOINs
SELECT 
    u.name,
    p.title,
    c.content
FROM users u
JOIN posts p ON u.id = p.user_id
JOIN comments c ON p.id = c.post_id
WHERE u.active = true;`,
          category: 'joins',
          tags: ['joins', 'inner', 'left', 'right', 'outer', 'relationships']
        },
        {
          title: 'Advanced Queries',
          description: 'Complex SQL operations',
          code: `-- Subqueries
SELECT name FROM users 
WHERE id IN (
    SELECT user_id FROM orders 
    WHERE total > 1000
);

-- Correlated subquery
SELECT name FROM users u
WHERE EXISTS (
    SELECT 1 FROM orders o 
    WHERE o.user_id = u.id AND o.status = 'completed'
);

-- Window functions
SELECT 
    name,
    salary,
    ROW_NUMBER() OVER (ORDER BY salary DESC) as rank,
    RANK() OVER (PARTITION BY department ORDER BY salary DESC) as dept_rank,
    LAG(salary) OVER (ORDER BY salary) as prev_salary,
    LEAD(salary) OVER (ORDER BY salary) as next_salary
FROM employees;

-- Common Table Expressions (CTE)
WITH high_earners AS (
    SELECT * FROM employees WHERE salary > 80000
),
department_stats AS (
    SELECT 
        department,
        AVG(salary) as avg_salary
    FROM high_earners
    GROUP BY department
)
SELECT * FROM department_stats WHERE avg_salary > 90000;

-- Recursive CTE (for hierarchical data)
WITH RECURSIVE employee_hierarchy AS (
    SELECT id, name, manager_id, 1 as level
    FROM employees WHERE manager_id IS NULL
    
    UNION ALL
    
    SELECT e.id, e.name, e.manager_id, eh.level + 1
    FROM employees e
    JOIN employee_hierarchy eh ON e.manager_id = eh.id
)
SELECT * FROM employee_hierarchy;`,
          category: 'advanced',
          tags: ['subqueries', 'window-functions', 'cte', 'recursive', 'analytical']
        }
      ]
    },
    {
      id: 'git',
      name: 'Git',
      icon: <Terminal className="w-4 h-4" />,
      items: [
        {
          title: 'Basic Commands',
          description: 'Essential Git operations',
          code: `# Initialize repository
git init
git clone https://github.com/user/repo.git

# Check status and add files
git status
git add .                    # Add all files
git add filename.txt         # Add specific file
git add *.js                # Add all JS files

# Commit changes
git commit -m "Add new feature"
git commit -am "Add and commit in one step"

# View history
git log
git log --oneline           # Condensed view
git log --graph --oneline   # Visual branch history

# Push and pull
git push origin main
git pull origin main
git fetch origin           # Download without merging

# Remote management
git remote -v              # List remotes
git remote add origin url  # Add remote
git remote remove origin   # Remove remote`,
          category: 'basics',
          tags: ['git', 'init', 'commit', 'push', 'pull', 'remote']
        },
        {
          title: 'Branching & Merging',
          description: 'Working with branches',
          code: `# Branch operations
git branch                 # List branches
git branch feature-name    # Create branch
git checkout feature-name  # Switch to branch
git checkout -b new-branch # Create and switch
git switch main           # Modern way to switch
git switch -c new-branch  # Create and switch (modern)

# Merging
git checkout main
git merge feature-branch   # Merge feature into main
git merge --no-ff feature  # Force merge commit

# Delete branches
git branch -d feature-name    # Delete merged branch
git branch -D feature-name    # Force delete
git push origin --delete branch-name  # Delete remote branch

# Rebase (alternative to merge)
git checkout feature
git rebase main           # Replay commits on top of main
git rebase -i HEAD~3      # Interactive rebase last 3 commits

# Stash changes
git stash                 # Save current changes
git stash pop            # Apply and remove stash
git stash list           # List all stashes
git stash apply stash@{0} # Apply specific stash`,
          category: 'branching',
          tags: ['branches', 'merge', 'rebase', 'stash', 'workflow']
        },
        {
          title: 'Undoing Changes',
          description: 'Fixing mistakes in Git',
          code: `# Unstage files
git reset HEAD filename    # Unstage specific file
git reset HEAD~1          # Undo last commit (keep changes)
git reset --hard HEAD~1   # Undo last commit (lose changes)

# Revert commits (safe way)
git revert HEAD           # Create new commit that undoes last commit
git revert commit-hash    # Revert specific commit

# Amend last commit
git commit --amend -m "New message"  # Change commit message
git add forgotten-file
git commit --amend --no-edit         # Add file to last commit

# Discard changes
git checkout -- filename    # Discard file changes
git checkout .              # Discard all changes
git clean -fd              # Remove untracked files and directories

# Reset to specific commit
git reset --soft commit-hash   # Keep changes staged
git reset --mixed commit-hash  # Keep changes unstaged
git reset --hard commit-hash   # Lose all changes

# Restore (modern Git)
git restore filename        # Discard file changes
git restore --staged file   # Unstage file
git restore --source=HEAD~1 file  # Restore from specific commit`,
          category: 'fixes',
          tags: ['reset', 'revert', 'amend', 'restore', 'undo', 'mistakes']
        }
      ]
    },
    {
      id: 'bash',
      name: 'Bash/Shell',
      icon: <Terminal className="w-4 h-4" />,
      items: [
        {
          title: 'File Operations',
          description: 'Working with files and directories',
          code: `# Navigation
pwd                    # Print working directory
ls -la                # List files with details
cd /path/to/directory # Change directory
cd ..                 # Go up one directory
cd ~                  # Go to home directory

# File operations
touch filename.txt    # Create empty file
mkdir directory       # Create directory
mkdir -p path/to/dir  # Create nested directories
cp file1 file2        # Copy file
cp -r dir1 dir2       # Copy directory recursively
mv oldname newname    # Move/rename
rm filename          # Delete file
rm -rf directory     # Delete directory recursively
rmdir empty_dir      # Delete empty directory

# File content
cat filename         # Display file content
less filename        # View file page by page
head -n 10 file     # First 10 lines
tail -n 10 file     # Last 10 lines
tail -f log.txt     # Follow file changes (logs)
wc -l filename      # Count lines
grep "pattern" file # Search in file
find . -name "*.txt" # Find files by pattern`,
          category: 'files',
          tags: ['files', 'directories', 'navigation', 'search', 'content']
        },
        {
          title: 'Text Processing',
          description: 'Manipulating text and data',
          code: `# Grep (search)
grep "pattern" file.txt
grep -i "pattern" file.txt      # Case insensitive
grep -r "pattern" directory/    # Recursive search
grep -n "pattern" file.txt      # Show line numbers
grep -v "pattern" file.txt      # Invert match (exclude)

# Sed (stream editor)
sed 's/old/new/g' file.txt      # Replace all occurrences
sed 's/old/new/' file.txt       # Replace first occurrence per line
sed -i 's/old/new/g' file.txt   # Edit file in place
sed '1,5d' file.txt            # Delete lines 1-5
sed -n '10,20p' file.txt       # Print lines 10-20

# Awk (pattern scanning)
awk '{print $1}' file.txt       # Print first column
awk '{print $NF}' file.txt      # Print last column
awk '{sum+=$1} END {print sum}' # Sum first column
awk '/pattern/ {print}' file    # Print lines matching pattern

# Sort and unique
sort file.txt                   # Sort lines
sort -n numbers.txt            # Numeric sort
sort -r file.txt               # Reverse sort
uniq file.txt                  # Remove duplicate lines
sort file.txt | uniq -c        # Count occurrences`,
          category: 'text',
          tags: ['grep', 'sed', 'awk', 'sort', 'text-processing', 'regex']
        },
        {
          title: 'System & Processes',
          description: 'System monitoring and process management',
          code: `# Process management
ps aux                 # List all processes
ps aux | grep nginx    # Find specific process
top                    # Real-time process viewer
htop                   # Enhanced process viewer
kill PID              # Terminate process by ID
kill -9 PID           # Force kill process
killall process_name  # Kill all processes by name
jobs                  # List background jobs
fg %1                 # Bring job to foreground
bg %1                 # Send job to background
nohup command &       # Run command immune to hangups

# System information
uname -a              # System information
df -h                 # Disk usage
du -sh directory/     # Directory size
free -h               # Memory usage
uptime                # System uptime
whoami                # Current user
id                    # User and group IDs
which command         # Find command location
history               # Command history

# Network
ping google.com       # Test connectivity
wget url              # Download file
curl -O url           # Download with curl
netstat -tulpn        # Show network connections
ss -tulpn             # Modern netstat alternative`,
          category: 'system',
          tags: ['processes', 'system', 'monitoring', 'network', 'performance']
        }
      ]
    }
  ];

  const filteredItems = useMemo(() => {
    if (!searchTerm) return cheatData;
    
    return cheatData.map(category => ({
      ...category,
      items: category.items.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
        item.code.toLowerCase().includes(searchTerm.toLowerCase())
      )
    })).filter(category => category.items.length > 0);
  }, [searchTerm]);

  const copyToClipboard = async (code: string, title: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedItem(title);
      setTimeout(() => setCopiedItem(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const allItems = cheatData.flatMap(category => 
    category.items.map(item => ({ ...item, categoryName: category.name }))
  );

  const searchResults = useMemo(() => {
    if (!searchTerm) return [];
    
    return allItems.filter(item =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
      item.code.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, allItems]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-background to-purple-50 dark:from-blue-950/20 dark:via-background dark:to-purple-950/20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <Link href="/playground" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Back to Playground
            </Link>
            <Badge variant="secondary" className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
              <Book className="w-3 h-3 mr-1" />
              Reference
            </Badge>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Developer Cheatsheet
          </h1>
          <p className="text-muted-foreground text-lg">
            Quick reference guide for developers with searchable syntax, code snippets, and examples
          </p>
        </div>

        {/* Search */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search syntax, functions, or concepts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 text-base"
              />
            </div>
            {searchTerm && (
              <div className="mt-4">
                <p className="text-sm text-muted-foreground">
                  Found {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} for "{searchTerm}"
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Search Results */}
        {searchTerm && searchResults.length > 0 && (
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Search Results
            </h2>
            <div className="grid gap-4">
              {searchResults.map((item, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{item.title}</CardTitle>
                        <CardDescription className="flex items-center gap-2 mt-1">
                          {item.description}
                          <Badge variant="outline" className="text-xs">
                            {item.categoryName}
                          </Badge>
                        </CardDescription>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(item.code, item.title)}
                        className="shrink-0"
                      >
                        {copiedItem === item.title ? (
                          <Check className="w-4 h-4" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {item.tags.map(tag => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                      <code>{item.code}</code>
                    </pre>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Categories */}
        {!searchTerm && (
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="space-y-6">
            <TabsList className="grid grid-cols-3 lg:grid-cols-6 w-full">
              {cheatData.map(category => (
                <TabsTrigger key={category.id} value={category.id} className="flex items-center gap-2">
                  {category.icon}
                  <span className="hidden sm:inline">{category.name}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            {cheatData.map(category => (
              <TabsContent key={category.id} value={category.id}>
                <div className="grid gap-6">
                  <div className="flex items-center gap-3 mb-4">
                    {category.icon}
                    <h2 className="text-2xl font-bold">{category.name}</h2>
                    <Badge variant="outline">{category.items.length} snippets</Badge>
                  </div>
                  
                  <div className="grid gap-4">
                    {category.items.map((item, index) => (
                      <Card key={index} className="hover:shadow-md transition-shadow">
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <div>
                              <CardTitle className="text-lg">{item.title}</CardTitle>
                              <CardDescription>{item.description}</CardDescription>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => copyToClipboard(item.code, item.title)}
                              className="shrink-0"
                            >
                              {copiedItem === item.title ? (
                                <Check className="w-4 h-4" />
                              ) : (
                                <Copy className="w-4 h-4" />
                              )}
                            </Button>
                          </div>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {item.tags.map(tag => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </CardHeader>
                        <CardContent>
                          <ScrollArea className="h-auto max-h-96">
                            <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                              <code>{item.code}</code>
                            </pre>
                          </ScrollArea>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        )}

        {/* No results */}
        {searchTerm && searchResults.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No results found</h3>
              <p className="text-muted-foreground">
                Try searching for different keywords or browse the categories above.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Footer */}
        <Card className="mt-12">
          <CardContent className="pt-6 text-center">
            <div className="space-y-2">
              <h3 className="font-semibold">Need more references?</h3>
              <p className="text-sm text-muted-foreground">
                This cheatsheet covers essential syntax and patterns for web development.
                Bookmark this page for quick access to commonly used code snippets.
              </p>
              <div className="flex justify-center gap-4 mt-4">
                <Button variant="outline" asChild>
                  <Link href="/playground">
                    Explore More Tools
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
