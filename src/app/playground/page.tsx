
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
import { PlaygroundProject } from '@/types';

const categories = [
  { id: 'all', label: 'All Projects', icon: Grid3X3 },
  { id: 'AI Tool', label: 'AI Tool', icon: Zap },
  { id: 'Tool', label: 'Tool', icon: Star },
  { id: 'Gaming', label: 'Gaming', icon: Code },
  { id: 'Utility', label: 'Utility', icon: Grid3X3 },
  { id: 'Visualization', label: 'Visualization', icon: Star }
];

const getStatusFromProject = (project: PlaygroundProject) => {
  if (project.isLive && !project.isAbandoned) return 'live';
  if (project.isAbandoned) return 'abandoned';
  return 'coming-soon';
};

const statusColors = {
  live: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  abandoned: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  'coming-soon': 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
};

export default function PlaygroundPage() {
  const allPlaygroundProjects = getAllPlaygroundProjects();
  const [projects, setProjects] = useState<PlaygroundProject[]>(allPlaygroundProjects);
  const [filteredProjects, setFilteredProjects] = useState<PlaygroundProject[]>(allPlaygroundProjects);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  
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
      filtered = filtered.filter(project => getStatusFromProject(project) === selectedStatus);
    }

    // Sort
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'title':
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case 'status':
          aValue = getStatusFromProject(a);
          bValue = getStatusFromProject(b);
          break;
        case 'category':
          aValue = a.category.toLowerCase();
          bValue = b.category.toLowerCase();
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

  const liveProjects = filteredProjects.filter(p => p.isLive && !p.isAbandoned);
  const abandonedProjects = filteredProjects.filter(p => p.isAbandoned);
  const comingSoonProjects = filteredProjects.filter(p => !p.isLive && !p.isAbandoned);

  const ProjectGrid = ({ projects }: { projects: PlaygroundProject[] }) => (
    <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
      {projects.map((project) => (
        <PlaygroundCard key={project.id} project={project} viewMode={viewMode} />
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                    <SelectItem value="live">Live</SelectItem>
                    <SelectItem value="abandoned">Abandoned</SelectItem>
                    <SelectItem value="coming-soon">Coming Soon</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="title">Title</SelectItem>
                    <SelectItem value="status">Status</SelectItem>
                    <SelectItem value="category">Category</SelectItem>
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
            <TabsTrigger value="live">Live ({liveProjects.length})</TabsTrigger>
            <TabsTrigger value="abandoned">Abandoned ({abandonedProjects.length})</TabsTrigger>
            <TabsTrigger value="coming-soon">Coming Soon ({comingSoonProjects.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-6">
            <ProjectGrid projects={filteredProjects} />
          </TabsContent>

          <TabsContent value="live" className="space-y-6">
            <ProjectGrid projects={liveProjects} />
          </TabsContent>

          <TabsContent value="abandoned" className="space-y-6">
            <ProjectGrid projects={abandonedProjects} />
          </TabsContent>

          <TabsContent value="coming-soon" className="space-y-6">
            <ProjectGrid projects={comingSoonProjects} />
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
