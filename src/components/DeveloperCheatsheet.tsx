
'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
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
  Settings,
  Eye
} from 'lucide-react';
import Link from 'next/link';

interface CheatItem {
  command: string;
  description: string;
  example?: string;
  scenario: string;
}

interface CheatCategory {
  name: string;
  entries: CheatItem[];
}

interface CheatSheet {
  title: string;
  categories: CheatCategory[];
}

interface CheatData {
  [key: string]: CheatSheet;
}

export default function DeveloperCheatsheet() {
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedItem, setCopiedItem] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('allCommands');
  const [selectedCommand, setSelectedCommand] = useState<CheatItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const originalCheatData: CheatData = {
    git: {
      title: "Git",
      categories: [
        {
          name: "Setup & Configuration",
          entries: [
            { 
              command: "git config --global user.name \"[name]\"", 
              description: "Set your username globally for all repositories.", 
              example: "git config --global user.name \"Your Name\"", 
              scenario: "First-time Git setup on a new machine." 
            },
            { 
              command: "git config --global user.email \"[email]\"", 
              description: "Set your email globally for all repositories.", 
              example: "git config --global user.email \"youremail@example.com\"", 
              scenario: "First-time Git setup on a new machine." 
            },
            { 
              command: "git config --list", 
              description: "List all Git configurations.", 
              example: "git config --list", 
              scenario: "Verifying current Git settings." 
            },
          ]
        },
        {
          name: "Basic Commands",
          entries: [
            { 
              command: "git init", 
              description: "Initialize a new Git repository.", 
              example: "git init my-project", 
              scenario: "Starting a new project from scratch." 
            },
            { 
              command: "git clone [url]", 
              description: "Clone an existing repository.", 
              example: "git clone https://github.com/user/repo.git", 
              scenario: "Getting a copy of an existing project." 
            },
            { 
              command: "git status", 
              description: "Show the working tree status.", 
              example: "git status", 
              scenario: "Checking what changes are ready to be committed." 
            },
            { 
              command: "git add [file]", 
              description: "Add file contents to the staging area.", 
              example: "git add index.html", 
              scenario: "Preparing a specific file for commit." 
            },
            { 
              command: "git commit -m \"[message]\"", 
              description: "Record changes with a descriptive message.", 
              example: "git commit -m \"Add initial project structure\"", 
              scenario: "Saving your staged changes." 
            },
            { 
              command: "git push origin [branch]", 
              description: "Upload local repository content to remote.", 
              example: "git push origin main", 
              scenario: "Sharing your commits with the remote repository." 
            },
            { 
              command: "git pull origin [branch]", 
              description: "Fetch and merge changes from remote.", 
              example: "git pull origin main", 
              scenario: "Updating your local branch with remote changes." 
            },
          ]
        },
        {
          name: "Branching & Merging",
          entries: [
            { 
              command: "git branch", 
              description: "List all local branches.", 
              example: "git branch", 
              scenario: "Seeing available branches." 
            },
            { 
              command: "git branch [branch-name]", 
              description: "Create a new branch.", 
              example: "git branch feature-x", 
              scenario: "Starting work on a new feature." 
            },
            { 
              command: "git checkout [branch]", 
              description: "Switch to an existing branch.", 
              example: "git checkout develop", 
              scenario: "Changing to a different branch." 
            },
            { 
              command: "git checkout -b [branch]", 
              description: "Create and switch to a new branch.", 
              example: "git checkout -b hotfix-123", 
              scenario: "Creating and starting work on a new branch." 
            },
            { 
              command: "git merge [branch]", 
              description: "Merge the specified branch into current branch.", 
              example: "git merge feature-x", 
              scenario: "Integrating changes from one branch into another." 
            },
          ]
        }
      ]
    },
    docker: {
      title: "Docker",
      categories: [
        {
          name: "Image Management",
          entries: [
            { 
              command: "docker images", 
              description: "List all local images.", 
              example: "docker images", 
              scenario: "Checking available Docker images on your system." 
            },
            { 
              command: "docker pull [image]", 
              description: "Download an image from registry.", 
              example: "docker pull ubuntu:latest", 
              scenario: "Getting a new Docker image." 
            },
            { 
              command: "docker build -t [name] .", 
              description: "Build an image from Dockerfile.", 
              example: "docker build -t myapp:v1 .", 
              scenario: "Creating a custom Docker image." 
            },
            { 
              command: "docker rmi [image]", 
              description: "Remove one or more images.", 
              example: "docker rmi myapp:v1", 
              scenario: "Cleaning up unused images." 
            },
          ]
        },
        {
          name: "Container Management",
          entries: [
            { 
              command: "docker ps", 
              description: "List running containers.", 
              example: "docker ps", 
              scenario: "Checking active containers." 
            },
            { 
              command: "docker run [image]", 
              description: "Create and start a new container.", 
              example: "docker run -d -p 8080:80 nginx", 
              scenario: "Running an application in a container." 
            },
            { 
              command: "docker stop [container]", 
              description: "Stop one or more running containers.", 
              example: "docker stop my_container", 
              scenario: "Gracefully stopping a container." 
            },
            { 
              command: "docker exec -it [container] [command]", 
              description: "Run a command in a running container.", 
              example: "docker exec -it my_container bash", 
              scenario: "Accessing a shell inside a container." 
            },
          ]
        }
      ]
    },
    bash: {
      title: "Bash",
      categories: [
        {
          name: "File Operations",
          entries: [
            { 
              command: "ls -la", 
              description: "List directory contents with details.", 
              example: "ls -la /var/log", 
              scenario: "Viewing files and directories with permissions." 
            },
            { 
              command: "cd [directory]", 
              description: "Change current directory.", 
              example: "cd /var/log", 
              scenario: "Navigating the file system." 
            },
            { 
              command: "mkdir [directory]", 
              description: "Create a new directory.", 
              example: "mkdir new_project", 
              scenario: "Creating a new folder." 
            },
            { 
              command: "rm [file]", 
              description: "Remove files.", 
              example: "rm temp.txt", 
              scenario: "Deleting a file." 
            },
            { 
              command: "cp [source] [dest]", 
              description: "Copy files or directories.", 
              example: "cp file.txt backup/", 
              scenario: "Making a copy of a file." 
            },
            { 
              command: "mv [source] [dest]", 
              description: "Move or rename files.", 
              example: "mv old.txt new.txt", 
              scenario: "Renaming or moving a file." 
            },
          ]
        },
        {
          name: "Text Processing",
          entries: [
            { 
              command: "cat [file]", 
              description: "Display file content.", 
              example: "cat error.log", 
              scenario: "Viewing the content of a file." 
            },
            { 
              command: "grep \"[pattern]\" [file]", 
              description: "Search for patterns in files.", 
              example: "grep -i \"error\" server.log", 
              scenario: "Finding specific text in a file." 
            },
            { 
              command: "head [file]", 
              description: "Show first lines of a file.", 
              example: "head -n 20 access.log", 
              scenario: "Viewing the beginning of a large file." 
            },
            { 
              command: "tail [file]", 
              description: "Show last lines of a file.", 
              example: "tail -f app.log", 
              scenario: "Monitoring log files in real-time." 
            },
          ]
        }
      ]
    },
    javascript: {
      title: "JavaScript",
      categories: [
        {
          name: "Array Methods",
          entries: [
            { 
              command: "array.map(callback)", 
              description: "Transform each element in an array.", 
              example: "const doubled = numbers.map(n => n * 2)", 
              scenario: "Converting an array of numbers to their doubles." 
            },
            { 
              command: "array.filter(callback)", 
              description: "Create a new array with filtered elements.", 
              example: "const evens = numbers.filter(n => n % 2 === 0)", 
              scenario: "Getting only even numbers from an array." 
            },
            { 
              command: "array.reduce(callback, initial)", 
              description: "Reduce array to a single value.", 
              example: "const sum = numbers.reduce((acc, n) => acc + n, 0)", 
              scenario: "Calculating the sum of all numbers." 
            },
            { 
              command: "array.find(callback)", 
              description: "Find the first element that matches condition.", 
              example: "const found = users.find(user => user.id === 1)", 
              scenario: "Finding a specific user by ID." 
            },
          ]
        },
        {
          name: "Modern JavaScript",
          entries: [
            { 
              command: "const { prop } = object", 
              description: "Destructure properties from objects.", 
              example: "const { name, age } = user", 
              scenario: "Extracting specific properties from an object." 
            },
            { 
              command: "const [first, ...rest] = array", 
              description: "Destructure arrays with spread operator.", 
              example: "const [head, ...tail] = [1, 2, 3, 4]", 
              scenario: "Getting the first element and the rest separately." 
            },
            { 
              command: "async function name() {}", 
              description: "Define an asynchronous function.", 
              example: "async function fetchData() { return await api.get('/data') }", 
              scenario: "Making asynchronous API calls." 
            },
            { 
              command: "const result = await promise", 
              description: "Wait for a promise to resolve.", 
              example: "const data = await fetch('/api/users')", 
              scenario: "Waiting for an API response." 
            },
          ]
        }
      ]
    }
  };

  // Create all commands data
  const allCommandsData = useMemo(() => {
    const allCommands: CheatItem[] = [];
    Object.values(originalCheatData).forEach(sheet => {
      sheet.categories.forEach(category => {
        allCommands.push(...category.entries);
      });
    });
    return allCommands;
  }, []);

  const cheatData: CheatData = {
    allCommands: {
      title: "All Commands",
      categories: [{ name: "All Available Commands", entries: allCommandsData }]
    },
    ...originalCheatData
  };

  const filteredData = useMemo(() => {
    if (!searchTerm) return cheatData;

    const filtered: CheatData = {};
    Object.entries(cheatData).forEach(([key, sheet]) => {
      const filteredCategories = sheet.categories.map(category => ({
        ...category,
        entries: category.entries.filter(entry =>
          entry.command.toLowerCase().includes(searchTerm.toLowerCase()) ||
          entry.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (entry.example && entry.example.toLowerCase().includes(searchTerm.toLowerCase())) ||
          entry.scenario.toLowerCase().includes(searchTerm.toLowerCase())
        )
      })).filter(category => category.entries.length > 0);

      if (filteredCategories.length > 0) {
        filtered[key] = { ...sheet, categories: filteredCategories };
      }
    });

    return filtered;
  }, [searchTerm, cheatData]);

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedItem(type);
      setTimeout(() => setCopiedItem(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const showCommandDetails = (command: CheatItem) => {
    setSelectedCommand(command);
    setIsModalOpen(true);
  };

  const colorCodeCommand = (command: string) => {
    // Simple syntax highlighting for commands
    return command
      .replace(/(\[[^\]]+\])/g, '<span style="color: #fbbf24;">$1</span>')
      .replace(/(".*?")/g, '<span style="color: #4ade80;">$1</span>')
      .replace(/(--?\w+)/g, '<span style="color: #f472b6;">$1</span>');
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-8 max-w-screen-2xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <Link href="/playground" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Back to Playground
            </Link>
            <Badge variant="secondary" className="bg-primary text-primary-foreground">
              <Book className="w-3 h-3 mr-1" />
              Reference
            </Badge>
          </div>
          
          <h1 className="text-3xl font-bold text-center mb-4">
            Developer Cheat Sheets
          </h1>

          {/* Search */}
          <div className="relative max-w-2xl mx-auto mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search across all cheat sheets (e.g., 'git commit', 'docker images')"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 shadow-sm focus:ring-2 focus:ring-primary"
            />
          </div>

          {searchTerm && (
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Found {Object.values(filteredData).reduce((acc, sheet) => 
                  acc + sheet.categories.reduce((catAcc, cat) => catAcc + cat.entries.length, 0), 0
                )} results for "{searchTerm}"
              </p>
            </div>
          )}
        </div>

        {/* Tabs */}
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="space-y-6">
          <div className="overflow-x-auto">
            <TabsList className="inline-flex h-10 items-center justify-start rounded-md bg-muted p-1 text-muted-foreground min-w-full lg:min-w-0 lg:grid lg:grid-cols-5 w-full">
              {Object.entries(filteredData).map(([key, sheet]) => (
                <TabsTrigger 
                  key={key} 
                  value={key} 
                  className="transition-all duration-300 whitespace-nowrap flex-shrink-0 lg:flex-shrink"
                >
                  {sheet.title}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {Object.entries(filteredData).map(([key, sheet]) => (
            <TabsContent key={key} value={key} className="mt-6">
              {key === 'allCommands' ? (
                // All Commands Layout - Grid style like the HTML example
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                  {sheet.categories[0].entries.map((entry, index) => (
                    <div 
                      key={index} 
                      className="flex flex-col border border-border rounded-lg p-4 bg-card shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1 mr-2">
                          <h3 className="text-lg font-semibold text-foreground mb-2 flex items-center flex-wrap">
                            <div className="flex-grow mr-2">
                              <code className="bg-muted text-foreground px-2 py-1 rounded text-sm break-all font-mono">
                                {entry.command}
                              </code>
                            </div>
                          </h3>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => showCommandDetails(entry)}
                            className="h-8 w-8 p-0"
                          >
                            <Eye className="w-3 h-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(entry.command, `all-${index}`)}
                            className="h-8 w-8 p-0"
                          >
                            {copiedItem === `all-${index}` ? (
                              <Check className="w-3 h-3 text-green-500" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </Button>
                        </div>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-2">
                        <strong className="text-foreground">Description:</strong> {entry.description}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        <strong className="text-foreground">Scenario:</strong> {entry.scenario}
                      </p>
                      
                      {entry.example && (
                        <div className="mt-3">
                          <p className="text-sm font-semibold text-foreground mb-1">Example:</p>
                          <pre className="bg-muted border border-border rounded p-3 text-sm overflow-x-auto">
                            <code 
                              className="text-foreground"
                              dangerouslySetInnerHTML={{ __html: colorCodeCommand(entry.example) }}
                            />
                          </pre>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                // Category Layout
                <div className="space-y-8">
                  {sheet.categories.map((category, categoryIndex) => (
                    <div key={categoryIndex}>
                      <h2 className="text-2xl font-semibold mb-6 pb-2 border-b border-border text-muted-foreground">
                        {category.name}
                      </h2>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {category.entries.map((entry, entryIndex) => (
                          <Card key={entryIndex} className="flex flex-col h-full hover:shadow-lg transition-shadow">
                            <CardHeader className="pb-3">
                              <div className="flex items-start justify-between">
                                <div className="flex-1 mr-2">
                                  <CardTitle className="text-lg mb-2">
                                    <code className="bg-muted text-foreground px-2 py-1 rounded text-sm break-all font-mono">
                                      {entry.command}
                                    </code>
                                  </CardTitle>
                                </div>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => copyToClipboard(entry.command, `${key}-${categoryIndex}-${entryIndex}`)}
                                  className="shrink-0"
                                >
                                  {copiedItem === `${key}-${categoryIndex}-${entryIndex}` ? (
                                    <Check className="w-4 h-4 text-green-500" />
                                  ) : (
                                    <Copy className="w-4 h-4" />
                                  )}
                                </Button>
                              </div>
                            </CardHeader>
                            <CardContent className="flex-1 pt-0">
                              <p className="text-sm text-muted-foreground mb-2">
                                <strong className="text-foreground">Description:</strong> {entry.description}
                              </p>
                              <p className="text-sm text-muted-foreground mb-3">
                                <strong className="text-foreground">Scenario:</strong> {entry.scenario}
                              </p>
                              {entry.example && (
                                <div className="mt-auto">
                                  <p className="text-sm font-semibold text-foreground mb-1">Example:</p>
                                  <pre className="bg-muted border border-border rounded p-3 text-sm overflow-x-auto">
                                    <code 
                                      className="text-foreground"
                                      dangerouslySetInnerHTML={{ __html: colorCodeCommand(entry.example) }}
                                    />
                                  </pre>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => copyToClipboard(entry.example, `example-${key}-${categoryIndex}-${entryIndex}`)}
                                    className="mt-2 h-8"
                                  >
                                    {copiedItem === `example-${key}-${categoryIndex}-${entryIndex}` ? (
                                      <Check className="w-3 h-3 mr-1 text-green-500" />
                                    ) : (
                                      <Copy className="w-3 h-3 mr-1" />
                                    )}
                                    Copy Example
                                  </Button>
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>

        {/* Command Details Modal */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-lg font-semibold text-primary break-all">
                {selectedCommand?.command}
              </DialogTitle>
            </DialogHeader>
            {selectedCommand && (
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">
                    <strong className="text-foreground">Description:</strong> {selectedCommand.description}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    <strong className="text-foreground">Scenario:</strong> {selectedCommand.scenario}
                  </p>
                </div>
                {selectedCommand.example && (
                  <div>
                    <p className="text-foreground font-semibold mb-2 text-sm">Example:</p>
                    <pre className="bg-muted border border-border rounded p-3 text-sm overflow-x-auto">
                      <code 
                        className="text-foreground"
                        dangerouslySetInnerHTML={{ __html: colorCodeCommand(selectedCommand.example) }}
                      />
                    </pre>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(selectedCommand.example!, 'modal-example')}
                      className="mt-2"
                    >
                      {copiedItem === 'modal-example' ? (
                        <>
                          <Check className="w-3 h-3 mr-1 text-green-500" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3 mr-1" />
                          Copy Example
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* No results */}
        {searchTerm && Object.keys(filteredData).length === 0 && (
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
      </div>
    </div>
  );
}
