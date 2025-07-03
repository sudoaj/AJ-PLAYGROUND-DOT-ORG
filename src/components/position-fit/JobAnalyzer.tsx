'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { 
  Globe, 
  FileText, 
  Loader2, 
  CheckCircle, 
  AlertCircle,
  Building,
  MapPin,
  DollarSign,
  Calendar,
  Users
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

interface JobAnalyzerProps {
  onJobParsed: (job: JobPosting) => void;
}

export default function JobAnalyzer({ onJobParsed }: JobAnalyzerProps) {
  const [inputType, setInputType] = useState<'url' | 'text'>('url');
  const [jobUrl, setJobUrl] = useState('');
  const [jobText, setJobText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [parsedJob, setParsedJob] = useState<JobPosting | null>(null);

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    setError(null);

    try {
      const input = inputType === 'url' ? jobUrl : jobText;
      
      if (!input.trim()) {
        throw new Error('Please provide a job URL or paste the job description');
      }

      // Simulate API call - in real implementation, this would call your job parsing API
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Mock parsed job data
      const mockJob: JobPosting = {
        title: inputType === 'url' ? 'Senior Frontend Developer' : extractTitleFromText(jobText),
        company: inputType === 'url' ? 'TechCorp Inc.' : extractCompanyFromText(jobText),
        location: 'San Francisco, CA (Remote)',
        salary: {
          min: 120000,
          max: 160000,
          currency: '$'
        },
        requirements: {
          required: [
            'React.js and modern JavaScript/TypeScript',
            '5+ years of frontend development experience',
            'Experience with state management (Redux, Zustand)',
            'Strong CSS and responsive design skills',
            'Git version control proficiency'
          ],
          preferred: [
            'Next.js framework experience',
            'UI/UX design sensibility',
            'GraphQL knowledge',
            'Testing frameworks (Jest, Cypress)',
            'AWS or cloud platform experience'
          ],
          experience: '5+ years in frontend development'
        },
        responsibilities: [
          'Build and maintain high-quality React applications',
          'Collaborate with design and backend teams',
          'Optimize application performance and user experience',
          'Mentor junior developers',
          'Participate in code reviews and technical planning'
        ],
        benefits: [
          'Competitive salary and equity',
          'Comprehensive health insurance',
          'Flexible work arrangements',
          'Professional development budget',
          'Unlimited PTO policy'
        ],
        jobType: 'full-time'
      };

      setParsedJob(mockJob);
      onJobParsed(mockJob);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to analyze job posting');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const extractTitleFromText = (text: string): string => {
    // Simple extraction - in real implementation, use AI
    const lines = text.split('\n');
    return lines[0] || 'Software Developer';
  };

  const extractCompanyFromText = (text: string): string => {
    // Simple extraction - in real implementation, use AI
    const companyMatch = text.match(/(?:Company|Organization|Employer):\s*(.+)/i);
    return companyMatch?.[1] || 'Technology Company';
  };

  const handleTryExample = () => {
    const exampleJob = `Senior Frontend Developer - TechCorp Inc.

Location: San Francisco, CA (Remote)
Salary: $120,000 - $160,000

About the Role:
We are seeking a Senior Frontend Developer to join our growing engineering team. You will be responsible for building and maintaining high-quality React applications that serve millions of users.

Requirements:
- 5+ years of frontend development experience
- Expert knowledge of React.js and modern JavaScript/TypeScript
- Experience with state management libraries (Redux, Zustand)
- Strong CSS and responsive design skills
- Proficiency with Git version control

Preferred Qualifications:
- Next.js framework experience
- UI/UX design sensibility
- GraphQL knowledge
- Experience with testing frameworks (Jest, Cypress)
- AWS or cloud platform experience

Responsibilities:
- Build and maintain high-quality React applications
- Collaborate with design and backend teams to implement new features
- Optimize application performance and user experience
- Mentor junior developers and participate in code reviews
- Contribute to technical planning and architecture decisions

Benefits:
- Competitive salary and equity package
- Comprehensive health, dental, and vision insurance
- Flexible work arrangements with remote options
- $2,000 annual professional development budget
- Unlimited PTO policy

Join us in building the future of technology!`;

    setJobText(exampleJob);
    setInputType('text');
  };

  if (parsedJob) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            Job Analysis Complete
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Job Header */}
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold">{parsedJob.title}</h2>
                <div className="flex items-center gap-4 mt-2 text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Building className="w-4 h-4" />
                    {parsedJob.company}
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {parsedJob.location}
                  </div>
                  {parsedJob.salary && (
                    <div className="flex items-center gap-1">
                      <DollarSign className="w-4 h-4" />
                      {parsedJob.salary.currency}{parsedJob.salary.min.toLocaleString()} - 
                      {parsedJob.salary.currency}{parsedJob.salary.max.toLocaleString()}
                    </div>
                  )}
                </div>
              </div>
              <Badge variant="outline" className="capitalize">
                {parsedJob.jobType}
              </Badge>
            </div>

            {/* Requirements */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-3 text-green-700 dark:text-green-400">Required Skills</h3>
                <ul className="space-y-2">
                  {parsedJob.requirements.required.map((req, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      {req}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold mb-3 text-blue-700 dark:text-blue-400">Preferred Skills</h3>
                <ul className="space-y-2">
                  {parsedJob.requirements.preferred.map((pref, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <Users className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                      {pref}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Responsibilities Preview */}
            <div>
              <h3 className="font-semibold mb-3">Key Responsibilities</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {parsedJob.responsibilities.slice(0, 4).map((resp, index) => (
                  <div key={index} className="text-sm text-muted-foreground">
                    • {resp}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <Button 
                onClick={() => setParsedJob(null)}
                variant="outline"
              >
                Edit Job Input
              </Button>
              <Button onClick={() => onJobParsed(parsedJob)}>
                Continue to Resume Upload
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="w-5 h-5" />
          Job Posting Analysis
        </CardTitle>
        <p className="text-muted-foreground">
          Provide a job posting URL or paste the job description to begin analysis
        </p>
      </CardHeader>
      <CardContent>
        <Tabs value={inputType} onValueChange={(value) => setInputType(value as 'url' | 'text')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="url">Job URL</TabsTrigger>
            <TabsTrigger value="text">Job Description</TabsTrigger>
          </TabsList>
          
          <TabsContent value="url" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="job-url">Job Posting URL</Label>
              <Input
                id="job-url"
                placeholder="https://company.com/careers/job-posting"
                value={jobUrl}
                onChange={(e) => setJobUrl(e.target.value)}
              />
              <p className="text-sm text-muted-foreground">
                Enter a URL from LinkedIn, Indeed, company career pages, or other job boards
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="text" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="job-text">Job Description</Label>
              <Textarea
                id="job-text"
                placeholder="Paste the complete job description here..."
                value={jobText}
                onChange={(e) => setJobText(e.target.value)}
                rows={12}
              />
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Include job title, requirements, responsibilities, and company details
                </p>
                <Button variant="link" size="sm" onClick={handleTryExample}>
                  Try Example
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {error && (
          <Alert className="mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="mt-6">
          <Button 
            onClick={handleAnalyze} 
            disabled={isAnalyzing || (!jobUrl.trim() && !jobText.trim())}
            className="w-full"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Analyzing Job Posting...
              </>
            ) : (
              <>
                <FileText className="w-4 h-4 mr-2" />
                Analyze Job Posting
              </>
            )}
          </Button>
        </div>

        <div className="mt-4 p-4 bg-muted/50 rounded-lg">
          <h4 className="font-medium mb-2">What we extract:</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Job title, company, and location details</li>
            <li>• Required and preferred skills/qualifications</li>
            <li>• Key responsibilities and role expectations</li>
            <li>• Salary range and benefits (when available)</li>
            <li>• Company culture and work environment clues</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
