
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getAllPlaygroundProjects } from '@/lib/playground';
import PlaygroundCard from '@/components/ui/PlaygroundCard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ArrowLeft, 
  Search, 
  Filter, 
  Grid3X3, 
  List, 
  Calendar,
  Code,
  Zap,
  Star,
  Clock,
  Tag,
  SortAsc,
  SortDesc
} from 'lucide-react';

interface PlaygroundProject {
  id: string;
  title: string;
  description: string;
  status: 'active' | 'maintenance' | 'beta' | 'coming-soon';
  category: string;
  tags: string[];
  lastUpdated: string;
  featured: boolean;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: string;
  tech: string[];
}

// Enhanced project data with better categorization
const enhancedProjects: PlaygroundProject[] = [
  {
    id: 'position-fit',
    title: 'Position Fit Analyzer',
    description: 'AI-powered job matching and resume optimization tool',
    status: 'active',
    category: 'AI & ML',
    tags: ['AI', 'Resume', 'Job Matching', 'NLP'],
    lastUpdated: '2024-01-15',
    featured: true,
    difficulty: 'intermediate',
    estimatedTime: '10-15 min',
    tech: ['Next.js', 'OpenAI', 'TypeScript']
  },
  {
    id: 'resume-builder',
    title: 'Resume Builder',
    description: 'Professional resume creation tool with templates',
    status: 'beta',
    category: 'Productivity',
    tags: ['Resume', 'Templates', 'PDF'],
    lastUpdated: '2024-01-10',
    featured: true,
    difficulty: 'beginner',
    estimatedTime: '5-10 min',
    tech: ['React', 'PDF.js', 'CSS']
  },
  {
    id: 'developer-cheatsheet',
    title: 'Developer Cheatsheet',
    description: 'Quick reference guide for developers',
    status: 'active',
    category: 'Development',
    tags: ['Reference', 'Commands', 'Quick Guide'],
    lastUpdated: '2024-01-12',
    featured: false,
    difficulty: 'beginner',
    estimatedTime: '2-5 min',
    tech: ['React', 'TypeScript', 'CSS']
  },
  {
    id: 'retro-games',
    title: 'Retro Games',
    description: 'Classic games collection',
    status: 'maintenance',
    category: 'Games',
    tags: ['Games', 'Retro', 'Entertainment'],
    lastUpdated: '2024-01-08',
    featured: false,
    difficulty: 'beginner',
    estimatedTime: '10+ min',
    tech: ['JavaScript', 'Canvas', 'CSS']
  },
  {
    id: 'tip-calculator',
    title: 'Tip Calculator',
    description: 'Calculate tips and split bills easily',
    status: 'active',
    category: 'Utilities',
    tags: ['Calculator', 'Finance', 'Utility'],
    lastUpdated: '2024-01-14',
    featured: false,
    difficulty: 'beginner',
    estimatedTime: '2-3 min',
    tech: ['React', 'TypeScript']
  },
  {
    id: 'basic-calculator',
    title: 'Basic Calculator',
    description: 'Simple arithmetic calculator',
    status: 'active',
    category: 'Utilities',
    tags: ['Calculator', 'Math', 'Basic'],
    lastUpdated: '2024-01-11',
    featured: false,
    difficulty: 'beginner',
    estimatedTime: '1-2 min',
    tech: ['React', 'JavaScript']
  }
];

const categories = [
  { id: 'all', label: 'All Projects', icon: Grid3X3 },
  { id: 'AI & ML', label: 'AI & ML', icon: Zap },
  { id: 'Productivity', label: 'Productivity', icon: Star },
  { id: 'Development', label: 'Development', icon: Code },
  { id: 'Games', label: 'Games', icon: Star },
  { id: 'Utilities', label: 'Utilities', icon: Grid3X3 }
];

const statusColors = {
  active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  beta: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  maintenance: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  'coming-soon': 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
};

export default function PlaygroundPage() {
  const [projects, setProjects] = useState<PlaygroundProject[]>(enhancedProjects);
  const [filteredProjects, setFilteredProjects] = useState<PlaygroundProject[]>(enhancedProjects);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [sortBy, setSortBy] = useState('featured');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    let filtered = [...projects];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(project =>
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(project => project.category === selectedCategory);
    }

    // Status filter
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(project => project.status === selectedStatus);
    }

    // Difficulty filter
    if (selectedDifficulty !== 'all') {
      filtered = filtered.filter(project => project.difficulty === selectedDifficulty);
    }

    // Sort
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'title':
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case 'lastUpdated':
          aValue = new Date(a.lastUpdated).getTime();
          bValue = new Date(b.lastUpdated).getTime();
          break;
        case 'featured':
          aValue = a.featured ? 1 : 0;
          bValue = b.featured ? 1 : 0;
          break;
        case 'difficulty':
          const difficultyOrder = { beginner: 1, intermediate: 2, advanced: 3 };
          aValue = difficultyOrder[a.difficulty];
          bValue = difficultyOrder[b.difficulty];
          break;
        default:
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredProjects(filtered);
  }, [projects, searchTerm, selectedCategory, selectedStatus, selectedDifficulty, sortBy, sortOrder]);

  const featuredProjects = filteredProjects.filter(p => p.featured);
  const activeProjects = filteredProjects.filter(p => p.status === 'active');
  const betaProjects = filteredProjects.filter(p => p.status === 'beta');

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'advanced': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const ProjectGrid = ({ projects }: { projects: PlaygroundProject[] }) => (
    <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
      {projects.map((project) => (
        <div key={project.id} className={`group ${viewMode === 'list' ? 'flex gap-4' : ''}`}>
          <PlaygroundCard project={project} />
          {viewMode === 'list' && (
            <div className="flex-1 p-4">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-semibold text-lg">{project.title}</h3>
                <Badge className={statusColors[project.status]}>
                  {project.status}
                </Badge>
                <Badge className={getDifficultyColor(project.difficulty)}>
                  {project.difficulty}
                </Badge>
              </div>
              <p className="text-muted-foreground mb-3">{project.description}</p>
              <div className="flex flex-wrap gap-1 mb-3">
                {project.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {project.estimatedTime}
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {new Date(project.lastUpdated).toLocaleDateString()}
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-background to-pink-50 dark:from-purple-950/20 dark:via-background dark:to-pink-950/20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
            <Badge variant="secondary" className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
              {filteredProjects.length} Projects
            </Badge>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            Playground
          </h1>
          <p className="text-muted-foreground">
            Explore interactive projects, tools, and experiments
          </p>
        </div>

        {/* Search and Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Search & Filter
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search projects, tags, or descriptions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Filters Row */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="beta">Beta</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                    <SelectItem value="coming-soon">Coming Soon</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                  <SelectTrigger>
                    <SelectValue placeholder="Difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="featured">Featured</SelectItem>
                    <SelectItem value="title">Title</SelectItem>
                    <SelectItem value="lastUpdated">Last Updated</SelectItem>
                    <SelectItem value="difficulty">Difficulty</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* View Controls */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Button
                    variant={sortOrder === 'asc' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSortOrder('asc')}
                  >
                    <SortAsc className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={sortOrder === 'desc' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSortOrder('desc')}
                  >
                    <SortDesc className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Projects Display */}
        <Tabs defaultValue="all" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">All ({filteredProjects.length})</TabsTrigger>
            <TabsTrigger value="featured">Featured ({featuredProjects.length})</TabsTrigger>
            <TabsTrigger value="active">Active ({activeProjects.length})</TabsTrigger>
            <TabsTrigger value="beta">Beta ({betaProjects.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-6">
            <ProjectGrid projects={filteredProjects} />
          </TabsContent>

          <TabsContent value="featured" className="space-y-6">
            <ProjectGrid projects={featuredProjects} />
          </TabsContent>

          <TabsContent value="active" className="space-y-6">
            <ProjectGrid projects={activeProjects} />
          </TabsContent>

          <TabsContent value="beta" className="space-y-6">
            <ProjectGrid projects={betaProjects} />
          </TabsContent>
        </Tabs>

        {/* Empty State */}
        {filteredProjects.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <div className="text-muted-foreground">
                <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-semibold mb-2">No projects found</h3>
                <p>Try adjusting your search or filters to find what you're looking for.</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
