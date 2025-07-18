'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
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
  SortDesc,
  Lock,
  User
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
  // All hooks must be called at the top level, before any conditional returns
  const { data: session, status } = useSession();
  const [allPlaygroundProjects, setAllPlaygroundProjects] = useState<PlaygroundProject[]>([]);
  const [projects, setProjects] = useState<PlaygroundProject[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<PlaygroundProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  
  const [sortBy, setSortBy] = useState('featured');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Effect for fetching projects - must come before conditional returns
  useEffect(() => {
    const fetchProjects = async () => {
      if (!session) {
        setIsLoading(false);
        return;
      }
      
      try {
        // First, try to fetch existing projects
        const response = await fetch('/api/playground', {
          headers: {
            'Authorization': `Bearer ${session.user?.email}`,
          },
        });
        
        if (response.ok) {
          const data = await response.json();
          
          // If user has no projects, initialize their playground
          if (data.length === 0) {
            try {
              const initResponse = await fetch('/api/user/initialize', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${session.user?.email}`,
                },
              });
              
              if (initResponse.ok) {
                // Fetch projects again after initialization
                const newResponse = await fetch('/api/playground', {
                  headers: {
                    'Authorization': `Bearer ${session.user?.email}`,
                  },
                });
                
                if (newResponse.ok) {
                  const newData = await newResponse.json();
                  setAllPlaygroundProjects(newData);
                  setProjects(newData);
                  setFilteredProjects(newData);
                }
              }
            } catch (initError) {
              console.error('Error initializing user playground:', initError);
              // Still set empty data if initialization fails
              setAllPlaygroundProjects(data);
              setProjects(data);
              setFilteredProjects(data);
            }
          } else {
            setAllPlaygroundProjects(data);
            setProjects(data);
            setFilteredProjects(data);
          }
        }
      } catch (error) {
        console.error('Error fetching playground projects:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, [session]);

  // Effect for filtering projects - must come before conditional returns
  useEffect(() => {
    let filtered = [...projects];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(project =>
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(project => project.category === selectedCategory);
    }

    // Status filter
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(project => {
        const status = getStatusFromProject(project);
        return status === selectedStatus;
      });
    }

    // Sort
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'title':
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case 'category':
          aValue = a.category.toLowerCase();
          bValue = b.category.toLowerCase();
          break;
        default:
          // Default to title for now since we don't have timestamps
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

  // Now we can do conditional returns after all hooks are called
  if (status === "loading") {
    return (
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-pulse flex items-center gap-2">
            <Clock className="w-6 h-6 animate-spin" />
            Loading...
          </div>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="flex flex-col items-center justify-center min-h-[400px] space-y-6">
          <div className="text-center space-y-4">
            <Lock className="w-16 h-16 mx-auto text-muted-foreground" />
            <h1 className="text-3xl font-bold">Authentication Required</h1>
            <p className="text-lg text-muted-foreground max-w-md">
              Please sign in to access the playground and start building amazing projects!
            </p>
          </div>
          <div className="flex gap-4">
            <Button asChild size="lg">
              <Link href="/auth/signin">
                <User className="w-4 h-4 mr-2" />
                Sign In
              </Link>
            </Button>
            <Button variant="outline" asChild size="lg">
              <Link href="/">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-pulse flex items-center gap-2">
            <Clock className="w-6 h-6 animate-spin" />
            Loading your playground...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Playground</h1>
          <p className="text-lg text-muted-foreground">
            Interactive projects and experiments. Build, learn, and have fun!
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href="/">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs font-medium uppercase tracking-wide">
              Total Projects
            </CardDescription>
            <CardTitle className="text-2xl font-bold">
              {allPlaygroundProjects.length}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs font-medium uppercase tracking-wide">
              Live Projects
            </CardDescription>
            <CardTitle className="text-2xl font-bold text-green-600">
              {allPlaygroundProjects.filter(p => p.isLive && !p.isAbandoned).length}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs font-medium uppercase tracking-wide">
              Coming Soon
            </CardDescription>
            <CardTitle className="text-2xl font-bold text-blue-600">
              {allPlaygroundProjects.filter(p => !p.isLive && !p.isAbandoned).length}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs font-medium uppercase tracking-wide">
              My Projects
            </CardDescription>
            <CardTitle className="text-2xl font-bold text-purple-600">
              {allPlaygroundProjects.filter(p => p.isOwner).length}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Controls */}
      <div className="flex flex-col lg:flex-row gap-4 mb-8">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-2">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full sm:w-[180px]">
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
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="live">Live</SelectItem>
              <SelectItem value="coming-soon">Coming Soon</SelectItem>
              <SelectItem value="abandoned">Abandoned</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="featured">Featured</SelectItem>
              <SelectItem value="title">Title</SelectItem>
              <SelectItem value="category">Category</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="w-full sm:w-auto"
          >
            {sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
          </Button>

          <div className="flex border rounded-md">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="rounded-r-none"
            >
              <Grid3X3 className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="rounded-l-none"
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Results */}
      {filteredProjects.length === 0 ? (
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
            <Search className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No projects found</h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm || selectedCategory !== 'all' || selectedStatus !== 'all'
              ? 'Try adjusting your search or filters'
              : 'Get started by exploring our playground projects!'}
          </p>
          {searchTerm || selectedCategory !== 'all' || selectedStatus !== 'all' ? (
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
                setSelectedStatus('all');
              }}
            >
              Clear Filters
            </Button>
          ) : null}
        </div>
      ) : (
        <div className={viewMode === 'grid' 
          ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
          : "space-y-4"
        }>
          {filteredProjects.map((project) => (
            <PlaygroundCard 
              key={project.id} 
              project={project} 
              viewMode={viewMode}
            />
          ))}
        </div>
      )}
    </div>
  );
}
