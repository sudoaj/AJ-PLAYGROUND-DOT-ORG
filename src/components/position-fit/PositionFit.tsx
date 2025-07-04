'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
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
  Award,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

import JobAnalyzer from './JobAnalyzer';
import ResumeUploader from './ResumeUploader';
import MatchingResults from './MatchingResults';
import ResumeOptimizer from './ResumeOptimizer';
import JobDashboard, { JobAnalysis, UserData } from './JobDashboard';

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
  _urlFetchSuccess?: boolean;
  _rawContent?: string;
  _sourceUrl?: string;
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
  const searchParams = useSearchParams();
  const router = useRouter();
  const [currentView, setCurrentView] = useState<'dashboard' | 'analysis'>('dashboard');
  const [currentStep, setCurrentStep] = useState<'job' | 'resume' | 'analysis' | 'optimization'>('job');
  const [jobPosting, setJobPosting] = useState<JobPosting | null>(null);
  const [showJobDetails, setShowJobDetails] = useState<boolean>(false);
  const [resume, setResume] = useState<ParsedResume | null>(null);
  const [analysis, setAnalysis] = useState<MatchingAnalysis | null>(null);
  const [optimizedResume, setOptimizedResume] = useState<OptimizedResume | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [viewingAnalysis, setViewingAnalysis] = useState<JobAnalysis | null>(null);
  
  // User state management
  const [currentUser, setCurrentUser] = useState<UserData | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // AI Configuration
  const [geminiApiKey, setGeminiApiKey] = useState<string>('');
  const [isApiKeyValid, setIsApiKeyValid] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>('');

  // Load API key from localStorage on component mount
  useEffect(() => {
    const savedApiKey = localStorage.getItem('geminiApiKey');
    if (savedApiKey) {
      setGeminiApiKey(savedApiKey);
      testApiKey(savedApiKey, false);
    }
  }, []);

  const saveApiKey = (apiKey: string) => {
    if (apiKey && apiKey.trim()) {
      localStorage.setItem('geminiApiKey', apiKey.trim());
      setGeminiApiKey(apiKey.trim());
    } else {
      localStorage.removeItem('geminiApiKey');
      setGeminiApiKey('');
    }
  };

  const testApiKey = async (apiKey: string, showUserFeedback: boolean = true) => {
    if (!apiKey || !apiKey.trim()) {
      setIsApiKeyValid(false);
      return false;
    }

    try {
      const testPrompt = "Say 'API test successful' and nothing else.";
      const response = await callGeminiAPI(testPrompt, apiKey);

      if (response && response.toLowerCase().includes('api test successful')) {
        setIsApiKeyValid(true);
        saveApiKey(apiKey);
        if (showUserFeedback) {
          alert('API key is valid and working!');
        }
        return true;
      } else {
        throw new Error('Unexpected API response');
      }
    } catch (error: unknown) {
      console.error('API test failed:', error);
      setIsApiKeyValid(false);
      
      if (showUserFeedback) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        alert(`API key test failed: ${errorMessage}`);
      }
      return false;
    }
  };
  // ============================================================================
      // CRITICAL AI INTERACTION POINT - This is where the actual AI call happens
      // ============================================================================
      // Making HTTP POST request to Google's Gemini AI API to process the prompt
      // This is the core AI functionality that powers job analysis, resume parsing,
      // compatibility analysis, and resume optimization throughout the application
  const callGeminiAPI = async (prompt: string, apiKeyOverride?: string): Promise<string> => {
    if (!prompt || typeof prompt !== 'string' || prompt.trim() === '') {
      throw new Error('Invalid prompt provided');
    }

    const apiKey = apiKeyOverride || geminiApiKey;
    if (!apiKey || apiKey.trim() === '') {
      throw new Error('API key is required');
    }

    const chatHistory = [{ role: 'user', parts: [{ text: prompt }] }];
    const payload = { contents: chatHistory };

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    try {
    
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        let errorMessage = `API request failed with status ${response.status}`;
        
        if (response.status === 401) {
          errorMessage = 'API key is invalid or expired';
        } else if (response.status === 403) {
          errorMessage = 'API access forbidden. Check your API key permissions';
        } else if (response.status === 429) {
          errorMessage = 'API quota exceeded or rate limit reached';
        } else if (response.status >= 500) {
          errorMessage = 'API server error. Please try again later';
        }

        throw new Error(errorMessage);
      }

      const result = await response.json();

      if (!result?.candidates?.[0]?.content?.parts?.[0]?.text) {
        throw new Error('Invalid response structure from API');
      }

      return result.candidates[0].content.parts[0].text.trim();
    } catch (error: unknown) {
      console.error('API call failed:', error);
      throw error;
    }
  };

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
    if (!isApiKeyValid) {
      alert('Please configure your Gemini API key first to use AI analysis features.');
      return;
    }

    setIsAnalyzing(true);
    setCurrentStep('analysis');
    setIsLoading(true);
    setLoadingMessage('AI is analyzing job-resume compatibility...');
    
    try {
      const analysisPrompt = `You are an expert career advisor and ATS specialist. Analyze the compatibility between this job posting and resume.

JOB POSTING:
Title: ${job.title}
Company: ${job.company}
Requirements: ${JSON.stringify(job.requirements)}
Responsibilities: ${JSON.stringify(job.responsibilities)}

RESUME:
Name: ${resumeData.personalInfo.name}
Experience: ${JSON.stringify(resumeData.experience)}
Skills: ${JSON.stringify(resumeData.skills)}
Education: ${JSON.stringify(resumeData.education)}
Projects: ${JSON.stringify(resumeData.projects)}

Provide a detailed analysis in this EXACT JSON format:
{
  "overallScore": [number 0-100],
  "categoryScores": {
    "skills": [number 0-100],
    "experience": [number 0-100], 
    "education": [number 0-100],
    "projects": [number 0-100]
  },
  "strengths": [
    "Specific strength 1",
    "Specific strength 2",
    "Specific strength 3"
  ],
  "gaps": [
    "Specific gap 1", 
    "Specific gap 2",
    "Specific gap 3"
  ],
  "recommendations": {
    "skillsToHighlight": ["skill1", "skill2", "skill3"],
    "experienceToEmphasize": ["experience1", "experience2"],
    "suggestedModifications": [
      "Specific modification 1",
      "Specific modification 2", 
      "Specific modification 3"
    ]
  }
}

IMPORTANT: Return ONLY valid JSON, no explanations or markdown formatting.`;

      const result = await callGeminiAPI(analysisPrompt);
      const cleanedResult = result.replace(/```json\n?|\n?```/g, '').trim();
      const analysisData = JSON.parse(cleanedResult);
      
      setAnalysis(analysisData);
    } catch (error) {
      console.error('Analysis failed:', error);
      alert('AI analysis failed. Please check your API key and try again.');
    } finally {
      setIsAnalyzing(false);
      setIsLoading(false);
    }
  };

  const handleOptimizeResume = async () => {
    if (!resume || !analysis || !jobPosting) return;
    
    if (!isApiKeyValid) {
      alert('Please configure your Gemini API key first to use AI optimization features.');
      return;
    }
    
    setIsOptimizing(true);
    setCurrentStep('optimization');
    setIsLoading(true);
    setLoadingMessage('AI is optimizing your resume for this position...');
    
    try {
      const optimizationPrompt = `You are an expert resume writer and career advisor. Optimize this resume for the specific job posting.

JOB POSTING:
Title: ${jobPosting.title}
Company: ${jobPosting.company}
Requirements: ${JSON.stringify(jobPosting.requirements)}
Responsibilities: ${JSON.stringify(jobPosting.responsibilities)}

CURRENT RESUME:
${JSON.stringify(resume)}

ANALYSIS INSIGHTS:
Skills to highlight: ${analysis.recommendations.skillsToHighlight.join(', ')}
Experience to emphasize: ${analysis.recommendations.experienceToEmphasize.join(', ')}
Suggested modifications: ${analysis.recommendations.suggestedModifications.join(', ')}

Create an optimized version with:
1. Reordered experience sections to highlight most relevant roles first
2. Enhanced project descriptions emphasizing relevant technologies
3. A tailored summary that matches the job requirements
4. Highlighted skills that match the job posting

Return the optimized resume in this EXACT JSON format:
{
  "personalInfo": ${JSON.stringify(resume.personalInfo)},
  "experience": [optimized experience array],
  "education": ${JSON.stringify(resume.education)},
  "skills": [optimized skills array],
  "projects": [optimized projects array],
  "optimizations": {
    "reorderedExperience": true,
    "highlightedSkills": [${JSON.stringify(analysis.recommendations.skillsToHighlight)}],
    "emphasizedProjects": ["project1", "project2"],
    "tailoredSummary": "Tailored professional summary for ${jobPosting.title} at ${jobPosting.company}"
  }
}

IMPORTANT: Return ONLY valid JSON, no explanations or markdown formatting.`;

      const result = await callGeminiAPI(optimizationPrompt);
      const cleanedResult = result.replace(/```json\n?|\n?```/g, '').trim();
      const optimizedData = JSON.parse(cleanedResult);
      
      setOptimizedResume(optimizedData);
    } catch (error) {
      console.error('Optimization failed:', error);
      alert('AI optimization failed. Please check your API key and try again.');
    } finally {
      setIsOptimizing(false);
      setIsLoading(false);
    }
  };

  // Get step status with loading states
  const getStepStatus = (step: string) => {
    if (viewingAnalysis) {
      // When viewing a saved analysis, show it as completed
      return 'completed';
    }
    
    // Check for loading states
    if (step === 'analysis' && isAnalyzing) {
      return 'loading';
    }
    if (step === 'optimization' && isOptimizing) {
      return 'loading';
    }
    
    const stepOrder = ['job', 'resume', 'analysis', 'optimization'];
    const currentStepIndex = stepOrder.indexOf(currentStep);
    const stepIndex = stepOrder.indexOf(step);
    
    if (stepIndex < currentStepIndex) {
      return 'completed';
    } else if (stepIndex === currentStepIndex) {
      return 'active';
    } else {
      return 'pending';
    }
  };

  // Check if a step is accessible (clickable)
  const isStepAccessible = (stepKey: string) => {
    if (viewingAnalysis) {
      return true; // All steps are accessible when viewing saved analysis
    }
    
    // Users can always go back to previous steps or stay on current step
    // They can also jump to future steps if they have the required data
    switch (stepKey) {
      case 'job':
        return true; // Always accessible
      case 'resume':
        return jobPosting !== null; // Accessible if job is analyzed
      case 'analysis':
        return jobPosting !== null && resume !== null; // Accessible if both job and resume are ready
      case 'optimization':
        return jobPosting !== null && resume !== null && analysis !== null; // Accessible if analysis is done
      default:
        return false;
    }
  };

  // Get helpful tooltip text for each step
  const getStepTooltip = (stepKey: string) => {
    if (viewingAnalysis) {
      return `View ${stepKey} details`;
    }
    
    // Handle loading states
    if (stepKey === 'analysis' && isAnalyzing) {
      return 'AI is analyzing compatibility...';
    }
    if (stepKey === 'optimization' && isOptimizing) {
      return 'AI is optimizing resume...';
    }
    
    const isAccessible = isStepAccessible(stepKey);
    
    if (isAccessible) {
      switch (stepKey) {
        case 'job':
          return 'Analyze job posting';
        case 'resume':
          return 'Upload and parse resume';
        case 'analysis':
          return analysis ? 'View compatibility analysis' : 'Start AI compatibility analysis';
        case 'optimization':
          return optimizedResume ? 'View optimized resume' : 'Generate optimized resume';
        default:
          return `Go to ${stepKey}`;
      }
    } else {
      switch (stepKey) {
        case 'resume':
          return 'Complete job analysis first';
        case 'analysis':
          return 'Complete job analysis and resume upload first';
        case 'optimization':
          return 'Complete analysis first';
        default:
          return `Complete previous steps to access ${stepKey}`;
      }
    }
  };

  // Handle step navigation click
  const handleStepClick = (stepKey: string) => {
    if (!isStepAccessible(stepKey)) {
      return; // Don't navigate if step is not accessible
    }
    
    // Special handling for analysis step
    if (stepKey === 'analysis') {
      if (jobPosting && resume && !analysis) {
        // Auto-trigger analysis if data is ready but analysis hasn't been performed
        performAnalysis(jobPosting, resume);
        return;
      }
    }
    
    // Special handling for optimization step
    if (stepKey === 'optimization') {
      if (jobPosting && resume && analysis && !optimizedResume) {
        // Auto-trigger optimization if data is ready but optimization hasn't been performed
        handleOptimizeResume();
        return;
      }
    }
    
    setCurrentStep(stepKey as 'job' | 'resume' | 'analysis' | 'optimization');
  };

  const resetAnalysis = () => {
    setJobPosting(null);
    setResume(null);
    setAnalysis(null);
    setOptimizedResume(null);
    setCurrentStep('job');
  };

  // Dashboard functions
  const handleStartAnalysis = () => {
    // Only start analysis if user is logged in
    if (!currentUser) {
      alert('Please login first to start an analysis');
      return;
    }
    setCurrentView('analysis');
    setCurrentStep('job');
    setJobPosting(null);
    setResume(null);
    setAnalysis(null);
    setOptimizedResume(null);
    setViewingAnalysis(null);
    setAnalysisAlreadySaved(false); // Reset saved flag for new analysis
  };

  const handleViewAnalysis = (analysisData: JobAnalysis) => {
    setViewingAnalysis(analysisData);
    setCurrentView('analysis');
    
    // Restore full state from the saved analysis
    if (analysisData.jobPosting) {
      setJobPosting(analysisData.jobPosting);
    } else {
      // Fallback: Convert JobAnalysis back to component state
      const jobPosting: JobPosting = {
        title: analysisData.jobTitle,
        company: analysisData.company,
        location: analysisData.location,
        requirements: {
          required: analysisData.requirements,
          preferred: [],
          experience: ''
        },
        responsibilities: analysisData.responsibilities,
        benefits: analysisData.benefits,
        jobType: 'full-time' as const,
        _sourceUrl: analysisData.jobUrl,
        _rawContent: analysisData.jobDescription
      };
      setJobPosting(jobPosting);
    }
    
    if (analysisData.resume) {
      setResume(analysisData.resume);
    }
    
    if (analysisData.analysis) {
      setAnalysis(analysisData.analysis);
    } else {
      // Fallback: Convert JobAnalysis back to MatchingAnalysis
      const analysis: MatchingAnalysis = {
        overallScore: analysisData.matchScore,
        categoryScores: {
          skills: analysisData.matchScore,
          experience: analysisData.matchScore,
          education: analysisData.matchScore,
          projects: analysisData.matchScore
        },
        strengths: analysisData.strengths,
        gaps: analysisData.gaps,
        recommendations: {
          skillsToHighlight: [],
          experienceToEmphasize: [],
          suggestedModifications: analysisData.recommendations
        }
      };
      setAnalysis(analysis);
    }
    
    if (analysisData.optimizedResume) {
      setOptimizedResume(analysisData.optimizedResume);
    }
    
    // Restore the correct step
    setCurrentStep(analysisData.currentStep || 'analysis');
    setAnalysisAlreadySaved(true); // Mark as already saved to prevent duplicate saves
  };

  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
    setViewingAnalysis(null);
    setCurrentStep('job'); // Reset to initial step
    
    // Clear URL parameters to prevent the useEffect from overriding the view
    const url = new URL(window.location.href);
    url.searchParams.delete('continue');
    url.searchParams.delete('step');
    router.replace(url.pathname + url.search);
  };

  const saveJobAnalysis = (job: JobPosting, analysis?: MatchingAnalysis, stepOverride?: 'job' | 'resume' | 'analysis' | 'optimization') => {
    if (!currentUser) {
      alert('Please login to save analysis');
      return;
    }

    // Check if this analysis already exists (prevent duplicates)
    const existingAnalysis = currentUser.analyses.find(a => 
      a.jobTitle === job.title && 
      a.company === job.company && 
      a.jobUrl === job._sourceUrl
    );
    
    if (existingAnalysis) {
      // Update existing analysis instead of creating duplicate
      const updatedAnalysis: JobAnalysis = {
        ...existingAnalysis,
        currentStep: stepOverride || currentStep,
        jobPosting: job,
        resume: resume,
        analysis: analysis,
        optimizedResume: optimizedResume,
        matchScore: analysis?.overallScore || existingAnalysis.matchScore,
        strengths: analysis?.strengths || existingAnalysis.strengths,
        gaps: analysis?.gaps || existingAnalysis.gaps,
        recommendations: analysis?.recommendations.suggestedModifications || existingAnalysis.recommendations,
        resumeOptimized: !!optimizedResume,
        analyzedAt: new Date().toISOString()
      };

      // Replace the existing analysis
      const updatedUser = {
        ...currentUser,
        analyses: currentUser.analyses.map(a => a.id === existingAnalysis.id ? updatedAnalysis : a),
        lastActive: new Date().toISOString()
      };

      saveUserData(updatedUser);
      return updatedAnalysis;
    }

    // Create new analysis
    const jobAnalysis: JobAnalysis = {
      id: `analysis-${Date.now()}`,
      jobTitle: job.title,
      company: job.company,
      location: job.location,
      salary: job.salary ? `${job.salary.currency} ${job.salary.min}-${job.salary.max}` : undefined,
      jobUrl: job._sourceUrl,
      jobDescription: job._rawContent || '',
      requirements: job.requirements.required,
      responsibilities: job.responsibilities,
      benefits: job.benefits,
      matchScore: analysis?.overallScore || 0,
      strengths: analysis?.strengths || [],
      gaps: analysis?.gaps || [],
      recommendations: analysis?.recommendations.suggestedModifications || [],
      analyzedAt: new Date().toISOString(),
      resumeOptimized: !!optimizedResume,
      // Full state restoration data
      currentStep: stepOverride || currentStep,
      jobPosting: job,
      resume: resume,
      analysis: analysis,
      optimizedResume: optimizedResume
    };

    // Add analysis to current user's data
    const updatedUser = {
      ...currentUser,
      analyses: [...currentUser.analyses, jobAnalysis],
      lastActive: new Date().toISOString()
    };

    saveUserData(updatedUser);
    return jobAnalysis;
  };

  const handleSaveJobAnalysis = () => {
    if (jobPosting) {
      const savedAnalysis = saveJobAnalysis(jobPosting, analysis || undefined);
      if (savedAnalysis) {
        alert('Job analysis saved to dashboard!');
        setAnalysisAlreadySaved(true);
      }
    }
  };

  // User management functions
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

  const saveUserData = (data: UserData) => {
    try {
      localStorage.setItem(`position-fit-user-${data.userId}`, JSON.stringify(data));
      setCurrentUser(data); // Update current user state
    } catch (error) {
      console.error('Error saving user data:', error);
    }
  };

  const handleUserLogin = (userData: UserData) => {
    setCurrentUser(userData);
    setIsLoggedIn(true);
  };

  // Load user from localStorage on mount
  useEffect(() => {
    const lastUserId = localStorage.getItem('position-fit-last-user');
    if (lastUserId) {
      const userData = loadUserData(lastUserId);
      if (userData) {
        setCurrentUser(userData);
        setIsLoggedIn(true);
      }
    }
  }, []);

  // Handle URL parameters for continuing analysis
  useEffect(() => {
    const continueAnalysisId = searchParams.get('continue');
    const targetStep = searchParams.get('step') as 'job' | 'resume' | 'analysis' | 'optimization' | null;
    
    if (continueAnalysisId && currentUser) {
      const analysisData = currentUser.analyses.find(a => a.id === continueAnalysisId);
      if (analysisData) {
        // Restore the analysis state
        setViewingAnalysis(analysisData);
        setCurrentView('analysis');
        
        // Restore all the state data
        if (analysisData.jobPosting) {
          setJobPosting(analysisData.jobPosting);
        } else {
          // Fallback: Convert JobAnalysis back to component state
          const jobPosting: JobPosting = {
            title: analysisData.jobTitle,
            company: analysisData.company,
            location: analysisData.location,
            requirements: {
              required: analysisData.requirements,
              preferred: [],
              experience: ''
            },
            responsibilities: analysisData.responsibilities,
            benefits: analysisData.benefits,
            jobType: 'full-time' as const,
            _sourceUrl: analysisData.jobUrl,
            _rawContent: analysisData.jobDescription
          };
          setJobPosting(jobPosting);
        }
        
        if (analysisData.resume) {
          setResume(analysisData.resume);
        }
        
        if (analysisData.analysis) {
          setAnalysis(analysisData.analysis);
        } else {
          // Fallback: Convert JobAnalysis back to MatchingAnalysis
          const analysis: MatchingAnalysis = {
            overallScore: analysisData.matchScore,
            categoryScores: {
              skills: analysisData.matchScore,
              experience: analysisData.matchScore,
              education: analysisData.matchScore,
              projects: analysisData.matchScore
            },
            strengths: analysisData.strengths,
            gaps: analysisData.gaps,
            recommendations: {
              skillsToHighlight: [],
              experienceToEmphasize: [],
              suggestedModifications: analysisData.recommendations
            }
          };
          setAnalysis(analysis);
        }
        
        if (analysisData.optimizedResume) {
          setOptimizedResume(analysisData.optimizedResume);
        }
        
        // Set the target step or use the saved step
        setCurrentStep(targetStep || analysisData.currentStep || 'job');
        setAnalysisAlreadySaved(true);
      }
    }
  }, [searchParams, currentUser]);

  // Save last user ID
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('position-fit-last-user', currentUser.userId);
    }
  }, [currentUser]);

  // Auto-save analysis when completed (only once)
  const [analysisAlreadySaved, setAnalysisAlreadySaved] = useState(false);
  
  useEffect(() => {
    if (analysis && jobPosting && !viewingAnalysis && currentUser && !analysisAlreadySaved) {
      saveJobAnalysis(jobPosting, analysis);
      setAnalysisAlreadySaved(true);
    }
  }, [analysis, jobPosting, viewingAnalysis, currentUser, analysisAlreadySaved]);

  // Reset saved flag when starting new analysis
  useEffect(() => {
    if (currentStep === 'job' && !viewingAnalysis) {
      setAnalysisAlreadySaved(false);
    }
  }, [currentStep, viewingAnalysis]);

  // Save state when user progresses through steps
  useEffect(() => {
    if (currentUser && jobPosting && !viewingAnalysis) {
      // Save progress at each step
      saveJobAnalysis(jobPosting, analysis || undefined, currentStep);
    }
  }, [currentStep, currentUser, jobPosting, viewingAnalysis]);

  // Save when optimization is completed
  useEffect(() => {
    if (currentUser && jobPosting && optimizedResume && !viewingAnalysis) {
      saveJobAnalysis(jobPosting, analysis || undefined, 'optimization');
    }
  }, [optimizedResume, currentUser, jobPosting, viewingAnalysis]);

  // Show dashboard if not viewing analysis
  if (currentView === 'dashboard') {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <JobDashboard
          onStartAnalysis={handleStartAnalysis}
          onViewAnalysis={handleViewAnalysis}
          onUserLogin={handleUserLogin}
          currentUser={currentUser}
          isLoggedIn={isLoggedIn}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-background to-green-50 dark:from-blue-950/20 dark:via-background dark:to-green-950/20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-end mb-4">
            <Badge variant="secondary" className="bg-gradient-to-r from-blue-500 to-green-500 text-white">
              AI-Powered
            </Badge>
          </div>
          
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-4 mb-4">
              <Button
                variant="outline"
                onClick={handleBackToDashboard}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Dashboard
              </Button>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                Position Fit AI 🎯
              </h1>
              <div className="w-32" /> {/* Spacer for balance */}
            </div>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              {viewingAnalysis ? 'Viewing saved analysis' : 'Analyze job postings and intelligently tailor your resume to maximize your chances of landing interviews'}
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
              const isAccessible = isStepAccessible(step.key);
              const Icon = step.icon;
              
              return (
                <div key={step.key} className="flex items-center">
                  <div 
                    className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-200 ${
                      status === 'completed' ? 'bg-green-500 border-green-500 text-white' :
                      status === 'active' ? 'bg-blue-500 border-blue-500 text-white' :
                      status === 'loading' ? 'bg-yellow-500 border-yellow-500 text-white animate-pulse' :
                      'bg-muted border-muted-foreground/20 text-muted-foreground'
                    } ${
                      isAccessible && status !== 'loading' ? 'cursor-pointer hover:scale-110 hover:shadow-lg' : 'cursor-not-allowed opacity-50'
                    }`}
                    onClick={() => status !== 'loading' && handleStepClick(step.key)}
                    title={getStepTooltip(step.key)}
                  >
                    {status === 'completed' ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : status === 'loading' ? (
                      <Icon className="w-5 h-5 animate-spin" />
                    ) : (
                      <Icon className="w-5 h-5" />
                    )}
                  </div>
                  <span 
                    className={`ml-2 text-sm font-medium transition-colors duration-200 ${
                      status === 'active' ? 'text-foreground' : 
                      status === 'loading' ? 'text-yellow-600' : 
                      'text-muted-foreground'
                    } ${
                      isAccessible && status !== 'loading' ? 'cursor-pointer hover:text-foreground' : 'cursor-not-allowed'
                    }`}
                    onClick={() => status !== 'loading' && handleStepClick(step.key)}
                    title={getStepTooltip(step.key)}
                  >
                    {step.label}
                    {status === 'loading' && <span className="ml-1">...</span>}
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

        {/* API Key Configuration */}
        {!isApiKeyValid && (
          <Alert className="mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-3">
                <p>AI features require a Gemini API key. Please configure your API key to use intelligent job-resume analysis.</p>
                <div className="flex gap-2">
                  <Input
                    type="password"
                    placeholder="Enter your Gemini API key"
                    value={geminiApiKey}                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setGeminiApiKey(e.target.value)}
                    className="flex-1"
                  />
                  <Button 
                    onClick={() => testApiKey(geminiApiKey)}
                    variant="outline"
                    size="sm"
                  >
                    Test & Save
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Get your free API key from{' '}
                  <a 
                    href="https://aistudio.google.com/app/apikey" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="underline"
                  >
                    Google AI Studio
                  </a>
                </p>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Main Content */}
        <div className="max-w-6xl mx-auto">
          {currentStep === 'job' && (
            <JobAnalyzer 
              onJobParsed={handleJobParsed} 
              apiKey={geminiApiKey}
              isApiKeyValid={isApiKeyValid}
            />
          )}

          {currentStep === 'resume' && jobPosting && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    Job Analysis Complete
                  </CardTitle>
                  <div className="flex items-center gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleSaveJobAnalysis}
                      className="flex items-center gap-2"
                      disabled={!currentUser}
                    >
                      <Download className="w-4 h-4" />
                      Save Analysis
                    </Button>
                    <span className="text-sm text-muted-foreground">
                      {currentUser ? 'Save this job analysis to your dashboard' : 'Login required to save analysis'}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Basic Job Info - Always Visible */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
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

                  {/* Toggle Button */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowJobDetails(!showJobDetails)}
                    className="w-full flex items-center justify-center gap-2 text-muted-foreground hover:text-foreground"
                  >
                    {showJobDetails ? 'Hide Details' : 'View Full Job Details'}
                    {showJobDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </Button>

                  {/* Detailed Job Info - Collapsible */}
                  {showJobDetails && (
                    <div className="mt-4 space-y-6 border-t pt-4">
                      {/* Requirements */}
                      <div>
                        <h4 className="font-semibold text-md mb-2 flex items-center gap-2">
                          <Target className="w-4 h-4" />
                          Requirements
                        </h4>
                        <div className="space-y-3">
                          {jobPosting.requirements.required.length > 0 && (
                            <div>
                              <p className="text-sm font-medium text-red-600 dark:text-red-400 mb-1">Required:</p>
                              <ul className="text-sm text-muted-foreground space-y-1">
                                {jobPosting.requirements.required.map((req, index) => (
                                  <li key={index} className="flex items-start gap-2">
                                    <span className="text-red-500 mt-1">•</span>
                                    <span>{req}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {jobPosting.requirements.preferred.length > 0 && (
                            <div>
                              <p className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-1">Preferred:</p>
                              <ul className="text-sm text-muted-foreground space-y-1">
                                {jobPosting.requirements.preferred.map((pref, index) => (
                                  <li key={index} className="flex items-start gap-2">
                                    <span className="text-blue-500 mt-1">•</span>
                                    <span>{pref}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {jobPosting.requirements.experience && (
                            <div>
                              <p className="text-sm font-medium text-green-600 dark:text-green-400 mb-1">Experience:</p>
                              <p className="text-sm text-muted-foreground">{jobPosting.requirements.experience}</p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Responsibilities */}
                      {jobPosting.responsibilities.length > 0 && (
                        <div>
                          <h4 className="font-semibold text-md mb-2 flex items-center gap-2">
                            <Briefcase className="w-4 h-4" />
                            Responsibilities
                          </h4>
                          <ul className="text-sm text-muted-foreground space-y-1">
                            {jobPosting.responsibilities.map((resp, index) => (
                              <li key={index} className="flex items-start gap-2">
                                <span className="text-blue-500 mt-1">•</span>
                                <span>{resp}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Benefits */}
                      {jobPosting.benefits.length > 0 && (
                        <div>
                          <h4 className="font-semibold text-md mb-2 flex items-center gap-2">
                            <Award className="w-4 h-4" />
                            Benefits
                          </h4>
                          <ul className="text-sm text-muted-foreground space-y-1">
                            {jobPosting.benefits.map((benefit, index) => (
                              <li key={index} className="flex items-start gap-2">
                                <span className="text-green-500 mt-1">•</span>
                                <span>{benefit}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Source Information */}
                      {jobPosting._sourceUrl && (
                        <div className="bg-muted/30 p-3 rounded-lg">
                          <p className="text-xs text-muted-foreground mb-1">Source:</p>
                          <a 
                            href={jobPosting._sourceUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-xs text-blue-600 hover:text-blue-800 underline break-all"
                          >
                            {jobPosting._sourceUrl}
                          </a>
                          {jobPosting._urlFetchSuccess !== undefined && (
                            <div className="mt-2 flex items-center gap-2">
                              {jobPosting._urlFetchSuccess ? (
                                <CheckCircle className="w-3 h-3 text-green-500" />
                              ) : (
                                <XCircle className="w-3 h-3 text-red-500" />
                              )}
                              <span className="text-xs text-muted-foreground">
                                {jobPosting._urlFetchSuccess ? 'Successfully fetched' : 'Failed to fetch'}
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <ResumeUploader 
                onResumeParsed={handleResumeParsed} 
                apiKey={geminiApiKey}
                isApiKeyValid={isApiKeyValid}
              />
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
                      {loadingMessage || 'Our AI is analyzing your resume against the job requirements...'}
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
                      {loadingMessage || 'Creating a tailored version of your resume for this position...'}
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
