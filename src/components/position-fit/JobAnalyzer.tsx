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
  _urlFetchSuccess?: boolean;
  _rawContent?: string;
  _sourceUrl?: string;
}

interface JobAnalyzerProps {
  onJobParsed: (job: JobPosting) => void;
  apiKey?: string;
  isApiKeyValid?: boolean;
}

export default function JobAnalyzer({ onJobParsed, apiKey, isApiKeyValid }: JobAnalyzerProps) {
  const [inputType, setInputType] = useState<'url' | 'text'>('url');
  const [jobUrl, setJobUrl] = useState('');
  const [jobText, setJobText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [parsedJob, setParsedJob] = useState<JobPosting | null>(null);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [rawExtractedContent, setRawExtractedContent] = useState<string>('');
  const [showRawContent, setShowRawContent] = useState(false);

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    setError(null);
    setLoadingMessage('Starting analysis...');

    try {
      const input = inputType === 'url' ? jobUrl : jobText;
      
      if (!input.trim()) {
        throw new Error('Please provide a job URL or paste the job description');
      }

      if (!apiKey || !isApiKeyValid) {
        throw new Error('API key required for job analysis. Please configure your Gemini API key.');
      }

      let jobDescription = input;
      let fetchSuccess = false;

      // If URL is provided, fetch the content
      if (inputType === 'url') {
        try {
          setLoadingMessage('Fetching job posting content from URL...');
          console.log('Fetching URL content:', jobUrl);
          const response = await fetch(`/api/fetch-url?url=${encodeURIComponent(jobUrl)}`);
          const result = await response.json();
          
          if (result.success) {
            jobDescription = result.content;
            fetchSuccess = true;
            setRawExtractedContent(result.content); // Store the raw extracted content
            setLoadingMessage('Successfully fetched content, analyzing with AI...');
            console.log('Successfully fetched URL content, length:', result.length);
          } else {
            console.warn('URL fetch failed:', result.error);
            setLoadingMessage('URL fetch failed, analyzing URL structure...');
            setRawExtractedContent(`Failed to fetch content: ${result.error}`);
            // Don't throw error immediately, try to extract what we can from the URL
            setError(`Warning: Could not fetch URL content (${result.error}). Analyzing URL structure instead.`);
            
            // Try to extract some info from the URL itself
            const urlParts = jobUrl.toLowerCase();
            if (urlParts.includes('linkedin.com/jobs') || 
                urlParts.includes('indeed.com') || 
                urlParts.includes('glassdoor.com') ||
                urlParts.includes('monster.com') ||
                urlParts.includes('ziprecruiter.com')) {
              jobDescription = `Job posting URL from ${urlParts.includes('linkedin') ? 'LinkedIn' : 
                                                    urlParts.includes('indeed') ? 'Indeed' : 
                                                    urlParts.includes('glassdoor') ? 'Glassdoor' :
                                                    urlParts.includes('monster') ? 'Monster' : 'ZipRecruiter'}: ${jobUrl}`;
            } else {
              throw new Error(`Unable to fetch job posting content from URL: ${result.error}`);
            }
          }
        } catch (fetchError: any) {
          console.error('URL fetch error:', fetchError);
          setRawExtractedContent(`Error fetching URL: ${fetchError.message}`);
          throw new Error(`Failed to fetch job posting from URL: ${fetchError.message || 'Network error'}`);
        }
      } else {
        setLoadingMessage('Analyzing job description with AI...');
        setRawExtractedContent(jobDescription); // Store the pasted content
      }

      // Parse with AI
      setLoadingMessage('Processing job posting with AI...');
      const parsePrompt = `You are an expert job posting analyzer. ${fetchSuccess ? 
        'Parse the following job posting content and extract structured information.' : 
        'The following is either a job posting URL or limited content. Extract what information you can and indicate what is missing.'
      }

${fetchSuccess ? 'JOB POSTING CONTENT:' : 'JOB POSTING URL/CONTENT:'}
${jobDescription}

${fetchSuccess ? '' : `
IMPORTANT: If this is just a URL and you cannot extract specific job details, please:
1. Set the title as "Job Title Not Available - Please use direct text input"
2. Set company as "Unknown Company"
3. Indicate in the requirements that the full job description could not be accessed
4. Be honest about what information is missing
`}

Extract and return ONLY valid JSON in this exact format:
{
  "title": "Job Title",
  "company": "Company Name",
  "location": "Location",
  "salary": {
    "min": 100000,
    "max": 150000,
    "currency": "$"
  },
  "requirements": {
    "required": ["requirement 1", "requirement 2"],
    "preferred": ["preferred 1", "preferred 2"],
    "experience": "X+ years experience"
  },
  "responsibilities": ["responsibility 1", "responsibility 2"],
  "benefits": ["benefit 1", "benefit 2"],
  "jobType": "full-time"
}

Rules:
- If salary info is not found, omit the salary field entirely
- jobType should be one of: "full-time", "part-time", "contract", "internship"
- Extract actual requirements and responsibilities, don't make them up
- Keep arrays concise but comprehensive
- If information is not available, be explicit about it in the content

IMPORTANT: Return ONLY the JSON object, no explanations or markdown formatting.`;

      const response = await callGeminiAPI(parsePrompt);
      const cleanedResponse = response.replace(/```json\n?|\n?```/g, '').trim();
      const parsedData = JSON.parse(cleanedResponse);
      
      // Add metadata about the fetch and raw content
      parsedData._urlFetchSuccess = fetchSuccess;
      parsedData._rawContent = rawExtractedContent;
      parsedData._sourceUrl = inputType === 'url' ? jobUrl : null;
      
      setLoadingMessage('Analysis complete!');
      setParsedJob(parsedData);
      onJobParsed(parsedData);
      
    } catch (error: any) {
      console.error('Job analysis failed:', error);
      setError(`Failed to analyze job posting: ${error.message}`);
    } finally {
      setIsAnalyzing(false);
      setLoadingMessage('');
    }
  };

  const callGeminiAPI = async (prompt: string): Promise<string> => {
    if (!prompt || typeof prompt !== 'string' || prompt.trim() === '') {
      throw new Error('Invalid prompt provided');
    }

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
    } catch (error: any) {
      console.error('API call failed:', error);
      throw error;
    }
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
            {parsedJob._urlFetchSuccess === false && (
              <Badge variant="outline" className="ml-2 text-orange-600 border-orange-600">
                Limited URL Data
              </Badge>
            )}
          </CardTitle>
          {parsedJob._urlFetchSuccess === false && (
            <p className="text-sm text-orange-600 mt-2">
              Note: Could not fully access the job posting content from the URL. For best results, copy and paste the job description directly.
            </p>
          )}
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

            {/* Raw Content Display */}
            {parsedJob._rawContent && (
              <div className="border-t pt-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold">Raw Extracted Content</h3>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setShowRawContent(!showRawContent)}
                  >
                    {showRawContent ? 'Hide' : 'Show'} Raw Content
                  </Button>
                </div>
                {parsedJob._sourceUrl && (
                  <p className="text-sm text-muted-foreground mb-2">
                    Source: <a href={parsedJob._sourceUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      {parsedJob._sourceUrl}
                    </a>
                  </p>
                )}
                {showRawContent && (
                  <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 max-h-96 overflow-y-auto">
                    <pre className="text-xs whitespace-pre-wrap text-gray-700 dark:text-gray-300">
                      {parsedJob._rawContent}
                    </pre>
                  </div>
                )}
                <p className="text-xs text-muted-foreground mt-2">
                  Content length: {parsedJob._rawContent.length} characters
                  {parsedJob._urlFetchSuccess === true && ' • Successfully fetched from URL'}
                  {parsedJob._urlFetchSuccess === false && ' • Limited content due to URL access issues'}
                  {parsedJob._sourceUrl && ` • Extracted at ${new Date().toLocaleTimeString()}`}
                </p>
                {parsedJob._urlFetchSuccess === true && (
                  <div className="text-xs text-green-600 mt-1">
                    ✓ URL content successfully extracted and analyzed
                  </div>
                )}
                {parsedJob._urlFetchSuccess === false && (
                  <div className="text-xs text-orange-600 mt-1">
                    ⚠ URL content could not be fully accessed - results may be limited
                  </div>
                )}
              </div>
            )}

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
                {loadingMessage || 'Analyzing Job Posting...'}
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
