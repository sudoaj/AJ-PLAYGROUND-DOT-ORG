
'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Link from 'next/link';
import { ArrowLeft, Search, Grid, List, Filter, X } from 'lucide-react';
import { getAllPlaygroundProjects } from '@/lib/playground';
import PlaygroundCard from '@/components/ui/PlaygroundCard';

export default function PlaygroundPage() {
  const playgroundProjects = getAllPlaygroundProjects();
  
  // State for filters and search
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // Get unique categories
  const categories = useMemo(() => {
    const cats = [...new Set(playgroundProjects.map(p => p.category))];
    return cats.sort();
  }, [playgroundProjects]);
  
  // Filter and search projects
  const filteredProjects = useMemo(() => {
    return playgroundProjects.filter(project => {
      const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           project.category.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = selectedCategory === 'all' || project.category === selectedCategory;
      
      const matchesStatus = selectedStatus === 'all' || 
                           (selectedStatus === 'live' && project.isLive && !project.isAbandoned) ||
                           (selectedStatus === 'coming-soon' && !project.isLive && !project.isAbandoned) ||
                           (selectedStatus === 'abandoned' && project.isAbandoned);
      
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [playgroundProjects, searchTerm, selectedCategory, selectedStatus]);
  
  // Categorize projects
  const categorizedProjects = useMemo(() => {
    const live = filteredProjects.filter(p => p.isLive && !p.isAbandoned);
    const comingSoon = filteredProjects.filter(p => !p.isLive && !p.isAbandoned);
    const abandoned = filteredProjects.filter(p => p.isAbandoned);
    
    return { live, comingSoon, abandoned };
  }, [filteredProjects]);
  
  // Clear all filters
  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSelectedStatus('all');
  };
  
  // Check if any filters are active
  const hasActiveFilters = searchTerm || selectedCategory !== 'all' || selectedStatus !== 'all';

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="mb-8">
        <Button variant="ghost" size="sm" asChild className="text-primary hover:text-black/80">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </Button>
      </div>
      
      <header className="text-center mb-10 md:mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-foreground leading-tight">
          AJ&apos;s Playground
        </h1>
        <p className="mt-3 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
          Interactive experiments and mini-projects. Click on any project to explore!
        </p>
      </header>

      {/* Search and Filters */}
      <div className="mb-8 space-y-4">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          {/* Search */}
          <div className="relative flex-1 w-full md:max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          {/* Category Filter */}
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map(category => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {/* Status Filter */}
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="live">Live</SelectItem>
              <SelectItem value="coming-soon">Coming Soon</SelectItem>
              <SelectItem value="abandoned">Abandoned</SelectItem>
            </SelectContent>
          </Select>
          
          {/* View Mode Toggle */}
          <div className="flex rounded-lg border bg-muted p-1">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="h-8 w-8 p-0"
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="h-8 w-8 p-0"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* Active Filters & Clear */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-muted-foreground">Active filters:</span>
            {searchTerm && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Search: {searchTerm}
                <X className="h-3 w-3 cursor-pointer" onClick={() => setSearchTerm('')} />
              </Badge>
            )}
            {selectedCategory !== 'all' && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Category: {selectedCategory}
                <X className="h-3 w-3 cursor-pointer" onClick={() => setSelectedCategory('all')} />
              </Badge>
            )}
            {selectedStatus !== 'all' && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Status: {selectedStatus}
                <X className="h-3 w-3 cursor-pointer" onClick={() => setSelectedStatus('all')} />
              </Badge>
            )}
            <Button variant="outline" size="sm" onClick={clearFilters} className="ml-2">
              Clear All
            </Button>
          </div>
        )}
      </div>

      {/* Results Count */}
      <div className="mb-6">
        <p className="text-sm text-muted-foreground">
          Showing {filteredProjects.length} of {playgroundProjects.length} projects
        </p>
      </div>

      {/* Projects Display */}
      <Tabs defaultValue="categorized" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="categorized">Categorized View</TabsTrigger>
          <TabsTrigger value="all">All Projects</TabsTrigger>
        </TabsList>

        {/* Categorized View */}
        <TabsContent value="categorized" className="space-y-12">
          {/* Live Projects */}
          {categorizedProjects.live.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
                Live Projects ({categorizedProjects.live.length})
              </h2>
              <div className={viewMode === 'grid' ? 
                "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" : 
                "space-y-4"
              }>
                {categorizedProjects.live.map((project) => (
                  <div key={project.id} className={viewMode === 'list' ? 'w-full' : ''}>
                    <PlaygroundCard project={project} viewMode={viewMode} />
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Coming Soon Projects */}
          {categorizedProjects.comingSoon.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-yellow-500 animate-pulse"></div>
                Coming Soon ({categorizedProjects.comingSoon.length})
              </h2>
              <div className={viewMode === 'grid' ? 
                "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" : 
                "space-y-4"
              }>
                {categorizedProjects.comingSoon.map((project) => (
                  <div key={project.id} className={viewMode === 'list' ? 'w-full' : ''}>
                    <PlaygroundCard project={project} viewMode={viewMode} />
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Abandoned Projects */}
          {categorizedProjects.abandoned.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                Abandoned Projects ({categorizedProjects.abandoned.length})
              </h2>
              <div className={viewMode === 'grid' ? 
                "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" : 
                "space-y-4"
              }>
                {categorizedProjects.abandoned.map((project) => (
                  <div key={project.id} className={viewMode === 'list' ? 'w-full' : ''}>
                    <PlaygroundCard project={project} viewMode={viewMode} />
                  </div>
                ))}
              </div>
            </section>
          )}
        </TabsContent>

        {/* All Projects View */}
        <TabsContent value="all">
          {filteredProjects.length > 0 ? (
            <div className={viewMode === 'grid' ? 
              "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" : 
              "space-y-4"
            }>
              {filteredProjects.map((project) => (
                <div key={project.id} className={viewMode === 'list' ? 'w-full' : ''}>
                  <PlaygroundCard project={project} viewMode={viewMode} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">No projects found matching your criteria.</p>
              <Button onClick={clearFilters} className="mt-4" variant="outline">
                Clear Filters
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
