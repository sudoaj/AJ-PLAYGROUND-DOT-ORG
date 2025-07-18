"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  RefreshCw
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

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const [stats, setStats] = useState<Stats>({
    blogPosts: 0,
    projects: 0,
    playgroundProjects: 0,
    totalUsers: 0,
    lastUpdated: new Date().toISOString(),
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
    } finally {
      setIsLoading(false);
    }
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
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-blue-500" />
                      Blog Posts
                    </CardTitle>
                    <CardDescription>Published articles and content</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-3xl font-bold">{stats.blogPosts}</span>
                        <Badge variant="secondary">Active</Badge>
                      </div>
                      <Progress value={75} className="h-2" />
                      <Button variant="outline" size="sm" className="w-full" asChild>
                        <a href="/admin/content">
                          <Settings className="w-4 h-4 mr-2" />
                          Manage Posts
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FolderOpen className="h-5 w-5 text-green-500" />
                      Projects
                    </CardTitle>
                    <CardDescription>Portfolio and showcase items</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-3xl font-bold">{stats.projects}</span>
                        <Badge variant="secondary">Live</Badge>
                      </div>
                      <Progress value={90} className="h-2" />
                      <Button variant="outline" size="sm" className="w-full" asChild>
                        <a href="/admin/content">
                          <Settings className="w-4 h-4 mr-2" />
                          Manage Projects
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Gamepad2 className="h-5 w-5 text-purple-500" />
                      Playground
                    </CardTitle>
                    <CardDescription>Interactive demos and tools</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-3xl font-bold">{stats.playgroundProjects}</span>
                        <Badge variant="secondary">Interactive</Badge>
                      </div>
                      <Progress value={85} className="h-2" />
                      <Button variant="outline" size="sm" className="w-full" asChild>
                        <a href="/admin/content">
                          <Settings className="w-4 h-4 mr-2" />
                          Manage Playground
                        </a>
                      </Button>
                    </div>
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
              <div className="grid gap-6 md:grid-cols-3">
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-blue-500" />
                      Content Management
                    </CardTitle>
                    <CardDescription>Manage all your content in one place</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button className="w-full" asChild>
                      <a href="/admin/content">
                        <Settings className="w-4 h-4 mr-2" />
                        Open Content Manager
                      </a>
                    </Button>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Blog Posts:</span>
                        <span className="font-medium">{stats.blogPosts}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Projects:</span>
                        <span className="font-medium">{stats.projects}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Playground:</span>
                        <span className="font-medium">{stats.playgroundProjects}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Upload className="h-5 w-5 text-green-500" />
                      Import & Export
                    </CardTitle>
                    <CardDescription>Backup and migrate your content</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button variant="outline" className="w-full">
                      <Upload className="w-4 h-4 mr-2" />
                      Import Content
                    </Button>
                    <Button variant="outline" className="w-full">
                      <Download className="w-4 h-4 mr-2" />
                      Export All Data
                    </Button>
                    <Button variant="outline" className="w-full">
                      <Database className="w-4 h-4 mr-2" />
                      Database Backup
                    </Button>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="h-5 w-5 text-purple-500" />
                      Quick Actions
                    </CardTitle>
                    <CardDescription>Common administrative tasks</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button variant="outline" className="w-full">
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Rebuild Search Index
                    </Button>
                    <Button variant="outline" className="w-full">
                      <Globe className="w-4 h-4 mr-2" />
                      Clear Cache
                    </Button>
                    <Button variant="outline" className="w-full">
                      <Server className="w-4 h-4 mr-2" />
                      Health Check
                    </Button>
                  </CardContent>
                </Card>
              </div>
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
    </div>
  );
}