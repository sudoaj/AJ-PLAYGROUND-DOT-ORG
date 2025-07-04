'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
  Info,
  Edit,
  Plus,
  Minus,
  Trash2,
  User,
  Phone,
  Mail,
  Linkedin,
  Github,
  GraduationCap,
  Briefcase,
  Code,
  Star,
  Save
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

// Resume Builder Data Interfaces
interface Contact {
  phone: string;
  email: string;
  linkedin: string;
  github: string;
}

interface TechnicalSkill {
  category: string;
  skills: string;
}

interface Education {
  institution: string;
  location: string;
  degree: string;
  dates: string;
}

interface Experience {
  title: string;
  company: string;
  location: string;
  dates: string;
  duties: string[];
}

interface Project {
  name: string;
  technologies: string;
  description: string[];
}

interface ResumeBuilderData {
  name: string;
  contact: Contact;
  summary: string;
  technical_skills: TechnicalSkill[];
  education: Education[];
  experience: Experience[];
  projects: Project[];
  other: string;
}

export default function ResumeOptimizer({ originalResume, optimizedResume, analysis }: ResumeOptimizerProps) {
  const [showComparison, setShowComparison] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [showResumeBuilder, setShowResumeBuilder] = useState(false);
  
  // Resume Builder state
  const [resumeData, setResumeData] = useState<ResumeBuilderData>({
    name: '',
    contact: { phone: '', email: '', linkedin: '', github: '' },
    summary: '',
    technical_skills: [{ category: 'Languages', skills: '' }],
    education: [{ institution: '', location: '', degree: '', dates: '' }],
    experience: [{ title: '', company: '', location: '', dates: '', duties: [''] }],
    projects: [{ name: '', technologies: '', description: [''] }],
    other: ''
  });

  // Initialize resume data when component mounts
  useEffect(() => {
    setResumeData(convertToResumeBuilderFormat(optimizedResume));
  }, [optimizedResume]);

  // Convert OptimizedResume to ResumeBuilder format
  const convertToResumeBuilderFormat = (optimized: OptimizedResume): ResumeBuilderData => {
    return {
      name: optimized.personalInfo.name,
      contact: {
        phone: optimized.personalInfo.phone,
        email: optimized.personalInfo.email,
        linkedin: '',
        github: ''
      },
      summary: optimized.optimizations.tailoredSummary,
      technical_skills: optimized.skills.map(skill => ({
        category: skill.category,
        skills: skill.skills.join(', ')
      })),
      education: optimized.education.map(edu => ({
        institution: edu.institution,
        location: '',
        degree: edu.degree,
        dates: edu.year
      })),
      experience: optimized.experience.map(exp => ({
        title: exp.title,
        company: exp.company,
        location: '',
        dates: exp.duration,
        duties: exp.responsibilities
      })),
      projects: optimized.projects.map(proj => ({
        name: proj.name,
        technologies: proj.technologies.join(', '),
        description: [proj.description]
      })),
      other: ''
    };
  };

  const handleExport = async (format: 'json' | 'latex') => {
    setIsExporting(true);
    
    try {
      if (format === 'json') {
        // Use the edited resumeData instead of optimizedResume
        const dataStr = JSON.stringify(resumeData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'optimized-resume.json';
        link.click();
        URL.revokeObjectURL(url);
      } else if (format === 'latex') {
        // Use the edited resumeData for LaTeX generation
        const latexContent = generateLaTeXResumeFromBuilder(resumeData);
        const dataBlob = new Blob([latexContent], { type: 'text/plain' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'optimized-resume.tex';
        link.click();
        URL.revokeObjectURL(url);
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

  const generateLaTeXResumeFromBuilder = (resume: ResumeBuilderData): string => {
    return `\\documentclass[letterpaper,11pt]{article}
\\usepackage[utf8]{inputenc}
\\usepackage{geometry}
\\geometry{margin=1in}

\\begin{document}

\\begin{center}
{\\Large \\textbf{${resume.name}}}\\\\
${resume.contact.email} | ${resume.contact.phone}${resume.contact.linkedin ? ` | ${resume.contact.linkedin}` : ''}${resume.contact.github ? ` | ${resume.contact.github}` : ''}
\\end{center}

${resume.summary ? `\\section*{Professional Summary}
${resume.summary}
` : ''}

\\section*{Experience}
${resume.experience.map(exp => `
\\textbf{${exp.title}} \\hfill ${exp.dates}\\\\
\\textit{${exp.company}}${exp.location ? `, ${exp.location}` : ''}
\\begin{itemize}
${exp.duties.filter(duty => duty.trim()).map(duty => `  \\item ${duty}`).join('\n')}
\\end{itemize}
`).join('\n')}

\\section*{Technical Skills}
${resume.technical_skills.map(cat => `
\\textbf{${cat.category}:} ${cat.skills}\\\\
`).join('')}

\\section*{Education}
${resume.education.map(edu => `
\\textbf{${edu.degree}} \\hfill ${edu.dates}\\\\
\\textit{${edu.institution}}${edu.location ? `, ${edu.location}` : ''}\\\\
`).join('\n')}

${resume.projects.length > 0 ? `\\section*{Projects}
${resume.projects.map(proj => `
\\textbf{${proj.name}} \\\\
\\textit{Technologies: ${proj.technologies}}
\\begin{itemize}
${proj.description.filter(desc => desc.trim()).map(desc => `  \\item ${desc}`).join('\n')}
\\end{itemize}
`).join('\n')}` : ''}

${resume.other ? `\\section*{Additional Information}
${resume.other}` : ''}

\\end{document}`;
  };

  const OptimizationBadge = ({ children }: { children: React.ReactNode }) => (
    <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-200">
      <Sparkles className="w-3 h-3 mr-1" />
      {children}
    </Badge>
  );

  // Resume Builder functions
  const updateData = (path: string, value: any) => {
    const keys = path.replace(/\[(\d+)\]/g, '.$1').split('.');
    const newData = JSON.parse(JSON.stringify(resumeData));
    let obj = newData;

    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i];
      if (!obj[key]) {
        obj[key] = {};
      }
      obj = obj[key];
    }

    obj[keys[keys.length - 1]] = value;
    setResumeData(newData);
  };

  const addExperience = () => {
    const newExperience = [...resumeData.experience, {
      title: '',
      company: '',
      location: '',
      dates: '',
      duties: ['']
    }];
    setResumeData({ ...resumeData, experience: newExperience });
  };

  const removeExperience = (index: number) => {
    if (resumeData.experience.length <= 1) return;
    const newExperience = resumeData.experience.filter((_, i) => i !== index);
    setResumeData({ ...resumeData, experience: newExperience });
  };

  const addDuty = (expIndex: number) => {
    const newExperience = [...resumeData.experience];
    newExperience[expIndex].duties.push('');
    setResumeData({ ...resumeData, experience: newExperience });
  };

  const removeDuty = (expIndex: number, dutyIndex: number) => {
    if (resumeData.experience[expIndex].duties.length <= 1) return;
    const newExperience = [...resumeData.experience];
    newExperience[expIndex].duties = newExperience[expIndex].duties.filter((_, i) => i !== dutyIndex);
    setResumeData({ ...resumeData, experience: newExperience });
  };

  const addProject = () => {
    const newProjects = [...resumeData.projects, {
      name: '',
      technologies: '',
      description: ['']
    }];
    setResumeData({ ...resumeData, projects: newProjects });
  };

  const removeProject = (index: number) => {
    if (resumeData.projects.length <= 1) return;
    const newProjects = resumeData.projects.filter((_, i) => i !== index);
    setResumeData({ ...resumeData, projects: newProjects });
  };

  const addEducation = () => {
    const newEducation = [...resumeData.education, {
      institution: '',
      location: '',
      degree: '',
      dates: ''
    }];
    setResumeData({ ...resumeData, education: newEducation });
  };

  const removeEducation = (index: number) => {
    if (resumeData.education.length <= 1) return;
    const newEducation = resumeData.education.filter((_, i) => i !== index);
    setResumeData({ ...resumeData, education: newEducation });
  };

  const addSkillCategory = () => {
    if (resumeData.technical_skills.length >= 4) return;
    const newSkills = [...resumeData.technical_skills, { category: '', skills: '' }];
    setResumeData({ ...resumeData, technical_skills: newSkills });
  };

  const removeSkillCategory = (index: number) => {
    if (resumeData.technical_skills.length <= 1) return;
    const newSkills = resumeData.technical_skills.filter((_, i) => i !== index);
    setResumeData({ ...resumeData, technical_skills: newSkills });
  };

  const exportResumeAsJSON = () => {
    const dataStr = JSON.stringify(resumeData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'optimized-resume-final.json';
    link.click();
    URL.revokeObjectURL(url);
  };

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
                      {originalResume.personalInfo ? 
                        "No professional summary was provided in the original resume." :
                        "No professional summary available in original resume"
                      }
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2 text-green-700 dark:text-green-400">Optimized</h4>
                    <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded text-sm border border-green-200">
                      {optimizedResume.optimizations.tailoredSummary || "No summary generated"}
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="experience" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2 text-muted-foreground">Original Order</h4>
                    <div className="space-y-3">
                      {originalResume.experience && originalResume.experience.length > 0 ? (
                        originalResume.experience.map((exp, index) => (
                          <div key={index} className="p-3 bg-muted/50 rounded border">
                            <div className="font-medium text-sm">{exp.title || "Title not specified"}</div>
                            <div className="text-xs text-muted-foreground">
                              {exp.company || "Company not specified"} • {exp.duration || "Duration not specified"}
                            </div>
                            <div className="text-xs mt-2 space-y-1">
                              {exp.responsibilities && exp.responsibilities.length > 0 ? (
                                exp.responsibilities.map((resp, idx) => (
                                  <div key={idx}>• {resp}</div>
                                ))
                              ) : (
                                <div className="text-muted-foreground">No responsibilities listed</div>
                              )}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-3 bg-muted/50 rounded border text-center text-muted-foreground">
                          No experience data available
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2 text-green-700 dark:text-green-400">Optimized Order</h4>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 mb-2">
                        <ArrowRight className="w-4 h-4 text-blue-500" />
                        <span className="text-sm">Reordered by job relevance</span>
                      </div>
                      {optimizedResume.experience && optimizedResume.experience.length > 0 ? (
                        optimizedResume.experience.map((exp, index) => (
                          <div key={index} className="p-3 bg-green-50 dark:bg-green-950/20 rounded border border-green-200">
                            <div className="font-medium text-sm">{exp.title || "Title not specified"}</div>
                            <div className="text-xs text-muted-foreground">
                              {exp.company || "Company not specified"} • {exp.duration || "Duration not specified"}
                            </div>
                            <div className="text-xs mt-2 space-y-1">
                              {exp.responsibilities && exp.responsibilities.length > 0 ? (
                                exp.responsibilities.map((resp, idx) => (
                                  <div key={idx}>• {resp}</div>
                                ))
                              ) : (
                                <div className="text-muted-foreground">No responsibilities listed</div>
                              )}
                            </div>
                            {index === 0 && <OptimizationBadge>Most Relevant</OptimizationBadge>}
                          </div>
                        ))
                      ) : (
                        <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded border border-green-200 text-center text-muted-foreground">
                          No experience data available
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="skills" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2 text-muted-foreground">Original Skills</h4>
                    <div className="space-y-4">
                      {originalResume.skills && originalResume.skills.length > 0 ? (
                        originalResume.skills.map((category, index) => (
                          <div key={index}>
                            <h5 className="font-medium mb-2 text-sm">{category.category || "Category not specified"}</h5>
                            <div className="flex flex-wrap gap-1">
                              {category.skills && category.skills.length > 0 ? (
                                category.skills.map((skill, skillIndex) => (
                                  <Badge
                                    key={skillIndex}
                                    variant="outline"
                                    className="text-xs"
                                  >
                                    {skill}
                                  </Badge>
                                ))
                              ) : (
                                <div className="text-xs text-muted-foreground">No skills listed</div>
                              )}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center text-muted-foreground">
                          No skills data available
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2 text-green-700 dark:text-green-400">Optimized Skills</h4>
                    <div className="space-y-4">
                      {optimizedResume.skills && optimizedResume.skills.length > 0 ? (
                        optimizedResume.skills.map((category, index) => (
                          <div key={index}>
                            <h5 className="font-medium mb-2 text-sm">{category.category || "Category not specified"}</h5>
                            <div className="flex flex-wrap gap-1">
                              {category.skills && category.skills.length > 0 ? (
                                category.skills.map((skill, skillIndex) => (
                                  <Badge
                                    key={skillIndex}
                                    variant={optimizedResume.optimizations.highlightedSkills.includes(skill) ? 'default' : 'outline'}
                                    className={optimizedResume.optimizations.highlightedSkills.includes(skill) ? 'bg-green-100 text-green-800 border-green-300' : 'text-xs'}
                                  >
                                    {skill}
                                    {optimizedResume.optimizations.highlightedSkills.includes(skill) && (
                                      <Sparkles className="w-3 h-3 ml-1" />
                                    )}
                                  </Badge>
                                ))
                              ) : (
                                <div className="text-xs text-muted-foreground">No skills listed</div>
                              )}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center text-muted-foreground">
                          No skills data available
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="projects" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2 text-muted-foreground">Original Projects</h4>
                    <div className="space-y-4">
                      {originalResume.projects && originalResume.projects.length > 0 ? (
                        originalResume.projects.map((project, index) => (
                          <div key={index} className="p-3 bg-muted/50 rounded border">
                            <h5 className="font-medium text-sm mb-2">{project.name || "Project name not specified"}</h5>
                            <p className="text-xs text-muted-foreground mb-2">
                              {project.description || "No description available"}
                            </p>
                            <div className="flex flex-wrap gap-1">
                              {project.technologies && project.technologies.length > 0 ? (
                                project.technologies.map((tech, techIndex) => (
                                  <Badge key={techIndex} variant="outline" className="text-xs">
                                    {tech}
                                  </Badge>
                                ))
                              ) : (
                                <div className="text-xs text-muted-foreground">No technologies listed</div>
                              )}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center text-muted-foreground">
                          No projects data available
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2 text-green-700 dark:text-green-400">Optimized Projects</h4>
                    <div className="space-y-4">
                      {optimizedResume.projects && optimizedResume.projects.length > 0 ? (
                        optimizedResume.projects.map((project, index) => (
                          <div
                            key={index}
                            className={`p-3 rounded border ${
                              optimizedResume.optimizations.emphasizedProjects.includes(project.name)
                                ? 'bg-green-50 dark:bg-green-950/20 border-green-200'
                                : 'bg-muted/50'
                            }`}
                          >
                            <div className="flex items-center gap-2 mb-2">
                              <h5 className="font-medium text-sm">{project.name || "Project name not specified"}</h5>
                              {optimizedResume.optimizations.emphasizedProjects.includes(project.name) && (
                                <OptimizationBadge>Emphasized</OptimizationBadge>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground mb-2">
                              {project.description || "No description available"}
                            </p>
                            <div className="flex flex-wrap gap-1">
                              {project.technologies && project.technologies.length > 0 ? (
                                project.technologies.map((tech, techIndex) => (
                                  <Badge key={techIndex} variant="outline" className="text-xs">
                                    {tech}
                                  </Badge>
                                ))
                              ) : (
                                <div className="text-xs text-muted-foreground">No technologies listed</div>
                              )}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center text-muted-foreground">
                          No projects data available
                        </div>
                      )}
                    </div>
                  </div>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          
          <div className="mt-4 pt-4 border-t">
            <div className="flex items-center justify-between">
              <div>
                <h5 className="font-medium">Continue Editing</h5>
                <p className="text-sm text-muted-foreground">Open the optimized resume in our builder for further customization</p>
              </div>
              <Button 
                onClick={() => setShowResumeBuilder(!showResumeBuilder)}
                variant={showResumeBuilder ? "secondary" : "default"}
                className="ml-4"
              >
                <Edit className="w-4 h-4 mr-2" />
                {showResumeBuilder ? 'Hide Builder' : 'Edit Resume'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resume Builder Section */}
      {showResumeBuilder && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Edit className="w-5 h-5 text-blue-500" />
              Resume Builder - Optimized Version
            </CardTitle>
            <p className="text-muted-foreground">
              Your optimized resume is now loaded in the builder. Make any final adjustments and export when ready.
            </p>
          </CardHeader>
          <CardContent>
            {/* Custom Embedded Resume Builder */}
            <div className="space-y-6">
              {/* Personal Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Personal Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Full Name</Label>
                      <Input
                        value={resumeData.name}
                        onChange={(e) => updateData('name', e.target.value)}
                        placeholder="Your Full Name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Email</Label>
                      <Input
                        value={resumeData.contact.email}
                        onChange={(e) => updateData('contact.email', e.target.value)}
                        placeholder="your.email@example.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Phone</Label>
                      <Input
                        value={resumeData.contact.phone}
                        onChange={(e) => updateData('contact.phone', e.target.value)}
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>LinkedIn</Label>
                      <Input
                        value={resumeData.contact.linkedin}
                        onChange={(e) => updateData('contact.linkedin', e.target.value)}
                        placeholder="linkedin.com/in/yourprofile"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Professional Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Professional Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={resumeData.summary}
                    onChange={(e) => updateData('summary', e.target.value)}
                    placeholder="A brief summary of your skills and experience..."
                    className="min-h-[100px]"
                  />
                </CardContent>
              </Card>

              {/* Technical Skills */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Code className="w-5 h-5" />
                    Technical Skills
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {resumeData.technical_skills.map((skill, index) => (
                    <div key={index} className="flex gap-2 items-end">
                      <div className="flex-1 space-y-2">
                        <Label>Category</Label>
                        <Input
                          value={skill.category}
                          onChange={(e) => updateData(`technical_skills[${index}].category`, e.target.value)}
                          placeholder="e.g. Programming Languages"
                        />
                      </div>
                      <div className="flex-[2] space-y-2">
                        <Label>Skills</Label>
                        <Input
                          value={skill.skills}
                          onChange={(e) => updateData(`technical_skills[${index}].skills`, e.target.value)}
                          placeholder="JavaScript, Python, React, Node.js..."
                        />
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeSkillCategory(index)}
                        disabled={resumeData.technical_skills.length <= 1}
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    onClick={addSkillCategory}
                    disabled={resumeData.technical_skills.length >= 4}
                    className="w-full"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Skill Category
                  </Button>
                </CardContent>
              </Card>

              {/* Experience */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="w-5 h-5" />
                    Work Experience
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {resumeData.experience.map((exp, expIndex) => (
                    <div key={expIndex} className="p-4 border rounded-lg space-y-4">
                      <div className="flex justify-between items-start">
                        <h4 className="font-medium">Experience {expIndex + 1}</h4>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeExperience(expIndex)}
                          disabled={resumeData.experience.length <= 1}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Job Title</Label>
                          <Input
                            value={exp.title}
                            onChange={(e) => updateData(`experience[${expIndex}].title`, e.target.value)}
                            placeholder="Software Developer"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Company</Label>
                          <Input
                            value={exp.company}
                            onChange={(e) => updateData(`experience[${expIndex}].company`, e.target.value)}
                            placeholder="Company Name"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Location</Label>
                          <Input
                            value={exp.location}
                            onChange={(e) => updateData(`experience[${expIndex}].location`, e.target.value)}
                            placeholder="City, State"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Dates</Label>
                          <Input
                            value={exp.dates}
                            onChange={(e) => updateData(`experience[${expIndex}].dates`, e.target.value)}
                            placeholder="Jan 2020 - Present"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Responsibilities</Label>
                        {exp.duties.map((duty, dutyIndex) => (
                          <div key={dutyIndex} className="flex gap-2">
                            <Textarea
                              value={duty}
                              onChange={(e) => updateData(`experience[${expIndex}].duties[${dutyIndex}]`, e.target.value)}
                              placeholder="Describe your responsibility and achievements..."
                              className="flex-1"
                              rows={2}
                            />
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => removeDuty(expIndex, dutyIndex)}
                              disabled={exp.duties.length <= 1}
                            >
                              <Minus className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => addDuty(expIndex)}
                          className="w-full"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add Responsibility
                        </Button>
                      </div>
                    </div>
                  ))}
                  
                  <Button
                    variant="outline"
                    onClick={addExperience}
                    className="w-full"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Experience
                  </Button>
                </CardContent>
              </Card>

              {/* Projects */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="w-5 h-5" />
                    Projects
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {resumeData.projects.map((project, index) => (
                    <div key={index} className="p-4 border rounded-lg space-y-4">
                      <div className="flex justify-between items-start">
                        <h4 className="font-medium">Project {index + 1}</h4>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeProject(index)}
                          disabled={resumeData.projects.length <= 1}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Project Name</Label>
                          <Input
                            value={project.name}
                            onChange={(e) => updateData(`projects[${index}].name`, e.target.value)}
                            placeholder="Project Name"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Technologies</Label>
                          <Input
                            value={project.technologies}
                            onChange={(e) => updateData(`projects[${index}].technologies`, e.target.value)}
                            placeholder="React, Node.js, MongoDB..."
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Description</Label>
                        <Textarea
                          value={project.description[0] || ''}
                          onChange={(e) => updateData(`projects[${index}].description[0]`, e.target.value)}
                          placeholder="Describe the project, your role, and achievements..."
                          className="min-h-[80px]"
                        />
                      </div>
                    </div>
                  ))}
                  
                  <Button
                    variant="outline"
                    onClick={addProject}
                    className="w-full"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Project
                  </Button>
                </CardContent>
              </Card>

              {/* Education */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GraduationCap className="w-5 h-5" />
                    Education
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {resumeData.education.map((edu, index) => (
                    <div key={index} className="p-4 border rounded-lg space-y-4">
                      <div className="flex justify-between items-start">
                        <h4 className="font-medium">Education {index + 1}</h4>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeEducation(index)}
                          disabled={resumeData.education.length <= 1}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Institution</Label>
                          <Input
                            value={edu.institution}
                            onChange={(e) => updateData(`education[${index}].institution`, e.target.value)}
                            placeholder="University Name"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Degree</Label>
                          <Input
                            value={edu.degree}
                            onChange={(e) => updateData(`education[${index}].degree`, e.target.value)}
                            placeholder="Bachelor of Science in Computer Science"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Location</Label>
                          <Input
                            value={edu.location}
                            onChange={(e) => updateData(`education[${index}].location`, e.target.value)}
                            placeholder="City, State"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Graduation Date</Label>
                          <Input
                            value={edu.dates}
                            onChange={(e) => updateData(`education[${index}].dates`, e.target.value)}
                            placeholder="May 2020"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  <Button
                    variant="outline"
                    onClick={addEducation}
                    className="w-full"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Education
                  </Button>
                </CardContent>
              </Card>

              {/* Export Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="w-5 h-5" />
                    Resume Preview
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Preview of your edited resume before export
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="bg-white dark:bg-gray-900 p-6 border rounded-lg">
                    <div className="space-y-4 text-sm">
                      {/* Header */}
                      <div className="text-center border-b pb-4">
                        <h1 className="text-xl font-bold">{resumeData.name}</h1>
                        <p className="text-gray-600">
                          {resumeData.contact.email} | {resumeData.contact.phone}
                          {resumeData.contact.linkedin && ` | ${resumeData.contact.linkedin}`}
                          {resumeData.contact.github && ` | ${resumeData.contact.github}`}
                        </p>
                      </div>

                      {/* Summary */}
                      {resumeData.summary && (
                        <div>
                          <h2 className="font-semibold border-b mb-2">Professional Summary</h2>
                          <p>{resumeData.summary}</p>
                        </div>
                      )}

                      {/* Experience */}
                      <div>
                        <h2 className="font-semibold border-b mb-2">Experience</h2>
                        {resumeData.experience.map((exp, index) => (
                          <div key={index} className="mb-3">
                            <div className="flex justify-between items-start">
                              <h3 className="font-bold text-base">{exp.title}</h3>
                              <span className="text-gray-600 text-sm font-semibold">{exp.dates}</span>
                            </div>
                            <p className="text-gray-600 text-xs mb-1">
                              {exp.company}{exp.location && `, ${exp.location}`}
                            </p>
                            <ul className="list-disc list-inside text-xs space-y-1">
                              {exp.duties.filter(duty => duty.trim()).map((duty, dutyIndex) => (
                                <li key={dutyIndex}>{duty}</li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>

                      {/* Skills */}
                      <div>
                        <h2 className="font-semibold border-b mb-2">Technical Skills</h2>
                        {resumeData.technical_skills.map((category, index) => (
                          <p key={index} className="text-xs mb-1">
                            <span className="font-medium">{category.category}:</span> {category.skills}
                          </p>
                        ))}
                      </div>

                      {/* Education */}
                      <div>
                        <h2 className="font-semibold border-b mb-2">Education</h2>
                        {resumeData.education.map((edu, index) => (
                          <div key={index} className="mb-2">
                            <div className="flex justify-between items-start">
                              <h3 className="font-bold text-sm">{edu.degree}</h3>
                              <span className="text-gray-600 text-sm font-semibold">{edu.dates}</span>
                            </div>
                            <p className="text-gray-600 text-xs">
                              {edu.institution}{edu.location && `, ${edu.location}`}
                            </p>
                          </div>
                        ))}
                      </div>

                      {/* Projects */}
                      {resumeData.projects.some(p => p.name.trim()) && (
                        <div>
                          <h2 className="font-semibold border-b mb-2">Projects</h2>
                          {resumeData.projects.filter(p => p.name.trim()).map((project, index) => (
                            <div key={index} className="mb-3">
                              <h3 className="font-bold text-sm">{project.name}</h3>
                              <p className="text-gray-600 text-xs mb-1">
                                <span className="font-medium">Technologies:</span> {project.technologies}
                              </p>
                              <ul className="list-disc list-inside text-xs space-y-1">
                                {project.description.filter(desc => desc.trim()).map((desc, descIndex) => (
                                  <li key={descIndex}>{desc}</li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Other */}
                      {resumeData.other && (
                        <div>
                          <h2 className="font-semibold border-b mb-2">Additional Information</h2>
                          <p className="text-xs">{resumeData.other}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Export Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Save className="w-5 h-5" />
                    Export Final Resume
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-3">
                    <Button
                      onClick={exportResumeAsJSON}
                      className="flex items-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Export as JSON
                    </Button>
                    <Button
                      onClick={() => handleExport('latex')}
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      <FileText className="w-4 h-4" />
                      Export as LaTeX
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
