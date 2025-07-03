'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  TrendingUp, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Target,
  Lightbulb,
  Award,
  Users,
  Briefcase,
  GraduationCap,
  Code,
  ArrowRight
} from 'lucide-react';

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

interface MatchingResultsProps {
  analysis: MatchingAnalysis;
  jobPosting: JobPosting;
  onOptimize: () => void;
}

export default function MatchingResults({ analysis, jobPosting, onOptimize }: MatchingResultsProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 dark:text-green-400';
    if (score >= 60) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-50 dark:bg-green-950/20';
    if (score >= 60) return 'bg-yellow-50 dark:bg-yellow-950/20';
    return 'bg-red-50 dark:bg-red-950/20';
  };

  const getScoreDescription = (score: number) => {
    if (score >= 80) return 'Excellent Match';
    if (score >= 60) return 'Good Match';
    if (score >= 40) return 'Fair Match';
    return 'Needs Improvement';
  };

  return (
    <div className="space-y-6">
      {/* Overall Score */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Compatibility Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-3">
                <div className={`text-6xl font-bold ${getScoreColor(analysis.overallScore)}`}>
                  {analysis.overallScore}%
                </div>
                <div>
                  <div className="text-lg font-semibold">{getScoreDescription(analysis.overallScore)}</div>
                  <div className="text-sm text-muted-foreground">
                    for {jobPosting.title} at {jobPosting.company}
                  </div>
                </div>
              </div>
            </div>
            <div className={`p-4 rounded-full ${getScoreBgColor(analysis.overallScore)}`}>
              {analysis.overallScore >= 80 ? (
                <Award className="w-8 h-8 text-green-600" />
              ) : analysis.overallScore >= 60 ? (
                <TrendingUp className="w-8 h-8 text-yellow-600" />
              ) : (
                <AlertTriangle className="w-8 h-8 text-red-600" />
              )}
            </div>
          </div>

          <Progress value={analysis.overallScore} className="h-3" />
          
          <div className="mt-4 text-sm text-muted-foreground">
            Based on analysis of job requirements vs. your resume content
          </div>
        </CardContent>
      </Card>

      {/* Category Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Category Breakdown</CardTitle>
          <p className="text-muted-foreground">
            Detailed scoring across different evaluation criteria
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Code className="w-4 h-4 text-blue-500" />
                  <span className="font-medium">Technical Skills</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`font-bold ${getScoreColor(analysis.categoryScores.skills)}`}>
                    {analysis.categoryScores.skills}%
                  </span>
                </div>
              </div>
              <Progress value={analysis.categoryScores.skills} className="h-2" />
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-green-500" />
                  <span className="font-medium">Experience</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`font-bold ${getScoreColor(analysis.categoryScores.experience)}`}>
                    {analysis.categoryScores.experience}%
                  </span>
                </div>
              </div>
              <Progress value={analysis.categoryScores.experience} className="h-2" />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-purple-500" />
                  <span className="font-medium">Education</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`font-bold ${getScoreColor(analysis.categoryScores.education)}`}>
                    {analysis.categoryScores.education}%
                  </span>
                </div>
              </div>
              <Progress value={analysis.categoryScores.education} className="h-2" />
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-orange-500" />
                  <span className="font-medium">Projects</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`font-bold ${getScoreColor(analysis.categoryScores.projects)}`}>
                    {analysis.categoryScores.projects}%
                  </span>
                </div>
              </div>
              <Progress value={analysis.categoryScores.projects} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Strengths and Gaps */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-400">
              <CheckCircle className="w-5 h-5" />
              Your Strengths
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {analysis.strengths.map((strength, index) => (
                <li key={index} className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{strength}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-700 dark:text-orange-400">
              <XCircle className="w-5 h-5" />
              Areas for Improvement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {analysis.gaps.map((gap, index) => (
                <li key={index} className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{gap}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5" />
            AI Recommendations
          </CardTitle>
          <p className="text-muted-foreground">
            Specific suggestions to improve your resume for this position
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <h4 className="font-medium mb-3 text-blue-700 dark:text-blue-400">Skills to Highlight</h4>
              <div className="flex flex-wrap gap-2">
                {analysis.recommendations.skillsToHighlight.map((skill, index) => (
                  <Badge key={index} variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200">
                    {skill}
                  </Badge>
                ))}
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                These skills from your resume closely match the job requirements
              </p>
            </div>

            <Separator />

            <div>
              <h4 className="font-medium mb-3 text-green-700 dark:text-green-400">Experience to Emphasize</h4>
              <ul className="space-y-2">
                {analysis.recommendations.experienceToEmphasize.map((exp, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <ArrowRight className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    {exp}
                  </li>
                ))}
              </ul>
            </div>

            <Separator />

            <div>
              <h4 className="font-medium mb-3 text-purple-700 dark:text-purple-400">Suggested Modifications</h4>
              <ul className="space-y-2">
                {analysis.recommendations.suggestedModifications.map((mod, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <TrendingUp className="w-4 h-4 text-purple-500 mt-0.5 flex-shrink-0" />
                    {mod}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Button */}
      <Card className="bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-950/20 dark:to-green-950/20">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-2">Ready to optimize your resume?</h3>
              <p className="text-muted-foreground">
                Generate a tailored version of your resume specifically for this {jobPosting.title} position
              </p>
            </div>
            <Button onClick={onOptimize} size="lg" className="ml-4">
              <TrendingUp className="w-4 h-4 mr-2" />
              Optimize Resume
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Insights Panel */}
      <Card className="border-dashed">
        <CardContent className="p-6">
          <div className="flex items-start gap-3">
            <Lightbulb className="w-6 h-6 text-yellow-500 flex-shrink-0 mt-1" />
            <div>
              <h4 className="font-medium mb-2">Pro Tips</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Focus on quantified achievements that demonstrate impact</li>
                <li>• Use keywords from the job posting throughout your resume</li>
                <li>• Reorder your experience to put the most relevant roles first</li>
                <li>• Consider adding specific technologies or tools mentioned in the job</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
