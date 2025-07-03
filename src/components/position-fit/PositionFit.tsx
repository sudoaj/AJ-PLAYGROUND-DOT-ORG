'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Target, 
  FileText, 
  Download, 
  Sparkles, 
  TrendingUp,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Briefcase,
  GraduationCap,
  Award
} from 'lucide-react';

import JobAnalyzer from './JobAnalyzer';
import ResumeUploader from './ResumeUploader';
import MatchingResults from './MatchingResults';
import ResumeOptimizer from './ResumeOptimizer';

interface JobPosting {
  title: string;
  company: string;
  location: string;
  salary?: {
    min: number;
    max: number;
    currency: string;
  };
  requirements: {
    required: string[];
    preferred: string[];
    experience: string;
  };
  responsibilities: string[];
  benefits: string[];
  jobType: 'full-time' | 'part-time' | 'contract' | 'internship';
}

interface ParsedResume {
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    location: string;
  };
  experience: Array<{
    title: string;
    company: string;
    duration: string;
    responsibilities: string[];
  }>;
  education: Array<{
    degree: string;
    institution: string;
    year: string;
  }>;
  skills: Array<{
    category: string;
    skills: string[];
  }>;
  projects: Array<{
    name: string;
    description: string;
    technologies: string[];
  }>;
}

interface MatchingAnalysis {
  overallScore: number;
  categoryScores: {
    skills: number;
    experience: number;
    education: number;
    projects: number;
  };
  strengths: string[];
  gaps: string[];
  recommendations: {
    skillsToHighlight: string[];
    experienceToEmphasize: string[];
    suggestedModifications: string[];
  };
}

interface OptimizedResume extends ParsedResume {
  optimizations: {
    reorderedExperience: boolean;
    highlightedSkills: string[];
    emphasizedProjects: string[];
    tailoredSummary: string;
  };
}

export default function PositionFit() {
  const [currentStep, setCurrentStep] = useState<'job' | 'resume' | 'analysis' | 'optimization'>('job');
  const [jobPosting, setJobPosting] = useState<JobPosting | null>(null);
  const [resume, setResume] = useState<ParsedResume | null>(null);
  const [analysis, setAnalysis] = useState<MatchingAnalysis | null>(null);
  const [optimizedResume, setOptimizedResume] = useState<OptimizedResume | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);

  const handleJobParsed = (parsedJob: JobPosting) => {
    setJobPosting(parsedJob);
    setCurrentStep('resume');
  };

  const handleResumeParsed = (parsedResume: ParsedResume) => {
    setResume(parsedResume);
    if (jobPosting) {
      performAnalysis(jobPosting, parsedResume);
    }
  };

  const performAnalysis = async (job: JobPosting, resumeData: ParsedResume) => {
    setIsAnalyzing(true);
    setCurrentStep('analysis');
    
    try {
      // Simulate AI analysis - in real implementation, this would call your AI API
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Mock analysis results
      const mockAnalysis: MatchingAnalysis = {
        overallScore: 78,
        categoryScores: {
          skills: 85,
          experience: 72,
          education: 90,
          projects: 65
        },
        strengths: [
          'Strong technical skills match',
          'Relevant project experience',
          'Educational background aligns well'
        ],
        gaps: [
          'Missing specific framework experience',
          'Could emphasize leadership experience',
          'Needs more quantified achievements'
        ],
        recommendations: {
          skillsToHighlight: ['React', 'TypeScript', 'Node.js'],
          experienceToEmphasize: ['Senior Developer role', 'Team leadership'],
          suggestedModifications: [
            'Reorder experience to highlight relevant roles',
            'Add quantified achievements to project descriptions',
            'Emphasize technical leadership experience'
          ]
        }
      };
      
      setAnalysis(mockAnalysis);
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleOptimizeResume = async () => {
    if (!resume || !analysis || !jobPosting) return;
    
    setIsOptimizing(true);
    setCurrentStep('optimization');
    
    try {
      // Simulate optimization process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock optimized resume
      const mockOptimized: OptimizedResume = {
        ...resume,
        optimizations: {
          reorderedExperience: true,
          highlightedSkills: analysis.recommendations.skillsToHighlight,
          emphasizedProjects: ['AI Resume Builder', 'E-commerce Platform'],
          tailoredSummary: `Experienced ${jobPosting.title} with strong background in ${analysis.recommendations.skillsToHighlight.join(', ')} and proven track record in ${jobPosting.company} industry.`
        }
      };
      
      setOptimizedResume(mockOptimized);
    } catch (error) {
      console.error('Optimization failed:', error);
    } finally {
      setIsOptimizing(false);
    }
  };

  const getStepStatus = (step: string) => {
    if (step === 'job') return jobPosting ? 'completed' : currentStep === 'job' ? 'active' : 'pending';
    if (step === 'resume') return resume ? 'completed' : currentStep === 'resume' ? 'active' : 'pending';
    if (step === 'analysis') return analysis ? 'completed' : currentStep === 'analysis' ? 'active' : 'pending';
    if (step === 'optimization') return optimizedResume ? 'completed' : currentStep === 'optimization' ? 'active' : 'pending';
    return 'pending';
  };

  const resetAnalysis = () => {
    setJobPosting(null);
    setResume(null);
    setAnalysis(null);
    setOptimizedResume(null);
    setCurrentStep('job');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-background to-green-50 dark:from-blue-950/20 dark:via-background dark:to-green-950/20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <Link href="/playground" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Back to Playground
            </Link>
            <Badge variant="secondary" className="bg-gradient-to-r from-blue-500 to-green-500 text-white">
              AI-Powered
            </Badge>
          </div>
          
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              Position Fit AI 🎯
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Analyze job postings and intelligently tailor your resume to maximize your chances of landing interviews
            </p>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-center space-x-4 mb-8">
            {[
              { key: 'job', label: 'Job Analysis', icon: Target },
              { key: 'resume', label: 'Resume Upload', icon: FileText },
              { key: 'analysis', label: 'AI Matching', icon: Sparkles },
              { key: 'optimization', label: 'Optimization', icon: TrendingUp }
            ].map((step, index) => {
              const status = getStepStatus(step.key);
              const Icon = step.icon;
              
              return (
                <div key={step.key} className="flex items-center">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                    status === 'completed' ? 'bg-green-500 border-green-500 text-white' :
                    status === 'active' ? 'bg-blue-500 border-blue-500 text-white' :
                    'bg-muted border-muted-foreground/20 text-muted-foreground'
                  }`}>
                    {status === 'completed' ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <Icon className="w-5 h-5" />
                    )}
                  </div>
                  <span className={`ml-2 text-sm font-medium ${
                    status === 'active' ? 'text-foreground' : 'text-muted-foreground'
                  }`}>
                    {step.label}
                  </span>
                  {index < 3 && (
                    <div className={`w-8 h-px mx-4 ${
                      status === 'completed' ? 'bg-green-500' : 'bg-muted-foreground/20'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto">
          {currentStep === 'job' && (
            <JobAnalyzer onJobParsed={handleJobParsed} />
          )}

          {currentStep === 'resume' && jobPosting && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    Job Analysis Complete
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-semibold text-lg">{jobPosting.title}</h3>
                      <p className="text-muted-foreground">{jobPosting.company} • {jobPosting.location}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline">{jobPosting.jobType}</Badge>
                      {jobPosting.salary && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {jobPosting.salary.currency}{jobPosting.salary.min.toLocaleString()} - 
                          {jobPosting.salary.currency}{jobPosting.salary.max.toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <ResumeUploader onResumeParsed={handleResumeParsed} />
            </div>
          )}

          {currentStep === 'analysis' && (
            <div className="space-y-6">
              {isAnalyzing ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    <Sparkles className="w-12 h-12 mx-auto mb-4 text-blue-500 animate-spin" />
                    <h3 className="text-xl font-semibold mb-2">Analyzing Compatibility</h3>
                    <p className="text-muted-foreground mb-4">
                      Our AI is analyzing your resume against the job requirements...
                    </p>
                    <Progress value={66} className="w-64 mx-auto" />
                  </CardContent>
                </Card>
              ) : analysis && (
                <MatchingResults 
                  analysis={analysis} 
                  jobPosting={jobPosting!}
                  onOptimize={handleOptimizeResume}
                />
              )}
            </div>
          )}

          {currentStep === 'optimization' && (
            <div className="space-y-6">
              {isOptimizing ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    <TrendingUp className="w-12 h-12 mx-auto mb-4 text-green-500 animate-pulse" />
                    <h3 className="text-xl font-semibold mb-2">Optimizing Your Resume</h3>
                    <p className="text-muted-foreground mb-4">
                      Creating a tailored version of your resume for this position...
                    </p>
                    <Progress value={75} className="w-64 mx-auto" />
                  </CardContent>
                </Card>
              ) : optimizedResume && (
                <ResumeOptimizer 
                  originalResume={resume!}
                  optimizedResume={optimizedResume}
                  analysis={analysis!}
                />
              )}
            </div>
          )}

          {/* Reset Button */}
          {currentStep !== 'job' && (
            <div className="text-center mt-8">
              <Button variant="outline" onClick={resetAnalysis}>
                Start New Analysis
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
