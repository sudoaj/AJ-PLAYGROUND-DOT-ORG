"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { 
  FileText, 
  FolderOpen, 
  Gamepad2,
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  Calendar,
  ExternalLink,
  RefreshCw
} from "lucide-react";

interface BlogPost {
  id: string;
  title: string;
  content: string;
  slug: string;
  excerpt?: string;
  createdAt: string;
  updatedAt: string;
}

interface Project {
  id: string;
  title: string;
  description: string;
  slug: string;
  technologies: string;
  demoUrl?: string;
  githubUrl?: string;
  createdAt: string;
  updatedAt: string;
}

interface PlaygroundProject {
  id: string;
  title: string;
  description: string;
  slug: string;
  component: string;
  createdAt: string;
  updatedAt: string;
}

export default function ContentManagement() {
  const { data: session, status } = useSession();
  const { toast } = useToast();
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [playgroundProjects, setPlaygroundProjects] = useState<PlaygroundProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [editingType, setEditingType] = useState<'blog' | 'project' | 'playground' | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    if (session?.user) {
      fetchContent();
    }
  }, [session]);

  const isAdmin = session?.user?.email === "admin@ajplayground.com" || session?.user?.email === "admin2@ajplayground.com";

  if (status === "loading") {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-pulse flex items-center gap-2">
            <RefreshCw className="w-6 h-6 animate-spin" />
            Loading Content...
          </div>
        </div>
      </div>
    );
  }

  if (!session || !isAdmin) {
    redirect("/auth/signin");
  }

  const fetchContent = async () => {
    setIsLoading(true);
    try {
      const [postsRes, projectsRes, playgroundRes] = await Promise.all([
        fetch("/api/blog"),
        fetch("/api/projects"),
        fetch("/api/playground"),
      ]);

      if (postsRes.ok) {
        const posts = await postsRes.json();
        setBlogPosts(posts);
      }

      if (projectsRes.ok) {
        const projects = await projectsRes.json();
        setProjects(projects);
      }

      if (playgroundRes.ok) {
        const playground = await playgroundRes.json();
        setPlaygroundProjects(playground);
      }
    } catch (error) {
      console.error("Error fetching content:", error);
      toast({ title: "Error", description: "Failed to fetch content", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (item: any, type: 'blog' | 'project' | 'playground') => {
    setEditingItem({ ...item });
    setEditingType(type);
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (!editingItem || !editingType) return;

    try {
      const endpoint = editingItem.id ? 
        `/api/${editingType === 'blog' ? 'posts' : editingType === 'project' ? 'projects' : 'playground'}/id/${editingItem.id}` :
        `/api/${editingType === 'blog' ? 'posts' : editingType === 'project' ? 'projects' : 'playground'}`;

      const method = editingItem.id ? 'PUT' : 'POST';
      
      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editingItem),
      });

      if (response.ok) {
        setIsDialogOpen(false);
        setEditingItem(null);
        setEditingType(null);
        fetchContent(); // Refresh the data
        toast({ title: "Success", description: `${editingType} ${editingItem.id ? 'updated' : 'created'} successfully` });
      } else {
        throw new Error(`Failed to ${editingItem.id ? 'update' : 'create'} item`);
      }
    } catch (error) {
      console.error('Error saving item:', error);
      toast({ title: "Error", description: `Failed to ${editingItem.id ? 'update' : 'create'} item`, variant: "destructive" });
    }
  };

  const handleDelete = async (id: string, type: 'blog' | 'project' | 'playground') => {
    try {
      const endpoint = `/api/${type === 'blog' ? 'posts' : type === 'project' ? 'projects' : 'playground'}/id/${id}`;
      
      const response = await fetch(endpoint, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchContent(); // Refresh the data
        toast({ title: "Success", description: `${type} deleted successfully` });
      } else {
        throw new Error('Failed to delete item');
      }
    } catch (error) {
      console.error('Error deleting item:', error);
      toast({ title: "Error", description: "Failed to delete item", variant: "destructive" });
    }
  };

  const handleNewItem = (type: 'blog' | 'project' | 'playground') => {
    const newItem = type === 'blog' ? {
      title: '',
      content: '',
      slug: '',
      excerpt: ''
    } : type === 'project' ? {
      title: '',
      description: '',
      slug: '',
      technologies: '[]',
      demoUrl: '',
      githubUrl: ''
    } : {
      title: '',
      description: '',
      slug: '',
      component: ''
    };

    setEditingItem(newItem);
    setEditingType(type);
    setIsDialogOpen(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-background to-pink-50 dark:from-purple-950/20 dark:via-background dark:to-pink-950/20">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Content Management
              </h1>
              <p className="text-muted-foreground mt-2">
                Manage your blog posts, projects, and playground items
              </p>
            </div>
            <Button 
              onClick={fetchContent} 
              variant="outline" 
              size="sm"
              disabled={isLoading}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>

          <Tabs defaultValue="blog" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="blog">Blog Posts ({blogPosts.length})</TabsTrigger>
              <TabsTrigger value="projects">Projects ({projects.length})</TabsTrigger>
              <TabsTrigger value="playground">Playground ({playgroundProjects.length})</TabsTrigger>
            </TabsList>

            {/* Blog Posts Tab */}
            <TabsContent value="blog" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold">Blog Posts</h2>
                <Button onClick={() => handleNewItem('blog')}>
                  <Plus className="w-4 h-4 mr-2" />
                  New Post
                </Button>
              </div>
              
              <div className="grid gap-4">
                {blogPosts.map((post) => (
                  <Card key={post.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="flex items-center gap-2">
                            <FileText className="h-5 w-5 text-blue-500" />
                            {post.title}
                          </CardTitle>
                          <CardDescription className="mt-2">
                            Slug: /{post.slug}
                          </CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {formatDate(post.createdAt)}
                          </Badge>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(post, 'blog')}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Blog Post</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete "{post.title}"? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(post.id, 'blog')}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {post.excerpt || post.content.substring(0, 150) + "..."}
                      </p>
                      <div className="mt-4 flex items-center gap-2">
                        <Button variant="ghost" size="sm" asChild>
                          <a href={`/blog/${post.slug}`} target="_blank">
                            <ExternalLink className="w-4 h-4 mr-1" />
                            View
                          </a>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Projects Tab */}
            <TabsContent value="projects" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold">Projects</h2>
                <Button onClick={() => handleNewItem('project')}>
                  <Plus className="w-4 h-4 mr-2" />
                  New Project
                </Button>
              </div>
              
              <div className="grid gap-4">
                {projects.map((project) => (
                  <Card key={project.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="flex items-center gap-2">
                            <FolderOpen className="h-5 w-5 text-green-500" />
                            {project.title}
                          </CardTitle>
                          <CardDescription className="mt-2">
                            Slug: /{project.slug}
                          </CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {formatDate(project.createdAt)}
                          </Badge>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(project, 'project')}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Project</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete "{project.title}"? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(project.id, 'project')}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                        {project.description}
                      </p>
                      {project.technologies && (
                        <div className="flex flex-wrap gap-1 mb-4">
                          {(() => {
                            try {
                              return JSON.parse(project.technologies).map((tech: string, index: number) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {tech}
                                </Badge>
                              ));
                            } catch (error) {
                              console.error('Error parsing technologies:', error);
                              return (
                                <Badge variant="outline" className="text-xs">
                                  {project.technologies}
                                </Badge>
                              );
                            }
                          })()}
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" asChild>
                          <a href={`/projects/${project.slug}`} target="_blank">
                            <ExternalLink className="w-4 h-4 mr-1" />
                            View
                          </a>
                        </Button>
                        {project.demoUrl && (
                          <Button variant="ghost" size="sm" asChild>
                            <a href={project.demoUrl} target="_blank">
                              <ExternalLink className="w-4 h-4 mr-1" />
                              Demo
                            </a>
                          </Button>
                        )}
                        {project.githubUrl && (
                          <Button variant="ghost" size="sm" asChild>
                            <a href={project.githubUrl} target="_blank">
                              <ExternalLink className="w-4 h-4 mr-1" />
                              GitHub
                            </a>
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Playground Tab */}
            <TabsContent value="playground" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold">Playground Projects</h2>
                <Button onClick={() => handleNewItem('playground')}>
                  <Plus className="w-4 h-4 mr-2" />
                  New Playground
                </Button>
              </div>
              
              <div className="grid gap-4">
                {playgroundProjects.map((playground) => (
                  <Card key={playground.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="flex items-center gap-2">
                            <Gamepad2 className="h-5 w-5 text-purple-500" />
                            {playground.title}
                          </CardTitle>
                          <CardDescription className="mt-2">
                            Slug: /{playground.slug} • Component: {playground.component}
                          </CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {formatDate(playground.createdAt)}
                          </Badge>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(playground, 'playground')}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Playground Project</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete "{playground.title}"? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(playground.id, 'playground')}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                        {playground.description}
                      </p>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" asChild>
                          <a href={`/playground/${playground.slug}`} target="_blank">
                            <ExternalLink className="w-4 h-4 mr-1" />
                            View
                          </a>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>

          {/* Edit Dialog */}
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingItem?.id ? 'Edit' : 'New'} {editingType === 'blog' ? 'Blog Post' : editingType === 'project' ? 'Project' : 'Playground Project'}
                </DialogTitle>
                <DialogDescription>
                  {editingItem?.id ? 'Make changes to your content item.' : 'Create a new content item.'}
                </DialogDescription>
              </DialogHeader>
              
              {editingItem && (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Title</label>
                    <Input
                      value={editingItem.title || ''}
                      onChange={(e) => setEditingItem({...editingItem, title: e.target.value})}
                      placeholder="Enter title..."
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Slug</label>
                    <Input
                      value={editingItem.slug || ''}
                      onChange={(e) => setEditingItem({...editingItem, slug: e.target.value})}
                      placeholder="url-slug"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Description</label>
                    <Textarea
                      value={editingItem.description || editingItem.content || ''}
                      onChange={(e) => setEditingItem({
                        ...editingItem, 
                        ...(editingType === 'blog' ? { content: e.target.value } : { description: e.target.value })
                      })}
                      placeholder="Enter description/content..."
                      rows={6}
                    />
                  </div>
                  
                  {editingType === 'blog' && (
                    <div>
                      <label className="text-sm font-medium">Excerpt</label>
                      <Textarea
                        value={editingItem.excerpt || ''}
                        onChange={(e) => setEditingItem({...editingItem, excerpt: e.target.value})}
                        placeholder="Brief excerpt..."
                        rows={3}
                      />
                    </div>
                  )}
                  
                  {editingType === 'project' && (
                    <>
                      <div>
                        <label className="text-sm font-medium">Technologies (JSON array)</label>
                        <Input
                          value={editingItem.technologies || ''}
                          onChange={(e) => setEditingItem({...editingItem, technologies: e.target.value})}
                          placeholder='["React", "Next.js", "TypeScript"]'
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Demo URL</label>
                        <Input
                          value={editingItem.demoUrl || ''}
                          onChange={(e) => setEditingItem({...editingItem, demoUrl: e.target.value})}
                          placeholder="https://demo.example.com"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">GitHub URL</label>
                        <Input
                          value={editingItem.githubUrl || ''}
                          onChange={(e) => setEditingItem({...editingItem, githubUrl: e.target.value})}
                          placeholder="https://github.com/user/repo"
                        />
                      </div>
                    </>
                  )}
                  
                  {editingType === 'playground' && (
                    <div>
                      <label className="text-sm font-medium">Component Name</label>
                      <Input
                        value={editingItem.component || ''}
                        onChange={(e) => setEditingItem({...editingItem, component: e.target.value})}
                        placeholder="ComponentName"
                      />
                    </div>
                  )}
                  
                  <div className="flex justify-end gap-2 pt-4">
                    <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                    <Button onClick={handleSave}>
                      <Save className="w-4 h-4 mr-2" />
                      Save
                    </Button>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}
