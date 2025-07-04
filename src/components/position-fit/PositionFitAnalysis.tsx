'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { 
  ArrowLeft, 
  ArrowRight,
  Play,
  Trash2, 
  MapPin, 
  Building, 
  Calendar,
  Target,
  CheckCircle,
  AlertTriangle,
  Star,
  TrendingUp,
  TrendingDown,
  Lightbulb,
  ExternalLink,
  FileText,
  Upload,
  Sparkles,
  RefreshCw
} from 'lucide-react';
import { JobAnalysis, UserData, JobApplication } from './JobDashboard';
import { useRouter } from 'next/navigation';

interface PositionFitAnalysisProps {
  analysis: JobAnalysis;
  userData: UserData;
  onBack: () => void;
}

const statusConfig = {
  interested: {
    label: 'Interested',
    color: 'bg-blue-50 border-blue-200 text-blue-800',
    icon: Target
  },
  applied: {
    label: 'Applied',
    color: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    icon: Calendar
  },
  interviewing: {
    label: 'Interviewing',
    color: 'bg-purple-50 border-purple-200 text-purple-800',
    icon: Calendar
  },
  rejected: {
    label: 'Rejected',
    color: 'bg-red-50 border-red-200 text-red-800',
    icon: AlertTriangle
  },
  offered: {
    label: 'Offered',
    color: 'bg-green-50 border-green-200 text-green-800',
    icon: CheckCircle
  },
  withdrawn: {
    label: 'Withdrawn',
    color: 'bg-gray-50 border-gray-200 text-gray-600',
    icon: AlertTriangle
  }
};

const stepConfig = {
  job: {
    label: 'Job Analysis',
    icon: Target,
    description: 'Parse and analyze job posting',
    color: 'text-blue-500'
  },
  resume: {
    label: 'Resume Upload',
    icon: FileText,
    description: 'Upload and parse resume',
    color: 'text-green-500'
  },
  analysis: {
    label: 'AI Matching',
    icon: Sparkles,
    description: 'AI compatibility analysis',
    color: 'text-purple-500'
  },
  optimization: {
    label: 'Optimization',
    icon: TrendingUp,
    description: 'Resume optimization',
    color: 'text-orange-500'
  }
};

export default function PositionFitAnalysis({ analysis, userData, onBack }: PositionFitAnalysisProps) {
  const router = useRouter();
  const [applicationStatus, setApplicationStatus] = useState<JobApplication['status'] | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // Find associated application
  const application = userData.applications.find(app => app.analysisId === analysis.id);

  useEffect(() => {
    if (application) {
      setApplicationStatus(application.status);
    }
  }, [application]);

  // Save user data to localStorage
  const saveUserData = (data: UserData) => {
    try {
      localStorage.setItem(`position-fit-user-${data.userId}`, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving user data:', error);
    }
  };

  // Delete analysis
  const handleDeleteAnalysis = () => {
    const updatedUserData = {
      ...userData,
      analyses: userData.analyses.filter(a => a.id !== analysis.id),
      applications: userData.applications.filter(app => app.analysisId !== analysis.id),
      lastActive: new Date().toISOString()
    };
    
    saveUserData(updatedUserData);
    onBack();
  };

  // Continue analysis workflow
  const handleContinueAnalysis = () => {
    // Navigate back to the main Position Fit component with this analysis loaded
    router.push(`/playground/position-fit?continue=${analysis.id}`);
  };

  // Go to specific step
  const handleGoToStep = (step: 'job' | 'resume' | 'analysis' | 'optimization') => {
    router.push(`/playground/position-fit?continue=${analysis.id}&step=${step}`);
  };

  // Add/Update application status
  const handleStatusChange = (newStatus: JobApplication['status']) => {
    let updatedUserData = { ...userData };

    if (application) {
      // Update existing application
      updatedUserData.applications = userData.applications.map(app => 
        app.id === application.id ? {
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
        } : app
      );
    } else {
      // Create new application
      const newApplication: JobApplication = {
        id: `app-${Date.now()}`,
        analysisId: analysis.id,
        status: newStatus,
        lastUpdate: new Date().toISOString(),
        timeline: [{
          date: new Date().toISOString(),
          event: 'Status Updated',
          description: `Set status to ${statusConfig[newStatus].label}`
        }]
      };
      updatedUserData.applications = [...userData.applications, newApplication];
    }

    updatedUserData.lastActive = new Date().toISOString();
    saveUserData(updatedUserData);
    setApplicationStatus(newStatus);
  };

  // Generate unique analysis URL
  const analysisUrl = `${window.location.origin}/playground/position-fit/analysis/${analysis.id}`;

  // Get step status for visualization
  const getStepStatus = (step: keyof typeof stepConfig) => {
    const stepOrder: (keyof typeof stepConfig)[] = ['job', 'resume', 'analysis', 'optimization'];
    const currentStepIndex = stepOrder.indexOf(analysis.currentStep);
    const stepIndex = stepOrder.indexOf(step);
    
    if (stepIndex < currentStepIndex) {
      return 'completed';
    } else if (stepIndex === currentStepIndex) {
      return 'current';
    } else {
      return 'pending';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-background to-green-50 dark:from-blue-950/20 dark:via-background dark:to-green-950/20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="outline"
              onClick={onBack}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Button>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => navigator.clipboard.writeText(analysisUrl)}
                className="flex items-center gap-2"
              >
                <ExternalLink className="w-4 h-4" />
                Copy Link
              </Button>
              
              <Button
                onClick={handleContinueAnalysis}
                className="flex items-center gap-2"
              >
                <Play className="w-4 h-4" />
                Continue Analysis
              </Button>
              
              <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <DialogTrigger asChild>
                  <Button variant="destructive" className="flex items-center gap-2">
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Delete Analysis</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Are you sure you want to delete this analysis for <strong>{analysis.jobTitle}</strong> at <strong>{analysis.company}</strong>? This action cannot be undone and will also remove any associated application data.
                    </p>
                    <div className="flex gap-2">
                      <Button 
                        variant="destructive"
                        onClick={handleDeleteAnalysis}
                        className="flex-1"
                      >
                        Delete Permanently
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => setShowDeleteDialog(false)}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto space-y-6">
          {/* Job Information */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <CardTitle className="text-2xl">{analysis.jobTitle}</CardTitle>
                  <div className="flex items-center gap-4 mt-2 text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Building className="w-4 h-4" />
                      {analysis.company}
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {analysis.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(analysis.analyzedAt).toLocaleDateString()}
                    </div>
                  </div>
                  {analysis.salary && (
                    <p className="text-sm text-muted-foreground mt-1">
                      <strong>Salary:</strong> {analysis.salary}
                    </p>
                  )}
                  {analysis.jobUrl && (
                    <a 
                      href={analysis.jobUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:text-blue-800 underline mt-1 inline-block"
                    >
                      View Original Job Posting
                    </a>
                  )}
                </div>
                
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-lg font-semibold">
                    {analysis.matchScore}% Match
                  </Badge>
                  <Badge variant="secondary" className="capitalize">
                    {analysis.currentStep}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            
            {/* Application Status */}
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Application Status</h3>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        {applicationStatus ? 'Update Status' : 'Set Status'}
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>
                          {applicationStatus ? 'Update Application Status' : 'Set Application Status'}
                        </DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label>Status</Label>
                          <Select 
                            value={applicationStatus || undefined} 
                            onValueChange={(value) => handleStatusChange(value as JobApplication['status'])}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
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
                </div>
                
                {applicationStatus && (
                  <Badge className={statusConfig[applicationStatus].color}>
                    {statusConfig[applicationStatus].label}
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Analysis Progress & Navigation */}
          <Card>
            <CardHeader>
              <CardTitle>Analysis Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Progress Steps */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {(Object.keys(stepConfig) as Array<keyof typeof stepConfig>).map((step) => {
                    const config = stepConfig[step];
                    const status = getStepStatus(step);
                    const Icon = config.icon;
                    
                    return (
                      <Card 
                        key={step} 
                        className={`cursor-pointer transition-all hover:shadow-md ${
                          status === 'current' ? 'ring-2 ring-blue-500' : 
                          status === 'completed' ? 'bg-green-50 border-green-200' : 
                          'bg-gray-50 border-gray-200'
                        }`}
                        onClick={() => handleGoToStep(step)}
                      >
                        <CardContent className="p-4 text-center">
                          <div className={`flex items-center justify-center w-12 h-12 rounded-full mx-auto mb-2 ${
                            status === 'completed' ? 'bg-green-500 text-white' :
                            status === 'current' ? 'bg-blue-500 text-white' :
                            'bg-gray-300 text-gray-600'
                          }`}>
                            {status === 'completed' ? (
                              <CheckCircle className="w-6 h-6" />
                            ) : (
                              <Icon className="w-6 h-6" />
                            )}
                          </div>
                          <h4 className={`font-medium text-sm ${config.color}`}>
                            {config.label}
                          </h4>
                          <p className="text-xs text-muted-foreground mt-1">
                            {config.description}
                          </p>
                          {status === 'current' && (
                            <Badge variant="secondary" className="mt-2 text-xs">
                              Current
                            </Badge>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>

                {/* Quick Actions */}
                <div className="flex flex-wrap gap-2 pt-4 border-t">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleGoToStep('job')}
                    className="flex items-center gap-2"
                  >
                    <Target className="w-4 h-4" />
                    Review Job
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleGoToStep('resume')}
                    className="flex items-center gap-2"
                  >
                    <Upload className="w-4 h-4" />
                    Update Resume
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleGoToStep('analysis')}
                    className="flex items-center gap-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Re-analyze
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleGoToStep('optimization')}
                    className="flex items-center gap-2"
                  >
                    <TrendingUp className="w-4 h-4" />
                    Optimize Resume
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Analysis Results */}
          <Card>
            <CardHeader>
              <CardTitle>Analysis Results</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Strengths */}
              <div>
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  Strengths
                </h4>
                <ul className="space-y-1">
                  {analysis.strengths.map((strength, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Star className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{strength}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Gaps */}
              <div>
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <TrendingDown className="w-4 h-4 text-red-500" />
                  Areas for Improvement
                </h4>
                <ul className="space-y-1">
                  {analysis.gaps.map((gap, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{gap}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Recommendations */}
              <div>
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-yellow-500" />
                  Recommendations
                </h4>
                <ul className="space-y-1">
                  {analysis.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Lightbulb className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Requirements and Responsibilities */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Requirements</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-1">
                  {analysis.requirements.map((req, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-blue-500 mt-1">•</span>
                      <span className="text-sm">{req}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Responsibilities</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-1">
                  {analysis.responsibilities.map((resp, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-green-500 mt-1">•</span>
                      <span className="text-sm">{resp}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Notes */}
          {analysis.notes && (
            <Card>
              <CardHeader>
                <CardTitle>Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {analysis.notes}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
