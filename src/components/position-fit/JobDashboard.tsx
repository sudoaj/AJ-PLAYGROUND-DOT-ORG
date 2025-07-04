'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  User, 
  Plus, 
  Eye, 
  Edit, 
  Trash2, 
  Download, 
  Upload,
  Calendar,
  Building,
  MapPin,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Mail,
  FileText,
  BarChart3,
  Target,
  ArrowRight,
  ArrowLeft,
  ExternalLink
} from 'lucide-react';

export interface JobAnalysis {
  id: string;
  jobTitle: string;
  company: string;
  location: string;
  salary?: string;
  jobUrl?: string;
  jobDescription: string;
  requirements: string[];
  responsibilities: string[];
  benefits: string[];
  matchScore: number;
  strengths: string[];
  gaps: string[];
  recommendations: string[];
  analyzedAt: string;
  notes?: string;
  resumeOptimized: boolean;
  // Full state restoration data
  currentStep: 'job' | 'resume' | 'analysis' | 'optimization';
  jobPosting?: any; // Full job posting data
  resume?: any; // Full resume data
  analysis?: any; // Full analysis data
  optimizedResume?: any; // Full optimized resume data
}

export interface JobApplication {
  id: string;
  analysisId: string;
  status: 'interested' | 'applied' | 'interviewing' | 'rejected' | 'offered' | 'withdrawn';
  appliedAt?: string;
  lastUpdate: string;
  notes?: string;
  contacts?: {
    name: string;
    email: string;
    role: string;
  }[];
  timeline: {
    date: string;
    event: string;
    description: string;
  }[];
}

export interface UserData {
  userId: string;
  name: string;
  email: string;
  createdAt: string;
  lastActive: string;
  analyses: JobAnalysis[];
  applications: JobApplication[];
}

const defaultUserData: Omit<UserData, 'userId'> = {
  name: '',
  email: '',
  createdAt: new Date().toISOString(),
  lastActive: new Date().toISOString(),
  analyses: [],
  applications: []
};

const statusConfig = {
  interested: {
    label: 'Interested',
    color: 'bg-blue-50 border-blue-200 text-blue-800',
    icon: Target
  },
  applied: {
    label: 'Applied',
    color: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    icon: Mail
  },
  interviewing: {
    label: 'Interviewing',
    color: 'bg-purple-50 border-purple-200 text-purple-800',
    icon: Calendar
  },
  rejected: {
    label: 'Rejected',
    color: 'bg-red-50 border-red-200 text-red-800',
    icon: XCircle
  },
  offered: {
    label: 'Offered',
    color: 'bg-green-50 border-green-200 text-green-800',
    icon: CheckCircle
  },
  withdrawn: {
    label: 'Withdrawn',
    color: 'bg-gray-50 border-gray-200 text-gray-600',
    icon: AlertCircle
  }
};

interface JobDashboardProps {
  onStartAnalysis: () => void;
  onViewAnalysis: (analysis: JobAnalysis) => void;
  onUserLogin?: (userData: UserData) => void;
  currentUser?: UserData | null;
  isLoggedIn?: boolean;
}

export default function JobDashboard({ 
  onStartAnalysis, 
  onViewAnalysis, 
  onUserLogin,
  currentUser: propCurrentUser,
  isLoggedIn: propIsLoggedIn 
}: JobDashboardProps) {
  const router = useRouter();
  const [userId, setUserId] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(propIsLoggedIn || false);
  const [userData, setUserData] = useState<UserData | null>(propCurrentUser || null);
  const [selectedAnalysis, setSelectedAnalysis] = useState<JobAnalysis | null>(null);
  const [newApplicationStatus, setNewApplicationStatus] = useState<JobApplication['status']>('interested');
  const [showUserSetup, setShowUserSetup] = useState(false);
  const [tempUserData, setTempUserData] = useState({ name: '', email: '' });

  // Load user data from localStorage
  const loadUserData = (id: string): UserData | null => {
    try {
      const stored = localStorage.getItem(`position-fit-user-${id}`);
      if (stored) {
        return JSON.parse(stored);
      }
      return null;
    } catch (error) {
      console.error('Error loading user data:', error);
      return null;
    }
  };

  // Save user data to localStorage
  const saveUserData = (data: UserData) => {
    try {
      localStorage.setItem(`position-fit-user-${data.userId}`, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving user data:', error);
    }
  };

  // Sync with parent props
  useEffect(() => {
    if (propCurrentUser) {
      setUserData(propCurrentUser);
      setIsLoggedIn(true);
    }
    if (propIsLoggedIn !== undefined) {
      setIsLoggedIn(propIsLoggedIn);
    }
  }, [propCurrentUser, propIsLoggedIn]);

  // Handle user login/identification
  const handleLogin = () => {
    if (!userId.trim()) return;
    
    const existingData = loadUserData(userId);
    
    if (existingData) {
      // Update last active time
      existingData.lastActive = new Date().toISOString();
      setUserData(existingData);
      saveUserData(existingData);
      setIsLoggedIn(true);
      
      // Notify parent component
      if (onUserLogin) {
        onUserLogin(existingData);
      }
    } else {
      // New user - show setup dialog
      setShowUserSetup(true);
    }
  };

  // Create new user
  const createUser = () => {
    if (!userId.trim() || !tempUserData.name.trim()) return;
    
    const newUser: UserData = {
      ...defaultUserData,
      userId: userId.trim(),
      name: tempUserData.name.trim(),
      email: tempUserData.email.trim()
    };
    
    setUserData(newUser);
    saveUserData(newUser);
    setIsLoggedIn(true);
    setShowUserSetup(false);
    
    // Notify parent component
    if (onUserLogin) {
      onUserLogin(newUser);
    }
  };

  // Add analysis to user data
  const addAnalysis = (analysis: JobAnalysis) => {
    if (!userData) return;
    
    const updatedData = {
      ...userData,
      analyses: [...userData.analyses, analysis],
      lastActive: new Date().toISOString()
    };
    
    setUserData(updatedData);
    saveUserData(updatedData);
  };

  // Add application to user data
  const addApplication = (analysisId: string, status: JobApplication['status']) => {
    if (!userData) return;
    
    const application: JobApplication = {
      id: `app-${Date.now()}`,
      analysisId,
      status,
      lastUpdate: new Date().toISOString(),
      timeline: [{
        date: new Date().toISOString(),
        event: 'Status Updated',
        description: `Set status to ${statusConfig[status].label}`
      }]
    };
    
    const updatedData = {
      ...userData,
      applications: [...userData.applications, application],
      lastActive: new Date().toISOString()
    };
    
    setUserData(updatedData);
    saveUserData(updatedData);
  };

  // Delete analysis
  const deleteAnalysis = (analysisId: string) => {
    if (!userData) return;
    
    const updatedData = {
      ...userData,
      analyses: userData.analyses.filter(analysis => analysis.id !== analysisId),
      applications: userData.applications.filter(app => app.analysisId !== analysisId),
      lastActive: new Date().toISOString()
    };
    
    setUserData(updatedData);
    saveUserData(updatedData);
  };

  // Update application status
  const updateApplicationStatus = (applicationId: string, newStatus: JobApplication['status']) => {
    if (!userData) return;
    
    const updatedApplications = userData.applications.map(app => {
      if (app.id === applicationId) {
        return {
          ...app,
          status: newStatus,
          lastUpdate: new Date().toISOString(),
          timeline: [
            ...app.timeline,
            {
              date: new Date().toISOString(),
              event: 'Status Updated',
              description: `Changed status to ${statusConfig[newStatus].label}`
            }
          ]
        };
      }
      return app;
    });
    
    const updatedData = {
      ...userData,
      applications: updatedApplications,
      lastActive: new Date().toISOString()
    };
    
    setUserData(updatedData);
    saveUserData(updatedData);
  };

  // Export user data
  const exportUserData = () => {
    if (!userData) return;
    
    const dataStr = JSON.stringify(userData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `position-fit-data-${userData.userId}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Import user data
  const importUserData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target?.result as string);
        setUserData(importedData);
        saveUserData(importedData);
        setUserId(importedData.userId);
        setIsLoggedIn(true);
      } catch (error) {
        console.error('Error importing data:', error);
      }
    };
    reader.readAsText(file);
  };

  // Get applications grouped by status
  const getApplicationsByStatus = (status: JobApplication['status']) => {
    if (!userData) return [];
    
    return userData.applications
      .filter(app => app.status === status)
      .map(app => {
        const analysis = userData.analyses.find(a => a.id === app.analysisId);
        return { application: app, analysis };
      })
      .filter(item => item.analysis);
  };

  // Get analysis without application
  const getAnalysesWithoutApplication = () => {
    if (!userData) return [];
    
    const appliedAnalysisIds = userData.applications.map(app => app.analysisId);
    return userData.analyses.filter(analysis => !appliedAnalysisIds.includes(analysis.id));
  };

  // Sync with parent props
  useEffect(() => {
    if (propCurrentUser) {
      setUserData(propCurrentUser);
      setIsLoggedIn(true);
    }
    if (propIsLoggedIn !== undefined) {
      setIsLoggedIn(propIsLoggedIn);
    }
  }, [propCurrentUser, propIsLoggedIn]);

  if (!isLoggedIn) {
    return (
      <div className="max-w-md mx-auto mt-20 space-y-6">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <User className="w-6 h-6" />
              Position Fit AI Dashboard
            </CardTitle>
            <p className="text-muted-foreground">
              Enter your user ID to access your job analyses and applications
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="userId">User ID</Label>
              <Input
                id="userId"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                placeholder="Enter your unique identifier"
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
              />
              <p className="text-xs text-muted-foreground">
                Use any text as your identifier. If it's new, you'll be prompted to set up your profile.
              </p>
            </div>
            
            <Button onClick={handleLogin} className="w-full" disabled={!userId.trim()}>
              Access Dashboard
            </Button>
            
            <div className="text-center">
              <Label htmlFor="import-data" className="cursor-pointer text-sm text-blue-600 hover:underline">
                <Upload className="w-4 h-4 inline mr-1" />
                Import existing data
              </Label>
              <Input
                id="import-data"
                type="file"
                accept=".json"
                onChange={importUserData}
                className="hidden"
              />
            </div>
          </CardContent>
        </Card>

        {/* User Setup Dialog */}
        <Dialog open={showUserSetup} onOpenChange={setShowUserSetup}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Welcome! Set up your profile</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input
                  value={tempUserData.name}
                  onChange={(e) => setTempUserData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Your full name"
                />
              </div>
              <div className="space-y-2">
                <Label>Email (Optional)</Label>
                <Input
                  value={tempUserData.email}
                  onChange={(e) => setTempUserData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="your.email@example.com"
                />
              </div>
              <Button onClick={createUser} className="w-full" disabled={!tempUserData.name.trim()}>
                Create Profile
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-4 mb-2">
            <Button variant="ghost" asChild className="p-0 h-auto">
              <Link href="/playground" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                <ArrowLeft className="w-4 h-4" />
                Back to Playground
              </Link>
            </Button>
          </div>
          <h1 className="text-2xl font-bold">Position Fit AI Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {userData?.name}! Track your job applications and analyses.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={exportUserData}>
            <Download className="w-4 h-4 mr-2" />
            Export Data
          </Button>
          <Button onClick={onStartAnalysis}>
            <Plus className="w-4 h-4 mr-2" />
            New Analysis
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-sm font-medium">Total Analyses</p>
                <p className="text-2xl font-bold">{userData?.analyses.length || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-green-500" />
              <div>
                <p className="text-sm font-medium">Applications</p>
                <p className="text-2xl font-bold">{userData?.applications.length || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-purple-500" />
              <div>
                <p className="text-sm font-medium">Interviewing</p>
                <p className="text-2xl font-bold">{getApplicationsByStatus('interviewing').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm font-medium">Offers</p>
                <p className="text-2xl font-bold">{getApplicationsByStatus('offered').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Analysis (Not Applied) */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-500" />
              Analysis
              <Badge variant="secondary">{getAnalysesWithoutApplication().length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {getAnalysesWithoutApplication().map((analysis) => (
              <Card key={analysis.id} className="p-3">
                <div className="space-y-2">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{analysis.jobTitle}</h4>
                      <p className="text-xs text-muted-foreground">{analysis.company}</p>
                      <p className="text-xs text-blue-600 font-mono">
                        /analysis/{analysis.id}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {analysis.matchScore}% match
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        {analysis.currentStep}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <MapPin className="w-3 h-3" />
                    {analysis.location}
                    <Clock className="w-3 h-3 ml-2" />
                    {new Date(analysis.analyzedAt).toLocaleDateString()}
                  </div>
                  
                  <div className="flex items-center gap-2 pt-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => router.push(`/playground/position-fit/analysis/${analysis.id}`)}
                    >
                      <Eye className="w-3 h-3 mr-1" />
                      {analysis.currentStep === 'job' ? 'Continue' : 'View'}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => router.push(`/playground/position-fit/analysis/${analysis.id}`)}
                    >
                      <ExternalLink className="w-3 h-3 mr-1" />
                      Open
                    </Button>
                    {analysis.currentStep === 'analysis' || analysis.currentStep === 'optimization' ? (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="sm" onClick={() => setSelectedAnalysis(analysis)}>
                            <ArrowRight className="w-3 h-3 mr-1" />
                            Apply
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Add to Application Pipeline</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <Label>Initial Status</Label>
                              <Select value={newApplicationStatus} onValueChange={(value) => setNewApplicationStatus(value as JobApplication['status'])}>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="interested">Interested</SelectItem>
                                  <SelectItem value="applied">Applied</SelectItem>
                                  <SelectItem value="interviewing">Interviewing</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <Button 
                              onClick={() => {
                                if (selectedAnalysis) {
                                  addApplication(selectedAnalysis.id, newApplicationStatus);
                                  setSelectedAnalysis(null);
                                }
                              }}
                              className="w-full"
                            >
                              Add to Pipeline
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    ) : null}
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="sm" variant="destructive" className="ml-auto">
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Delete Analysis</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <p className="text-sm text-muted-foreground">
                            Are you sure you want to delete this analysis for <strong>{analysis.jobTitle}</strong> at <strong>{analysis.company}</strong>? This action cannot be undone.
                          </p>
                          <div className="flex gap-2">
                            <Button 
                              variant="destructive"
                              onClick={() => deleteAnalysis(analysis.id)}
                              className="flex-1"
                            >
                              Delete
                            </Button>
                            <DialogTrigger asChild>
                              <Button variant="outline" className="flex-1">
                                Cancel
                              </Button>
                            </DialogTrigger>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </Card>
            ))}
            
            {getAnalysesWithoutApplication().length === 0 && (
              <div className="text-center text-muted-foreground py-8">
                <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No analyses yet</p>
                <Button variant="outline" className="mt-2" onClick={onStartAnalysis}>
                  Start Analysis
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Active Applications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-yellow-500" />
              Active Pipeline
              <Badge variant="secondary">
                {getApplicationsByStatus('interested').length + getApplicationsByStatus('applied').length + getApplicationsByStatus('interviewing').length}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="interested" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="interested">Interested</TabsTrigger>
                <TabsTrigger value="applied">Applied</TabsTrigger>
                <TabsTrigger value="interviewing">Interview</TabsTrigger>
              </TabsList>
              
              {(['interested', 'applied', 'interviewing'] as const).map((status) => (
                <TabsContent key={status} value={status} className="space-y-3">
                  {getApplicationsByStatus(status).map(({ application, analysis }) => (
                    <Card key={application.id} className="p-3">
                      <div className="space-y-2">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium text-sm">{analysis?.jobTitle}</h4>
                            <p className="text-xs text-muted-foreground">{analysis?.company}</p>
                          </div>
                          <Badge className={statusConfig[status].color}>
                            {statusConfig[status].label}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          {new Date(application.lastUpdate).toLocaleDateString()}
                        </div>
                        
                        <div className="flex items-center gap-2 pt-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => router.push(`/playground/position-fit/analysis/${analysis?.id}`)}
                          >
                            <Eye className="w-3 h-3 mr-1" />
                            View
                          </Button>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button size="sm" variant="outline">
                                <Edit className="w-3 h-3 mr-1" />
                                Update
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Update Application Status</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div>
                                  <Label>New Status</Label>
                                  <Select onValueChange={(value) => updateApplicationStatus(application.id, value as JobApplication['status'])}>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select new status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="interested">Interested</SelectItem>
                                      <SelectItem value="applied">Applied</SelectItem>
                                      <SelectItem value="interviewing">Interviewing</SelectItem>
                                      <SelectItem value="offered">Offered</SelectItem>
                                      <SelectItem value="rejected">Rejected</SelectItem>
                                      <SelectItem value="withdrawn">Withdrawn</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button size="sm" variant="destructive" className="ml-auto">
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Delete Application</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                <p className="text-sm text-muted-foreground">
                                  Are you sure you want to delete this application for <strong>{analysis?.jobTitle}</strong> at <strong>{analysis?.company}</strong>? This will also delete the associated analysis and cannot be undone.
                                </p>
                                <div className="flex gap-2">
                                  <Button 
                                    variant="destructive"
                                    onClick={() => deleteAnalysis(application.analysisId)}
                                    className="flex-1"
                                  >
                                    Delete
                                  </Button>
                                  <DialogTrigger asChild>
                                    <Button variant="outline" className="flex-1">
                                      Cancel
                                    </Button>
                                  </DialogTrigger>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </div>
                    </Card>
                  ))}
                  
                  {getApplicationsByStatus(status).length === 0 && (
                    <div className="text-center text-muted-foreground py-4">
                      <p className="text-sm">No {status} applications</p>
                    </div>
                  )}
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>

        {/* Completed Applications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              Completed
              <Badge variant="secondary">
                {getApplicationsByStatus('offered').length + getApplicationsByStatus('rejected').length + getApplicationsByStatus('withdrawn').length}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="offered" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="offered">Offered</TabsTrigger>
                <TabsTrigger value="rejected">Rejected</TabsTrigger>
                <TabsTrigger value="withdrawn">Withdrawn</TabsTrigger>
              </TabsList>
              
              {(['offered', 'rejected', 'withdrawn'] as const).map((status) => (
                <TabsContent key={status} value={status} className="space-y-3">
                  {getApplicationsByStatus(status).map(({ application, analysis }) => (
                    <Card key={application.id} className="p-3">
                      <div className="space-y-2">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium text-sm">{analysis?.jobTitle}</h4>
                            <p className="text-xs text-muted-foreground">{analysis?.company}</p>
                          </div>
                          <Badge className={statusConfig[status].color}>
                            {statusConfig[status].label}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          {new Date(application.lastUpdate).toLocaleDateString()}
                        </div>
                        
                        <div className="flex items-center gap-2 pt-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => router.push(`/playground/position-fit/analysis/${analysis?.id}`)}
                          >
                            <Eye className="w-3 h-3 mr-1" />
                            View
                          </Button>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button size="sm" variant="destructive" className="ml-auto">
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Delete Application</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                <p className="text-sm text-muted-foreground">
                                  Are you sure you want to delete this application for <strong>{analysis?.jobTitle}</strong> at <strong>{analysis?.company}</strong>? This will also delete the associated analysis and cannot be undone.
                                </p>
                                <div className="flex gap-2">
                                  <Button 
                                    variant="destructive"
                                    onClick={() => deleteAnalysis(application.analysisId)}
                                    className="flex-1"
                                  >
                                    Delete
                                  </Button>
                                  <DialogTrigger asChild>
                                    <Button variant="outline" className="flex-1">
                                      Cancel
                                    </Button>
                                  </DialogTrigger>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </div>
                    </Card>
                  ))}
                  
                  {getApplicationsByStatus(status).length === 0 && (
                    <div className="text-center text-muted-foreground py-4">
                      <p className="text-sm">No {status} applications</p>
                    </div>
                  )}
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
