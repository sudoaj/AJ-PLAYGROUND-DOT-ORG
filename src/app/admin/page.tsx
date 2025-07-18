"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { 
  User, 
  Mail, 
  Calendar, 
  Shield, 
  FileText, 
  FolderOpen, 
  Gamepad2,
  BarChart3,
  TrendingUp,
  Activity,
  Globe,
  Database,
  Server,
  Users,
  MessageSquare,
  Clock,
  Settings,
  Download,
  Upload,
  RefreshCw,
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  ExternalLink,
  Github
} from "lucide-react";

interface Stats {
  blogPosts: number;
  projects: number;
  playgroundProjects: number;
  totalUsers: number;
  lastUpdated?: string;
}

interface RecentActivity {
  id: string;
  type: 'blog' | 'project' | 'playground';
  title: string;
  action: 'created' | 'updated' | 'viewed';
  timestamp: string;
}

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

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const { toast } = useToast();
  const [stats, setStats] = useState<Stats>({
    blogPosts: 0,
    projects: 0,
    playgroundProjects: 0,
    totalUsers: 0,
    lastUpdated: new Date().toISOString(),
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Content management state
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [playgroundProjects, setPlaygroundProjects] = useState<PlaygroundProject[]>([]);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [editingType, setEditingType] = useState<'blog' | 'project' | 'playground' | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    if (session?.user) {
      fetchDashboardData();
    }
  }, [session]);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const [postsRes, projectsRes, playgroundRes] = await Promise.all([
        fetch("/api/blog"),
        fetch("/api/projects"),
        fetch("/api/playground"),
      ]);

      const [posts, projects, playground] = await Promise.all([
        postsRes.json(),
        projectsRes.json(),
        playgroundRes.json(),
      ]);

      // Set content data for content management
      setBlogPosts(posts);
      setProjects(projects);
      setPlaygroundProjects(playground);

      setStats({
        blogPosts: posts.length || 0,
        projects: projects.length || 0,
        playgroundProjects: playground.length || 0,
        totalUsers: 2, // We have 2 users in the database now
        lastUpdated: new Date().toISOString(),
      });

      // Generate real recent activity from actual data
      const recentActivity: RecentActivity[] = [
        ...posts.slice(0, 2).map((post: any, index: number) => ({
          id: `blog-${index}`,
          type: 'blog' as const,
          title: post.title,
          action: 'updated' as const,
          timestamp: post.createdAt || new Date().toISOString(),
        })),
        ...projects.slice(0, 2).map((project: any, index: number) => ({
          id: `project-${index}`,
          type: 'project' as const,
          title: project.title,
          action: 'viewed' as const,
          timestamp: project.createdAt || new Date().toISOString(),
        })),
        ...playground.slice(0, 2).map((item: any, index: number) => ({
          id: `playground-${index}`,
          type: 'playground' as const,
          title: item.title,
          action: 'created' as const,
          timestamp: item.createdAt || new Date().toISOString(),
        })),
      ];

      setRecentActivity(recentActivity.sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      ));
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast({ title: "Error", description: "Failed to fetch dashboard data", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  // Content management functions
  const handleEdit = (item: any, type: 'blog' | 'project' | 'playground') => {
    // Convert technologies array back to JSON string for editing if it's a project
    const editItem = { ...item };
    if (type === 'project' && editItem.technologies && Array.isArray(editItem.technologies)) {
      editItem.technologies = JSON.stringify(editItem.technologies);
    }
    setEditingItem(editItem);
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
        fetchDashboardData(); // Refresh the data
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
        fetchDashboardData(); // Refresh the data
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

  if (status === "loading") {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-pulse flex items-center gap-2">
            <Activity className="w-6 h-6 animate-spin" />
            Loading Dashboard...
          </div>
        </div>
      </div>
    );
  }

  if (!session) {
    redirect("/auth/signin");
  }

  // Basic admin check - you can enhance this with proper role-based access
  const isAdmin = session.user?.email === "admin@ajplayground.com" || session.user?.email === "admin2@ajplayground.com";

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInHours = Math.floor((now.getTime() - time.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-background to-pink-50 dark:from-purple-950/20 dark:via-background dark:to-pink-950/20">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Dashboard
              </h1>
              <p className="text-muted-foreground mt-2">
                Welcome back, {session.user?.name || 'Admin'}! Here's what's happening with your playground.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant={isAdmin ? "default" : "secondary"} className="px-3 py-1">
                <Shield className="w-4 h-4 mr-2" />
                {isAdmin ? "Admin" : "User"}
              </Badge>
              <Button 
                onClick={fetchDashboardData} 
                variant="outline" 
                size="sm"
                disabled={isLoading}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </div>

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Stats Grid */}
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card className="border-2 hover:border-purple-200 transition-colors">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Registered Users</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.totalUsers}</div>
                    <p className="text-xs text-muted-foreground">
                      Total registered accounts
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-2 hover:border-blue-200 transition-colors">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Projects</CardTitle>
                    <FolderOpen className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.projects}</div>
                    <p className="text-xs text-muted-foreground">
                      Active portfolio items
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-2 hover:border-green-200 transition-colors">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Blog Posts</CardTitle>
                    <FileText className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.blogPosts}</div>
                    <p className="text-xs text-muted-foreground">
                      Published articles
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-2 hover:border-orange-200 transition-colors">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Playground Items</CardTitle>
                    <Gamepad2 className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.playgroundProjects}</div>
                    <p className="text-xs text-muted-foreground">
                      Interactive demos
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Content Overview */}
              <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3">
                <Card className="hover:shadow-lg transition-shadow lg:col-span-2">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="h-5 w-5 text-purple-500" />
                      Content Management
                    </CardTitle>
                    <CardDescription>Manage all your content in one place</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-blue-500">{stats.blogPosts}</div>
                        <div className="text-sm text-muted-foreground">Blog Posts</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-green-500">{stats.projects}</div>
                        <div className="text-sm text-muted-foreground">Projects</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-purple-500">{stats.playgroundProjects}</div>
                        <div className="text-sm text-muted-foreground">Playground</div>
                      </div>
                    </div>
                    <Button className="w-full" onClick={() => (document.querySelector('[data-value="content"]') as HTMLElement)?.click()}>
                      <Edit className="w-4 h-4 mr-2" />
                      Manage Content
                    </Button>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Database className="h-5 w-5 text-blue-500" />
                      Quick Actions
                    </CardTitle>
                    <CardDescription>Common admin tasks</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button variant="outline" className="w-full">
                      <Upload className="w-4 h-4 mr-2" />
                      Import Content
                    </Button>
                    <Button variant="outline" className="w-full">
                      <Download className="w-4 h-4 mr-2" />
                      Export Data
                    </Button>
                    <Button variant="outline" className="w-full">
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Backup Database
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Recent Activity
                  </CardTitle>
                  <CardDescription>Latest updates and interactions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivity.map((activity) => (
                      <div key={activity.id} className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
                        <div className="flex-shrink-0">
                          {activity.type === 'blog' && <FileText className="h-4 w-4 text-blue-500" />}
                          {activity.type === 'project' && <FolderOpen className="h-4 w-4 text-green-500" />}
                          {activity.type === 'playground' && <Gamepad2 className="h-4 w-4 text-purple-500" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{activity.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {activity.action} • {formatTimeAgo(activity.timestamp)}
                          </p>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {activity.type}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="content" className="space-y-6">
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
                          <p className="text-sm text-muted-foreground mb-3">
                            {project.description}
                          </p>
                          <div className="flex flex-wrap gap-2 mb-3">
                            {(() => {
                              let technologies = [];
                              try {
                                if (typeof project.technologies === 'string') {
                                  technologies = JSON.parse(project.technologies);
                                } else if (Array.isArray(project.technologies)) {
                                  technologies = project.technologies;
                                }
                              } catch (e) {
                                if (typeof project.technologies === 'string') {
                                  technologies = [project.technologies];
                                }
                              }
                              return technologies.map((tech: string, index: number) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {tech}
                                </Badge>
                              ));
                            })()}
                          </div>
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
                                  <Globe className="w-4 h-4 mr-1" />
                                  Demo
                                </a>
                              </Button>
                            )}
                            {project.githubUrl && (
                              <Button variant="ghost" size="sm" asChild>
                                <a href={project.githubUrl} target="_blank">
                                  <Github className="w-4 h-4 mr-1" />
                                  Code
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
                                Slug: /{playground.slug}
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
                          <p className="text-sm text-muted-foreground mb-3">
                            {playground.description}
                          </p>
                          <div className="mb-3">
                            <Badge variant="outline" className="text-xs">
                              Component: {playground.component}
                            </Badge>
                          </div>
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
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" />
                      Content Overview
                    </CardTitle>
                    <CardDescription>Distribution of your content types</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Blog Posts</span>
                        <span className="text-2xl font-bold">{stats.blogPosts}</span>
                      </div>
                      <Progress value={stats.blogPosts > 0 ? (stats.blogPosts / (stats.blogPosts + stats.projects + stats.playgroundProjects)) * 100 : 0} className="h-3" />
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Projects</span>
                        <span className="text-2xl font-bold">{stats.projects}</span>
                      </div>
                      <Progress value={stats.projects > 0 ? (stats.projects / (stats.blogPosts + stats.projects + stats.playgroundProjects)) * 100 : 0} className="h-3" />
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Playground Items</span>
                        <span className="text-2xl font-bold">{stats.playgroundProjects}</span>
                      </div>
                      <Progress value={stats.playgroundProjects > 0 ? (stats.playgroundProjects / (stats.blogPosts + stats.projects + stats.playgroundProjects)) * 100 : 0} className="h-3" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Recent Content
                    </CardTitle>
                    <CardDescription>Latest added content items</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentActivity.slice(0, 3).map((activity) => (
                        <div key={activity.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                          <div>
                            <p className="font-medium text-sm">{activity.title}</p>
                            <p className="text-xs text-muted-foreground capitalize">{activity.type}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-sm">{activity.action}</p>
                            <p className="text-xs text-muted-foreground">{formatTimeAgo(activity.timestamp)}</p>
                          </div>
                        </div>
                      ))}
                      {recentActivity.length === 0 && (
                        <p className="text-center text-muted-foreground py-4">No recent activity</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Profile Settings
                    </CardTitle>
                    <CardDescription>Your account and profile information</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                        <User className="h-8 w-8 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{session.user?.name || "No name provided"}</p>
                          <p className="text-xs text-muted-foreground">{session.user?.email || "No email provided"}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm">
                        <Shield className="h-4 w-4 text-muted-foreground" />
                        <span>User ID: {session.user?.id}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>Last updated: {new Date(stats.lastUpdated || '').toLocaleDateString()}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2 pt-4">
                      <Button variant="outline" className="w-full">
                        <User className="w-4 h-4 mr-2" />
                        Edit Profile
                      </Button>
                      <Button variant="outline" className="w-full">
                        <Shield className="w-4 h-4 mr-2" />
                        Security Settings
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="h-5 w-5" />
                      Application Settings
                    </CardTitle>
                    <CardDescription>Configure system preferences</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-sm">Maintenance Mode</p>
                          <p className="text-xs text-muted-foreground">Temporarily disable public access</p>
                        </div>
                        <Button variant="outline" size="sm">
                          <Settings className="w-4 h-4" />
                        </Button>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-sm">Email Notifications</p>
                          <p className="text-xs text-muted-foreground">Get notified of important events</p>
                        </div>
                        <Button variant="outline" size="sm">
                          <Mail className="w-4 h-4" />
                        </Button>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-sm">Analytics Tracking</p>
                          <p className="text-xs text-muted-foreground">Monitor site performance</p>
                        </div>
                        <Button variant="outline" size="sm">
                          <BarChart3 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingItem?.id ? 'Edit' : 'Create'} {editingType === 'blog' ? 'Blog Post' : editingType === 'project' ? 'Project' : 'Playground Project'}
            </DialogTitle>
            <DialogDescription>
              Fill in the details below to {editingItem?.id ? 'update' : 'create'} the item.
            </DialogDescription>
          </DialogHeader>
          
          {editingItem && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Title</label>
                <Input
                  value={editingItem.title || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                  placeholder="Enter title"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">Slug</label>
                <Input
                  value={editingItem.slug || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, slug: e.target.value })}
                  placeholder="Enter URL slug"
                />
              </div>
              
              {editingType === 'blog' && (
                <>
                  <div>
                    <label className="text-sm font-medium">Excerpt</label>
                    <Textarea
                      value={editingItem.excerpt || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, excerpt: e.target.value })}
                      placeholder="Short description"
                      rows={2}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Content</label>
                    <Textarea
                      value={editingItem.content || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, content: e.target.value })}
                      placeholder="Full content (Markdown supported)"
                      rows={8}
                    />
                  </div>
                </>
              )}
              
              {editingType === 'project' && (
                <>
                  <div>
                    <label className="text-sm font-medium">Description</label>
                    <Textarea
                      value={editingItem.description || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                      placeholder="Project description"
                      rows={3}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Technologies (JSON Array)</label>
                    <Textarea
                      value={editingItem.technologies || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, technologies: e.target.value })}
                      placeholder='["React", "TypeScript", "Next.js"]'
                      rows={2}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Demo URL</label>
                    <Input
                      value={editingItem.demoUrl || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, demoUrl: e.target.value })}
                      placeholder="https://..."
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">GitHub URL</label>
                    <Input
                      value={editingItem.githubUrl || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, githubUrl: e.target.value })}
                      placeholder="https://github.com/..."
                    />
                  </div>
                </>
              )}
              
              {editingType === 'playground' && (
                <>
                  <div>
                    <label className="text-sm font-medium">Description</label>
                    <Textarea
                      value={editingItem.description || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                      placeholder="Playground description"
                      rows={3}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Component</label>
                    <Input
                      value={editingItem.component || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, component: e.target.value })}
                      placeholder="ComponentName"
                    />
                  </div>
                </>
              )}
              
              <div className="flex justify-end gap-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsDialogOpen(false);
                    setEditingItem(null);
                    setEditingType(null);
                  }}
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
                <Button onClick={handleSave}>
                  <Save className="w-4 h-4 mr-2" />
                  {editingItem?.id ? 'Update' : 'Create'}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}