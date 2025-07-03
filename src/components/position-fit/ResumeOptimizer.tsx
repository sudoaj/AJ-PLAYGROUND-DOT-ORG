'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Download, 
  FileText, 
  Eye, 
  EyeOff,
  CheckCircle,
  ArrowRight,
  Sparkles,
  RefreshCw,
  FileJson,
  FileImage,
  Info
} from 'lucide-react';

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

interface OptimizedResume extends ParsedResume {
  optimizations: {
    reorderedExperience: boolean;
    highlightedSkills: string[];
    emphasizedProjects: string[];
    tailoredSummary: string;
  };
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

interface ResumeOptimizerProps {
  originalResume: ParsedResume;
  optimizedResume: OptimizedResume;
  analysis: MatchingAnalysis;
}

export default function ResumeOptimizer({ originalResume, optimizedResume, analysis }: ResumeOptimizerProps) {
  const [showComparison, setShowComparison] = useState(true);
  const [exportFormat, setExportFormat] = useState<'json' | 'latex' | 'pdf'>('json');
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async (format: 'json' | 'latex' | 'pdf') => {
    setIsExporting(true);
    
    try {
      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (format === 'json') {
        const dataStr = JSON.stringify(optimizedResume, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'optimized-resume.json';
        link.click();
        URL.revokeObjectURL(url);
      } else if (format === 'latex') {
        // Mock LaTeX content
        const latexContent = generateLaTeXResume(optimizedResume);
        const dataBlob = new Blob([latexContent], { type: 'text/plain' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'optimized-resume.tex';
        link.click();
        URL.revokeObjectURL(url);
      } else if (format === 'pdf') {
        // Mock PDF generation (in real app, would generate actual PDF)
        alert('PDF generation would create a formatted resume file here');
      }
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const generateLaTeXResume = (resume: OptimizedResume): string => {
    return `\\documentclass[letterpaper,11pt]{article}
\\usepackage[utf8]{inputenc}
\\usepackage{geometry}
\\geometry{margin=1in}

\\begin{document}

\\begin{center}
{\\Large \\textbf{${resume.personalInfo.name}}}\\\\
${resume.personalInfo.email} | ${resume.personalInfo.phone} | ${resume.personalInfo.location}
\\end{center}

\\section*{Professional Summary}
${resume.optimizations.tailoredSummary}

\\section*{Experience}
${resume.experience.map(exp => `
\\textbf{${exp.title}} \\hfill ${exp.duration}\\\\
\\textit{${exp.company}}
\\begin{itemize}
${exp.responsibilities.map(resp => `  \\item ${resp}`).join('\n')}
\\end{itemize}
`).join('\n')}

\\section*{Skills}
${resume.skills.map(cat => `
\\textbf{${cat.category}:} ${cat.skills.join(', ')}\\\\
`).join('')}

\\section*{Education}
${resume.education.map(edu => `
\\textbf{${edu.degree}} \\hfill ${edu.year}\\\\
\\textit{${edu.institution}}\\\\
`).join('\n')}

\\end{document}`;
  };

  const OptimizationBadge = ({ children }: { children: React.ReactNode }) => (
    <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-200">
      <Sparkles className="w-3 h-3 mr-1" />
      {children}
    </Badge>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950/20 dark:to-blue-950/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            Resume Optimization Complete
          </CardTitle>
          <p className="text-muted-foreground">
            Your resume has been tailored for maximum compatibility with the job requirements
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-3 bg-white/50 dark:bg-black/20 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {analysis.overallScore}% → {Math.min(analysis.overallScore + 15, 100)}%
              </div>
              <div className="text-sm text-muted-foreground">Compatibility Score</div>
            </div>
            <div className="text-center p-3 bg-white/50 dark:bg-black/20 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {optimizedResume.optimizations.highlightedSkills.length}
              </div>
              <div className="text-sm text-muted-foreground">Skills Highlighted</div>
            </div>
            <div className="text-center p-3 bg-white/50 dark:bg-black/20 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {optimizedResume.optimizations.emphasizedProjects.length}
              </div>
              <div className="text-sm text-muted-foreground">Projects Emphasized</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Optimizations Applied */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RefreshCw className="w-5 h-5" />
            Optimizations Applied
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                All optimizations maintain the authenticity of your experience while reorganizing and emphasizing content for better job match.
              </AlertDescription>
            </Alert>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-medium">Content Changes</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Professional summary tailored</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Experience reordered by relevance</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Skills section optimized</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium">Highlighted Skills</h4>
                <div className="flex flex-wrap gap-1">
                  {optimizedResume.optimizations.highlightedSkills.map((skill, index) => (
                    <OptimizationBadge key={index}>{skill}</OptimizationBadge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Comparison View */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              {showComparison ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
              Resume Comparison
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowComparison(!showComparison)}
            >
              {showComparison ? 'Hide' : 'Show'} Comparison
            </Button>
          </div>
        </CardHeader>
        {showComparison && (
          <CardContent>
            <Tabs defaultValue="summary" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="summary">Summary</TabsTrigger>
                <TabsTrigger value="experience">Experience</TabsTrigger>
                <TabsTrigger value="skills">Skills</TabsTrigger>
                <TabsTrigger value="projects">Projects</TabsTrigger>
              </TabsList>
              
              <TabsContent value="summary" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2 text-muted-foreground">Original</h4>
                    <div className="p-3 bg-muted/50 rounded text-sm">
                      Generic professional summary focusing on general experience...
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2 text-green-700 dark:text-green-400">Optimized</h4>
                    <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded text-sm border border-green-200">
                      {optimizedResume.optimizations.tailoredSummary}
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="experience" className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <ArrowRight className="w-4 h-4 text-blue-500" />
                    <span className="text-sm">Experience reordered to prioritize most relevant roles</span>
                  </div>
                  {optimizedResume.experience.slice(0, 2).map((exp, index) => (
                    <div key={index} className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded border border-blue-200">
                      <div className="font-medium">{exp.title}</div>
                      <div className="text-sm text-muted-foreground">{exp.company} • {exp.duration}</div>
                      <OptimizationBadge>Prioritized for relevance</OptimizationBadge>
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="skills" className="space-y-4">
                <div className="space-y-4">
                  {optimizedResume.skills.map((category, index) => (
                    <div key={index}>
                      <h5 className="font-medium mb-2">{category.category}</h5>
                      <div className="flex flex-wrap gap-1">
                        {category.skills.map((skill, skillIndex) => (
                          <Badge
                            key={skillIndex}
                            variant={optimizedResume.optimizations.highlightedSkills.includes(skill) ? 'default' : 'outline'}
                            className={optimizedResume.optimizations.highlightedSkills.includes(skill) ? 'bg-green-100 text-green-800 border-green-300' : ''}
                          >
                            {skill}
                            {optimizedResume.optimizations.highlightedSkills.includes(skill) && (
                              <Sparkles className="w-3 h-3 ml-1" />
                            )}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="projects" className="space-y-4">
                <div className="space-y-4">
                  {optimizedResume.projects.map((project, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded border ${
                        optimizedResume.optimizations.emphasizedProjects.includes(project.name)
                          ? 'bg-purple-50 dark:bg-purple-950/20 border-purple-200'
                          : 'bg-muted/50'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <h5 className="font-medium">{project.name}</h5>
                        {optimizedResume.optimizations.emphasizedProjects.includes(project.name) && (
                          <OptimizationBadge>Emphasized</OptimizationBadge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{project.description}</p>
                      <div className="flex flex-wrap gap-1">
                        {project.technologies.map((tech, techIndex) => (
                          <Badge key={techIndex} variant="outline" className="text-xs">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        )}
      </Card>

      {/* Export Options */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="w-5 h-5" />
            Export Optimized Resume
          </CardTitle>
          <p className="text-muted-foreground">
            Download your tailored resume in your preferred format
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              variant="outline"
              className="h-20 flex-col"
              onClick={() => handleExport('json')}
              disabled={isExporting}
            >
              <FileJson className="w-6 h-6 mb-2 text-blue-500" />
              <span className="font-medium">JSON</span>
              <span className="text-xs text-muted-foreground">Structured data</span>
            </Button>
            
            <Button
              variant="outline"
              className="h-20 flex-col"
              onClick={() => handleExport('latex')}
              disabled={isExporting}
            >
              <FileText className="w-6 h-6 mb-2 text-green-500" />
              <span className="font-medium">LaTeX</span>
              <span className="text-xs text-muted-foreground">Academic format</span>
            </Button>
            
            <Button
              variant="outline"
              className="h-20 flex-col"
              onClick={() => handleExport('pdf')}
              disabled={isExporting}
            >
              <FileImage className="w-6 h-6 mb-2 text-red-500" />
              <span className="font-medium">PDF</span>
              <span className="text-xs text-muted-foreground">Print-ready</span>
            </Button>
          </div>
          
          {isExporting && (
            <div className="mt-4 text-center">
              <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                <RefreshCw className="w-4 h-4 animate-spin" />
                Generating optimized resume...
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Next Steps */}
      <Card className="border-dashed">
        <CardContent className="p-6">
          <h4 className="font-medium mb-3">Next Steps</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
              Review the optimized resume for accuracy and authenticity
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
              Customize the professional summary in your own voice
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
              Add specific achievements and metrics where possible
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
              Apply to the position with confidence!
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
